/**
 * SISTEMA DE DEVOLUCIÓN IVA EXPORTADOR
 * Archivo: main.js
 * Descripción: Punto de entrada principal para la aplicación modular
 * Última actualización: 21/05/2025
 */

// Importar inicialización
import { inicializarAplicacion, toggleDarkMode } from './modules/inicializacion.js';

// Importar módulos del sistema
import * as Utilidades from './modules/utilidades.js';
import * as Core from './modules/core.js';
import * as Navegacion from './modules/navegacion.js';
import * as ObsNoJustificadas from './modules/obs-no-justificadas.js';
import * as ObsJustificadas from './modules/obs-justificadas.js';
import * as Decision from './modules/decision.js';
import * as Fep from './modules/fep.js';
import * as Contacto from './modules/contacto.js';

// Inicializar la aplicación cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializarAplicacion);

// Exponer las funciones al ámbito global para que puedan ser llamadas desde HTML
// Módulo de Navegación
window.handleTabNavigation = Navegacion.handleTabNavigation;

// Módulo de Observaciones No Justificadas
window.abrirHojaTrabajo = ObsNoJustificadas.abrirHojaTrabajo;
window.guardarHojaTrabajo = ObsNoJustificadas.guardarHojaTrabajo;
window.cerrarHojaTrabajo = ObsNoJustificadas.cerrarHojaTrabajo;
window.mostrarAyuda = ObsNoJustificadas.mostrarAyuda;

// Módulo de Observaciones Justificadas
// (Funciones definidas en obs-justificadas.js)

// Módulo de Decisión
window.validarYProcesarDecision = Decision.validarYProcesarDecision;
window.puedeHabilitarFEP = Decision.puedeHabilitarFEP;

// Módulo FEP
window.mostrarPopupFep = Fep.mostrarPopupFep;
window.cerrarPopupFep = Fep.cerrarPopupFep;
window.formatFepText = Fep.formatFepText;
window.enviarSolicitudFep = Fep.enviarSolicitudFep;
window.generarResolucionFep = Fep.generarResolucionFep;
window.notificarContribuyenteFep = Fep.notificarContribuyenteFep;
window.calcularFechaLimite = Fep.calcularFechaLimite;
window.generarResolucion15Dias = Fep.generarResolucion15Dias;
window.notificarContribuyente15Dias = Fep.notificarContribuyente15Dias;
window.enviarDecision15Dias = Fep.enviarDecision15Dias;
window.formatNumber15 = Fep.formatNumber15;
window.toggleActaRecepcion = Fep.toggleActaRecepcion;
window.generarActaRecepcion = Fep.generarActaRecepcion;
window.guardarFechaActa = Fep.guardarFechaActa;
window.toggleDecisionSegunda = Fep.toggleDecisionSegunda;

// Módulo de Contacto con Contribuyente
window.mostrarPopupContacto = Contacto.mostrarPopupContacto;
window.cerrarPopupContacto = Contacto.cerrarPopupContacto;
window.toggleBotonesContacto = Contacto.toggleBotonesContacto;
window.registrarEvento = Contacto.registrarEvento;
window.generarAnotacion42 = Contacto.generarAnotacion42;
window.ejecutarDisponeFep = Contacto.ejecutarDisponeFep;
window.abrirExpediente = Contacto.abrirExpediente;
window.mostrarPopupAntecedentes = Contacto.mostrarPopupAntecedentes;
window.cerrarPopupAntecedentes = Contacto.cerrarPopupAntecedentes;
window.enviarSolicitudAntecedentes = Contacto.enviarSolicitudAntecedentes;

// Utilidades varias
window.formatNumber = Core.formatNumber;
window.actualizarCamposUTM = Core.actualizarCamposUTM;
window.actualizarUTM = Core.actualizarUTM;
window.mostrarAlerta = Utilidades.mostrarAlerta;
window.toggleDarkMode = toggleDarkMode;

// Exportar todas las funciones para posible uso desde otros scripts
export {
    Utilidades,
    Core,
    Navegacion,
    ObsNoJustificadas,
    ObsJustificadas,
    Decision,
    Fep,
    Contacto
};
