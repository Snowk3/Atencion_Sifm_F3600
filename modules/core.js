/**
 * Módulo: Core
 * Descripción: Funcionalidad común utilizada en múltiples módulos
 * Parte del Sistema de Devolución IVA Exportador
 */

import { FORMATO_MONEDA, FORMATO_UTM, convertirAUTM, obtenerValorNumerico, generarIdExpediente } from './utilidades.js';

/**
 * Formatea un número con separadores de miles y actualiza UTM
 * @param {HTMLInputElement} input - El elemento input a formatear
 */
export function formatNumber(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor) {
        input.value = FORMATO_MONEDA.format(parseInt(valor));
    }
    actualizarCamposUTM();
}

/**
 * Actualiza todos los campos UTM basados en sus correspondientes montos en pesos
 */
export function actualizarCamposUTM() {
    // Devolución solicitada
    const devolucionSolicitada = obtenerValorNumerico('devolucionSolicitada');
    if (devolucionSolicitada > 0) {
        const utmSolicitada = convertirAUTM(devolucionSolicitada);
        document.getElementById('devolucionSolicitadaUTM').value = FORMATO_UTM.format(utmSolicitada);
    }

    // Monto autorizado
    const montoAutorizado = obtenerValorNumerico('montoAutorizado');
    if (montoAutorizado >= 0) {
        const utmAutorizada = convertirAUTM(montoAutorizado);
        document.getElementById('montoAutorizadoUTM').value = FORMATO_UTM.format(utmAutorizada);
        
        // Monto rechazado (calculado como devolución solicitada - monto autorizado)
        if (devolucionSolicitada >= montoAutorizado) {
            const montoRechazado = devolucionSolicitada - montoAutorizado;
            const utmRechazada = convertirAUTM(montoRechazado);
            document.getElementById('montoRechazadoUTM').value = FORMATO_UTM.format(utmRechazada);
            // Actualizar también el campo de monto rechazado en pesos si existe
            const montoRechazadoElement = document.getElementById('montoRechazado');
            if (montoRechazadoElement) {
                montoRechazadoElement.value = FORMATO_MONEDA.format(montoRechazado);
            }
        }
    }
}

/**
 * Actualiza el valor UTM de un campo específico
 * @param {string} campoMonedaId - ID del campo con el monto en moneda
 * @param {string} campoUtmId - ID del campo donde se mostrará el valor en UTM
 */
export function actualizarUTM(campoMonedaId, campoUtmId) {
    const valorMoneda = obtenerValorNumerico(campoMonedaId);
    if (valorMoneda >= 0) {
        const valorUTM = convertirAUTM(valorMoneda);
        document.getElementById(campoUtmId).value = FORMATO_UTM.format(valorUTM);
    }
}

/**
 * Muestra un mensaje de alerta personalizado
 * @param {string} mensaje - El mensaje a mostrar
 * @param {string} [tipo='info'] - El tipo de alerta (error, warning, info, success)
 */
export function mostrarAlerta(mensaje, tipo = 'info') {
    const alertaDiv = document.createElement('div');
    alertaDiv.className = `alerta-popup alerta-${tipo}`;
    alertaDiv.innerHTML = `
        <div class="alerta-contenido">
            <p>${mensaje}</p>
            <button onclick="this.parentElement.parentElement.remove()">Aceptar</button>
        </div>
    `;
    document.body.appendChild(alertaDiv);
}

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
 * Updates the expedition ID across all places in the interface
 * @param {string} expedienteID - The ID to set (if not provided, a new one will be generated)
 * @returns {string} The expedition ID that was set
 */
export function actualizarIdExpediente(expedienteID = null) {
    // If no ID provided, generate a new one
    if (!expedienteID) {
        expedienteID = generarIdExpediente();
    }
    
    // Update the ID in the main section
    const mainExpedienteElement = document.getElementById('idExpediente');
    if (mainExpedienteElement) {
        mainExpedienteElement.textContent = expedienteID;
    }
    
    // Update the ID in the FEP section
    const fepExpedienteElement = document.getElementById('idExpedienteFep');
    if (fepExpedienteElement) {
        fepExpedienteElement.textContent = expedienteID;
    }
    
    return expedienteID;
}

/**
 * Configura los tooltips y ayudas contextuales de la interfaz
 */
export function configurarTooltips() {
    const elementos = document.querySelectorAll('[data-tooltip]');
    elementos.forEach(elemento => {
        elemento.setAttribute('title', elemento.dataset.tooltip);
    });
}

/**
 * Función para actualizar el contador de caracteres del área de texto
 */
export function updateCharCount() {
    const text = document.getElementById('comentarios').value;
    document.getElementById('charCount').textContent = text.length;
}
