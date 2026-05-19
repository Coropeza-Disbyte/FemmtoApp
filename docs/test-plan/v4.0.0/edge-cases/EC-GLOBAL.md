---
version_produccion: 4.0.0
last_modified: 2026-05-14
descripcion: Edge cases globales, transversales a todos los módulos. Complementan los happy paths de test-cases. Organizados por categoría de riesgo.
---

# Edge Cases Globales — Femmto App v4.0.0

> Casos límite y comportamientos condicionales documentados para cada módulo. Complementan los happy paths de `test-cases/TC-*.md`. Priorizar su revisión al cambiar de versión o al modificar lógica de negocio condicional.

---

## 1. Conectividad y Red

| ID | Área | Caso | Resultado esperado |
|--|--|--|--|
| EC-GLOB-001 | App general | Sin conexión a internet al abrir la app (usuario ya autenticado) | Se muestra la pantalla Home con los datos cacheados; mensaje de sin conexión si intenta cargar datos nuevos. |
| EC-GLOB-002 | App general | Sin conexión a internet al intentar login | Mensaje de error de red visible; sin crash; opción de reintentar. |
| EC-GLOB-003 | Medition / Bluetooth | Red muy lenta (latencia >3s) durante medición | Timeout manejado; mensaje "Operación lenta, reintentando..." visible. |
| EC-GLOB-004 | Share | Generar reporte sin conexión | Error: "Se requiere conexión para generar el reporte"; botón reintentar visible. |
| EC-GLOB-005 | Reminders | API de recordatorios timeout durante sincronización | Recordatorios locales se muestran; sincronización reintenta en background. |
| EC-GLOB-006 | Profile | Cambiar datos (nombre, peso) sin conexión | Operación se encola; se sincroniza cuando hay conexión. |
| EC-GLOB-007 | App general | Conexión pierde signal durante upload de medición | El sistema pausa y reintenta automáticamente; sin perder datos. |
| EC-GLOB-008 | Home | Widgets se cargan lentamente (<2s delay) | Skeleton loaders visibles; transición suave a datos reales. |

---

## 2. Sesión y Autenticación

| ID | Área | Caso | Resultado esperado |
|--|--|--|--|
| EC-GLOB-009 | App general | Token de sesión expirado durante uso activo | La app redirige a Login sin crash; sin bucle infinito. |
| EC-GLOB-010 | App general | Doble login (usuario abre app en 2 dispositivos simultáneamente) | El más antiguo es desconectado; el nuevo recibe la sesión. |
| EC-GLOB-011 | Profile / Cerrar sesión | Usuario cierra sesión mientras hay una operación de medición en curso | La sesión se cierra y la medición en curso se descarta sin dejar estado inconsistente. |
| EC-GLOB-012 | App general | Usuario fuerza cierre de app durante login (en transición) | Al reabrirse, retoma desde Login sin datos corruptos. |
| EC-GLOB-013 | Auth | Reset de contraseña + simultáneamente otro device hace login | El login más reciente es válido; reset no afecta la sesión activa. |
| EC-GLOB-014 | App general | Refresh token expirado sin acceso a API | Se pide re-login; usuario retorna a Welcome. |
| EC-GLOB-015 | Menu | Cerrar sesión en medio de descarga de reporte | La descarga se cancela; sesión se cierra; sin datos parciales en storage. |

---

## 3. Datos Límite y Validación

| ID | Área | Caso | Resultado esperado |
|--|--|--|--|
| EC-GLOB-016 | Profile / EditBirthdate | Fecha de nacimiento exactamente 18 años (hoy - 18 años) | Validación pasa; se guarda como válido. |
| EC-GLOB-017 | Profile / EditBirthdate | Fecha de nacimiento exactamente 99 años atrás | Validación pasa; se guarda como válido. |
| EC-GLOB-018 | Profile / EditWeight | Peso exactamente 20 kg (mínimo) | Validación pasa; se guarda. |
| EC-GLOB-019 | Profile / EditWeight | Peso exactamente 250 kg (máximo) | Validación pasa; se guarda. |
| EC-GLOB-020 | Profile / EditHeight | Altura exactamente 90 cm (mínimo) | Validación pasa; se guarda. |
| EC-GLOB-021 | Profile / EditHeight | Altura exactamente 220 cm (máximo) | Validación pasa; se guarda. |
| EC-GLOB-022 | Profile / EditName | Nombre con exactamente 3 caracteres (mínimo) | Validación pasa; ej: "Bob". |
| EC-GLOB-023 | Profile / EditName | Nombre con exactamente 30 caracteres (máximo) | Input bloqueado por maxLength; no se puede exceder. |
| EC-GLOB-024 | Profile / EditPassword | Contraseña exactamente 8 caracteres (mínimo) | Validación pasa. |
| EC-GLOB-025 | Metrics | Medición de glucosa: valor 0 (sin medición registrada) | No se guarda; error "Ingresa un valor válido". |
| EC-GLOB-026 | Metrics | Medición de glucosa muy alta (600 mg/dL) | Se almacena y muestra con indicador de alarma (rojo). |
| EC-GLOB-027 | Metrics | Presión sistólica == diastólica | Guardar sin error; mostrar resultado inusual con warning visual. |

---

## 4. Bluetooth y Dispositivos

| ID | Área | Caso | Resultado esperado |
|--|--|--|--|
| EC-GLOB-028 | Devices / Bluetooth | Bluetooth completamente desactivado en el dispositivo | Se muestra prompt para activar Bluetooth; sin crash. |
| EC-GLOB-029 | Medition / Bluetooth | Dispositivo Bluetooth fuera de rango durante la medición | Timeout o mensaje de error de conexión; opción de reintentar visible. |
| EC-GLOB-030 | Devices / Bluetooth | Intentar conectar 2 dispositivos del mismo tipo simultáneamente | El primero se conecta; el segundo entra en cola o muestra error "Ya hay una conexión activa". |
| EC-GLOB-031 | Medition / Bluetooth | Medición duplicada detectada dentro de tolerancia (0.5 kg) | La segunda medición no se guarda como duplicado; se muestra aviso. |
| EC-GLOB-032 | Devices / Bluetooth | Dispositivo emparejado pero sin vinculación en la app | Opción de "Conectar" permite volver a sincronizar. |
| EC-GLOB-033 | Medition / Bluetooth | Pairing se rechaza por contraseña PIN incorrecta | Mensaje: "Pairing rechazado"; opción de reintentar. |
| EC-GLOB-034 | Devices | Dispositivo se apaga durante la conexión activa | La app detecta desconexión; indica "Dispositivo desconectado"; botón reconectar visible. |
| EC-GLOB-035 | Medition / Bluetooth | Batería del dispositivo Bluetooth muy baja (<5%) | Mensaje de advertencia: "Batería baja del dispositivo"; medición se completa pero recomienda cargar. |

---

## 5. Permisos del Sistema

| ID | Área | Caso | Resultado esperado |
|--|--|--|--|
| EC-GLOB-036 | Auth / Notifications | Usuario rechaza permisos de notificación en signup | La app navega a FirstMeasure sin crash; sin notificaciones push. |
| EC-GLOB-037 | Home | Permisos de notificación revocados desde configuración del SO | La app no crashea; PermissionAlert visible en Overview; sugerencia de reactivar. |
| EC-GLOB-038 | Medition / OCR | Permiso de cámara denegado | Mensaje claro de permiso requerido; sin crash; botón para ir a Configuración. |
| EC-GLOB-039 | Devices / Bluetooth | Permiso de Bluetooth denegado en Android 12+ | Prompt para activar permiso; sin crash. |
| EC-GLOB-040 | Devices / Bluetooth | Permiso de ubicación denegado (requerido en algunos Android) | Mensaje: "Se requiere ubicación para búsqueda BLE"; opción de ir a Configuración. |
| EC-GLOB-041 | Auth / Health | Permiso de Health rechazado en iOS | App navega a FirstMeasure sin conectar Health; indica "Health no disponible". |

---

## 6. Formularios y Entrada de Datos

| ID | Área | Caso | Resultado esperado |
|--|--|--|--|
| EC-GLOB-042 | Profile / EditName | Nombre con caracteres especiales: "María José O'Brien" | Se guarda y muestra correctamente. |
| EC-GLOB-043 | Profile / EditName | Nombre con emojis: "Juan 🎯" | Input rechaza emojis (validación) o los elimina automáticamente. |
| EC-GLOB-044 | Profile / EditPassword | Campo de contraseña: copiar-pegar contraseña | Funciona correctamente; contraseña oculta durante pega. |
| EC-GLOB-045 | Profile / EditPassword | Contraseña con espacios: "  pass123  " | Se trimea automáticamente antes de guardar. |
| EC-GLOB-046 | Profile / EditPassword | Contraseña muy larga (>256 caracteres) | Se limita a 256 o se rechaza con validación clara. |
| EC-GLOB-047 | Reminders / AddReminder | SelectProduct "Otro" con texto vacío | Validación: "Ingresa un producto personalizado"; error visible. |
| EC-GLOB-048 | Reminders / AddReminder | SelectProduct "Otro" con 100 caracteres | Se guarda si la validación lo permite (sin límite específico documentado). |
| EC-GLOB-049 | Profile / EditCountry | Búsqueda con caracteres especiales: "côte" | Normalización Unicode retorna "Côte d'Ivoire" correctamente. |
| EC-GLOB-050 | Profile / EditCountry | Búsqueda que retorna 0 resultados | Estado vacío visible: "No se encontraron países"; sin crash. |

---

## 7. Onboarding Interrumpido

| ID | Área | Caso | Resultado esperado |
|--|--|--|--|
| EC-GLOB-051 | Auth / Onboarding | App cerrada en medio del registro (paso Name) y reabierta | El stack de navegación retoma desde el punto correcto (paso Name) sin perder estado. |
| EC-GLOB-052 | Auth / Onboarding | App forzadamente cerrada durante FirstMeasure | Al reabrirse, navega a FirstMeasure (se reinicia el flujo de medición). |
| EC-GLOB-053 | Auth / Onboarding | Usuario rechaza todos los permisos durante onboarding | La app continúa sin crash; indica "Permisos opcionales rechazados"; navega a Home. |
| EC-GLOB-054 | Auth / SaveOnboardingProgress | Provider user (Google) con displayName existente | El paso Name se omite automáticamente; stepper salta al siguiente. |
| EC-GLOB-055 | Auth / SaveOnboardingProgress | Provider user (Google/Apple) | Paso Password se omite siempre; no aparece en el stepper. |

---

## 8. Datos Concurrentes y Sincronización

| ID | Área | Caso | Resultado esperado |
|--|--|--|--|
| EC-GLOB-056 | Metrics | Medición registrada desde otro dispositivo mientras se consulta historial | Refresco con pull-to-refresh muestra la nueva medición. |
| EC-GLOB-057 | Profile | Nombre cambiado desde otro dispositivo + user abre la app | Sync automático retrae el nombre más reciente; se refleja en UserProfile. |
| EC-GLOB-058 | Home | Targets editados desde otro dispositivo | Al volver a Home, ObjectiveTabs refleja los nuevos targets. |
| EC-GLOB-059 | Reminders | Recordatorio eliminado desde otro dispositivo | La lista de Reminders se sincroniza; recordatorio eliminado desaparece. |
| EC-GLOB-060 | Share | Generar reporte A y simultáneamente iniciar reporte B | Solo uno se procesa; el otro entra en cola o muestra error "Operación en curso". |

---

## 9. Estados Vacíos y Transiciones

| ID | Área | Caso | Resultado esperado |
|--|--|--|--|
| EC-GLOB-061 | Metrics / WeightDetails | Primera vez que se abre, sin ninguna medición registrada | Estado vacío visible; sin crash ni error de renderización; botón "Registrar medición" visible. |
| EC-GLOB-062 | Metrics / WeightDetails | Solo existe una medición (sin historial previo para calcular delta) | Delta no visible o "—"; gráfico con un solo punto. |
| EC-GLOB-063 | Metrics / PressureDetails | Medición con frecuencia cardíaca 0 o nula | Campo de FC muestra "—" o vacío; sin crash. |
| EC-GLOB-064 | Metrics / GlucoseDetails | Sin mediciones | Estado vacío: "No tienes mediciones aún"; botón para registrar. |
| EC-GLOB-065 | Metrics / StepsDetails | Health no sincronizado o permisos de Health denegados | Estado vacío o mensaje de "conectar con Health" visible; sin crash. |
| EC-GLOB-066 | Home / Grid de métricas | Un solo target configurado | Grid de 2 columnas con 1 card; la card ocupa el 100% del ancho (fila completa), sin card vacía al lado. |
| EC-GLOB-067 | Devices | Usuario sin dispositivos vinculados | Estado vacío con imagen devices/no-devices.png + botón "Agregar dispositivo". |
| EC-GLOB-068 | Reminders | Usuario sin recordatorios creados | Mensaje "No tienes recordatorios" + botón "Agregar recordatorio". |
| EC-GLOB-069 | Home | Usuario sin ningún target configurado (targets vacío) | ObjectiveTabs sin tabs; verificar que no genera crash ni loop infinito. |
| EC-GLOB-070 | Share | Usuario sin ninguna medición registrada | Mensaje "No tienes mediciones registradas aún"; botón "Compartir" deshabilitado. |

---

## 10. Objetivos y Personalización

| ID | Área | Caso | Resultado esperado |
|--|--|--|--|
| EC-GLOB-071 | Profile / EditTargets | Usuario sin targets previos → selecciona todos | Todas las 6 opciones seleccionadas; paso 2 muestra frequency options. |
| EC-GLOB-072 | Profile / EditTargets | Usuario con targets previamente guardados → elimina todos | Al deseleccionar todos, botón "Elegir frecuencia" se deshabilita. |
| EC-GLOB-073 | Profile / EditTargets | EditTargets paso 2: cambiar frequency seleccionada | Radio anterior se deselecciona; nuevo se selecciona. |
| EC-GLOB-074 | Home / ObjectiveTabs | Usuario con 6 targets todos activos | 6 tabs visibles en HorizontalScroll; scroll lateral suave. |
| EC-GLOB-075 | Home / ObjectiveTabs | Usuario con 1 target único | Pestaña "General" está separada; solo muestra ese target. |
| EC-GLOB-076 | Home / ObjectiveTabs | Usuario cambia targets en EditTargets y vuelve a Home | ObjectiveTabs refleja los nuevos targets; orden personalizado previo puede quedar inconsistente. |

---

## 11. Notifications y Reminders

| ID | Área | Caso | Resultado esperado |
|--|--|--|--|
| EC-GLOB-077 | Home / AskForPushPermissions | Usuario que ya rechazó los permisos (markPushPermissionRejected llamado) | La pantalla de permisos push no vuelve a aparecer desde Home. |
| EC-GLOB-078 | Reminders / PermissionAlert | Sin permisos push activos (!permissionStatus) | Componente PermissionAlert visible en lista de recordatorios. |
| EC-GLOB-079 | Notifications | App abierta desde push notification (deep link) | La app navega a la pantalla corresponiente (ej: a Medición si es recordatorio de medición). |
| EC-GLOB-080 | Notifications | App cerrada y se abre desde push notification | Deep link navega a la pantalla correcta sin crash. |
| EC-GLOB-081 | Reminders / Toggle | Toggle de recordatorio encendido/apagado múltiples veces | El estado persiste correctamente; sin lag ni inconsistencias. |
| EC-GLOB-082 | Home / HotFemmtoModal | Fecha ≥ 18 de mayo 2026 | El modal no se muestra aunque el usuario sea AR y no lo haya visto hoy. |
| EC-GLOB-083 | Home / HotFemmtoModal | Usuario AR que ya vio el modal hoy abre una nueva sesión | Modal no aparece hasta el día siguiente. |

---

## 12. Ciclo de Vida de la App

| ID | Área | Caso | Resultado esperado |
|--|--|--|--|
| EC-GLOB-084 | App general | App puesta en background durante flujo de medición Bluetooth y luego restored | La medición continúa o se muestra opción de reiniciarla; sin crash. |
| EC-GLOB-085 | App general | Rotación de pantalla (si soportada) | UI no se rompe; o la app bloquea la rotación de forma controlada. |
| EC-GLOB-086 | App general | Memory leak en navegación: entrar/salir de pantalla 20 veces | Memoria se libera correctamente; sin memory bloat. |
| EC-GLOB-087 | App general | App en segundo plano durante 24 horas + user regresa | La app se reinicia correctamente; datos cacheados se cargan. |
| EC-GLOB-088 | Bottom nav | Tap rápido múltiple entre tabs | No genera estados duplicados ni crashes de navegación. |

---

## 13. OCR y Captura de Imágenes (Medition)

| ID | Área | Caso | Resultado esperado |
|--|--|--|--|
| EC-GLOB-089 | Medition / PressureOCRMedition | Imagen borrosa o fuera de foco — OCR no puede leer el valor | Permite al usuario ingresar manualmente o reintentar captura. |
| EC-GLOB-090 | Medition / PressureOCRMedition | OCR lee valor incorrecto (ej: sistólica lee 189 en lugar de 139) | Usuario puede editar el valor antes de guardar. |
| EC-GLOB-091 | Medition / PressureOCRMedition | Valor OCR fuera de rango fisiológico (ej: 999/999) | Validación rechaza; se pide corrección manual. |
| EC-GLOB-092 | Medition / PressureOCRMedition | Imagen de pantalla completamente negra/blanca | OCR falla; se sugiere reintentar con mejor iluminación. |
| EC-GLOB-093 | Medition / Camera | Permiso de cámara denegado | Mensaje claro de permiso requerido; sin crash. |

---

## 14. Health Native (iOS)

| ID | Área | Caso | Resultado esperado |
|--|--|--|--|
| EC-GLOB-094 | Auth / HealthNativeIntro | Dispositivo no compatible con HealthNative | shouldShowHealthNativeIntro resuelve a finishAndGoHome directamente. |
| EC-GLOB-095 | Auth / HealthNativeIntro | Acceso desde menú: finalizar intro | No verifica HealthNative — navega directo a Home (popToTop). |
| EC-GLOB-096 | Home / Health sync | Datos de Health importados exitosamente | Steps y HeartRate se reflejan en Home y Metrics. |
| EC-GLOB-097 | Profile / ConnectHealth | Usuario revoca permisos de Health en iOS Configuración | App detecta cambio; muestra opción de reconectar. |

---

## 15. Idioma, Locale y Formato

| ID | Área | Caso | Resultado esperado |
|--|--|--|--|
| EC-GLOB-098 | Profile / EditWeight | Separador decimal con coma (locale ES) | Acepta "68,5" y lo convierte a 68.5 internamente. |
| EC-GLOB-099 | Profile / EditBirthdate | Formato de fecha en locale LL | Muestra "14 de mayo de 1990" (no "May 14, 1990"). |
| EC-GLOB-100 | Metrics | Valores con coma decimal en la UI | Se muestran como "68,5 kg" o "120,2 mmHg" según locale. |
| EC-GLOB-101 | Share | Período en idioma local | "Últimos 14 días", "Últimos 30 días" traducidos correctamente. |
| EC-GLOB-102 | Profile | Nombre de país en español | Muestra "Argentina", "Estados Unidos", no "Argentina", "United States". |

---

## 16. Configuración y Preferencias

| ID | Área | Caso | Resultado esperado |
|--|--|--|--|
| EC-GLOB-103 | Profile / Notifications | Usuario desactiva notificaciones globales en configuración del SO | La app respeta la preferencia; sin enviar notificaciones. |
| EC-GLOB-104 | Profile / Menu | Versión de app cambia (update en Play Store) | Al reabrirse, versión en Menu se actualiza. |
| EC-GLOB-105 | Profile / Theme | Si existe tema oscuro: cambiar de tema en SO | La app respeta el cambio de preferencia (Light/Dark). |
| EC-GLOB-106 | Auth / Login | Usuario configura biometría en el dispositivo post-login | La app puede ofrecerla en próximos logins (si implementado). |

---

## 17. Errores API y Fallback

| ID | Área | Caso | Resultado esperado |
|--|--|--|--|
| EC-GLOB-107 | Profile / Guardar cambios | API retorna error 400 (validation error) | Mensaje específico de validación mostrado; usuario puede reintentar. |
| EC-GLOB-108 | Profile / Guardar cambios | API retorna error 500 (server error) | Mensaje genérico: "Error al guardar. Reintenta más tarde"; botón reintentar. |
| EC-GLOB-109 | Medition / Guardar | API timeout en guardar medición | Operación se reintenta automáticamente; sin perder datos. |
| EC-GLOB-110 | Share / Generar reporte | API retorna error 413 (payload too large) | Se ofrece reducir el período: "El reporte es muy grande; intenta un período menor". |

---

