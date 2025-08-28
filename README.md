# Sistema de Devolución IVA Exportador

## Descripción
Sistema para gestionar solicitudes de devolución de IVA para exportadores (F3600), con funcionalidades para revisar observaciones, tomar decisiones y gestionar procesos de Fiscalización Especial Previa (FEP).

## Estructura del Proyecto
El proyecto ha sido modularizado siguiendo una arquitectura de módulos ES6 para mejorar la mantenibilidad y organización del código:

### Estructura de Archivos
```
/
├── index.html              # Punto de entrada HTML de la aplicación
├── main.js                 # Punto de entrada JavaScript (importa todos los módulos)
├── sytle_v2.css            # Estilos de la aplicación
├── modules/
│   ├── utilidades.js       # Funciones base y constantes globales
│   ├── core.js             # Funcionalidad compartida entre módulos
│   ├── navegacion.js       # Gestión de navegación y pestañas
│   ├── obs-no-justificadas.js  # Manejo de observaciones no justificadas
│   ├── obs-justificadas.js # Manejo de observaciones justificadas
│   ├── decision.js         # Proceso de toma de decisiones
│   ├── fep.js              # Funcionalidad para Fiscalización Especial Previa
│   ├── contacto.js         # Gestión de contacto con contribuyentes
│   └── inicializacion.js   # Inicialización de la aplicación
└── Respaldo_V2/            # Respaldo de la versión anterior
```

## Descripción de Módulos

1. **utilidades.js**: Contiene constantes, funciones de formato y conversión, y generadores de ID.

2. **core.js**: Implementa funcionalidad compartida entre varios módulos como formateo de números, actualización de UTM y gestión de alertas.

3. **navegacion.js**: Maneja la navegación entre pestañas y la interfaz de usuario común.

4. **obs-no-justificadas.js**: Gestiona la pestaña de observaciones no justificadas y sus hojas de trabajo.

5. **obs-justificadas.js**: Gestiona la pestaña de observaciones justificadas.

6. **decision.js**: Implementa el proceso de toma de decisiones para la devolución.

7. **fep.js**: Maneja el flujo completo de Fiscalización Especial Previa.

8. **contacto.js**: Gestiona la comunicación con el contribuyente.

9. **inicializacion.js**: Configura la aplicación al cargarse el documento.

10. **main.js**: Integra todos los módulos y expone funciones al ámbito global para su uso en el HTML.

## Uso

El sistema sigue un flujo de trabajo en el que el usuario:

1. Revisa las observaciones no justificadas y justificadas
2. Toma una decisión sobre la devolución (ha lugar, parcial, no ha lugar)
3. Opcionalmente inicia un proceso FEP
4. Genera resoluciones y notifica al contribuyente

## Desarrollo

Para continuar el desarrollo de este sistema:

1. Cada módulo funcional está en su propio archivo para facilitar el mantenimiento
2. Las funciones exportadas están documentadas con JSDoc
3. Para añadir nuevas funcionalidades, modifique o extienda el módulo correspondiente
4. Para agregar nuevos módulos, inclúyalos en main.js
