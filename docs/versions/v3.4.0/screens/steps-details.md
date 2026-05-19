---
version: 3.4.0
screen: steps-details
risk_level: low
since: 3.4.0
last_modified: 2026-05-14
source_files:
  - src/features/StepsDetails/index.js
  - src/features/StepsDetails/containers/Overview/index.js
  - src/features/StepsDetails/containers/MoreInfo/index.js
  - src/features/StepsHistory/index.js
  - src/features/StepsHistory/containers/RecordList/index.js
spec_file: tests/specs/metrics/metricsDetail.spec.js
page_object: src/pages/metrics/StepsDetailsPage.js
---

# [Metrics] Pasos — Detalle — v3.4.0

> Pantalla de detalle de la métrica de Pasos. Los datos provienen de Health Connect (Android) o Apple Health (iOS). Muestra gráficos históricos con selector día/semana/mes, última medición y acceso al historial completo.

---

## Acceso

- **Desde:** Home → tap card Pasos en "Últimas mediciones"
- **Prerequisito:** usuario autenticado con permisos de salud nativa otorgados; al menos un registro de pasos en la plataforma de salud
- **Retorna a:** Home (botón atrás)

---

## Stack del módulo

```
StepsDetailsNavigator
  ├── StepsOverview     ← pantalla principal
  ├── StepsMoreInfo     ← contenido educativo
  └── StepsHistory      ← StepsHistoryNavigator
        └── RecordList
```

---

## StepsOverview — Pantalla principal

Estructura idéntica a `HeartRateOverview` con las siguientes diferencias:

| Aspecto | HeartRate | Steps |
|---------|-----------|-------|
| Header título | "Frecuencia Cardíaca" | "Pasos" |
| Reducer | `heartRateDetailsReducer` | `stepsDetailsReducer` |
| Historial | `HeartRateHistory` | `StepsHistory` |
| Botón historial | `ViewHistoryButton` presente | `ViewHistoryButton` presente |
| `safeAreaTop` | sí | no |
| LastMeasureSection | desde `homeReducer.lastMeasurements.heartRate` | data de pasos del día |

### Elementos de UI

| Elemento | Notas |
|----------|-------|
| Header | título "Pasos" + botón atrás + ícono info → `StepsMoreInfo` |
| GroupedSelector | tabs "día" / "semana" / "mes" |
| RangeSection | rango de fechas del período |
| ChartSection | `DayChart` / `WeekChart` / `MonthChart` / `GroupedChart` según tab |
| DetailsSection | `StepsCard` con datos del período seleccionado |
| LastMeasureSection | medición más reciente |
| DescriptionSection | texto según período (fuente Google/Apple Health) |
| ViewHistoryButton | navega a `StepsHistory` via `dispatch(initHistoryFlow(...))` |
| RefreshControl | pull-to-refresh → `dispatch(refresh(...))` |

### StatusBar

`useStatusBarColorOnFocus('white')` — blanco en esta pantalla.

### Selector de período

| Índice | Tab | Rango |
|--------|-----|-------|
| 0 | día | últimas 24h |
| 1 | semana | últimos 7 días |
| 2 | mes | últimos 6 meses |

### DescriptionSection

| Período | Texto |
|---------|-------|
| día / semana | "Los datos de pasos se importan desde Google/Apple Health. El promedio se calcula en base a los últimos 7 días de actividad." |
| mes | "…El promedio se calcula en base a los últimos 6 meses de actividad." |

### Fuente de datos

**Health Connect (Android)** / **HealthKit (iOS)**. Store: `INIT_FLOW`, `LOAD_DAY_DATA`, `LOAD_WEEKS_DATA`, `LOAD_MONTHS_STEPS_DATA`.

---

## StepsMoreInfo

Contenido educativo sobre actividad física, cantidad de pasos recomendados y beneficios para la salud.

---

## StepsHistory — Historial

Historial completo de registros de pasos importados de la plataforma de salud nativa.

| Elemento | Notas |
|----------|-------|
| Header con botón atrás | |
| Lista de registros | fecha + cantidad de pasos |

`loadRecords` se dispara en `useEffect` al montar el componente. Los registros se llaman `Record` (no `Measurement`) — distinción terminológica respecto a las otras métricas.

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.4.0 | Introducida | Detalle de Pasos desde Health Connect / Apple Health |
