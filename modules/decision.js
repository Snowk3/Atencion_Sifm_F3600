/**
 * Módulo: Decisión
 * Descripción: Proceso de toma de decisión y validaciones
 * Parte del Sistema de Devolución IVA Exportador
 */

import { obtenerValorNumerico, FORMATO_MONEDA } from './utilidades.js';
import { mostrarAlerta } from './core.js';
import { mostrarPopupFep } from './fep.js';

/**
 * Valida que se haya seleccionado una decisión
 * @returns {boolean} true si hay una decisión seleccionada
 */
export function validarDecision() {
    const radioButtons = document.getElementsByName('decisionCruce');
    return Array.from(radioButtons).some(radio => radio.checked);
}

/**
 * Valida que se hayan ingresado los montos requeridos
 * @returns {boolean} true si los montos están ingresados correctamente
 */
export function validarMontos() {
    const devolucionSolicitada = obtenerValorNumerico('devolucionSolicitada');
    const montoAutorizado = obtenerValorNumerico('montoAutorizado');
    return devolucionSolicitada > 0 && montoAutorizado >= 0 && montoAutorizado <= devolucionSolicitada;
}

/**
 * Actualiza el estado de habilitación de los botones según las validaciones
 */
export function validarYActualizarBotones() {
    const todoValido = validarDecision() && validarMontos();
    const botones = document.querySelectorAll('.accion-btn');
    botones.forEach(boton => {
        boton.disabled = !todoValido;
    });
}

/**
 * Verifica si se puede habilitar el FEP según el monto autorizado
 * @returns {boolean} Retorna true si se permite habilitar FEP
 */
export function puedeHabilitarFEP() {
    const montoAutorizado = obtenerValorNumerico('montoAutorizado');
    return montoAutorizado === 0 || document.getElementById('montoAutorizado').value.trim() === '';
}

/**
 * Valida la decisión y procesa la acción correspondiente
 * @param {string} accion - La acción a realizar ('ingresar', 'resolucion', 'notificar', 'disponerFep')
 */
export function validarYProcesarDecision(accion) {
    if (!validarDecision()) {
        mostrarAlerta('Debe seleccionar una decisión', 'error');
        return;
    }

    if (!validarMontos()) {
        mostrarAlerta('Los montos ingresados no son válidos', 'error');
        return;
    }

    const decision = document.querySelector('input[name="decisionCruce"]:checked').value;
    const montoAutorizado = document.getElementById('montoAutorizado').value;

    switch (accion) {
        case 'ingresar':
            // Procesar el ingreso de la decisión
            mostrarAlerta(`Decisión ingresada: ${decision} - Monto: ${montoAutorizado}`, 'success');
            document.getElementById('btnGenerarResolucion').disabled = false;
            break;

        case 'resolucion':
            if (generarResolucion()) {
                document.getElementById('btnNotificar').disabled = false;
                mostrarAlerta('Resolución generada exitosamente', 'success');
            }
            break;

        case 'notificar':
            // Notificar al contribuyente
            document.getElementById('btnDisponeFep').disabled = false;
            mostrarAlerta('Notificación enviada al contribuyente', 'success');
            break;

        case 'disponerFep':
            if (puedeHabilitarFEP()) {
                mostrarPopupFep();
            } else {
                mostrarAlerta('No se puede habilitar FEP con el monto autorizado actual', 'error');
            }
            break;
    }
}

/**
 * Genera la resolución correspondiente
 * @returns {boolean} true si la resolución se genera correctamente
 */
export function generarResolucion() {
    // TODO: Implementar generación de resolución
    mostrarAlerta('Resolución generada correctamente', 'success');
    return true;
}

// Funciones para la lógica de decisión 48 horas
export function initDecision() {
    // Elementos de decisión
    const radioLugar = document.getElementById('devolucionLugar');
    const radioParcial = document.getElementById('devolucionParcial');
    const radioNoLugar = document.getElementById('devolucionNoLugar');
    const montoSolicitada = document.getElementById('devolucionSolicitada');
    const montoAutorizado = document.getElementById('montoAutorizado');
    const montoRechazado = document.getElementById('montoRechazado');
    const comentarios = document.getElementById('comentarios');
    const btnIngresarDecision = document.getElementById('btnIngresarDecision');
    const btnGenerarResolucion = document.getElementById('btnGenerarResolucion');
    const btnNotificar = document.getElementById('btnNotificar');
    const btnDisponeFep = document.getElementById('btnDisponeFep');

    // Estado de botones
    btnIngresarDecision.disabled = false;
    btnGenerarResolucion.disabled = true;
    btnNotificar.disabled = true;
    btnDisponeFep.disabled = true;

    // Helper para limpiar y bloquear/desbloquear campos
    function setMontoAutorizado(valor, readOnly = false) {
        montoAutorizado.value = valor;
        montoAutorizado.readOnly = readOnly;
        montoAutorizado.dispatchEvent(new Event('change'));
    }

    function requireComentarios(requerido) {
        if (requerido) {
            comentarios.classList.add('required');
        } else {
            comentarios.classList.remove('required');
        }
    }

    // Lógica de selección de decisión
    function handleDecisionChange() {
        if (radioLugar && radioLugar.checked) {
            // 1. Devolución ha lugar: monto autorizado = monto solicitada, bloqueado
            setMontoAutorizado(montoSolicitada.value, true);
            requireComentarios(false);
            btnDisponeFep.disabled = true;
        } else if (radioParcial && radioParcial.checked) {
            // 2. Parcial: monto autorizado editable (>0), comentarios requeridos
            setMontoAutorizado('', false);
            requireComentarios(true);
            btnDisponeFep.disabled = true;
        } else if (radioNoLugar && radioNoLugar.checked) {
            // 3. No ha lugar: monto autorizado = 0, bloqueado, comentarios requeridos
            setMontoAutorizado('0', true);
            requireComentarios(true);
            btnDisponeFep.disabled = false;
        }
        
        // Lógica adicional: montoRechazado
        // Si montoAutorizado == devolucionSolicitada, montoRechazado = 0
        const autorizado = parseFloat(montoAutorizado.value.replace(/[^\d.-]/g, '')) || 0;
        const solicitada = parseFloat(montoSolicitada.value.replace(/[^\d.-]/g, '')) || 0;
        if (autorizado === solicitada) {
            montoRechazado.value = '0';
        }
    }

    // Configurar listeners
    if (radioLugar) radioLugar.addEventListener('change', handleDecisionChange);
    if (radioParcial) radioParcial.addEventListener('change', handleDecisionChange);
    if (radioNoLugar) radioNoLugar.addEventListener('change', handleDecisionChange);

    // Validación antes de procesar decisión
    function validarDecisionLocal() {
        if (radioLugar && radioLugar.checked) {
            // No requiere validación extra
            return true;
        } else if (radioParcial && radioParcial.checked) {
            // Monto autorizado > 0 y comentarios no vacíos
            const monto = parseFloat(montoAutorizado.value.replace(/[^\d.-]/g, ''));
            const comentario = comentarios.innerText.trim();
            if (!(monto > 0)) {
                alert('Debe ingresar un monto autorizado mayor a 0.');
                montoAutorizado.focus();
                return false;
            }
            if (!comentario) {
                alert('Debe ingresar comentarios para justificar la decisión parcial.');
                comentarios.focus();
                return false;
            }
            return true;
        } else if (radioNoLugar && radioNoLugar.checked) {
            // Comentarios no vacíos
            const comentario = comentarios.innerText.trim();
            if (!comentario) {
                alert('Debe ingresar comentarios para justificar el rechazo.');
                comentarios.focus();
                return false;
            }
            return true;
        }
        alert('Debe seleccionar una opción de decisión.');
        return false;
    }

    // Flujo de botones
    if (btnIngresarDecision) {
        btnIngresarDecision.addEventListener('click', function (e) {
            if (!validarDecisionLocal()) {
                e.preventDefault();
                return;
            }
            btnGenerarResolucion.disabled = false;
            btnIngresarDecision.disabled = true;
        });
    }

    if (btnGenerarResolucion) {
        btnGenerarResolucion.addEventListener('click', function () {
            btnNotificar.disabled = false;
            btnGenerarResolucion.disabled = true;
        });
    }

    // Inicializar estado según selección actual
    handleDecisionChange();
}
