/**
 * SISTEMA DE DEVOLUCIÓN IVA EXPORTADOR
 * Módulo: Contacto con Contribuyente
 * Descripción: Gestión de contactos y comunicaciones con contribuyentes
 */

import { mostrarAlerta } from './utilidades.js';
import { actualizarIdExpediente } from './core.js';

/**
 * Muestra el popup con un mensaje
 * @param {string} mensaje - Mensaje a mostrar en el popup
 */
export function mostrarPopupContacto(mensaje) {
    document.getElementById('popupMensaje').textContent = mensaje;
    document.getElementById('popupContacto').style.display = 'flex';
}

/**
 * Cierra el popup de contacto
 */
export function cerrarPopupContacto() {
    document.getElementById('popupContacto').style.display = 'none';
}

/**
 * Muestra u oculta los botones según la opción seleccionada
 */
export function toggleBotonesContacto() {
    const valor = document.getElementById('contactoContribuyente').value;
    const btnGuardar = document.getElementById('btnGuardar');
    const btnAnotacion42 = document.getElementById('btnAnotacion42');
    const btnDisponeFep = document.getElementById('btnDisponeFep');
    const checkInfoRecibida = document.querySelector('label.checkbox-label');
    const btnGenerarActa = document.getElementById('btnGenerarActa');

    // Ocultar todos los botones primero
    btnGuardar.style.display = 'none';
    btnAnotacion42.style.display = 'none';
    btnDisponeFep.style.display = 'none';
    checkInfoRecibida.style.display = 'none';
    btnGenerarActa.style.display = 'none';

    // Mostrar los botones correspondientes
    if (valor === 'contactado') {
        btnGuardar.style.display = 'inline-block';
        checkInfoRecibida.style.display = 'block';
        btnGenerarActa.style.display = 'inline-block';
    } else if (valor === 'noContactado') {
        btnAnotacion42.style.display = 'inline-block';
        btnDisponeFep.style.display = 'inline-block';
    }
}

/**
 * Registra el evento de contacto
 */
export function registrarEvento() {
    mostrarPopupContacto("Evento registrado en Consulta Estado");
}

/**
 * Genera la anotación 42
 */
export function generarAnotacion42() {
    // Aquí puedes agregar la lógica específica para la anotación 42
    mostrarPopupContacto("Anotación 42 generada exitosamente");
}

/**
 * Ejecuta la acción de Disponer FEP
 */
export function ejecutarDisponeFep() {
    // Asegurar que exista un ID de expediente
    if (!document.getElementById('idExpediente').textContent) {
        actualizarIdExpediente();
    }
    
    // Aquí puedes agregar la lógica específica para disponer FEP
    mostrarPopupContacto("FEP dispuesto exitosamente");
}

/**
 * Abre el expediente electrónico
 */
export function abrirExpediente() {
    // Use the utility function to update all ID instances
    actualizarIdExpediente();
}

/**
 * Muestra el popup de antecedentes
 * @param {string} popupId - ID del popup a mostrar
 */
export function mostrarPopupAntecedentes(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'block';
    }
}

/**
 * Cierra el popup de antecedentes
 */
export function cerrarPopupAntecedentes() {
    const popup = document.getElementById('solicitaAntecedentesPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

/**
 * Solicita antecedentes al contribuyente
 */
export function enviarSolicitudAntecedentes() {
    // Obtener los antecedentes seleccionados
    const checkedAntecedentes = Array.from(document.querySelectorAll('.antecedentes-list input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);

    if (checkedAntecedentes.length === 0) {
        mostrarAlerta('Por favor seleccione al menos un antecedente.', 'error');
        return;
    }

    // Aquí iría la lógica para enviar los antecedentes al backend
    console.log('Antecedentes solicitados:', checkedAntecedentes);

    // Cerrar el popup de antecedentes si existe
    cerrarPopupAntecedentes();

    // Mostrar popup de evento registrado (reutilizando función existente)
    mostrarPopupContacto("Evento registrado en consulta estado");

    // Agregar ticket verde al botón de Solicitar Antecedentes
    marcarBotonSolicitaAntecedentes();
}

/**
 * Marca el botón de solicitar antecedentes con un tick verde
 */
export function marcarBotonSolicitaAntecedentes() {
    const btn = document.getElementById('Solicita-Antecedentes');
    if (btn && !btn.querySelector('.ticket-verde')) {
        const icon = document.createElement('span');
        icon.className = 'ticket-verde';
        icon.innerHTML = '✔️'; // Puedes usar un SVG si prefieres
        icon.style.marginLeft = '8px';
        btn.appendChild(icon);
    }
}
