/******************************************************************************
 * SISTEMA DE DEVOLUCIÓN IVA EXPORTADOR
 * Módulo: Decisión F3600
 * Descripción: Manejo de la lógica de decisiones para devolución de IVA exportador
 * Última actualización: 15/05/2025
 ******************************************************************************/

/******************************************************************************
 * 1. CONSTANTES Y CONFIGURACIÓN GLOBAL
 ******************************************************************************/

const UTM_VALOR = 65182;

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


/******************************************************************************
 * 2. GESTIÓN DE NAVEGACIÓN Y PESTAÑAS
 ******************************************************************************/

/**
 * Maneja la navegación entre pestaanas
 * @param {Event} event - El evento del click
 * @param {string} tabId - El ID del contenido de la pestaana a mostrar
 */
function handleTabNavigation(event, tabId) {
    hideAllTabContents();
    deactivateAllTabs();
    showSelectedTab(tabId);
    setActiveTab(event.currentTarget);

    // Inicializar contenido cuando se navega a la pestaña FEP
    if (tabId === 'tabFep') {
        const devolucionSolicitada = document.getElementById('devolucionSolicitada').value;
        document.getElementById('montoSolicitadoFep').textContent = devolucionSolicitada;
        document.getElementById('fechaFep').textContent = new Date().toLocaleDateString('es-CL');
        document.getElementById('periodoTributario').textContent = '202504';
        document.getElementById('folioSolicitud').textContent = generarFolioSolicitud();
        
        // Asegurar que todas las secciones FEP sean visibles
        document.querySelectorAll('.subsection-content').forEach(section => {
            section.style.display = 'block';
            section.classList.remove('collapsed');
        });
    }
}

/**
 * Oculta todos los contenidos de las pestañas
 */
function hideAllTabContents() {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
}

/**
 * Desactiva todas las pestañas
 */
function deactivateAllTabs() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
}

/**
 * Muestra el contenido de la pestaña seleccionada
 * @param {string} tabId - El ID del contenido a mostrar
 */
function showSelectedTab(tabId) {
    document.getElementById(tabId).classList.add('active');
}

/**
 * Marca la pestaña seleccionada como activa
 * @param {HTMLElement} selectedTab - El elemento de la pestaña seleccionada
 */
function setActiveTab(selectedTab) {
    selectedTab.classList.add('active');
}

/******************************************************************************
 * 3. FUNCIONES DE FORMATEO Y CÁLCULOS
 ******************************************************************************/

/**
 * Formatea un número con separadores de miles
 * @param {HTMLInputElement} input - El elemento input a formatear
 */
function formatNumber(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor) {
        input.value = FORMATO_MONEDA.format(parseInt(valor));
    }
    calcularMontos();
}

/**
 * Convierte un monto desde pesos chilenos a UTM
 * @param {number} valorPesos - Monto en pesos chilenos
 * @returns {number} Valor convertido a UTM
 */
function convertirAUTM(valorPesos) {
    return valorPesos / UTM_VALOR;
}

/**
 * Obtiene el valor numérico de un input eliminando formato de moneda
 * @param {string} inputId - ID del elemento input
 * @returns {number} Valor numérico del input
 */
function obtenerValorNumerico(inputId) {
    const valor = document.getElementById(inputId).value.replace(/\D/g, '');
    return valor ? parseInt(valor) : 0;
}

/**
 * Actualiza el valor de UTM correspondiente a un monto
 * @param {string} montoInputId - ID del input del monto
 * @param {string} utmInputId - ID del input donde se mostrará la conversión a UTM
 */
function actualizarUTM(montoInputId, utmInputId) {
    const valorPesos = obtenerValorNumerico(montoInputId);
    const valorUTM = convertirAUTM(valorPesos);
    document.getElementById(utmInputId).value = FORMATO_UTM.format(valorUTM);
}

/**
 * Genera un ID único para resoluciones FEP
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

/******************************************************************************
 * 4. GESTIÓN DE RESOLUCIONES Y DECISIONES
 ******************************************************************************/

/**
 * Genera la resolución correspondiente
 * @returns {boolean} true si la resolución se genera correctamente
 */
function generarResolucion() {
    // TODO: Implementar generación de resolución
    mostrarAlerta('Resolución generada correctamente', 'success');
    return true;
}

/**
 * Genera la resolución para la primera revisión FEP (15 días)
 */
function generarResolucion15Dias() {
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

/******************************************************************************
 * 5. GESTIÓN DE NOTIFICACIONES
 ******************************************************************************/

/**
 * Notifica al contribuyente sobre la decisión de 15 días
 */
function notificarContribuyente15Dias() {
    // Almacenar fecha de notificación
    const fechaNotificacion = new Date();
    document.getElementById('fechaNotificacionSegundaRevision').textContent = formatoFecha(fechaNotificacion);
    
    // Habilitar siguiente paso
    document.getElementById('btnEnviarDecision15').disabled = false;
    mostrarAlerta('Notificación enviada al contribuyente', 'success');
}

/******************************************************************************
 * 6. GESTIÓN DE FEP (FISCALIZACIÓN ESPECIAL PREVIA)
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
 * Envía la solicitud FEP y navega a la pestaña FEP
 */
function enviarSolicitudFep() {
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
    document.getElementById('folioSolicitud').textContent = '12345';
    document.getElementById('montoSolicitadoFep').textContent = document.getElementById('devolucionSolicitada').value;

    // Cerrar el popup y navegar a la pestaña FEP
    document.getElementById('fepPopup').style.display = 'none';
    handleTabNavigation({ currentTarget: document.getElementById('tabFep') }, 'tabFep');
    
    // Mostrar mensaje de éxito
    mostrarAlerta('Solicitud FEP enviada correctamente', 'success');
}

/**
 * Genera la resolución FEP
 */
function generarResolucionFep() {
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
function notificarContribuyenteFep() {
    // Mostrar alerta de éxito
    mostrarAlerta('Notificación FEP enviada al contribuyente', 'success');
    
    // Actualizar datos y mostrar sección de aviso vencimiento
    const fechaActual = new Date().toLocaleDateString('es-CL');
    document.getElementById('fechaNotificacionFep').textContent = fechaActual;
    document.getElementById('numeroResolucionFep').textContent = generarNumeroResolucion();
    document.getElementById('fechaGeneracionFep').textContent = document.getElementById('fechaFep').textContent;
    document.getElementById('idExpediente').textContent = generarIdExpediente();
    
    // Mostrar la sección de aviso vencimiento
    document.getElementById('seccionAvisoVencimiento').style.display = 'block';
}

/**
 * Genera un número de resolución FEP
 * @returns {string} Número de resolución generado
 */
function generarNumeroResolucion() {
    const año = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${numero}-${año}`;
}

/**
 * Genera un ID de expediente electrónico
 * @returns {string} ID de expediente generado
 */
function generarIdExpediente() {
    const año = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `EE-${año}-${numero}`;
}

/**
 * Controla la habilitación del botón de generar acta
 */
function toggleActaRecepcion() {
    const checkbox = document.getElementById('checkInfoRecibida');
    const btnGenerar = document.getElementById('btnGenerarActa');
    btnGenerar.disabled = !checkbox.checked;
}

/**
 * Genera el acta de recepción F3309
 */
function generarActaRecepcion() {
    const checkbox = document.getElementById('checkInfoRecibida');
    if (!checkbox.checked) {
        mostrarAlerta('Debe confirmar que el contribuyente ha enviado la información requerida', 'error');
        return;
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
function habilitarControlesDecision15() {
    const radios = document.getElementsByName('decision15Dias');
    radios.forEach(radio => radio.disabled = false);
    document.getElementById('montoAutorizado15').disabled = false;
}

/**
 * Formatea un número con separadores de miles para la sección 15 días
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
 * Calcula los montos y conversiones UTM para la sección 15 días
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
 * Valida y actualiza el estado de los botones de la sección 15 días
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
 * Genera la resolución para la decisión de 15 días
 */
function generarResolucion15Dias() {
    mostrarAlerta('Resolución generada exitosamente', 'success');
    document.getElementById('btnNotificar15').disabled = false;
}

/**
 * Genera un número de resolución FEP
 * @returns {string} Número de resolución generado
 */
function generarResolucion15Dias() {
    const año = new Date().getFullYear();
    const numero = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${numero}-${año}`;
}

/**
 * Notifica al contribuyente sobre la decisión de 15 días
 */
function notificarContribuyente15Dias() {
    mostrarAlerta('Notificación enviada al contribuyente', 'success');
    document.getElementById('btnEnviarDecision15').disabled = false;
}

/**
 * Envía la decisión final de 15 días
 */
function enviarDecision15Dias() {
    const decision = document.querySelector('input[name="decision15Dias"]:checked').value;
    const montoAutorizado = document.getElementById('montoAutorizado15').value;
    
    mostrarAlerta(`Decisión enviada exitosamente: ${decision} - Monto: ${montoAutorizado}`, 'success');
}

/******************************************************************************
 * 7. VALIDACIONES Y CONTROLES
 ******************************************************************************/

/**
 * Valida que se haya seleccionado una decisión
 * @returns {boolean} true si hay una decisión seleccionada
 */
function validarDecision() {
    const radioButtons = document.getElementsByName('decisionCruce');
    return Array.from(radioButtons).some(radio => radio.checked);
}

/**
 * Valida que se hayan ingresado los montos requeridos
 * @returns {boolean} true si los montos están ingresados correctamente
 */
function validarMontos() {
    const devolucionSolicitada = obtenerValorNumerico('devolucionSolicitada');
    const montoAutorizado = obtenerValorNumerico('montoAutorizado');
    return devolucionSolicitada > 0 && montoAutorizado >= 0 && montoAutorizado <= devolucionSolicitada;
}

/**
 * Verifica si se puede habilitar el FEP según el monto autorizado
 * @returns {boolean} Retorna true si se permite habilitar FEP
 */
function puedeHabilitarFEP() {
    const montoAutorizado = obtenerValorNumerico('montoAutorizado');
    return montoAutorizado === 0 || document.getElementById('montoAutorizado').value.trim() === '';
}

/******************************************************************************
 * 8. GESTIÓN DE LA INTERFAZ DE USUARIO
 ******************************************************************************/

/**
 * Actualiza el estado de habilitación de los botones según las validaciones
 */
function validarYActualizarBotones() {
    const todoValido = validarDecision() && validarMontos();
    const botones = document.querySelectorAll('.accion-btn');
    botones.forEach(boton => {
        boton.disabled = !todoValido;
    });
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

/******************************************************************************
 * 9. INICIALIZACIÓN Y EVENTOS
 ******************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
    // Muestra el valor de UTM actual
    document.getElementById('valorUTM').textContent = FORMATO_MONEDA.format(UTM_VALOR);
    
    // Inicializa los cálculos y estado de botones
    calcularMontos();

    // Configura listeners para campos de montos
    const camposMontos = ['devolucionSolicitada', 'montoAutorizado'];
    camposMontos.forEach(campo => {
        document.getElementById(campo)?.addEventListener('input', (event) => {
            formatNumber(event.target);
        });
    });

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
    }    // La funcionalidad de colapso ha sido eliminada

    // Asegurar que todas las secciones FEP sean visibles inicialmente
    document.querySelectorAll('.subsection-content').forEach(section => {
        section.style.display = 'block';
        section.classList.remove('collapsed');
    });
});

/**
 * Configura los tooltips y ayudas contextuales de la interfaz
 */
function configurarTooltips() {
    const elementos = document.querySelectorAll('[data-tooltip]');
    elementos.forEach(elemento => {
        elemento.setAttribute('title', elemento.dataset.tooltip);
    });
}

/**
 * Alterna la visibilidad de una subsección FEP
 * @param {string} sectionId - ID de la subsección a alternar
 */
function toggleSubsection(sectionId) {
    const content = document.getElementById(sectionId);
    const header = content.previousElementSibling;
    const isCollapsed = content.classList.contains('collapsed');

    if (isCollapsed) {
        expandSubsection(sectionId);
    } else {
        collapseSubsection(sectionId);
    }
}

/**
 * Expande una subsección FEP
 * @param {string} sectionId - ID de la subsección a expandir
 */
function expandSubsection(sectionId) {
    const content = document.getElementById(sectionId);
    const header = content.previousElementSibling;

    content.classList.remove('collapsed');
    header.classList.remove('collapsed');
}

/**
 * Colapsa una subsección FEP
 * @param {string} sectionId - ID de la subsección a colapsar
 */
function collapseSubsection(sectionId) {
    const content = document.getElementById(sectionId);
    const header = content.previousElementSibling;

    content.classList.add('collapsed');
    header.classList.add('collapsed');
}

/**
 * Maneja el checkbox de información recibida para la segunda revisión
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
 * Habilita los controles de la segunda decisión
 */
function habilitarControlesSegundaDecision() {
    const radios = document.getElementsByName('decisionSegunda');
    radios.forEach(radio => radio.disabled = false);
    document.getElementById('montoAutorizadoSegunda').disabled = false;
}

/**
 * Deshabilita los controles de la segunda decisión
 */
function deshabilitarControlesSegundaDecision() {
    const radios = document.getElementsByName('decisionSegunda');
    radios.forEach(radio => radio.disabled = true);
    document.getElementById('montoAutorizadoSegunda').disabled = true;
}

/**
 * Activa la pestaña FEP y la hace visible
 */
function activarTabFep() {
    const tabFep = document.getElementById('tabFep');
    if (tabFep) {
        tabFep.style.display = 'block';
    }
}

/**
 * Genera la resolución para la primera revisión FEP (15 días)
 */
function generarResolucion15Dias() {
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
 * Notifica al contribuyente sobre la decisión de la primera revisión
 */
function notificarContribuyente15Dias() {
    document.getElementById('btnEnviarDecision15').disabled = false;
    mostrarAlerta('Notificación enviada al contribuyente', 'success');
}

/**
 * Envía la decisión de la primera revisión
 */
function enviarDecision15Dias() {
    mostrarAlerta('Decisión enviada correctamente', 'success');
}

/**
 * Habilita/deshabilita el botón de generar acta de recepción
 */
function toggleActaRecepcion() {
    const infoRecibida = document.getElementById('checkInfoRecibida').checked;
    document.getElementById('btnGenerarActa').disabled = !infoRecibida;
}

/**
 * Genera el acta de recepción F3309
 */
function generarActaRecepcion() {
    mostrarAlerta('Acta de recepción generada correctamente', 'success');
}

/**
 * Calcula y actualiza los montos en UTM para la primera revisión
 */
function calcularMontos15() {
    const montoSolicitado = limpiarFormatoNumero(document.getElementById('montoSolicitado15').value);
    const montoAutorizado = limpiarFormatoNumero(document.getElementById('montoAutorizado15').value);
    
    // Calcular montos en UTM
    document.getElementById('montoSolicitadoUTM15').value = FORMATO_UTM.format(montoSolicitado / UTM_VALOR);
    document.getElementById('montoAutorizadoUTM15').value = FORMATO_UTM.format(montoAutorizado / UTM_VALOR);
    
    // Calcular y mostrar monto rechazado
    const montoRechazado = montoSolicitado - montoAutorizado;
    document.getElementById('montoRechazado15').value = FORMATO_MONEDA.format(montoRechazado);
    document.getElementById('montoRechazadoUTM15').value = FORMATO_UTM.format(montoRechazado / UTM_VALOR);
}

/**
 * Formatea un número en el formato de moneda chilena para los campos de la primera revisión
 * @param {HTMLInputElement} input - El elemento input a formatear
 */
function formatNumber15(input) {
    const valor = limpiarFormatoNumero(input.value);
    input.value = FORMATO_MONEDA.format(valor);
    calcularMontos15();
}

/**
 * Habilita/deshabilita los controles de la segunda revisión
 */
function toggleDecisionSegunda() {
    const infoRecibida = document.getElementById('checkInfoRecibidaSegunda').checked;
    document.getElementById('decisionSegunda').querySelectorAll('input, button').forEach(element => {
        element.disabled = !infoRecibida;
    });
}

/**
 * Genera la resolución para la segunda revisión
 */
function generarResolucionSegunda() {
    const decision = document.querySelector('input[name="decisionSegunda"]:checked');
    if (!decision) {
        mostrarAlerta('Debe seleccionar una decisión', 'error');
        return;
    }

    // Habilitar el botón de notificación
    document.getElementById('btnNotificarSegunda').disabled = false;
    mostrarAlerta('Resolución generada correctamente', 'success');
}

/**
 * Notifica al contribuyente sobre la decisión de la segunda revisión
 */
function notificarContribuyenteSegunda() {
    document.getElementById('btnEnviarDecisionSegunda').disabled = false;
    mostrarAlerta('Notificación enviada al contribuyente', 'success');
}

/**
 * Envía la decisión final de la segunda revisión
 */
function enviarDecisionSegunda() {
    mostrarAlerta('Decisión final enviada correctamente', 'success');
    // Aquí se podría agregar lógica adicional para cerrar el caso
}

/**
 * Calcula y actualiza los días restantes para la segunda revisión
 */
function actualizarDiasRestantes() {
    const fechaLimite = document.getElementById('fechaLimiteSegunda').textContent;
    if (fechaLimite) {
        const limite = new Date(fechaLimite);
        const hoy = new Date();
        const diferencia = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24));
        document.getElementById('diasRestantesSegunda').textContent = diferencia;
    }
}

// Inicializar los eventos cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Manejar cambios en los checkboxes
    document.getElementById('checkInfoRecibida')?.addEventListener('change', toggleActaRecepcion);
    document.getElementById('checkInfoRecibidaSegunda')?.addEventListener('change', toggleDecisionSegunda);

    // Actualizar días restantes periódicamente
    actualizarDiasRestantes();
    setInterval(actualizarDiasRestantes, 1000 * 60 * 60); // Actualizar cada hora
});

/**
 * Genera un número de folio único para la solicitud FEP
 * @returns {string} Folio generado con formato YYYYMMDD-XXX
 */
function generarFolioSolicitud() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `${año}${mes}${dia}-${random}`;
}

/**
 * Valida la decisión y procesa la acción correspondiente
 * @param {string} accion - La acción a realizar ('ingresar', 'resolucion', 'notificar', 'disponerFep')
 */
function validarYProcesarDecision(accion) {
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
