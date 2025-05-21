/**
 * Módulo: Utilidades
 * Descripción: Constantes globales, formatos de moneda, funciones de conversión, generación de IDs
 * Parte del Sistema de Devolución IVA Exportador
 */

// Valores y constantes globales
export const UTM_VALOR = 65182;
export const DEVOLUCION_SOLICITADA = 15000000;
export const FECHA_SOLICITUD = new Date('2025-05-19');
export const folioformulario = 123456789;

/**
 * Calcula la fecha máxima de decisión sumando 2 días a la fecha de solicitud
 * @returns {Date} Fecha máxima para decisión 48 horas
 */
export function calcularFechaMaxDesc48() {
    const fechaMax = new Date(FECHA_SOLICITUD);
    fechaMax.setDate(fechaMax.getDate() + 2);
    return fechaMax;
}

// Formatos de moneda y números
export const FORMATO_MONEDA = new Intl.NumberFormat('es-CL', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

export const FORMATO_UTM = new Intl.NumberFormat('es-CL', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

/**
 * Convierte un monto desde pesos chilenos a UTM
 * @param {number} valorPesos - Monto en pesos chilenos
 * @returns {number} Valor convertido a UTM
 */
export function convertirAUTM(valorPesos) {
    return valorPesos / UTM_VALOR;
}

/**
 * Genera un ID único para resoluciones FEP
 * @returns {string} ID con formato FEP-YYYYMMDD-XXXX
 */
export function generarIdResolucion() {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `FEP-${year}${month}${day}-${random}`;
}

/**
 * Genera un número de resolución FEP
 * @returns {string} Número de resolución generado
 */
export function generarNumeroResolucion() {
    const año = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${numero}-${año}`;
}

/**
 * Genera un ID de expediente electrónico
 * @returns {string} ID de expediente generado
 */
export function generarIdExpediente() {
    const año = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `EE-${año}-${numero}`;
}

/**
 * Genera un número de folio único para la solicitud FEP
 * @returns {string} Folio generado con formato YYYYMMDD-XXX
 */
export function generarFolioSolicitud() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `${año}${mes}${dia}-${random}`;
}

/**
 * Formatea una fecha al formato dd/mm/yyyy
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export function formatoFecha(fecha) {
    return fecha.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Obtiene el valor numérico de un input eliminando formato de moneda
 * @param {string} inputId - ID del elemento input
 * @returns {number} Valor numérico del input
 */
export function obtenerValorNumerico(inputId) {
    const elemento = document.getElementById(inputId);
    if (!elemento) return 0;
    const valor = elemento.value.replace(/\D/g, '');
    return valor ? parseInt(valor) : 0;
}
