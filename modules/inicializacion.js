/**
 * SISTEMA DE DEVOLUCIÓN IVA EXPORTADOR
 * Módulo: Inicialización
 * Descripción: Configuración inicial y eventos de carga del documento
 */

import { 
    DEVOLUCION_SOLICITADA, 
    UTM_VALOR, 
    FECHA_SOLICITUD, 
    FORMATO_MONEDA, 
    formatoFecha, 
    calcularFechaMaxDesc48 
} from './utilidades.js';

import { 
    actualizarCamposUTM, 
    formatNumber, 
    configurarTooltips, 
    actualizarIdExpediente 
} from './core.js';

import { validarYActualizarBotones } from './decision.js';
import { toggleActaRecepcion } from './fep.js';

/**
 * Actualiza el contador de caracteres en texto editable
 */
export function updateCharCount() {
    const text = document.getElementById('comentarios').innerText;
    const charCountElement = document.getElementById('charCount');
    if (charCountElement) {
        charCountElement.textContent = text.length;
    }
}

/**
 * Alterna entre modo oscuro y claro
 */
export function toggleDarkMode() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    
    // Cambia el tema y guarda la preferencia
    if (currentTheme === 'dark') {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

/**
 * Inicializa el tema basado en la preferencia guardada o el tema del sistema
 */
export function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        // Usa el tema guardado por el usuario
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        // Si el usuario no ha guardado preferencia pero su sistema usa modo oscuro
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

/**
 * Inicializa todos los eventos y configuraciones al cargar el documento
 */
export function inicializarAplicacion() {
    // Inicializar el monto de devolución solicitada
    const devolucionInput = document.getElementById('devolucionSolicitada');
    if (devolucionInput) {
        devolucionInput.value = FORMATO_MONEDA.format(DEVOLUCION_SOLICITADA);
        actualizarCamposUTM(); // Actualizar los campos UTM al inicializar
    }

    // Muestra el valor de UTM actual
    const valorUTMElement = document.getElementById('valorUTM');
    if (valorUTMElement) {
        valorUTMElement.textContent = FORMATO_MONEDA.format(UTM_VALOR);
    }
    
    // Configura listeners para campos de montos
    const camposMontos = ['devolucionSolicitada', 'montoAutorizado'];
    camposMontos.forEach(campo => {
        const element = document.getElementById(campo);
        if (element) {
            element.addEventListener('input', (event) => {
                formatNumber(event.target);
            });
        }
    });

    // Inicializar fecha de solicitud y folio
    const fechaSolicitudElement = document.getElementById('fechaSolicitud');
    if (fechaSolicitudElement) {
        fechaSolicitudElement.textContent = formatoFecha(FECHA_SOLICITUD);
    }

    const folioElement = document.getElementById('folioFormulario');
    if (folioElement) {
        folioElement.textContent = folioformulario; // Asegúrate de tener esta variable definida en un módulo
    }
    
    // Inicializar fechas
    const fechaMaxElement = document.getElementById('fechaMaxDesc48');
    
    if (fechaSolicitudElement) {
        fechaSolicitudElement.textContent = formatoFecha(FECHA_SOLICITUD);
    }
    if (fechaMaxElement) {
        fechaMaxElement.textContent = formatoFecha(calcularFechaMaxDesc48());
    }

    // Configura listeners para decisiones
    const decisionRadios = document.getElementsByName('decisionCruce');
    if (decisionRadios.length > 0) {
        Array.from(decisionRadios).forEach(radio => {
            radio.addEventListener('change', validarYActualizarBotones);
        });
    }

    // Configura tooltips y ayudas contextuales
    configurarTooltips();

    // Configurar el editor de texto
    const editor = document.getElementById('comentarios');
    if (editor) {
        editor.addEventListener('input', updateCharCount);
        
        // Mantener el formato al pegar texto
        editor.addEventListener('paste', function(e) {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        });
    }

    // Agregar event listener para el contador de caracteres del FEP
    const fepEditor = document.getElementById('fepComentarios');
    if (fepEditor) {
        fepEditor.addEventListener('input', function(event) {
            const maxLength = parseInt(this.dataset.maxLength);
            const text = this.innerText;
            const charCount = text.length;
            
            const fepCharCountElement = document.getElementById('fepCharCount');
            if (fepCharCountElement) {
                fepCharCountElement.textContent = charCount;
            }
            
            if (charCount > maxLength) {
                if (event.inputType === 'insertText') {
                    event.preventDefault();
                }
                this.innerText = text.substring(0, maxLength);
            }
        });

        fepEditor.addEventListener('paste', function(e) {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        });
    }

    // Asegurar que todas las secciones FEP sean visibles inicialmente
    document.querySelectorAll('.subsection-content').forEach(section => {
        section.style.display = 'block';
        section.classList.remove('collapsed');
    });
    
    // Inicializar sincronización de IDs de expediente si existe algún valor
    const mainIdExpediente = document.getElementById('idExpediente')?.textContent;
    const fepIdExpediente = document.getElementById('idExpedienteFep')?.textContent;
    
    if (mainIdExpediente || fepIdExpediente) {
        // Usar el ID existente que encontremos primero
        actualizarIdExpediente(mainIdExpediente || fepIdExpediente);
    }
    
    // Manejar cambios en los checkboxes para información recibida
    const checkInfoRecibida = document.getElementById('checkInfoRecibida');
    if (checkInfoRecibida) {
        checkInfoRecibida.addEventListener('change', toggleActaRecepcion);
    }
    
    const checkInfoRecibidaSegunda = document.getElementById('checkInfoRecibidaSegunda');
    if (checkInfoRecibidaSegunda) {
        checkInfoRecibidaSegunda.addEventListener('change', toggleDecisionSegunda);
    }
    
    // Inicializar el tema
    initTheme();
    
    // Agregar listener al botón de cambio de tema
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleDarkMode);
    }
}

// Variable global para el folio del formulario
// Normalmente se obtendría de una API o base de datos
const folioformulario = 123456789;
