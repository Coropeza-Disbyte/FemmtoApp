---
modulo: home
version_produccion: 4.0.0
last_modified: 2026-05-14
pantallas_cubiertas:
  - Home (ObjectiveTabs, WidgetSection, HealthyHabitSection, LastMeasurements grid, Header)
  - HomeHeader (botón Nueva medición, ícono notificaciones con badge)
  - ReorderTabsModal
  - AskForPushNotificationPermissions
  - Notifications Overview (3 estados: sin permisos, vacío, con notificaciones)
  - NotificationSettings (NotificationsPreferences con 3 switches)
  - TourGuide (6 zonas, una sola vez)
---

# Test Cases — Módulo Home v4.0.0

---

## Home Principal — Carga e Inicialización

### TC-HOME-001 — Home carga correctamente post-login

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario autenticado con perfil completo y al menos un target configurado.

**Pasos:**
1. Iniciar sesión con `Cypress.env('VALID_USER')`.

**Resultado esperado:**
- Se muestra la pantalla Home.
- Bottom nav visible con exactamente 4 tabs: "Inicio", "Dispositivos", "Alarmas", "Compartir".
- ObjectiveTabs visible con tabs generados dinámicamente según targets del usuario.
- WidgetSection visible mostrando datos del target principal.

---

### TC-HOME-002 — Bottom nav tiene exactamente 4 tabs con labels correctos

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Home.

**Pasos:**
1. Observar el bottom navigation bar.

**Resultado esperado:**
- Tab 1: label="Inicio", accessibilityLabel="Home".
- Tab 2: label="Dispositivos", accessibilityLabel="Dispositivos".
- Tab 3: label="Alarmas", accessibilityLabel="Recordatorios".
- Tab 4: label="Compartir", accessibilityLabel="Compartir métricas".
- No existe tab "Medición" (removido en v4.0.0).

---

### TC-HOME-003 — Home se posiciona en el tab correcto después del login

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario login-logout-login.

**Pasos:**
1. Iniciar sesión.
2. Cerrar la app.
3. Reabrirla.

**Resultado esperado:**
- Home abre con el focus en el tab "Inicio" de bottom nav.

---

---

## TourGuide — 6 Zonas (Se muestra una sola vez)

### TC-HOME-004 — TourGuide se muestra la primera vez en Home

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario que nunca vio el tour (AsyncStorage sin clave `@femmto/home_tour_v1`). App limpia instalada.

**Pasos:**
1. Completar onboarding y login.
2. Ingresar al Home por primera vez.

**Resultado esperado:**
- TourGuide se activa automáticamente.
- Backdrop visible: rgba(0,0,0,0.6).
- Zone 1 resaltada: WidgetSection con tooltip "Aquí verás el seguimiento del objetivo que elegiste como principal y tu progreso actual.".
- Border radius: 16.

---

### TC-HOME-005 — TourGuide Zone 1 visible en WidgetSection

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** TC-HOME-004 pasó. TourGuide activo.

**Pasos:**
1. Observar la zona resaltada alrededor del WidgetSection.

**Resultado esperado:**
- Zone 1 muestra tooltip: "Aquí verás el seguimiento del objetivo que elegiste como principal y tu progreso actual.".
- Se ve el widget del target principal con datos.

---

### TC-HOME-006 — TourGuide Zone 2 visible en ObjectiveTabs

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario avanzó al siguiente paso del tour.

**Pasos:**
1. Avanzar en el TourGuide (tap forward).
2. Observar la zona resaltada.

**Resultado esperado:**
- Zone 2 resaltada alrededor de ObjectiveTabs.
- Tooltip: "Selecciona otras opciones para ver tus otras métricas...".

---

### TC-HOME-007 — TourGuide Zone 4 visible en HealthyHabitSection

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario avanzó al paso 4 del tour.

**Pasos:**
1. Avanzar en el TourGuide hasta Zone 4.

**Resultado esperado:**
- Zone 4 resaltada alrededor de HealthyHabitSection.
- Tooltip: "Pequeños pasos, gran impacto. Aquí te sugerimos hábitos diarios sencillos para acompañar tu salud.".

---

### TC-HOME-008 — TourGuide Zone 5 visible en botón Nueva medición

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario avanzó al paso 5 del tour.

**Pasos:**
1. Avanzar en el TourGuide hasta Zone 5.

**Resultado esperado:**
- Zone 5 resaltada alrededor del botón "Nueva medición" en el header.
- Tooltip: "Suma mediciones en cualquier momento tocando aquí. ¡Tu compañero de salud está listo!".

---

### TC-HOME-009 — TourGuide puede cerrarse en cualquier paso

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** TourGuide visible en cualquier zona.

**Pasos:**
1. Tap en el botón Close del TourGuide.

**Resultado esperado:**
- El TourGuide se cierra.
- Home queda visible con datos normales.
- La clave `@femmto/home_tour_v1` se guarda en AsyncStorage.

---

### TC-HOME-010 — TourGuide NO se muestra en visitas posteriores

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario que ya completó el tour en una visita anterior (AsyncStorage tiene `@femmto/home_tour_v1`).

**Pasos:**
1. Cerrar y reabrir la app.
2. Ingresar al Home.

**Resultado esperado:**
- El TourGuide no se muestra.
- Home carga directamente en estado normal.
- Todos los elementos visibles sin backdrop de tour.

---

---

## ObjectiveTabs — Dinámicos según targets

### TC-HOME-011 — Tabs se generan según targets del usuario (Peso + Presión)

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con targets: `control_weight` y `control_blood_pressure`.

**Pasos:**
1. Observar la sección ObjectiveTabs en Home.

**Resultado esperado:**
- Tab 1: label="Peso", color=#64A185.
- Tab 2: label="Presión arterial", color=#E57373.
- No hay tabs de glucosa ni pasos.

---

### TC-HOME-012 — Tab "General" se añade automáticamente si no existe

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con targets: `control_weight` (solo uno).

**Pasos:**
1. Observar ObjectiveTabs.

**Resultado esperado:**
- Tab "Peso" visible.
- Tab "General" agregado automáticamente como segundo tab.

---

### TC-HOME-013 — Cambiar de tab actualiza WidgetSection y HealthyHabitSection

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con targets: `control_weight`, `control_blood_pressure`. En Home.

**Pasos:**
1. Tap en tab "Presión arterial" (si no está activo).

**Resultado esperado:**
- Tab "Presión arterial" tiene borde inferior #91B2DC y fondo #91B2DC26 (selected state).
- WidgetSection debajo cambia para mostrar BloodPressureWidget (mmHg, sys/dia, referencias punteadas).
- HealthyHabitSection muestra hábito: "Momento de calma" con descripción "Descanso silencioso antes de medir".

---

### TC-HOME-014 — Labels exactos por tipo de target

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con todos los targets: weight, blood_pressure, glucose, steps, general.

**Pasos:**
1. Observar los 5 tabs en ObjectiveTabs.

**Resultado esperado:**
- control_weight → "Peso".
- control_blood_pressure → "Presión arterial".
- control_glucose → "Glucosa".
- control_steps → "Pasos".
- control_general → "General".

---

---

## ReorderTabsModal

### TC-HOME-015 — Abrir ReorderTabsModal desde botón de reordenación

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Home con al menos 2 targets.

**Pasos:**
1. Tap en botón de reordenación (icono) en WidgetSection o header.

**Resultado esperado:**
- ReorderTabsModal se abre.
- Título: "Ordenar tarjetas".
- Subtítulo: "Arrastra tus objetivos para ordenarlos.".
- Lista de tabs reordenables visible.
- Botón "Guardar" visible.

---

### TC-HOME-016 — Reordenar tabs con drag and drop

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** ReorderTabsModal abierto con al menos 2 tabs.

**Pasos:**
1. Presionar sobre "Presión arterial" y arrastrar hacia arriba de "Peso".

**Resultado esperado:**
- Durante el drag: fondo del item es gris (indicador visual).
- El orden en la lista cambia en tiempo real.

---

### TC-HOME-017 — Guardar cambios de orden persiste en Redux

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** TC-HOME-016 pasó. Nuevo orden en modal.

**Pasos:**
1. Tap en botón "Guardar".

**Resultado esperado:**
- ReorderTabsModal se cierra.
- Los tabs en ObjectiveTabs aparecen en el nuevo orden.

---

### TC-HOME-018 — El orden persiste al salir y volver a Home

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** TC-HOME-017 pasó. Tabs reordenados.

**Pasos:**
1. Navegar a otra pantalla (ej: Devices).
2. Volver a Home.

**Resultado esperado:**
- ObjectiveTabs mantiene el orden guardado.

---

### TC-HOME-019 — Cerrar ReorderTabsModal descarta cambios no guardados

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** ReorderTabsModal abierto, drag hecho pero no guardado.

**Pasos:**
1. Tap en "X" o backdrop del modal sin guardar.

**Resultado esperado:**
- Modal se cierra.
- El orden original de tabs se mantiene en ObjectiveTabs.

---

---

## WidgetSection — Por tipo de target

### TC-HOME-020 — WeightWidget muestra datos correctos

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con target control_weight y mediciones registradas. Tab "Peso" activo.

**Pasos:**
1. Observar el WidgetSection.

**Resultado esperado:**
- Título: "Control de peso".
- Valor principal: ej "72.5 kg" (número + unidad).
- Gráfico de líneas con historial de mediciones.
- Delta visible: flecha (↑ o ↓) + variación respecto anterior.
- Badge "Última medición [fecha] – [hora] hs".

---

### TC-HOME-021 — BloodPressureWidget muestra mmHg con dos líneas

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con target control_blood_pressure. Tab activo.

**Pasos:**
1. Observar el WidgetSection.

**Resultado esperado:**
- Título: "Presión arterial".
- Valores: sys/dia (ej "120/80 mmHg").
- Gráfico con 2 líneas (sistólica y diastólica).
- Referencias punteadas en el gráfico.

---

### TC-HOME-022 — GlucoseWidget muestra mg/dL con puntos extremos en amarillo

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con target control_glucose. Tab activo.

**Pasos:**
1. Observar el WidgetSection.

**Resultado esperado:**
- Título: "Glucosa".
- Unidad: "mg/dL".
- Gráfico con puntos de datos.
- Puntos extremos (mín/máx) visibles en color #FFAD0D (amarillo).

---

### TC-HOME-023 — StepsWidget muestra gráfico donut con % del objetivo

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con target control_steps. Tab activo.

**Pasos:**
1. Observar el WidgetSection.

**Resultado esperado:**
- Título: "Pasos".
- Gráfico circular donut.
- Porcentaje del objetivo mostrado (ej "75%").
- Valor total de pasos visible.

---

### TC-HOME-024 — HeartRateWidget muestra bpm y estado "Normal"

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con target control_heart_rate (si aplica). Tab activo. healthNativeAvailable=true.

**Pasos:**
1. Observar el WidgetSection.

**Resultado esperado:**
- Título: "Ritmo cardíaco".
- Unidad: "bpm".
- Gráfico de líneas.
- Estado visible: "Normal" (o el estado correspondiente).

---

### TC-HOME-025 — Botón "Medir ahora" visible si no hay medición del día

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario no registró medición hoy para el target activo.

**Pasos:**
1. Observar el widget del tab activo.

**Resultado esperado:**
- Botón "Medir ahora" habilitado y visible en el widget.

---

### TC-HOME-026 — Botón "Ya medido hoy" visible si hay medición del día

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario registró una medición hoy para el target activo.

**Pasos:**
1. Observar el widget del tab activo.

**Resultado esperado:**
- Botón "Ya medido hoy" visible y deshabilitado (secondary state).
- Botón "Medir ahora" no aparece.

---

### TC-HOME-027 — Tap en "Medir ahora" navega al flujo de medición

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** TC-HOME-025 pasó. Botón "Medir ahora" visible.

**Pasos:**
1. Tap en "Medir ahora".

**Resultado esperado:**
- Navega al flujo de medición correspondiente (ej: AddGlucometerPage si tab es Glucosa).

---

---

## Header — Botón Nueva medición e Ícono Notificaciones

### TC-HOME-028 — Botón "Nueva medición" en header navega según tab activo (Peso)

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Tab activo = "Peso". Usuario en Home.

**Pasos:**
1. Tap en botón "Nueva medición" (icono new-measure-icon.png) en el header.

**Resultado esperado:**
- Navega a NewScalePage (flujo de medición con balanza).

---

### TC-HOME-029 — Botón "Nueva medición" navega según tab activo (Presión)

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Tab activo = "Presión arterial". Usuario en Home.

**Pasos:**
1. Tap en botón "Nueva medición".

**Resultado esperado:**
- Navega a NewPresurePage (flujo de medición con tensiómetro).

---

### TC-HOME-030 — Botón "Nueva medición" navega según tab activo (Glucosa)

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Tab activo = "Glucosa". Usuario en Home.

**Pasos:**
1. Tap en botón "Nueva medición".

**Resultado esperado:**
- Navega a NewGlucometerPage (flujo de medición con glucómetro).

---

### TC-HOME-031 — Botón "Nueva medición" en tab Pasos no navega

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Tab activo = "Pasos". Usuario en Home.

**Pasos:**
1. Tap en botón "Nueva medición".

**Resultado esperado:**
- No navega a ninguna pantalla de medición (datos de Pasos vienen de HealthKit/Health API).
- No genera crash ni comportamiento inesperado.

---

### TC-HOME-032 — Ícono notificaciones muestra badge numérico rojo

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario tiene notificaciones sin leer.

**Pasos:**
1. Observar el header de Home.

**Resultado esperado:**
- Ícono campana visible en el header.
- Badge numérico visible: color #D32F2F (rojo), número de notificaciones sin leer.

---

### TC-HOME-033 — Tap en ícono notificaciones navega a Notifications Overview

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Home.

**Pasos:**
1. Tap en el ícono de notificaciones (campana) del header.

**Resultado esperado:**
- Navega a Notifications Overview.
- Visible título "Notificaciones" y lista de notificaciones o empty state.

---

### TC-HOME-034 — Badge desaparece cuando se leen todas las notificaciones

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario vio la pantalla Notifications Overview.

**Pasos:**
1. Volver a Home.

**Resultado esperado:**
- Badge del ícono notificaciones desaparece o muestra "0".

---

---

## HealthyHabitSection

### TC-HOME-035 — Hábito del día visible y pendiente (Peso)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con target control_weight. No marcó el hábito del día (es primera vez en el día).

**Pasos:**
1. Hacer scroll hasta HealthyHabitSection en Home.

**Resultado esperado:**
- Card visible con:
  - Título: "Pesaje consciente".
  - Descripción: "Pesaje al despertar y en ayunas".
  - Checkbox vacío (borde gris #B0B8C1).
  - Texto normal (no tachado).

---

### TC-HOME-036 — Hábito del día visible y pendiente (Presión)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con target control_blood_pressure. No marcó el hábito del día.

**Pasos:**
1. Hacer scroll hasta HealthyHabitSection.

**Resultado esperado:**
- Título: "Momento de calma".
- Descripción: "Descanso silencioso antes de medir".
- Checkbox vacío.

---

### TC-HOME-037 — Hábito del día visible y pendiente (Glucosa)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con target control_glucose. No marcó el hábito del día.

**Pasos:**
1. Observar HealthyHabitSection.

**Resultado esperado:**
- Título: "Registro pospandrial".
- Descripción: "2 hs después de la comida principal".
- Checkbox vacío.

---

### TC-HOME-038 — Hábito del día visible y pendiente (Pasos)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con target control_steps. No marcó el hábito del día.

**Pasos:**
1. Observar HealthyHabitSection.

**Resultado esperado:**
- Título: "Caminata de activación".
- Descripción: "Caminar 10 min después de comer".
- Checkbox vacío.

---

### TC-HOME-039 — Hábito del día visible y pendiente (General)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con target control_general o sin targets específicos. No marcó el hábito del día.

**Pasos:**
1. Observar HealthyHabitSection.

**Resultado esperado:**
- Título: "Hidratación".
- Descripción: "Beber 2 litros de agua diarios".
- Checkbox vacío.

---

### TC-HOME-040 — Marcar hábito del día muestra confetti

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** TC-HOME-035 pasó. Hábito pendiente visible.

**Pasos:**
1. Tap en el checkbox de la card del hábito.

**Resultado esperado:**
- Animación de confetti visible (12 partículas distribuidas).
- Card cambia a estado completado:
  - Checkbox: azul #5777A0 con checkmark visible.
  - Texto: tachado.
  - Mensaje popup: "¡Bien hecho! El hábito de hoy está completo. Vuelve mañana para seguir cuidándote.".

---

### TC-HOME-041 — Hábito completado persiste durante el día

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** TC-HOME-040 pasó. Hábito marcado como completado.

**Pasos:**
1. Navegar a otra pantalla (ej: Devices).
2. Volver a Home.

**Resultado esperado:**
- El hábito sigue marcado como completado (checkbox azul, texto tachado).

---

### TC-HOME-042 — Hábito se reinicia al día siguiente

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** TC-HOME-041 pasó. Hábito marcado completado.

**Pasos:**
1. Cambiar fecha del dispositivo a mañana.
2. Reabrirt la app y navegar a Home.

**Resultado esperado:**
- El hábito vuelve a estado pendiente:
  - Checkbox vacío (borde gris).
  - Texto normal.
  - Sin mensaje de "Bien hecho".

---

---

## LastMeasurements Grid

### TC-HOME-043 — Grid de métricas muestra 6 cards máximo (2 columnas)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con targets múltiples y mediciones para cada uno.

**Pasos:**
1. Hacer scroll hasta LastMeasurements section en Home.

**Resultado esperado:**
- Grid visible con layout de 2 columnas.
- Cards visible (máximo 6): Pasos, Ritmo Cardíaco, Presión, Glucosa, Peso, Metabolismo.
- Dimensiones por card: 48% ancho, 160px alto.

---

### TC-HOME-044 — Grid muestra solo métricas de targets activos del usuario

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con solo targets: control_weight, control_glucose.

**Pasos:**
1. Observar LastMeasurements grid.

**Resultado esperado:**
- Cards visible: Peso, Glucosa.
- No aparecen cards de Presión, Pasos, Ritmo Cardíaco.

---

### TC-HOME-045 — Tap en card de métrica navega a detalles de esa métrica

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Home. Grid visible.

**Pasos:**
1. Tap en card "Peso".

**Resultado esperado:**
- Navega a WeightDetailsPage o página de detalles de Peso.

---

### TC-HOME-046 — Pasos y Ritmo Cardíaco requieren healthNativeAvailable=true

**Tipo:** Condicional | **Prioridad:** Media

**Precondiciones:** healthNativeAvailable=false.

**Pasos:**
1. Observar LastMeasurements grid.

**Resultado esperado:**
- Cards de Pasos y Ritmo Cardíaco no aparecen en el grid.
- Solo aparecen: Presión, Glucosa, Peso, Metabolismo (si aplica).

---

---

## AskForPushNotificationPermissions

### TC-HOME-047 — Pantalla de permisos push se muestra automáticamente en primera entrada

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario nunca respondió al permiso push (markPushPermissionRejected no fue llamado). Onboarding completado.

**Pasos:**
1. Completar login.
2. Sistema navega automáticamente a AskForPushNotificationPermissions.

**Resultado esperado:**
- Pantalla visible con:
  - Gradient: ['#CAD8EA', '#FFFFFF', '#FFFFFF', '#FFFFFF'].
  - Imagen: push-notification.png.
  - Título: "Recibe recordatorios y novedades que te ayudan a cuidar tu salud.".
  - Descripción: "🔔 Te avisaremos cuando sea momento de medir y te mantenemos al día con novedades importantes y actualizaciones.".
  - Botón 1: "Recibir recordatorios".
  - Botón 2: "Ahora no".

---

### TC-HOME-048 — Aceptar permisos push solicita permiso del sistema

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** TC-HOME-047 pasó. Pantalla de permisos visible.

**Pasos:**
1. Tap en "Recibir recordatorios".

**Resultado esperado:**
- Se abre el diálogo del sistema solicitando permiso de notificaciones.
- El usuario puede aceptar o rechazar en el diálogo del sistema.

---

### TC-HOME-049 — Aceptar permisos push retorna a Home

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** TC-HOME-048 pasó. Diálogo del sistema visible.

**Pasos:**
1. Aceptar el diálogo del sistema.

**Resultado esperado:**
- Regresa a Home (goBack).
- No hay errores.

---

### TC-HOME-050 — Rechazar permisos con "Ahora no" marca como rechazado

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** TC-HOME-047 pasó. Pantalla de permisos visible.

**Pasos:**
1. Tap en "Ahora no".

**Resultado esperado:**
- Llamada a `markPushPermissionRejected()`.
- Regresa a Home sin errores.

---

### TC-HOME-051 — Pantalla de permisos push no se muestra segunda vez

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario completó TC-HOME-050 o TC-HOME-049 en una sesión anterior.

**Pasos:**
1. Cerrar la app.
2. Reabrirla y hacer login.

**Resultado esperado:**
- AskForPushNotificationPermissions NO aparece.
- Home se muestra directamente.

---

---

## Notifications Overview (3 estados)

### TC-HOME-052 — Notifications Overview carga con lista de notificaciones

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con al menos 1 notificación sin leer.

**Pasos:**
1. Navegar a Notifications Overview (tap en ícono notificaciones del header).

**Resultado esperado:**
- Pantalla visible.
- Header: "Notificaciones" + ícono settings (engranaje).
- Lista de notificaciones visible (componente Notification por item).
- Pull-to-refresh disponible.

---

### TC-HOME-053 — Notifications Overview estado sin notificaciones

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario sin notificaciones.

**Pasos:**
1. Navegar a Notifications Overview.

**Resultado esperado:**
- Componente EmptyListView visible.
- Icono: reminder-icon.png.
- Título: "No tienes recordatorios".
- Descripción: "Crea recordatorios para no olvidar tus mediciones de salud y mantener un seguimiento constante.".

---

### TC-HOME-054 — Notifications Overview estado sin permisos

**Tipo:** Condicional | **Prioridad:** Media

**Precondiciones:** Usuario rechazó permisos de notificaciones del sistema.

**Pasos:**
1. Navegar a Notifications Overview.

**Resultado esperado:**
- Card con fondo #FFF4E5 (naranja claro) visible.
- Título: "Notificaciones desactivadas".
- Descripción: "Para recibir tus recordatorios de salud, necesitas activar las notificaciones en la configuración de tu dispositivo.".
- Botón: "Activar notificaciones" (color #EF6C00).

---

### TC-HOME-055 — Botón "Activar notificaciones" abre configuración del sistema

**Tipo:** Condicional | **Prioridad:** Media

**Precondiciones:** TC-HOME-054 pasó. Card sin permisos visible.

**Pasos:**
1. Tap en "Activar notificaciones".

**Resultado esperado:**
- Se abre la configuración del sistema (Settings app) en la sección de permisos de la app.

---

### TC-HOME-056 — Pull-to-refresh en Notifications Overview actualiza lista

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en Notifications Overview con notificaciones.

**Pasos:**
1. Hacer pull-to-refresh (deslizar hacia abajo desde la parte superior).

**Resultado esperado:**
- Indicador de refresh visible.
- Lista se actualiza sin cambios (o con nuevas notificaciones si las hay).

---

### TC-HOME-057 — Ícono settings navega a NotificationSettings

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Notifications Overview.

**Pasos:**
1. Tap en ícono de settings (engranaje) del header.

**Resultado esperado:**
- Navega a NotificationSettings (NotificationsPreferences).

---

---

## Notifications — Modo edición (selección y eliminación)

### TC-HOME-058 — Modo selección: activar con botón "Seleccionar"

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Notifications Overview con notificaciones.

**Pasos:**
1. Tap en botón "Seleccionar".

**Resultado esperado:**
- Header cambia: botón "Seleccionar" desaparece.
- Botones "Cancelar" y "Eliminar" aparecen.
- Checkboxes visibles en cada notificación.

---

### TC-HOME-059 — Seleccionar notificaciones en modo edición

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** TC-HOME-058 pasó. Modo selección activo.

**Pasos:**
1. Tap en checkbox de una notificación.

**Resultado esperado:**
- Checkbox se marca.
- El contador de seleccionados se actualiza (si existe).

---

### TC-HOME-060 — Eliminar notificaciones seleccionadas

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** TC-HOME-059 pasó. Al menos 1 notificación seleccionada.

**Pasos:**
1. Tap en botón "Eliminar".

**Resultado esperado:**
- AlertModal de confirmación aparece.
- Mensaje de confirmación visible.

---

### TC-HOME-061 — Confirmar eliminación en AlertModal

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** TC-HOME-060 pasó. AlertModal visible.

**Pasos:**
1. Tap en botón "Confirmar" o "Sí" del AlertModal.

**Resultado esperado:**
- Notificaciones seleccionadas se eliminan de la lista.
- Modo selección se desactiva.
- Header vuelve a mostrar botón "Seleccionar".

---

### TC-HOME-062 — Cancelar eliminación en AlertModal

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** TC-HOME-060 pasó. AlertModal visible.

**Pasos:**
1. Tap en botón "Cancelar" o "No" del AlertModal.

**Resultado esperado:**
- Modal se cierra sin eliminar notificaciones.
- Modo selección sigue activo.

---

### TC-HOME-063 — Cancelar modo selección sin eliminar

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** TC-HOME-058 pasó. Modo selección activo.

**Pasos:**
1. Tap en botón "Cancelar".

**Resultado esperado:**
- Modo selección se desactiva.
- Checkboxes desaparecen.
- Header vuelve a "Notificaciones" + botón "Seleccionar".

---

### TC-HOME-064 — Modo edición se desactiva al abandonar la pantalla

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** TC-HOME-058 pasó. Modo selección activo.

**Pasos:**
1. Navegar a otra pantalla (ej: Home o Settings).

**Resultado esperado:**
- El modo selección se desactiva automáticamente.
- Al volver a Notifications Overview, se muestra en estado normal.

---

---

## NotificationSettings (3 switches)

### TC-HOME-065 — NotificationSettings muestra 3 switches

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en NotificationSettings (navegar desde Notifications Overview).

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Texto superior: "Elige las notificaciones que quieres recibir".
- Switch 1: "Notificaciones de recordatorio" (notify_reminders, default: ON).
- Switch 2: "Notificaciones de motivación" (notify_motivation, default: ON).
- Switch 3: "Notificaciones de actualizaciones" (notify_updates, default: ON).

---

### TC-HOME-066 — Activar/desactivar switch de recordatorio

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en NotificationSettings.

**Pasos:**
1. Tap en switch "Notificaciones de recordatorio".

**Resultado esperado:**
- Switch cambia de estado (ON → OFF).
- El cambio se guarda silenciosamente en el backend.

---

### TC-HOME-067 — Activar/desactivar switch de motivación

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en NotificationSettings.

**Pasos:**
1. Tap en switch "Notificaciones de motivación".

**Resultado esperado:**
- Switch cambia de estado.
- El cambio se guarda en el backend.

---

### TC-HOME-068 — Activar/desactivar switch de actualizaciones

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en NotificationSettings.

**Pasos:**
1. Tap en switch "Notificaciones de actualizaciones".

**Resultado esperado:**
- Switch cambia de estado.
- El cambio se guarda en el backend.

---

### TC-HOME-069 — Los cambios de switches persisten al volver

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario cambió estados de switches en TC-HOME-066.

**Pasos:**
1. Navegar a Home o Notifications Overview.
2. Volver a NotificationSettings.

**Resultado esperado:**
- Los switches mantienen los estados guardados.

---

### TC-HOME-070 — Rollback automático si falla la solicitud al servidor

**Tipo:** Edge case | **Prioridad:** Baja

**Precondiciones:** Usuario en NotificationSettings. Conexión a internet cae después de cambiar switch.

**Pasos:**
1. Cambiar estado de un switch.
2. Desconectar internet.

**Resultado esperado:**
- Si la solicitud falla, el switch vuelve al estado anterior automáticamente.
- Se muestra mensaje de error si aplica.

---

---

## Integración de Widgets y Secciones

### TC-HOME-071 — HomeHeader posicionado en la parte superior de Home

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en Home.

**Pasos:**
1. Observar la estructura de Home.

**Resultado esperado:**
- HomeHeader visible en la parte superior.
- Botón "Nueva medición" y botón notificaciones visibles.

---

### TC-HOME-072 — ObjectiveTabs se muestra debajo del HomeHeader

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en Home.

**Pasos:**
1. Observar el layout de Home.

**Resultado esperado:**
- ObjectiveTabs visible debajo del header.
- Tabs scrolleables horizontalmente.

---

### TC-HOME-073 — WidgetSection se muestra debajo de ObjectiveTabs

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en Home.

**Pasos:**
1. Observar el layout.

**Resultado esperado:**
- WidgetSection visible con widget del target seleccionado.

---

### TC-HOME-074 — HealthyHabitSection se muestra debajo de WidgetSection

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en Home.

**Pasos:**
1. Hacer scroll hacia abajo.

**Resultado esperado:**
- HealthyHabitSection visible con card del hábito del día.

---

### TC-HOME-075 — LastMeasurements grid se muestra al final de Home

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en Home.

**Pasos:**
1. Hacer scroll hasta el final.

**Resultado esperado:**
- LastMeasurements grid visible al final de la pantalla.
- Grid scrolleable si hay muchas cards.

---
