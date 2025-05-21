/**
 * SISTEMA DE DEVOLUCIÓN IVA EXPORTADOR
 * Módulo: Fiscalización Especial Previa (FEP)
 * Descripción: Funcionalidad para el manejo del flujo FEP
 */

import { mostrarAlerta, formatoFecha, FORMATO_MONEDA } from './utilidades.js';
import { actualizarIdExpediente, handleTabNavigation, actualizarUTM } from './core.js';
import { obtenerValorNumerico } from './utilidades.js';
import { generarIdResolucion, generarNumeroResolucion, generarFolioSolicitud, generarIdExpediente } from './utilidades.js';

/**
 * Muestra el popup de FEP
 */
export function mostrarPopupFep() {
    document.getElementById('fepPopup').style.display = 'block';
    document.getElementById('fepComentarios').focus();
}

/**
 * Cierra el popup de FEP
 */
export function cerrarPopupFep() {
    document.getElementById('fepPopup').style.display = 'none';
    document.getElementById('fepComentarios').innerHTML = '';
    document.getElementById('fepCharCount').textContent = '0';
}

/**
 * Aplica formato al texto en el editor FEP
 * @param {string} command - El comando de formato a aplicar
 */
export function formatFepText(command) {
    document.execCommand(command, false, null);
}

/**
 * Envía la solicitud FEP y navega a la pestaña FEP
 */
export function enviarSolicitudFep() {
    const comentarios = document.getElementById('fepComentarios').innerText;
    if (comentarios.trim().length === 0) {
        mostrarAlerta('Debe ingresar comentarios para la solicitud FEP', 'error');
        return;
    }

    // Obtener fecha actual
    const fecha = new Date().toLocaleDateString('es-CL');
    
    // Actualizar campos en la sección FEP
    document.getElementById('fechaFep').textContent = fecha;
    document.getElementById('periodoTributario').textContent = '202504';
    document.getElementById('folioSolicitud').textContent = generarFolioSolicitud();
    document.getElementById('montoSolicitadoFep').textContent = document.getElementById('devolucionSolicitada').value;
    
    // Asegurar que el ID de expediente esté sincronizado
    const mainIdExpediente = document.getElementById('idExpediente').textContent;
    if (mainIdExpediente) {
        // Si ya existe un ID, usarlo para actualizar todos los elementos
        actualizarIdExpediente(mainIdExpediente);
    } else {
        // Si no existe, generar uno nuevo
        actualizarIdExpediente();
    }
    
    // Cerrar el popup y navegar a la pestaña FEP
    document.getElementById('fepPopup').style.display = 'none';
    handleTabNavigation({ currentTarget: document.getElementById('tabFepButton') }, 'tabFep');
    
    // Mostrar mensaje de éxito
    mostrarAlerta('Solicitud FEP enviada correctamente', 'success');
}

/**
 * Genera la resolución FEP
 */
export function generarResolucionFep() {
    // Generar y almacenar número de resolución
    const numeroResolucion = generarNumeroResolucion();
    document.getElementById('numeroResolucionFep').textContent = numeroResolucion;

    // Almacenar fecha de generación
    const fechaGeneracion = formatoFecha(new Date());
    document.getElementById('fechaGeneracionFep').textContent = fechaGeneracion;

    // Habilitar botón de notificación
    document.getElementById('btnNotificarFep').disabled = false;
    
    mostrarAlerta('Resolución FEP generada correctamente', 'success');
}

/**
 * Notifica al contribuyente sobre la resolución FEP
 */
export function notificarContribuyenteFep() {
    // Mostrar alerta de éxito
    mostrarAlerta('Notificación FEP enviada al contribuyente', 'success');
    
    // Actualizar datos y mostrar sección de aviso vencimiento
    const fechaActual = new Date();
    const diaActual = fechaActual.getDate().toString().padStart(2, '0');
    const mesActual = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const añoActual = fechaActual.getFullYear();
    const fechaFormateada = `${diaActual}/${mesActual}/${añoActual}`;
    
    document.getElementById('fechaNotificacionFep').textContent = fechaFormateada;
    
    // Calcular y mostrar la fecha límite
    calcularFechaLimite();
    
    // Mostrar la sección de aviso vencimiento
    document.getElementById('seccionAvisoVencimiento').style.display = 'block';
}

/**
 * Calcula y muestra la fecha límite (fecha generación acta + 15 días)
 */
export function calcularFechaLimite() {
    // Obtener la fecha de generación del acta, si existe
    const fechaGeneracionActaElement = document.getElementById('fechaGeneracionActa');
    let fechaBase;
    
    if (fechaGeneracionActaElement && fechaGeneracionActaElement.value) {
        // Usar la fecha del calendario si está disponible
        fechaBase = new Date(fechaGeneracionActaElement.value);
    } else {
        // Si no hay fecha en el calendario, usar la fecha de notificación FEP
        const fechaNotificacionElement = document.getElementById('fechaNotificacionFep');
        if (!fechaNotificacionElement || !fechaNotificacionElement.textContent) {
            return;
        }
        
        // Parsear la fecha (formato dd/mm/yyyy)
        const partesFecha = fechaNotificacionElement.textContent.split('/');
        if (partesFecha.length !== 3) {
            return;
        }
        
        const dia = parseInt(partesFecha[0], 10);
        const mes = parseInt(partesFecha[1], 10) - 1; // En JavaScript los meses van de 0-11
        const año = parseInt(partesFecha[2], 10);
        
        // Crear objeto Date con la fecha de notificación
        fechaBase = new Date(año, mes, dia);
    }
    
    // Sumar 15 días
    const fechaLimite = new Date(fechaBase);
    fechaLimite.setDate(fechaLimite.getDate() + 15);
    
    // Formatear la fecha límite (dd/mm/yyyy)
    const diaLimite = fechaLimite.getDate().toString().padStart(2, '0');
    const mesLimite = (fechaLimite.getMonth() + 1).toString().padStart(2, '0');
    const añoLimite = fechaLimite.getFullYear();
    const fechaLimiteFormateada = `${diaLimite}/${mesLimite}/${añoLimite}`;
    
    // Mostrar la fecha límite en el elemento correspondiente
    const fechaLimiteElement = document.getElementById('fechaLimite15Dias');
    if (fechaLimiteElement) {
        fechaLimiteElement.textContent = fechaLimiteFormateada;
        
        // Aplicar clase de estilo
        fechaLimiteElement.classList.add('fecha-maxima');
    }
}

/**
 * Genera la resolución para la primera revisión FEP (15 días)
 */
export function generarResolucion15Dias() {
    const decision = document.querySelector('input[name="decision15Dias"]:checked');
    if (!decision) {
        mostrarAlerta('Debe seleccionar una decisión', 'error');
        return;
    }

    const montoAutorizado = document.getElementById('montoAutorizado15').value;
    if (montoAutorizado === '' && decision.value !== 'retencionTotal') {
        mostrarAlerta('Debe ingresar un monto autorizado', 'error');
        return;
    }

    // Generar y almacenar número de resolución
    const numeroResolucion = generarIdResolucion();
    document.getElementById('numeroResolucionFepSegunda').textContent = numeroResolucion;
    
    // Almacenar fecha de generación
    const fechaGeneracion = new Date();
    document.getElementById('fechaGeneracionFepSegunda').textContent = formatoFecha(fechaGeneracion);
    
    // Habilitar siguiente paso
    document.getElementById('btnNotificar15').disabled = false;
    mostrarAlerta('Resolución generada correctamente', 'success');
}

/**
 * Notifica al contribuyente sobre la decisión de 15 días
 */
export function notificarContribuyente15Dias() {
    mostrarAlerta('Notificación enviada al contribuyente', 'success');
    document.getElementById('btnEnviarDecision15').disabled = false;
}

/**
 * Envía la decisión final de 15 días
 */
export function enviarDecision15Dias() {
    const decision = document.querySelector('input[name="decision15Dias"]:checked').value;
    const montoAutorizado = document.getElementById('montoAutorizado15').value;
    
    mostrarAlerta(`Decisión enviada exitosamente: ${decision} - Monto: ${montoAutorizado}`, 'success');
}

/**
 * Formatea un número con separadores de miles para la sección 15 días
 * @param {HTMLInputElement} input - El elemento input a formatear
 */
export function formatNumber15(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor) {
        input.value = FORMATO_MONEDA.format(parseInt(valor));
    }
    calcularMontos15();
}

/**
 * Calcula los montos y conversiones UTM para la sección 15 días
 */
export function calcularMontos15() {
    const montoSolicitado = obtenerValorNumerico('montoSolicitado15');
    const montoAutorizado = obtenerValorNumerico('montoAutorizado15');
    const montoRechazado = montoSolicitado - montoAutorizado;
    
    if (montoSolicitado > 0) {
        document.getElementById('montoRechazado15').value = FORMATO_MONEDA.format(montoRechazado);
    }
    
    actualizarUTM('montoSolicitado15', 'montoSolicitadoUTM15');
    actualizarUTM('montoAutorizado15', 'montoAutorizadoUTM15');
    actualizarUTM('montoRechazado15', 'montoRechazadoUTM15');
    
    validarYActualizarBotonesDecision15();
}

/**
 * Valida y actualiza el estado de los botones de la sección 15 días
 */
export function validarYActualizarBotonesDecision15() {
    const decisionSeleccionada = Array.from(document.getElementsByName('decision15Dias')).some(radio => radio.checked);
    const montoAutorizado = obtenerValorNumerico('montoAutorizado15');
    const montoSolicitado = obtenerValorNumerico('montoSolicitado15');
    
    const valido = decisionSeleccionada && 
                  (montoAutorizado >= 0 && montoAutorizado <= montoSolicitado);
    
    document.getElementById('btnGenerarResolucion15').disabled = !valido;
}

/**
 * Controla la habilitación del botón de generar acta
 */
export function toggleActaRecepcion() {
    const checkbox = document.getElementById('checkInfoRecibida');
    const btnGenerar = document.getElementById('btnGenerarActa');
    btnGenerar.disabled = !checkbox.checked;
}

/**
 * Genera el acta de recepción F3309
 */
export function generarActaRecepcion() {
    const checkbox = document.getElementById('checkInfoRecibida');
    if (!checkbox.checked) {
        mostrarAlerta('Debe confirmar que el contribuyente ha enviado la información requerida', 'error');
        return;
    }
    
    // Registrar la fecha actual en el campo fechaGeneracionActa
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split('T')[0]; // Formato YYYY-MM-DD para input date
    const fechaGeneracionActa = document.getElementById('fechaGeneracionActa');
    if (fechaGeneracionActa) {
        fechaGeneracionActa.value = fechaFormateada;
        // Calcular la fecha límite basada en esta fecha
        calcularFechaLimite();
    }
    
    mostrarAlerta('Acta de Recepción F3309 generada exitosamente', 'success');
    
    // Mostrar y configurar la sección de decisión 15 días
    document.getElementById('seccionDecision15Dias').style.display = 'block';
    
    // Copiar los montos iniciales
    const montoSolicitado = document.getElementById('devolucionSolicitada').value;
    document.getElementById('montoSolicitado15').value = montoSolicitado;
    actualizarUTM('montoSolicitado15', 'montoSolicitadoUTM15');
    
    // Habilitar los radio buttons y el campo de monto autorizado
    habilitarControlesDecision15();
}

/**
 * Habilita los controles de la sección de decisión 15 días
 */
export function habilitarControlesDecision15() {
    const radios = document.getElementsByName('decision15Dias');
    radios.forEach(radio => radio.disabled = false);
    document.getElementById('montoAutorizado15').disabled = false;
}

/**
 * Guarda la fecha de generación del acta y muestra confirmación
 */
export function guardarFechaActa() {
    const fechaGeneracionActa = document.getElementById('fechaGeneracionActa');
    
    // Verificar que se haya ingresado una fecha
    if (!fechaGeneracionActa || !fechaGeneracionActa.value) {
        mostrarAlerta('Debe ingresar una fecha de generación del acta', 'error');
        return;
    }
    
    // Formatear la fecha para mostrar
    const fecha = new Date(fechaGeneracionActa.value);
    const fechaFormateada = fecha.toLocaleDateString('es-CL');
    
    // Aquí se implementaría la lógica para guardar en el sistema de Consulta Estado
    // Esta es una simulación del proceso de guardado
    
    // Actualizar la fecha límite basada en esta fecha
    calcularFechaLimite();
    
    // Mostrar mensaje de confirmación
    mostrarAlerta('Evento registrado en Consulta Estado', 'success');
}

/**
 * Habilita/deshabilita los controles de la segunda revisión
 */
export function toggleDecisionSegunda() {
    const checkbox = document.getElementById('checkInfoRecibidaSegunda');
    
    if (checkbox.checked) {
        habilitarControlesSegundaDecision();
    } else {
        deshabilitarControlesSegundaDecision();
    }
}

/**
 * Habilita los controles de la segunda decisión
 */
export function habilitarControlesSegundaDecision() {
    const radios = document.getElementsByName('decisionSegunda');
    radios.forEach(radio => radio.disabled = false);
    document.getElementById('montoAutorizadoSegunda').disabled = false;
}

/**
 * Deshabilita los controles de la segunda decisión
 */
export function deshabilitarControlesSegundaDecision() {
    const radios = document.getElementsByName('decisionSegunda');
    radios.forEach(radio => radio.disabled = true);
    document.getElementById('montoAutorizadoSegunda').disabled = true;
}
