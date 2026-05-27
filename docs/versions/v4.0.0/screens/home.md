---
version: 4.0.0
screen: home
risk_level: high
since: 3.0.1
last_modified: 2026-05-26
build: 1027
source_files:
  - src/features/Home/containers/Overview/index.js
  - src/features/Home/containers/Overview/sections/ObjectiveTabs/TabsSection.js
  - src/features/Home/containers/Overview/sections/ObjectiveTabs/widgets/WidgetSection.js
  - src/features/Home/containers/Overview/sections/ObjectiveTabs/widgets/WeightWidget.js
  - src/features/Home/containers/Overview/sections/ObjectiveTabs/HealthyHabitSection.js
  - src/features/Home/containers/Overview/sections/ObjectiveTabs/ReorderTabsModal.js
  - src/features/Home/containers/Overview/sections/HealthMetrics/index.js
  - src/features/Home/containers/Overview/sections/TrendsSection/index.js
  - src/components/HomeHeader/index.js
  - src/components/HotFemmtoModal/index.js
  - src/theme/measurementColors.js
spec_file: tests/specs/home/home.spec.js
page_object: src/pages/home/HomePage.js
---

# [Home] Home Screen — v4.0.0

> Pantalla principal post-login. En v4.0.0 recibió un rebranding completo: se eliminó el modelo de favoritos y se introdujo un sistema de tabs por objetivo con widgets de métricas, sección de tendencias, hábitos diarios y un tour guiado de onboarding.

---

## Acceso

- **Desde:** Login exitoso / cualquier tab del bottom nav al tocar "Home"
- **Prerequisito:** usuario autenticado con al menos un objetivo (`user.data.targets`) configurado
- **Retorna a:** no aplica (es el root del stack Home)

---

## Bottom Navigation Bar

En v4.0.0 el tab "Medición" fue eliminado. El nav pasó de 5 a 4 tabs:

| Tab | Ícono | Destino |
|-----|-------|---------|
| Home | home | HomeScreen (actual) |
| Devices | devices | DevicesScreen |
| Alarmas | alarm | RemindersScreen |
| Compartir | share | ShareScreen |

---

## Header (HomeHeader)

Fuente: `src/components/HomeHeader/index.js`. El header tiene tres botones en la parte derecha (de izquierda a derecha):

| Elemento | Tipo | Comportamiento |
|----------|------|----------------|
| Logo / nombre usuario | texto | visible en la parte izquierda (UserHeader) |
| Botón "Nueva medición" | botón (new-measure-icon) | 1er botón derecha — navega al flujo según tab activo; envuelto en `TourGuideZone zone={4}` |
| Ícono notificaciones | botón (bell-icon, size 7) | 2do botón derecha — navega a NotificationsScreen; muestra badge rojo con conteo cuando `unreadCount > 0` y hay permisos |
| Ícono menú | botón (menu-icon, size 7) | 3er botón derecha — navega a MenuOptions |

> En v3.x el botón derecho del header era de ayuda/videos. En v4.0.0 fue reemplazado por "Nueva medición".
> El tamaño del ícono de notificaciones es size 7.
> El badge de notificaciones cambia `fontSize` a 6 si `unreadCount >= 100`.

### Routing inteligente del botón "Nueva medición"

La pantalla de destino depende del `targetType` pasado por ObjectiveTabs (`onNewMeasurePress`):

| Tab activo | `targetType` | Destino de medición |
|------------|--------------|---------------------|
| Peso | `control_weight` | flujo de balanza (`initFlow` → `NewScaleMedition`) |
| Presión arterial | `control_blood_pressure` | `NewPreasureOCRMedition` |
| Glucosa | `control_glucose` | `NewGlucometerMedition` |
| Pasos | `control_steps` | pantalla genérica de medición (`Measure`) |
| General | `control_general` | pantalla genérica de medición (`Measure`) |

> `control_steps` no está en el map de rutas — cae al `else` y navega a `Measure` (pantalla de selección general).
> `control_general` sí está en el map y también navega a `Measure`.

---

## TourGuide — Sistema de onboarding interactivo

Librería `rn-tourguide`. El tour se muestra una única vez por usuario (persiste en `AsyncStorage` con clave `@femmto/home_tour_v1`). Se completa antes de evaluar intro de HealthNative o perfil incompleto.

**Persistencia (build 1025):** la clave `@femmto/home_tour_v1` se escribe en `AsyncStorage` **al iniciar el tour** (no al completarlo). Esto garantiza que si el usuario navega fuera a mitad del tour, al volver al Home el tour no reaparece. `tourStartedRef` previene múltiples disparos en la misma sesión.

| Zona | Nro | Qué apunta | Texto del tooltip |
|------|-----|------------|-------------------|
| Widget activo | 1 | WidgetSection | contenido del widget del objetivo activo |
| Tabs de objetivos | 2 | TabsSection | cómo cambiar entre objetivos |
| Menú del widget | 3 | ícono ⋯ del widget | cómo cambiar el orden de objetivos o editar la selección |
| Nueva medición | 4 | botón header | cómo iniciar una medición rápida |

> El tour hace scroll automático para mostrar cada zona. El tooltip personalizado es `HomeTourTooltip`.
> El scroll para los pasos 1 y 2 usa `programmaticStopRef` para distinguir stop manual de stop por scroll — evita marcar el tour como completado prematuramente.

---

## ObjectiveTabs — Tabs horizontales de objetivos

Reemplaza al `FavoritesSelector` de v3.x. Los tabs se generan a partir de `user.data.targets`.

### Tabs disponibles

| Tab | Color de acento | Métrica |
|-----|----------------|---------|
| Peso | `#64A185` | weight |
| Presión arterial | `#E57373` | blood_pressure |
| Glucosa | `#37A1AF` | glucose |
| Pasos | `#D76801` | steps |
| General | `#7493BA` | general |

### Estilo de tab activo

- Borde inferior: `#91B2DC`
- Fondo: `#91B2DC26`
- Texto: bold

### Orden personalizable

- El usuario puede reordenar los tabs desde el modal `ReorderTabsModal`
- El orden persiste en el store con la acción `SET_TAB_ORDER`

---

## ReorderTabsModal

Modal de reordenamiento de tabs accesible desde el Home.

| Elemento | Tipo | Detalle |
|----------|------|---------|
| Título | texto | "Ordenar tarjetas" |
| Subtítulo | texto | "Arrastra tus objetivos para ordenarlos." |
| Lista de tabs | drag & drop (PanResponder) | cada tab es arrastrable verticalmente |
| Botón guardar | botón primario | "Guardar" — persiste el orden y cierra el modal |
| Cierre | X o tap en backdrop | descarta cambios |

---

## WidgetSection — Resumen de hoy

Contenedor principal del widget activo. Muestra el título "Resumen de hoy" y envuelve el widget correspondiente al tab activo.

### WeightWidget (representativo — todos los widgets siguen la misma estructura)

| Elemento | Tipo | Detalle |
|----------|------|---------|
| Valor principal | número + unidad | ej: "72.5 kg" |
| Delta | variación + flecha | flecha arriba si aumentó (`#c91f1d`), abajo si bajó (`#28B446`) |
| Gráfico | LineChart | historial reciente de la métrica |
| Frecuencia | texto | ej: "3 mediciones esta semana" |
| CTA "Medir ahora" | botón primario | visible si el usuario no midió hoy — navega al flujo de medición |
| CTA "Ya medido hoy" | botón deshabilitado/secundario | visible si ya hay medición del día |
| "Ver historial" | link | navega a la pantalla de historial de la métrica |

> Los colores delta: positivo (aumento de peso) = `#c91f1d` (rojo), negativo (baja) = `#28B446` (verde).
> Para glucosa y presión la lógica de color puede invertirse según configuración clínica.

---

## TrendsSection

Sección de tendencias debajo del widget activo. Muestra análisis de la métrica seleccionada en el período configurado.

- Se carga con la acción `LOAD_HOME_SUMMARY` / `LOAD_GENERAL_SUMMARY`
- Contenido varía por métrica activa

---

## HealthyHabitSection — Hábitos diarios

Sección debajo de TrendsSection. Muestra el hábito del día correspondiente al objetivo activo.

### Mapa de hábitos por objetivo

| Objetivo | Nombre del hábito | Descripción visible |
|----------|-------------------|---------------------|
| Peso (`control_weight`) | Pesaje consciente | "Pesaje al despertar y en ayunas" |
| Presión (`control_blood_pressure`) | Momento de calma | "Descanso silencioso antes de medir" |
| Glucosa (`control_glucose`) | Registro pospandrial | "2 hs después de la comida principal" |
| Pasos (`control_steps`) | Caminata de activación | "Caminar 10 min después de comer" |
| General (`control_general`) | Hidratación | "Beber 2 litros de agua diarios" |

### Estados del hábito

| Estado | Condición | Qué muestra |
|--------|-----------|-------------|
| Pendiente | hábito no completado hoy | card con nombre + descripción + botón para marcar |
| Completado | hábito ya registrado | card "¡Bien hecho! El hábito de hoy está completo." + animación confetti (12 partículas) |

> El registro persiste con la acción `SET_DAILY_HABIT`.

---

## Métricas de salud (grid inferior)

Reemplaza a "Últimas mediciones" de v3.x.

| Cambio | v3.x | v4.0.0 |
|--------|------|--------|
| Título | "Últimas mediciones" | "Métricas de salud" |
| Layout | lista vertical 1 columna | grid 2 columnas (48% cada card) |
| Filtrado | lista `favourites` del store | `user.data.targets` |
| Card composición | card normal | ocupa fila completa (100%) al final del grid |

El componente `HealthMetricCard` centraliza los estilos de todas las cards de métricas.

---

## Paleta de colores por métrica (`measurementColors.js`)

| Métrica | Color |
|---------|-------|
| Presión arterial | `#E57373` |
| Peso | `#64A185` |
| Glucosa | `#37A1AF` |
| Pasos | `#D76801` |
| General | `#7493BA` |
| Delta positivo | `#28B446` |
| Delta negativo | `#c91f1d` |

---

## Componentes persistentes en pantalla

| Componente | Siempre visible | Descripción |
|------------|-----------------|-------------|
| `OptionalUpdateBottomSheet` | sí | sheet de actualización opcional; se auto-muestra si hay versión más reciente |
| `FeedbackFlow` | sí | flujo de feedback en app; accede a soporte (`Support`) o menú con highlight de reseña (`MenuOptions?highlightReview=true`) |
| `HotFemmtoModal` | **no (deshabilitado desde build 1025)** | modal promocional "Hot Femmto"; import, ref, lógica y JSX comentados en `Overview/index.js` tras expiración de promo el 18/05/2026. Componente en disco pero no se monta. |

---

## Store — acciones relevantes

| Acción | Qué hace |
|--------|----------|
| `LOAD_HOME_SUMMARY` | carga el resumen del widget activo |
| `LOAD_GENERAL_SUMMARY` | carga el resumen para el tab General |
| `SET_TAB_ORDER` | persiste el orden de tabs personalizado |
| `SET_DAILY_HABIT` | registra cumplimiento del hábito diario |
| `SET_WEIGHT_SUMMARY` | setea datos del widget de peso |
| `SET_BLOOD_PRESSURE_SUMMARY` | setea datos del widget de presión |
| `SET_GLUCOSE_SUMMARY` | setea datos del widget de glucosa |
| `SET_STEPS_SUMMARY` | setea datos del widget de pasos |
| `SET_GENERAL_SUMMARY` | setea datos del widget general |

---

## Edge cases documentados

- Si el usuario no tiene objetivos configurados (`targets` vacío), no hay tabs que mostrar — verificar comportamiento de fallback
- Si el usuario ya completó el tour (`AsyncStorage` tiene `@femmto/home_tour_v1`), el tour no vuelve a aparecer aunque se reinstale (depende de si AsyncStorage persiste)
- El botón "Nueva medición" para tabs "Pasos" y "General" no navega — verificar que no genere crash o estado inesperado
- El delta de color en glucosa/presión puede tener lógica inversa a la de peso — documentar por separado en los specs de esas métricas
- Si `user.data.targets` cambia entre sesiones, el orden personalizado de tabs puede quedar inconsistente

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.0.1 | Baseline | Home con FavoritesSelector, 5 tabs en bottom nav, header con ícono de ayuda |
| v4.0.0 | Rebranding completo | Eliminado tab Medición del nav; reemplazado FavoritesSelector por ObjectiveTabs; nuevo header con routing inteligente; TourGuide onboarding; TrendsSection; HealthyHabitSection; grid de métricas; measurementColors |
| v4.0.0 (build 1024) | Correcciones docs | Path HomeHeader corregido a `src/components/HomeHeader/index.js`; routing de Pasos/General corregido (sí navegan a Measure); orden de botones del header documentado; FeedbackFlow y OptionalUpdateBottomSheet registrados |
| v4.0.0 (build 1025) | Fix | TourGuide: clave `@femmto/home_tour_v1` escrita en AsyncStorage al **iniciar** el tour (no al completarlo) — evita re-aparición al navegar fuera a mitad del tour |
| v4.0.0 (build 1027) | Fix + chore | fix(home): clave `@femmto/home_tour_v1` escrita en AsyncStorage al iniciar el tour — evita re-aparición. chore(home): `HotFemmtoModal` deshabilitado (import, ref, lógica y JSX comentados) tras expiración de promo "Hot Femmto" el 18/05/2026. |
