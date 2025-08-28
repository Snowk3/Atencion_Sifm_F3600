/**
 * Módulo: Observaciones No Justificadas
 * Descripción: Gestión de la pestaña de observaciones no justificadas
 * Parte del Sistema de Devolución IVA Exportador
 */

import { mostrarAlerta } from './core.js';

/**
 * Abre la hoja de trabajo para una observación específica
 * @param {string} obsId - ID de la observación
 */
export function abrirHojaTrabajo(obsId) {
    // Mostrar el popup
    const popup = document.getElementById('worksheetPopup');
    popup.style.display = 'block';

    // Actualizar el número de observación en el título
    document.getElementById('obsNumber').textContent = obsId;

    // Cargar datos de ejemplo (reemplazar con datos reales de tu sistema)
    cargarDatosHojaTrabajo(obsId);

    // Configurar los eventos de los botones
    configurarBotonesHojaTrabajo();
}

/**
 * Carga los datos en las tablas y checklist de la hoja de trabajo
 * @param {string} obsId - ID de la observación
 */
export function cargarDatosHojaTrabajo(obsId) {
    // Ejemplo de datos (reemplazar con datos reales)
    const codigos3600 = [
        { codigo: '001', nombre: 'Código Ejemplo 1', valor: '1000000' },
        { codigo: '002', nombre: 'Código Ejemplo 2', valor: '2000000' }
    ];

    const vectoresPropios = [
        { codigo: 'VP1', nombre: 'Vector Propio 1', valor: '500000' },
        { codigo: 'VP2', nombre: 'Vector Propio 2', valor: '750000' }
    ];

    const vectoresComplementables = [
        { codigo: 'VC1', nombre: 'Vector DDJJ 1', valor: '300000' },
        { codigo: 'VC2', nombre: 'Vector DDJJ 2', valor: '450000' }
    ];

    const vectoresTerceros = [
        { codigo: 'VT1', nombre: 'Vector Tercero 1', valor: '200000' },
        { codigo: 'VT2', nombre: 'Vector Tercero 2', valor: '350000' }
    ];

    const revisiones = [
        'Verificación de documentación respaldatoria',
        'Validación de montos declarados',
        'Comprobación de fechas',
        'Revisión de requisitos formales'
    ];

    // Llenar las tablas
    llenarTabla('codigos3600Table', codigos3600);
    llenarTabla('vectoresPropiosTable', vectoresPropios);
    llenarTabla('vectoresComplementablesTable', vectoresComplementables);
    llenarTabla('vectoresTercerosTable', vectoresTerceros);

    // Crear checklist
    crearChecklist(revisiones);
}

/**
 * Llena una tabla con los datos proporcionados
 * @param {string} tableId - ID de la tabla
 * @param {Array} datos - Array de objetos con los datos
 */
export function llenarTabla(tableId, datos) {
    const tbody = document.getElementById(tableId);
    tbody.innerHTML = '';

    datos.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.codigo}</td>
            <td>${item.nombre}</td>
            <td>${item.valor}</td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Crea el checklist de revisiones
 * @param {Array} revisiones - Array de strings con las revisiones
 */
export function crearChecklist(revisiones) {
    const container = document.getElementById('revisionesChecklist');
    container.innerHTML = '';

    revisiones.forEach((revision, index) => {
        const div = document.createElement('div');
        div.className = 'checklist-item';
        div.innerHTML = `
            <input type="checkbox" id="check${index}" class="revision-check">
            <label for="check${index}">${revision}</label>
        `;
        container.appendChild(div);
    });
}

/**
 * Configura los eventos de los botones de la hoja de trabajo
 */
export function configurarBotonesHojaTrabajo() {
    // Botón de Justificación de Jefe
    document.getElementById('btnJustificacionJefe').onclick = function() {
        // Implementar lógica para justificación de jefe
        alert('Solicitando justificación del jefe de grupo...');
    };

    // Botón de Grabar
    document.getElementById('btnGrabar').onclick = function() {
        guardarHojaTrabajo();
    };

    // Botón de Salir
    document.getElementById('btnSalir').onclick = function() {
        cerrarHojaTrabajo();
    };
}

/**
 * Guarda los datos de la hoja de trabajo
 */
export function guardarHojaTrabajo() {
    // Obtener valores del formulario
    const comentarios = document.getElementById('worksheetComentarios').value;
    const revisiones = Array.from(document.querySelectorAll('.revision-check'))
        .map(check => ({
            texto: check.nextElementSibling.textContent,
            checked: check.checked
        }));

    // Validar que se hayan completado todas las revisiones
    if (!validarRevisiones(revisiones)) {
        mostrarAlerta('Debe completar todas las revisiones antes de guardar', 'error');
        return;
    }

    // Aquí implementar la lógica para guardar los datos
    console.log('Guardando hoja de trabajo...', { comentarios, revisiones });
    mostrarAlerta('Hoja de trabajo guardada exitosamente', 'success');
    cerrarHojaTrabajo();
}

/**
 * Valida que todas las revisiones estén marcadas
 * @param {Array} revisiones - Array de objetos con las revisiones
 * @returns {boolean} - true si todas las revisiones están marcadas
 */
export function validarRevisiones(revisiones) {
    return revisiones.every(revision => revision.checked);
}

/**
 * Cierra la hoja de trabajo
 */
export function cerrarHojaTrabajo() {
    const popup = document.getElementById('worksheetPopup');
    popup.style.display = 'none';
    
    // Limpiar formulario
    document.getElementById('worksheetComentarios').value = '';
    document.querySelectorAll('.revision-check').forEach(check => check.checked = false);
}
