---
version: 3.4.0
screen: heart-rate-details
risk_level: low
since: 3.4.0
last_modified: 2026-05-14
source_files:
  - src/features/HeartRateDetails/index.js
  - src/features/HeartRateDetails/containers/Overview/index.js
  - src/features/HeartRateDetails/containers/MoreInfo/index.js
  - src/features/HeartRateMeasurementHistory/index.js
  - src/features/HeartRateMeasurementHistory/containers/MeasurementList/index.js
spec_file: tests/specs/metrics/metricsDetail.spec.js
page_object: src/pages/metrics/HeartRateDetailsPage.js
---

# [Metrics] Frecuencia Cardíaca — Detalle — v3.4.0

> Pantalla de detalle de la métrica de Frecuencia Cardíaca. Los datos provienen de Health Connect (Android) o Apple Health (iOS) — no de dispositivos Bluetooth. Muestra gráficos históricos con selector día/semana/mes y acceso al historial completo.

---

## Acceso

- **Desde:** Home → tap card Frecuencia Cardíaca en "Últimas mediciones"
- **Prerequisito:** usuario autenticado con permisos de salud nativa otorgados (HealthNativeIntro completado); al menos una medición de frecuencia cardíaca disponible en la plataforma de salud
- **Retorna a:** Home (botón atrás)

---

## Stack del módulo

```
HeartRateDetailsNavigator
  ├── HeartRateOverview     ← pantalla principal
  ├── HeartRateMoreInfo     ← contenido educativo
  └── HeartRateHistory      ← HeartRateMeasurementHistoryNavigator
        └── MeasurementList
```

---

## HeartRateOverview — Pantalla principal

### Elementos de UI

| Elemento | Notas |
|----------|-------|
| Header | título "Frecuencia Cardíaca" + botón atrás + ícono info (`info-icon.png`) → `HeartRateMoreInfo` |
| GroupedSelector | tabs `ControlTab`: "día" / "semana" / "mes" — debajo del header con borde inferior |
| RangeSection | rango de fechas del período seleccionado (calculado con `moment-timezone` en español) |
| ChartSection | gráfico según tab activo: `DayChart` / `WeekChart` / `MonthChart` + vistas agrupadas `GroupedChart` / `SinglePointChart` |
| DetailsSection | `BpmCard` con datos de la medición seleccionada |
| LastMeasureSection | "Mas reciente: HH:MM hs — NNN lpm" — desde `homeReducer.lastMeasurements.heartRate` |
| DescriptionSection | texto informativo del período, fuente de datos (Google/Apple Health) |
| RefreshControl | pull-to-refresh → `dispatch(refresh(...))` |

### StatusBar

`useStatusBarColorOnFocus('white')` — blanco en esta pantalla.

### `safeAreaTop`

`BoxContainer` tiene `safeAreaTop` en esta pantalla.

### Selector de período (GroupedSelector)

| Índice | Tab | Rango |
|--------|-----|-------|
| 0 | día | últimas 24h (datos por hora) |
| 1 | semana | últimos 7 días |
| 2 | mes | últimos 6 meses |

`dispatch(changeGroupedOption(index))` → actualiza `heartRateDetailsReducer.selectedGroupedOption`.

### DescriptionSection (texto por período)

| Período | Texto |
|---------|-------|
| día / semana | "Los datos de pasos se importan desde Google/Apple Health. El promedio se calcula en base a los últimos 7 días de actividad." |
| mes | "…El promedio se calcula en base a los últimos 6 meses de actividad." |

> Nota: el texto menciona "pasos" por un copy-paste bug en v3.4.0 — el comportamiento es correcto.

### Fuente de datos

`HeartRateDetails` lee datos de **Health Connect (Android)** o **HealthKit (iOS)**. No proviene de dispositivos Bluetooth Femmto. El store carga datos via `INIT_FLOW`, `LOAD_DAY_DATA`, `LOAD_WEEKS_DATA`, `LOAD_MONTHS_HEART_RATE_DATA`.

---

## HeartRateMoreInfo

Contenido educativo sobre frecuencia cardíaca, rangos normales y relación con la actividad física.

---

## HeartRateMeasurementHistory — Historial

Historial completo de mediciones de frecuencia cardíaca importadas de la plataforma de salud nativa.

| Elemento | Notas |
|----------|-------|
| Header con botón atrás | |
| Lista de mediciones | fecha + hora + valor en lpm |

`loadMeasurements` se dispara en `useEffect` al montar el componente.

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.4.0 | Introducida | Detalle de Frecuencia Cardíaca desde Health Connect / Apple Health |
