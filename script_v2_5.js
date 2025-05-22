/******************************************************************************
 * SISTEMA DE DEVOLUCIÃ“N IVA EXPORTADOR
 * MÃ³dulo: DecisiÃ³n F3600 (VERSIÃ“N MODULAR)
 * DescripciÃ³n: Manejo de la lÃ³gica de decisiones para devoluciÃ³n de IVA exportador
 * Ãšltima actualizaciÃ³n: 19/05/2025
 ******************************************************************************/

/******************************************************************************
 * 1. FUNCIONES BASE Y UTILITARIAS
 * - Constantes globales, formatos de moneda, conversiones, generaciÃ³n de IDs, etc.
 ******************************************************************************/

// Valores y constantes globales
const UTM_VALOR = 65182;
const DEVOLUCION_SOLICITADA = 15000000;
const FECHA_SOLICITUD = new Date('2025-05-21');
const folioformulario = 123456789

// Formatos de moneda y nÃºmeros
const FORMATO_MONEDA = new Intl.NumberFormat('es-CL', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

const FORMATO_UTM = new Intl.NumberFormat('es-CL', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

/**
 * Convierte un monto desde pesos chilenos a UTM
 * @param {number} valorPesos - Monto en pesos chilenos
 * @returns {number} Valor convertido a UTM
 */
function convertirAUTM(valorPesos) {
    return valorPesos / UTM_VALOR;
}

/**
 * Genera un ID Ãºnico para resoluciones FEP
 * @returns {string} ID con formato FEP-YYYYMMDD-XXXX
 */
function generarIdResolucion() {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `FEP-${year}${month}${day}-${random}`;
}

/**
 * Genera un nÃºmero de resoluciÃ³n FEP
 * @returns {string} NÃºmero de resoluciÃ³n generado
 */
function generarNumeroResolucion() {
    const aÃ±o = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${numero}-${aÃ±o}`;
}

/**
 * Genera un ID de expediente electrÃ³nico
 * @returns {string} ID de expediente generado
 */
function generarIdExpediente() {
    const aÃ±o = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `EE-${aÃ±o}-${numero}`;
}

/**
 * Genera un nÃºmero de folio Ãºnico para la solicitud FEP
 * @returns {string} Folio generado con formato YYYYMMDD-XXX
 */
function generarFolioSolicitud() {
    const fecha = new Date();
    const aÃ±o = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `${aÃ±o}${mes}${dia}-${random}`;
}

/**
 * Formatea una fecha al formato dd/mm/yyyy
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
function formatoFecha(fecha) {
    return fecha.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Obtiene el valor numÃ©rico de un input eliminando formato de moneda
 * @param {string} inputId - ID del elemento input
 * @returns {number} Valor numÃ©rico del input
 */
function obtenerValorNumerico(inputId) {
    const elemento = document.getElementById(inputId);
    if (!elemento) return 0;
    const valor = elemento.value.replace(/\D/g, '');
    return valor ? parseInt(valor) : 0;
}

/******************************************************************************
 * 2. FUNCIONES COMPARTIDAS / CORE
 * - Funcionalidad comÃºn utilizada en mÃºltiples mÃ³dulos
 ******************************************************************************/

/**
 * Formatea un nÃºmero con separadores de miles y actualiza UTM
 * @param {HTMLInputElement} input - El elemento input a formatear
 */
function formatNumber(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor) {
        input.value = FORMATO_MONEDA.format(parseInt(valor));
    }
    actualizarCamposUTM();
}

/**
 * Actualiza todos los campos UTM basados en sus correspondientes montos en pesos
 */
function actualizarCamposUTM() {
    // DevoluciÃ³n solicitada
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
        
        // Monto rechazado (calculado como devoluciÃ³n solicitada - monto autorizado)
        if (devolucionSolicitada >= montoAutorizado) {
            const montoRechazado = devolucionSolicitada - montoAutorizado;
            const utmRechazada = convertirAUTM(montoRechazado);
            document.getElementById('montoRechazadoUTM').value = FORMATO_UTM.format(utmRechazada);
            // Actualizar tambiÃ©n el campo de monto rechazado en pesos si existe
            const montoRechazadoElement = document.getElementById('montoRechazado');
            if (montoRechazadoElement) {
                montoRechazadoElement.value = FORMATO_MONEDA.format(montoRechazado);
            }
        }
    }
}

/**
 * Actualiza el valor UTM de un campo especÃ­fico
 * @param {string} campoMonedaId - ID del campo con el monto en moneda
 * @param {string} campoUtmId - ID del campo donde se mostrarÃ¡ el valor en UTM
 */
function actualizarUTM(campoMonedaId, campoUtmId) {
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
function mostrarAlerta(mensaje, tipo = 'info') {
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
function mostrarPopupContacto(mensaje) {
    document.getElementById('popupMensaje').textContent = mensaje;
    document.getElementById('popupContacto').style.display = 'flex';
}

/**
 * Cierra el popup de contacto
 */
function cerrarPopupContacto() {
    document.getElementById('popupContacto').style.display = 'none';
}

/**
 * Updates the expedition ID across all places in the interface
 * @param {string} expedienteID - The ID to set (if not provided, a new one will be generated)
 * @returns {string} The expedition ID that was set
 */
function actualizarIdExpediente(expedienteID = null) {
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
function configurarTooltips() {
    const elementos = document.querySelectorAll('[data-tooltip]');
    elementos.forEach(elemento => {
        elemento.setAttribute('title', elemento.dataset.tooltip);
    });
}

/******************************************************************************
 * 3. GESTIÃ“N DE NAVEGACIÃ“N Y PESTAÃ‘AS
 * - Funciones para la navegaciÃ³n entre pestaÃ±as y UI comÃºn
 ******************************************************************************/

/**
 * Maneja la navegaciÃ³n entre pestaanas
 * @param {Event} event - El evento del click
 * @param {string} tabId - El ID del contenido de la pestaana a mostrar
 */
function handleTabNavigation(event, tabId) {
    hideAllTabContents();
    deactivateAllTabs();
    showSelectedTab(tabId);
    setActiveTab(event.currentTarget);
    
    // Inicializar contenido cuando se navega a la pestaÃ±a FEP
    if (tabId === 'tabFep') {
        const devolucionSolicitada = document.getElementById('devolucionSolicitada').value;
        document.getElementById('montoSolicitadoFep').textContent = devolucionSolicitada;
        document.getElementById('fechaFep').textContent = new Date().toLocaleDateString('es-CL');
        document.getElementById('periodoTributario').textContent = '202504';
        document.getElementById('folioSolicitud').textContent = generarFolioSolicitud();
        
        // Sincronizar el ID del expediente entre secciones
        const mainIdExpediente = document.getElementById('idExpediente').textContent;
        if (mainIdExpediente) {
            // Si hay un ID existente en la secciÃ³n principal, usarlo
            actualizarIdExpediente(mainIdExpediente);
        } else if (document.getElementById('idExpedienteFep').textContent) {
            // Si hay un ID en la secciÃ³n FEP pero no en la principal, usarlo
            actualizarIdExpediente(document.getElementById('idExpedienteFep').textContent);
        }
        
        // Asegurar que todas las secciones FEP sean visibles
        document.querySelectorAll('.subsection-content').forEach(section => {
            section.style.display = 'block';
            section.classList.remove('collapsed');
        });
    }
}

/**
 * Oculta todos los contenidos de las pestaÃ±as
 */
function hideAllTabContents() {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
}

/**
 * Desactiva todas las pestaÃ±as
 */
function deactivateAllTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
}

/**
 * Muestra el contenido de la pestaÃ±a seleccionada
 * @param {string} tabId - El ID del contenido a mostrar
 */
function showSelectedTab(tabId) {
    document.getElementById(tabId).classList.add('active');
}

/**
 * Marca la pestaÃ±a seleccionada como activa
 * @param {HTMLElement} selectedTab - El elemento de la pestaÃ±a seleccionada
 */
function setActiveTab(selectedTab) {
    selectedTab.classList.add('active');
}

/******************************************************************************
 * 4. SECCIÃ“N OBSERVACIONES NO JUSTIFICADAS
 * - GestiÃ³n de la pestaÃ±a de observaciones no justificadas
 ******************************************************************************/

/**
 * Abre la hoja de trabajo para una observaciÃ³n especÃ­fica
 * @param {string} obsId - ID de la observaciÃ³n
 */
function abrirHojaTrabajo(obsId) {
    // Mostrar el popup
    const popup = document.getElementById('worksheetPopup');
    popup.style.display = 'block';

    // Actualizar el nÃºmero de observaciÃ³n en el tÃ­tulo
    document.getElementById('obsNumber').textContent = obsId;

    // Cargar datos de ejemplo (reemplazar con datos reales de tu sistema)
    cargarDatosHojaTrabajo(obsId);

    // Configurar los eventos de los botones
    configurarBotonesHojaTrabajo();
}

/**
 * Carga los datos en las tablas y checklist de la hoja de trabajo
 * @param {string} obsId - ID de la observaciÃ³n
 */
function cargarDatosHojaTrabajo(obsId) {
    // Ejemplo de datos (reemplazar con datos reales)
    const codigos3600 = [
        { codigo: '001', nombre: 'CÃ³digo Ejemplo 1', valor: '1000000' },
        { codigo: '002', nombre: 'CÃ³digo Ejemplo 2', valor: '2000000' }
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
        'VerificaciÃ³n de documentaciÃ³n respaldatoria',
        'ValidaciÃ³n de montos declarados',
        'ComprobaciÃ³n de fechas',
        'RevisiÃ³n de requisitos formales'
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
function llenarTabla(tableId, datos) {
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
function crearChecklist(revisiones) {
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
function configurarBotonesHojaTrabajo() {
    // BotÃ³n de JustificaciÃ³n de Jefe
    document.getElementById('btnJustificacionJefe').onclick = function() {
        // Implementar lÃ³gica para justificaciÃ³n de jefe
        alert('Solicitando justificaciÃ³n del jefe de grupo...');
    };

    // BotÃ³n de Grabar
    document.getElementById('btnGrabar').onclick = function() {
        guardarHojaTrabajo();
    };

    // BotÃ³n de Salir
    document.getElementById('btnSalir').onclick = function() {
        cerrarHojaTrabajo();
    };
}

/**
 * Guarda los datos de la hoja de trabajo
 */
function guardarHojaTrabajo() {
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

    // AquÃ­ implementar la lÃ³gica para guardar los datos
    console.log('Guardando hoja de trabajo...', { comentarios, revisiones });
    mostrarAlerta('Hoja de trabajo guardada exitosamente', 'success');
    cerrarHojaTrabajo();
}

/**
 * Valida que todas las revisiones estÃ©n marcadas
 * @param {Array} revisiones - Array de objetos con las revisiones
 * @returns {boolean} - true si todas las revisiones estÃ¡n marcadas
 */
function validarRevisiones(revisiones) {
    return revisiones.every(revision => revision.checked);
}

/**
 * Cierra la hoja de trabajo
 */
function cerrarHojaTrabajo() {
    const popup = document.getElementById('worksheetPopup');
    popup.style.display = 'none';
    
    // Limpiar formulario
    document.getElementById('worksheetComentarios').value = '';
    document.querySelectorAll('.revision-check').forEach(check => check.checked = false);
}

/******************************************************************************
 * 5. SECCIÃ“N OBSERVACIONES JUSTIFICADAS
 * - GestiÃ³n de la pestaÃ±a de observaciones justificadas
 ******************************************************************************/

// AquÃ­ se agregarÃ¡n las funciones especÃ­ficas para la gestiÃ³n de observaciones justificadas
// a medida que se implementen en el sistema

/******************************************************************************
 * 6. SECCIÃ“N DECISIÃ“N
 * - Proceso de toma de decisiÃ³n y validaciones
 ******************************************************************************/
/**
 * Calcula la fecha mÃ¡xima de decisiÃ³n sumando 2 dÃ­as a la fecha de solicitud
 * @returns {Date} Fecha mÃ¡xima para decisiÃ³n 48 horas
 */
function calcularFechaMaxDesc48() {
    const fechaMax = new Date(FECHA_SOLICITUD);
    fechaMax.setDate(fechaMax.getDate() + 2);
    return fechaMax;
}
/**
 * Valida que se haya seleccionado una decisiÃ³n
 * @returns {boolean} true si hay una decisiÃ³n seleccionada
 */
function validarDecision() {
    const radioButtons = document.getElementsByName('decisionCruce');
    return Array.from(radioButtons).some(radio => radio.checked);
}

/**
 * Valida que se hayan ingresado los montos requeridos
 * @returns {boolean} true si los montos estÃ¡n ingresados correctamente
 */
function validarMontos() {
    const devolucionSolicitada = obtenerValorNumerico('devolucionSolicitada');
    const montoAutorizado = obtenerValorNumerico('montoAutorizado');
    return devolucionSolicitada > 0 && montoAutorizado >= 0 && montoAutorizado <= devolucionSolicitada;
}

/**
 * Actualiza el estado de habilitaciÃ³n de los botones segÃºn las validaciones
 */
function validarYActualizarBotones() {
    const todoValido = validarDecision() && validarMontos();
    const botones = document.querySelectorAll('.accion-btn');
    botones.forEach(boton => {
        boton.disabled = !todoValido;
    });
}
// =====================
// LÃ³gica de DecisiÃ³n 48 Horas
// =====================

document.addEventListener('DOMContentLoaded', function () {
    // Elementos de decisiÃ³n
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
    btnDisponeFep.disabled = true; // Siempre deshabilitado al inicio

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

    // LÃ³gica de selecciÃ³n de decisiÃ³n
    function handleDecisionChange() {
        if (radioLugar.checked) {
            // 1. DevoluciÃ³n ha lugar: monto autorizado = monto solicitada, bloqueado
            setMontoAutorizado(montoSolicitada.value, true);
            requireComentarios(false);
            btnDisponeFep.disabled = true;
        } else if (radioParcial.checked) {
            // 2. Parcial: monto autorizado editable (>0), comentarios requeridos
            setMontoAutorizado('', false);
            requireComentarios(true);
            btnDisponeFep.disabled = true;
        } else if (radioNoLugar.checked) {
            // 3. No ha lugar: monto autorizado = 0, bloqueado, comentarios requeridos
            setMontoAutorizado('0', true);
            requireComentarios(true);
            btnDisponeFep.disabled = false;
        }
             // --- LÃ³gica adicional: montoRechazado ---
        // Si montoAutorizado == devolucionSolicitada, montoRechazado = 0
        const autorizado = parseFloat(montoAutorizado.value.replace(/[^\d.-]/g, '')) || 0;
        const solicitada = parseFloat(montoSolicitada.value.replace(/[^\d.-]/g, '')) || 0;
        if (autorizado === solicitada) {
            montoRechazado.value = '0';
        }
    }

    radioLugar.addEventListener('change', handleDecisionChange);
    radioParcial.addEventListener('change', handleDecisionChange);
    radioNoLugar.addEventListener('change', handleDecisionChange);

       // TambiÃ©n actualizar montoRechazado cuando cambian los montos
    function handleMontosChange() {
        const autorizado = parseFloat(montoAutorizado.value.replace(/[^\d.-]/g, '')) || 0;
        const solicitada = parseFloat(montoSolicitada.value.replace(/[^\d.-]/g, '')) || 0;
        if (autorizado === solicitada) {
            montoRechazado.value = '0';
        }}

    // ValidaciÃ³n antes de procesar decisiÃ³n
    function validarDecision() {
        if (radioLugar.checked) {
            // No requiere validaciÃ³n extra
            return true;
        } else if (radioParcial.checked) {
            // Monto autorizado > 0 y comentarios no vacÃ­os
            const monto = parseFloat(montoAutorizado.value.replace(/[^\d.-]/g, ''));
            const comentario = comentarios.innerText.trim();
            if (!(monto > 0)) {
                alert('Debe ingresar un monto autorizado mayor a 0.');
                montoAutorizado.focus();
                return false;
            }
            if (!comentario) {
                alert('Debe ingresar comentarios para justificar la decisiÃ³n parcial.');
                comentarios.focus();
                return false;
            }
            return true;
        } else if (radioNoLugar.checked) {
            // Comentarios no vacÃ­os
            const comentario = comentarios.innerText.trim();
            if (!comentario) {
                alert('Debe ingresar comentarios para justificar el rechazo.');
                comentarios.focus();
                return false;
            }
            return true;
        }
        alert('Debe seleccionar una opciÃ³n de decisiÃ³n.');
        return false;
    }

    // Flujo de botones
    btnIngresarDecision.addEventListener('click', function (e) {
        if (!validarDecision()) {
            e.preventDefault();
            return;
        }
        btnGenerarResolucion.disabled = false;
        btnIngresarDecision.disabled = true;
    });

    btnGenerarResolucion.addEventListener('click', function () {
        btnNotificar.disabled = false;
        btnGenerarResolucion.disabled = true;
    });

    // El botÃ³n Notificar no habilita ningÃºn otro botÃ³n en este flujo

    // El botÃ³n DisponeFep solo se habilita con "No ha lugar" (ya manejado en handleDecisionChange)

    // Inicializar estado segÃºn selecciÃ³n actual
    handleDecisionChange();
});
/**
 * Verifica si se puede habilitar el FEP segÃºn el monto autorizado
 * @returns {boolean} Retorna true si se permite habilitar FEP
 */
function puedeHabilitarFEP() {
    const montoAutorizado = obtenerValorNumerico('montoAutorizado');
    return montoAutorizado === 0 || document.getElementById('montoAutorizado').value.trim() === '';
}

/**
 * Valida la decisiÃ³n y procesa la acciÃ³n correspondiente
 * @param {string} accion - La acciÃ³n a realizar ('ingresar', 'resolucion', 'notificar', 'disponerFep')
 */
function validarYProcesarDecision(accion) {
    if (!validarDecision()) {
        mostrarAlerta('Debe seleccionar una decisiÃ³n', 'error');
        return;
    }

    if (!validarMontos()) {
        mostrarAlerta('Los montos ingresados no son vÃ¡lidos', 'error');
        return;
    }

    const decision = document.querySelector('input[name="decisionCruce"]:checked').value;
    const montoAutorizado = document.getElementById('montoAutorizado').value;

    switch (accion) {
        case 'ingresar':
            // Procesar el ingreso de la decisiÃ³n
            mostrarAlerta(`DecisiÃ³n ingresada: ${decision} - Monto: ${montoAutorizado}`, 'success');
            document.getElementById('btnGenerarResolucion').disabled = false;
            break;

        case 'resolucion':
            if (generarResolucion()) {
                document.getElementById('btnNotificar').disabled = false;
                mostrarAlerta('ResoluciÃ³n generada exitosamente', 'success');
            }
            break;

        case 'notificar':
            // Notificar al contribuyente
            document.getElementById('btnDisponeFep').disabled = false;
            mostrarAlerta('NotificaciÃ³n enviada al contribuyente', 'success');
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
 * Genera la resoluciÃ³n correspondiente
 * @returns {boolean} true si la resoluciÃ³n se genera correctamente
 */
function generarResolucion() {
    // TODO: Implementar generaciÃ³n de resoluciÃ³n
    mostrarAlerta('ResoluciÃ³n generada correctamente', 'success');
    return true;
}

/******************************************************************************
 * 7. SECCIÃ“N FEP (FISCALIZACIÃ“N ESPECIAL PREVIA)
 * - Manejo completo del flujo FEP
 ******************************************************************************/

/**
 * Muestra el popup de FEP
 */
function mostrarPopupFep() {
    document.getElementById('fepPopup').style.display = 'block';
    document.getElementById('fepComentarios').focus();
}

/**
 * Cierra el popup de FEP
 */
function cerrarPopupFep() {
    document.getElementById('fepPopup').style.display = 'none';
    document.getElementById('fepComentarios').innerHTML = '';
    document.getElementById('fepCharCount').textContent = '0';
}

/**
 * Aplica formato al texto en el editor FEP
 * @param {string} command - El comando de formato a aplicar
 */
function formatFepText(command) {
    document.execCommand(command, false, null);
}

/**
 * EnvÃ­a la solicitud FEP y navega a la pestaÃ±a FEP
 */
function enviarSolicitudFep() {
    const comentarios = document.getElementById('fepComentarios').innerText;
    if (comentarios.trim().length === 0) {
        mostrarAlerta('Debe ingresar comentarios para la solicitud FEP', 'error');
        return;
    }

    // Obtener fecha actual
    const fecha = new Date().toLocaleDateString('es-CL');
    
    // Actualizar campos en la secciÃ³n FEP
    document.getElementById('fechaFep').textContent = fecha;
    document.getElementById('periodoTributario').textContent = '202504';
    document.getElementById('folioSolicitud').textContent = generarFolioSolicitud();
    document.getElementById('montoSolicitadoFep').textContent = document.getElementById('devolucionSolicitada').value;
    
    // Asegurar que el ID de expediente estÃ© sincronizado
    const mainIdExpediente = document.getElementById('idExpediente').textContent;
    if (mainIdExpediente) {
        // Si ya existe un ID, usarlo para actualizar todos los elementos
        actualizarIdExpediente(mainIdExpediente);
    } else {
        // Si no existe, generar uno nuevo
        actualizarIdExpediente();
    }
    
    // Cerrar el popup y navegar a la pestaÃ±a FEP
    document.getElementById('fepPopup').style.display = 'none';
    handleTabNavigation({ currentTarget: document.getElementById('tabFep') }, 'tabFep');
    
    // Mostrar mensaje de Ã©xito
    mostrarAlerta('Solicitud FEP enviada correctamente', 'success');
}

/**
 * Controla la habilitaciÃ³n del botÃ³n de generar acta
 */
function toggleActaRecepcion() {
    const checkbox = document.getElementById('checkInfoRecibida');
    const btnGenerar = document.getElementById('btnGenerarActa');
    btnGenerar.disabled = !checkbox.checked;
}

/**
 * Genera el acta de recepciÃ³n F3309
 */
function generarActaRecepcion() {
    const checkbox = document.getElementById('checkInfoRecibida');
    if (!checkbox.checked) {
        mostrarAlerta('Debe confirmar que el contribuyente ha enviado la informaciÃ³n requerida', 'error');
        return;
    }
    
    // Registrar la fecha actual en el campo fechaGeneracionActa
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split('T')[0]; // Formato YYYY-MM-DD para input date
    const fechaGeneracionActa = document.getElementById('fechaGeneracionActa');
    if (fechaGeneracionActa) {
        fechaGeneracionActa.value = fechaFormateada;
        // Calcular la fecha lÃ­mite basada en esta fecha
        calcularFechaLimite();
    }
    
    mostrarAlerta('Acta de RecepciÃ³n F3309 generada exitosamente', 'success');
    
    // Mostrar y configurar la secciÃ³n de decisiÃ³n 15 dÃ­as
    document.getElementById('seccionDecision15Dias').style.display = 'block';
    
    // Copiar los montos iniciales
    const montoSolicitado = document.getElementById('devolucionSolicitada').value;
    document.getElementById('montoSolicitado15').value = montoSolicitado;
    actualizarUTM('montoSolicitado15', 'montoSolicitadoUTM15');
    
    // Habilitar los radio buttons y el campo de monto autorizado
    habilitarControlesDecision15();
}

/**
 * Genera la resoluciÃ³n FEP
 */
function generarResolucionFep() {
    // Generar y almacenar nÃºmero de resoluciÃ³n
    const numeroResolucion = generarNumeroResolucion();
    document.getElementById('numeroResolucionFep').textContent = numeroResolucion;

    // Almacenar fecha de generaciÃ³n
    const fechaGeneracion = formatoFecha(new Date());
    document.getElementById('fechaGeneracionFep').textContent = fechaGeneracion;

    // Habilitar botÃ³n de notificaciÃ³n
    document.getElementById('btnNotificarFep').disabled = false;
    
    mostrarAlerta('ResoluciÃ³n FEP generada correctamente', 'success');
}

/**
 * Notifica al contribuyente sobre la resoluciÃ³n FEP
 */
function notificarContribuyenteFep() {
    // Mostrar alerta de Ã©xito
    mostrarAlerta('NotificaciÃ³n FEP enviada al contribuyente', 'success');
    
    // Actualizar datos y mostrar secciÃ³n de aviso vencimiento
    const fechaActual = new Date();
    const diaActual = fechaActual.getDate().toString().padStart(2, '0');
    const mesActual = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const aÃ±oActual = fechaActual.getFullYear();
    const fechaFormateada = `${diaActual}/${mesActual}/${aÃ±oActual}`;
    
    document.getElementById('fechaNotificacionFep').textContent = fechaFormateada;
    
    // Calcular y mostrar la fecha lÃ­mite
    calcularFechaLimite();
    
    // Mostrar la secciÃ³n de aviso vencimiento
    document.getElementById('seccionAvisoVencimiento').style.display = 'block';
}

/**
 * Calcula y muestra la fecha lÃ­mite (fecha generaciÃ³n acta + 15 dÃ­as)
 */
function calcularFechaLimite() {
    // Obtener la fecha de generaciÃ³n del acta, si existe
    const fechaGeneracionActaElement = document.getElementById('fechaGeneracionActa');
    let fechaBase;
    
    if (fechaGeneracionActaElement && fechaGeneracionActaElement.value) {
        // Usar la fecha del calendario si estÃ¡ disponible
        fechaBase = new Date(fechaGeneracionActa.value);
    } else {
        // Si no hay fecha en el calendario, usar la fecha de notificaciÃ³n FEP
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
        const aÃ±o = parseInt(partesFecha[2], 10);
        
        // Crear objeto Date con la fecha de notificaciÃ³n
        fechaBase = new Date(aÃ±o, mes, dia);
    }
    
    // Sumar 15 dÃ­as
    const fechaLimite = new Date(fechaBase);
    fechaLimite.setDate(fechaLimite.getDate() + 15);
    
    // Formatear la fecha lÃ­mite (dd/mm/yyyy)
    const diaLimite = fechaLimite.getDate().toString().padStart(2, '0');
    const mesLimite = (fechaLimite.getMonth() + 1).toString().padStart(2, '0');
    const aÃ±oLimite = fechaLimite.getFullYear();
    const fechaLimiteFormateada = `${diaLimite}/${mesLimite}/${aÃ±oLimite}`;
    
    // Mostrar la fecha lÃ­mite en el elemento correspondiente
    const fechaLimiteElement = document.getElementById('fechaLimite15Dias');
    if (fechaLimiteElement) {
        fechaLimiteElement.textContent = fechaLimiteFormateada;
        
        // Aplicar clase de estilo
        fechaLimiteElement.classList.add('fecha-maxima');
    }
}

/**
 * Genera la resoluciÃ³n para la primera revisiÃ³n FEP (15 dÃ­as)
 */
function generarResolucion15Dias() {
    const decision = document.querySelector('input[name="decision15Dias"]:checked');
    if (!decision) {
        mostrarAlerta('Debe seleccionar una decisiÃ³n', 'error');
        return;
    }

    const montoAutorizado = document.getElementById('montoAutorizado15').value;
    if (montoAutorizado === '' && decision.value !== 'retencionTotal') {
        mostrarAlerta('Debe ingresar un monto autorizado', 'error');
        return;
    }

    // Generar y almacenar nÃºmero de resoluciÃ³n
    const numeroResolucion = generarIdResolucion();
    document.getElementById('numeroResolucionFepSegunda').textContent = numeroResolucion;
    
    // Almacenar fecha de generaciÃ³n
    const fechaGeneracion = new Date();
    document.getElementById('fechaGeneracionFepSegunda').textContent = formatoFecha(fechaGeneracion);
    
    // Habilitar siguiente paso
    document.getElementById('btnNotificar15').disabled = false;
    mostrarAlerta('ResoluciÃ³n generada correctamente', 'success');
}

/**
 * Notifica al contribuyente sobre la decisiÃ³n de 15 dÃ­as
 */
function notificarContribuyente15Dias() {
    // Verificar si el radio button plazoAdicional15 estÃ¡ seleccionado
    const radioPlazoAdicional = document.getElementById('plazoAdicional15');
    
    if (radioPlazoAdicional && radioPlazoAdicional.checked) {
        // Si estÃ¡ seleccionado, establecer la fecha actual en fechaNotificacionSegundaRevision
        const fechaActual = new Date();
        const fechaFormateada = formatoFecha(fechaActual);
        
        // Actualizar el elemento con la fecha actual
        const fechaNotificacionElement = document.getElementById('fechaNotificacionSegundaRevision');
        if (fechaNotificacionElement) {
            fechaNotificacionElement.textContent = fechaFormateada;
            

        }
    }
    
    // Continuar con el comportamiento normal de la funciÃ³n
    mostrarAlerta('NotificaciÃ³n enviada al contribuyente', 'success');
    document.getElementById('btnEnviarDecision15').disabled = false;
}

/**
 * EnvÃ­a la decisiÃ³n final de 15 dÃ­as
 */
function enviarDecision15Dias() {
    const decision = document.querySelector('input[name="decision15Dias"]:checked').value;
    const montoAutorizado = document.getElementById('montoAutorizado15').value;
    
    mostrarAlerta(`DecisiÃ³n enviada exitosamente: ${decision} - Monto: ${montoAutorizado}`, 'success');
}

/**
 * Formatea un nÃºmero con separadores de miles para la secciÃ³n 15 dÃ­as
 * @param {HTMLInputElement} input - El elemento input a formatear
 */
function formatNumber15(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor) {
        input.value = FORMATO_MONEDA.format(parseInt(valor));
    }
    calcularMontos15();
}

/**
 * Calcula los montos y conversiones UTM para la secciÃ³n 15 dÃ­as
 */
function calcularMontos15() {
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
 * Valida y actualiza el estado de los botones de la secciÃ³n 15 dÃ­as
 */
function validarYActualizarBotonesDecision15() {
    const decisionSeleccionada = Array.from(document.getElementsByName('decision15Dias')).some(radio => radio.checked);
    const montoAutorizado = obtenerValorNumerico('montoAutorizado15');
    const montoSolicitado = obtenerValorNumerico('montoSolicitado15');
    
    const valido = decisionSeleccionada && 
                  (montoAutorizado >= 0 && montoAutorizado <= montoSolicitado);
    
    document.getElementById('btnGenerarResolucion15').disabled = !valido;
}


/**
 * Habilita los controles de la secciÃ³n de decisiÃ³n 15 dÃ­as
 */
function habilitarControlesDecision15() {
    const radios = document.getElementsByName('decision15Dias');
    radios.forEach(radio => radio.disabled = false);
    document.getElementById('montoAutorizado15').disabled = false;
}

/**
 * Maneja la lÃ³gica de selecciÃ³n de decisiÃ³n para los radio buttons de decisiÃ³n 15 dÃ­as
 */
function handleDecision15Change() {
    // Obtener los radio buttons
    const radioDevolucionTotal = document.getElementById('devolucionTotal15');
    const radioRetencionTotal = document.getElementById('retencionTotal15');
    const radioPlazoAdicional = document.getElementById('plazoAdicional15');
    const montoAutorizado = document.getElementById('montoAutorizado15');
    
    // Establecer el valor del monto autorizado segÃºn la selecciÃ³n
    if (radioDevolucionTotal && radioDevolucionTotal.checked) {
        // Para devoluciÃ³n total, el monto autorizado es igual al solicitado
        montoAutorizado.value = FORMATO_MONEDA.format(DEVOLUCION_SOLICITADA);
        montoAutorizado.readOnly = true; // Bloquear ediciÃ³n
    } else if ((radioRetencionTotal && radioRetencionTotal.checked) || 
               (radioPlazoAdicional && radioPlazoAdicional.checked)) {
        // Para retenciÃ³n total o plazo adicional, el monto autorizado es 0
        montoAutorizado.value = FORMATO_MONEDA.format(0);
        montoAutorizado.readOnly = true; // Bloquear ediciÃ³n
    } else {
        // Para las demÃ¡s opciones, permitir ediciÃ³n
        montoAutorizado.readOnly = false;
    }
    
    // Recalcular montos y UTMs
    calcularMontos15();
}

/******************************************************************************
 * 8. MÃ“DULO DE CONTACTO CON CONTRIBUYENTE
 * - GestiÃ³n de contactos y comunicaciones
 ******************************************************************************/

/**
 * Muestra u oculta los botones segÃºn la opciÃ³n seleccionada
 */
function toggleBotonesContacto() {
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
function registrarEvento() {
    mostrarPopupContacto("Evento registrado en Consulta Estado");
}

/**
 * Genera la anotaciÃ³n 42
 */
function generarAnotacion42() {
    // AquÃ­ puedes agregar la lÃ³gica especÃ­fica para la anotaciÃ³n 42
    mostrarPopupContacto("AnotaciÃ³n 42 generada exitosamente");
}

/**
 * Ejecuta la acciÃ³n de Disponer FEP
 */
function ejecutarDisponeFep() {
    // Asegurar que exista un ID de expediente
    if (!document.getElementById('idExpediente').textContent) {
        actualizarIdExpediente();
    }
    
    // AquÃ­ puedes agregar la lÃ³gica especÃ­fica para disponer FEP
    mostrarPopupContacto("FEP dispuesto exitosamente");
}

/**
 * Abre el expediente electrÃ³nico
 */
function AbrirExpediente() {
    // Use the utility function to update all ID instances
    actualizarIdExpediente();
}

/**
 * Muestra el popup de antecedentes
 * @param {string} popupId - ID del popup a mostrar
 */
function mostrarPopupAntecedentes(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.display = 'block';
    }
}

/**
 * Cierra el popup de antecedentes
 */
function cerrarPopupAntecedentes() {
    const popup = document.getElementById('solicitaAntecedentesPopup');
    if (popup) {
        popup.style.display = 'none';
    }
}

/**
 * Solicita antecedentes al contribuyente
 */
function enviarSolicitudAntecedentes() {
    // Obtener los antecedentes seleccionados
    const checkedAntecedentes = Array.from(document.querySelectorAll('.antecedentes-list input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);

    if (checkedAntecedentes.length === 0) {
        alert('Por favor seleccione al menos un antecedente.');
        return;
    }

    // AquÃ­ irÃ­a la lÃ³gica para enviar los antecedentes al backend
    console.log('Antecedentes solicitados:', checkedAntecedentes);

    // Cerrar el popup de antecedentes si existe
    cerrarPopupAntecedentes && cerrarPopupAntecedentes();

    // Mostrar popup de evento registrado (reutilizando funciÃ³n existente)
    mostrarPopupContacto("Evento registrado en consulta estado");

    // Agregar ticket verde al botÃ³n de Solicitar Antecedentes
    marcarBotonSolicitaAntecedentes();
}

/**
 * Marca el botÃ³n de solicitar antecedentes con un tick verde
 */
function marcarBotonSolicitaAntecedentes() {
    const btn = document.getElementById('Solicita-Antecedentes');
    if (btn && !btn.querySelector('.ticket-verde')) {
        const icon = document.createElement('span');
        icon.className = 'ticket-verde';
        icon.innerHTML = 'âœ”ï¸'; // Puedes usar un SVG si prefieres
        icon.style.marginLeft = '8px';
        btn.appendChild(icon);
    }
}

/******************************************************************************
 * 9. INICIALIZACIÃ“N Y EVENTOS
 * - ConfiguraciÃ³n inicial y listeners de eventos
 ******************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el monto de devoluciÃ³n solicitada
    const devolucionInput = document.getElementById('devolucionSolicitada');
    if (devolucionInput) {
        devolucionInput.value = FORMATO_MONEDA.format(DEVOLUCION_SOLICITADA);
        actualizarCamposUTM(); // Actualizar los campos UTM al inicializar
    }

    // Muestra el valor de UTM actual
    document.getElementById('valorUTM').textContent = FORMATO_MONEDA.format(UTM_VALOR);
    
    // Configura listeners para campos de montos
    const camposMontos = ['devolucionSolicitada', 'montoAutorizado'];
    camposMontos.forEach(campo => {
        document.getElementById(campo)?.addEventListener('input', (event) => {
            formatNumber(event.target);
        });
    });

    // Inicializar fecha de solicitud y folio
    const fechaSolicitudElement = document.getElementById('fechaSolicitud');
    if (fechaSolicitudElement) {
        fechaSolicitudElement.textContent = formatoFecha(FECHA_SOLICITUD);
    } 

    const folioElement = document.getElementById('folioFormulario');
    if (folioElement) {
        folioElement.textContent = folioformulario;
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
    document.getElementsByName('decisionCruce').forEach(radio => {
        radio.addEventListener('change', validarYActualizarBotones);
    });

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
            
            document.getElementById('fepCharCount').textContent = charCount;
            
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
    }    // Asegurar que todas las secciones FEP sean visibles inicialmente
    document.querySelectorAll('.subsection-content').forEach(section => {
        section.style.display = 'block';
        section.classList.remove('collapsed');
    });
      // Inicializar el monto solicitado 15 dÃ­as con el valor de DEVOLUCION_SOLICITADA
    const montoSolicitado15 = document.getElementById('montoSolicitado15');
    if (montoSolicitado15) {
        montoSolicitado15.value = FORMATO_MONEDA.format(DEVOLUCION_SOLICITADA);
        actualizarUTM('montoSolicitado15', 'montoSolicitadoUTM15');
    }
    
    // Inicializar el monto solicitado Segunda RevisiÃ³n con el valor de DEVOLUCION_SOLICITADA
    const montoSolicitadoSegunda = document.getElementById('montoSolicitadoSegunda');
    if (montoSolicitadoSegunda) {
        montoSolicitadoSegunda.value = FORMATO_MONEDA.format(DEVOLUCION_SOLICITADA);
        actualizarUTM('montoSolicitadoSegunda', 'montoSolicitadoUTMSegunda');
    }
    
    // Configurar listeners para los radio buttons de decisiÃ³n 15 dÃ­as
    document.getElementsByName('decision15Dias').forEach(radio => {
        radio.addEventListener('change', handleDecision15Change);
    });
    
    // Configurar listeners para los radio buttons de decisiÃ³n segunda
    document.getElementsByName('decisionSegunda').forEach(radio => {
        radio.addEventListener('change', handleDecisionSegundaChange);
    });
    
    // Inicializar sincronizaciÃ³n de IDs de expediente si existe algÃºn valor
    const mainIdExpediente = document.getElementById('idExpediente')?.textContent;
    const fepIdExpediente = document.getElementById('idExpedienteFep')?.textContent;
    
    if (mainIdExpediente || fepIdExpediente) {
        // Usar el ID existente que encontremos primero
        actualizarIdExpediente(mainIdExpediente || fepIdExpediente);
    }
      // Manejar cambios en los checkboxes para informaciÃ³n recibida
    document.getElementById('checkInfoRecibida')?.addEventListener('change', toggleActaRecepcion);
    document.getElementById('checkInfoRecibidaFep')?.addEventListener('change', toggleActaRecepcionFep);
    document.getElementById('checkInfoRecibidaSegunda')?.addEventListener('change', toggleDecisionSegunda);
    
    // Inicializar el tema
    initTheme();
    
    // Agregar listener al botÃ³n de cambio de tema
    document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);
});

/**
 * Habilita/deshabilita los controles de la segunda revisiÃ³n
 */
function toggleDecisionSegunda() {
    const checkbox = document.getElementById('checkInfoRecibidaSegunda');
    
    if (checkbox.checked) {
        habilitarControlesSegundaDecision();
    } else {
        deshabilitarControlesSegundaDecision();
    }
}

/**
 * Habilita los controles de la segunda decisiÃ³n
 */
function habilitarControlesSegundaDecision() {
    const radios = document.getElementsByName('decisionSegunda');
    radios.forEach(radio => radio.disabled = false);
    document.getElementById('montoAutorizadoSegunda').disabled = false;
}

/**
 * Deshabilita los controles de la segunda decisiÃ³n
 */
function deshabilitarControlesSegundaDecision() {
    const radios = document.getElementsByName('decisionSegunda');
    radios.forEach(radio => radio.disabled = true);
    document.getElementById('montoAutorizadoSegunda').disabled = true;
}

/**
 * Alterna entre modo oscuro y claro
 */
function toggleDarkMode() {
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
function initTheme() {
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

// FunciÃ³n faltante para el contador de caracteres - requerida por el cÃ³digo
function updateCharCount() {
    const text = document.getElementById('comentarios').value;
    document.getElementById('charCount').textContent = text.length;
}

/**
 * Controla la habilitaciÃ³n del botÃ³n de generar acta para la secciÃ³n FEP
 */
function toggleActaRecepcionFep() {
    const checkbox = document.getElementById('checkInfoRecibidaFep');
    const btnGenerar = document.getElementById('btnGenerarActaFep');
    btnGenerar.disabled = !checkbox.checked;
}

/**
 * Genera el acta de recepciÃ³n F3309 para la secciÃ³n FEP
 */
function generarActaRecepcionFep() {
    const checkbox = document.getElementById('checkInfoRecibidaFep');
    if (!checkbox.checked) {
        mostrarAlerta('Debe confirmar que el contribuyente ha enviado la informaciÃ³n requerida', 'error');
        return;
    }
      // Registrar la fecha actual en el campo fechaGeneracionActaFep
    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toISOString().split('T')[0]; // Formato YYYY-MM-DD para input date
    const fechaGeneracionActa = document.getElementById('fechaGeneracionActaFep');
    if (fechaGeneracionActa) {
        fechaGeneracionActa.value = fechaFormateada;
        // Calcular la fecha lÃ­mite basada en esta fecha
        calcularFechaLimiteFep();
    }
    
    mostrarAlerta('Acta de RecepciÃ³n F3309 generada exitosamente', 'success');
    
    // Mostrar y configurar la secciÃ³n de decisiÃ³n 15 dÃ­as
    document.getElementById('seccionDecision15Dias').style.display = 'block';
    
    // Establecer el monto solicitado usando la constante DEVOLUCION_SOLICITADA
    document.getElementById('montoSolicitado15').value = FORMATO_MONEDA.format(DEVOLUCION_SOLICITADA);
    actualizarUTM('montoSolicitado15', 'montoSolicitadoUTM15');
    
    // Habilitar los radio buttons y el campo de monto autorizado
    habilitarControlesDecision15();
}

/**
 * Calcula y muestra la fecha lÃ­mite para la secciÃ³n FEP (fecha generaciÃ³n acta + 15 dÃ­as)
 */
function calcularFechaLimiteFep() {
    // Obtener la fecha de generaciÃ³n del acta, si existe
    const fechaGeneracionActaElement = document.getElementById('fechaGeneracionActaFep');
    let fechaBase;
    
    if (fechaGeneracionActaElement && fechaGeneracionActaElement.value) {
        // Usar la fecha del calendario si estÃ¡ disponible
        fechaBase = new Date(fechaGeneracionActaElement.value);
    } else {
        // Si no hay fecha en el calendario, usar la fecha de notificaciÃ³n FEP
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
        const aÃ±o = parseInt(partesFecha[2], 10);
        
        // Crear objeto Date con la fecha de notificaciÃ³n
        fechaBase = new Date(aÃ±o, mes, dia);
    }
    
    // Sumar 15 dÃ­as
    const fechaLimite = new Date(fechaBase);
    fechaLimite.setDate(fechaLimite.getDate() + 15);
    
    // Formatear la fecha lÃ­mite (dd/mm/yyyy)
    const diaLimite = fechaLimite.getDate().toString().padStart(2, '0');
    const mesLimite = (fechaLimite.getMonth() + 1).toString().padStart(2, '0');
    const aÃ±oLimite = fechaLimite.getFullYear();
    const fechaLimiteFormateada = `${diaLimite}/${mesLimite}/${aÃ±oLimite}`;
    
    // Mostrar la fecha lÃ­mite en el elemento correspondiente
    const fechaLimiteElement = document.getElementById('fechaLimite15Dias');
    if (fechaLimiteElement) {
        fechaLimiteElement.textContent = fechaLimiteFormateada;
        
        // Aplicar clase de estilo
        fechaLimiteElement.classList.add('fecha-maxima');
    }
}


  // Inicializar fechaLimiteSegunda si ya hay una fecha de notificaciÃ³n
    const fechaNotificacionSegunda = document.getElementById('fechaNotificacionSegundaRevision');
    if (fechaNotificacionSegunda && fechaNotificacionSegunda.textContent) {
        // Si ya hay una fecha de notificaciÃ³n, calcular la fecha lÃ­mite
        setTimeout(() => calcularFechaLimiteSegunda(), 500);
    }

/**
 * Guarda la fecha de generaciÃ³n del acta y muestra confirmaciÃ³n para la secciÃ³n FEP
 */
function guardarFechaActaFep() {
    const fechaGeneracionActa = document.getElementById('fechaGeneracionActaFep');
    
    // Verificar que se haya ingresado una fecha
    if (!fechaGeneracionActa || !fechaGeneracionActa.value) {
        mostrarAlerta('Debe ingresar una fecha de generaciÃ³n del acta', 'error');
        return;
    }
    
    // Formatear la fecha para mostrar
    const fecha = new Date(fechaGeneracionActa.value);
    const fechaFormateada = fecha.toLocaleDateString('es-CL');
    
    // AquÃ­ se implementarÃ­a la lÃ³gica para guardar en el sistema de Consulta Estado
    // Esta es una simulaciÃ³n del proceso de guardado
    
    // Actualizar la fecha lÃ­mite basada en esta fecha
    calcularFechaLimiteFep();
    
    // Mostrar mensaje de confirmaciÃ³n
    mostrarAlerta('Evento registrado en Consulta Estado', 'success');
}

/**
 * Abre el expediente electrÃ³nico para la secciÃ³n FEP
 */
function AbrirExpedienteFep() {
    // Check if an ID already exists in the FEP section
    const idExpedienteFep = document.getElementById('idExpedienteFep');
    if (idExpedienteFep && idExpedienteFep.textContent) {
        // ID already exists, show message
        mostrarAlerta('Expediente ya ha sido generado para la solicitud', 'info');
    } else {
        // No ID yet, generate one
        actualizarIdExpediente();
    }
}

/******************************************************************************
 * 10. SECCIÃ“N SEGUNDA REVISION
 * - Proceso de segunda revisiÃ³n y validaciones
 ******************************************************************************/

/**
 * Valida que se haya seleccionado una decisiÃ³n en la segunda revisiÃ³n
 * @returns {boolean} true si hay una decisiÃ³n seleccionada
 */
function validarDecisionSegunda() {
    const radioButtons = document.getElementsByName('decisionSegunda');
    return Array.from(radioButtons).some(radio => radio.checked);
}

/**
 * Valida que se hayan ingresado los montos requeridos en la segunda revisiÃ³n
 * @returns {boolean} true si los montos estÃ¡n ingresados correctamente
 */
function validarMontosSegunda() {
    const montoAutorizado = obtenerValorNumerico('montoAutorizadoSegunda');
    return montoAutorizado >= 0;
}

/**
 * Actualiza el estado de habilitaciÃ³n de los botones segÃºn las validaciones de la segunda revisiÃ³n
 */
function validarYActualizarBotonesDecisionSegunda() {
    const todoValido = validarDecisionSegunda() && validarMontosSegunda();
    const botones = document.querySelectorAll('.accion-btn-segunda');
    botones.forEach(boton => {
        boton.disabled = !todoValido;
    });
}

/**
 * Formatea un nÃºmero con separadores de miles para la secciÃ³n Segunda RevisiÃ³n
 * @param {HTMLInputElement} input - El elemento input a formatear
 */
function formatNumberSegunda(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor) {
        input.value = FORMATO_MONEDA.format(parseInt(valor));
    }
    calcularMontosSegunda();
}

/**
 * Calcula los montos y conversiones UTM para la secciÃ³n Segunda RevisiÃ³n
 */
function calcularMontosSegunda() {
    const montoSolicitado = obtenerValorNumerico('montoSolicitadoSegunda');
    const montoAutorizado = obtenerValorNumerico('montoAutorizadoSegunda');
    const montoRechazado = montoSolicitado - montoAutorizado;
    
    if (montoSolicitado > 0) {
        document.getElementById('montoRechazadoSegunda').value = FORMATO_MONEDA.format(montoRechazado);
    }
    
    actualizarUTM('montoSolicitadoSegunda', 'montoSolicitadoUTMSegunda');
    actualizarUTM('montoAutorizadoSegunda', 'montoAutorizadoUTMSegunda');
    actualizarUTM('montoRechazadoSegunda', 'montoRechazadoUTMSegunda');
    
    validarYActualizarBotonesDecisionSegunda();
}

/**
 * Genera la resoluciÃ³n para la segunda revisiÃ³n
 */
function generarResolucionSegunda() {
    const decision = document.querySelector('input[name="decisionSegunda"]:checked');
    if (!decision) {
        mostrarAlerta('Debe seleccionar una decisiÃ³n', 'error');
        return;
    }

    const montoAutorizado = document.getElementById('montoAutorizadoSegunda').value;
    if (montoAutorizado === '' && decision.value !== 'retencionTotal') {
        mostrarAlerta('Debe ingresar un monto autorizado', 'error');
        return;
    }

    // Generar y almacenar nÃºmero de resoluciÃ³n
    const numeroResolucion = generarIdResolucion();
    // Almacenar fecha de generaciÃ³n
    const fechaGeneracion = new Date();
    
    // Habilitar siguiente paso
    document.getElementById('btnNotificarSegunda').disabled = false;
    mostrarAlerta('ResoluciÃ³n Segunda RevisiÃ³n generada correctamente', 'success');
}

/**
 * Notifica al contribuyente sobre la decisiÃ³n de la segunda revisiÃ³n
 */
function notificarContribuyenteSegunda() {
    // Establecer la fecha actual como fecha de notificaciÃ³n
    const fechaActual = new Date();
    const fechaFormateada = formatoFecha(fechaActual);
    
    // Actualizar el elemento con la fecha actual
    const fechaNotificacionElement = document.getElementById('fechaNotificacionSegundaRevision');
    if (fechaNotificacionElement) {
        fechaNotificacionElement.textContent = fechaFormateada;
        fechaNotificacionElement.style.display = 'inline-block'; // Asegurar visibilidad
        
        // Calcular inmediatamente la fecha lÃ­mite
        setTimeout(() => calcularFechaLimiteSegunda(), 100);
    }
    
    mostrarAlerta('NotificaciÃ³n de Segunda RevisiÃ³n enviada al contribuyente', 'success');
    document.getElementById('btnEnviarDecisionSegunda').disabled = false;
}
/**
 * EnvÃ­a la decisiÃ³n final de la segunda revisiÃ³n
 */
function enviarDecisionSegunda() {
    const decision = document.querySelector('input[name="decisionSegunda"]:checked').value;
    const montoAutorizado = document.getElementById('montoAutorizadoSegunda').value;
    
    mostrarAlerta(`DecisiÃ³n de Segunda RevisiÃ³n enviada exitosamente: ${decision} - Monto: ${montoAutorizado}`, 'success');
}

/**
 * Maneja la lÃ³gica de selecciÃ³n de decisiÃ³n para los radio buttons de decisiÃ³n segunda
 */
function handleDecisionSegundaChange() {
    // Obtener los radio buttons
    const radioDevolucionTotal = document.getElementById('devolucionTotalSegunda');
    const radioRetencionTotal = document.getElementById('retencionTotalSegunda');
    const radioPlazoAdicional = document.getElementById('plazoAdicionalSegunda');
    const montoAutorizado = document.getElementById('montoAutorizadoSegunda');
    
    // Establecer el valor del monto autorizado segÃºn la selecciÃ³n
    if (radioDevolucionTotal && radioDevolucionTotal.checked) {
        // Para devoluciÃ³n total, el monto autorizado es igual al solicitado
        montoAutorizado.value = FORMATO_MONEDA.format(DEVOLUCION_SOLICITADA);
        montoAutorizado.readOnly = true; // Bloquear ediciÃ³n
    } else if ((radioRetencionTotal && radioRetencionTotal.checked) || 
               (radioPlazoAdicional && radioPlazoAdicional.checked)) {
        // Para retenciÃ³n total o plazo adicional, el monto autorizado es 0
        montoAutorizado.value = FORMATO_MONEDA.format(0);
        montoAutorizado.readOnly = true; // Bloquear ediciÃ³n
    } else {
        // Para las demÃ¡s opciones, permitir ediciÃ³n
        montoAutorizado.readOnly = false;
    }
    
    // Recalcular montos y UTMs
    calcularMontosSegunda();
}

/**
 * Calcula y muestra la fecha lÃ­mite para la Segunda RevisiÃ³n (fecha notificaciÃ³n + 25 dÃ­as)
 */
function calcularFechaLimiteSegunda() {
    console.log("Iniciando cÃ¡lculo de fecha lÃ­mite segunda revisiÃ³n");
    
    // Obtener la fecha de notificaciÃ³n de la segunda revisiÃ³n
    const fechaNotificacionElement = document.getElementById('fechaNotificacionSegundaRevision');
    if (!fechaNotificacionElement) {
        console.error("Elemento fechaNotificacionSegundaRevision no encontrado");
        return;
    }
    
    if (!fechaNotificacionElement.textContent || fechaNotificacionElement.textContent.trim() === '') {
        console.error("Elemento fechaNotificacionSegundaRevision no tiene contenido:", fechaNotificacionElement.textContent);
        
        // Si no hay fecha, establecer la fecha actual como fecha de notificaciÃ³n
        const fechaActual = new Date();
        const diaActual = fechaActual.getDate().toString().padStart(2, '0');
        const mesActual = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
        const aÃ±oActual = fechaActual.getFullYear();
        fechaNotificacionElement.textContent = `${diaActual}/${mesActual}/${aÃ±oActual}`;
        console.log("Se estableciÃ³ la fecha actual como fecha de notificaciÃ³n:", fechaNotificacionElement.textContent);
    }
    
    console.log("Fecha de notificaciÃ³n encontrada:", fechaNotificacionElement.textContent);
    
    // Parsear la fecha (formato dd/mm/yyyy)
    const partesFecha = fechaNotificacionElement.textContent.split('/');
    if (partesFecha.length !== 3) {
        console.error("Formato de fecha incorrecto:", fechaNotificacionElement.textContent);
        return;
    }
    
    const dia = parseInt(partesFecha[0], 10);
    const mes = parseInt(partesFecha[1], 10) - 1; // En JavaScript los meses van de 0-11
    const aÃ±o = parseInt(partesFecha[2], 10);
    
    console.log("Fecha parseada:", dia, mes + 1, aÃ±o);
    
    // Crear objeto Date con la fecha de notificaciÃ³n
    const fechaBase = new Date(aÃ±o, mes, dia);
    
    // Sumar 25 dÃ­as
    const fechaLimite = new Date(fechaBase);
    fechaLimite.setDate(fechaLimite.getDate() + 25);
    
    console.log("Fecha lÃ­mite calculada:", fechaLimite);
    
    // Formatear la fecha lÃ­mite (dd/mm/yyyy)
    const diaLimite = fechaLimite.getDate().toString().padStart(2, '0');
    const mesLimite = (fechaLimite.getMonth() + 1).toString().padStart(2, '0');
    const aÃ±oLimite = fechaLimite.getFullYear();
    const fechaLimiteFormateada = `${diaLimite}/${mesLimite}/${aÃ±oLimite}`;
    
    console.log("Fecha lÃ­mite formateada:", fechaLimiteFormateada);
    
    // Mostrar la fecha lÃ­mite en el elemento correspondiente
    const fechaLimiteElement = document.getElementById('fechaLimiteSegunda');
    if (!fechaLimiteElement) {
        console.error("Elemento fechaLimiteSegunda no encontrado");
        
        // Verificar si el elemento existe pero no puede ser encontrado directamente
        const todosLosSpans = document.querySelectorAll('span');
        let encontrado = false;
        todosLosSpans.forEach(span => {
            if (span.id === 'fechaLimiteSegunda') {
                span.textContent = fechaLimiteFormateada;
                span.classList.add('fecha-maxima');
                encontrado = true;
                console.log("Elemento fechaLimiteSegunda encontrado mediante querySelectorAll");
            }
        });
        
        if (!encontrado) {
            console.error("Elemento fechaLimiteSegunda no pudo ser encontrado por ningÃºn mÃ©todo");
            return;
        }
    } else {
        // El elemento fue encontrado correctamente
        fechaLimiteElement.textContent = fechaLimiteFormateada;
        
        // Aplicar clase de estilo
        fechaLimiteElement.classList.add('fecha-maxima');
        
        // Asegurar visibilidad
        fechaLimiteElement.style.display = 'inline-block';
        
        console.log("Fecha lÃ­mite establecida correctamente en el elemento:", fechaLimiteElement);
    }
    
    // Verificar que el elemento tenga el contenido esperado
    setTimeout(() => {
        const verificacion = document.getElementById('fechaLimiteSegunda');
        if (verificacion) {
            console.log("VerificaciÃ³n: El elemento fechaLimiteSegunda tiene el contenido:", verificacion.textContent);
        }
    }, 100);
    
    return fechaLimiteFormateada;
}
