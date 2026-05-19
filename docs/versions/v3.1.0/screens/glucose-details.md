---
version: 3.1.0
screen: glucose-details
risk_level: medium
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/GlucoseDetails/Overview/index.js
  - src/features/GlucoseDetails/MoreInfo/index.js
  - src/features/GlucoseDetails/index.js
  - src/features/GlucoseMeasurementHistory/index.js
spec_file: tests/specs/metrics/metricsDetail.spec.js
page_object: src/pages/metrics/GlucoseDetailsPage.js
---

# [Metrics] Glucosa — Detalle — v3.1.0

> Pantalla de detalle de la métrica de Glucosa en sangre. Muestra el resumen de mediciones con clasificación de rango y acceso al historial.

---

## Acceso

- **Desde:** Home → tap card Glucosa en "Últimas mediciones"
- **Prerequisito:** usuario autenticado con al menos una medición de glucosa
- **Retorna a:** Home (botón atrás)

---

## Stack del módulo Glucosa

```
GlucoseDetails (GlucoseOverview) → GlucoseMeasurementHistory
                                 → MoreInfo
```

---

## GlucoseOverview — Pantalla principal

| Elemento | Notas |
|----------|-------|
| Última medición | valor en mg/dL + fecha |
| Clasificación | rango (Normal en ayunas, Prediabetes, etc.) |
| Gráfico de evolución | historial visual de glucosa |
| Botón "Ver historial" | navega a GlucoseMeasurementHistory |
| Botón "Más info" | navega a MoreInfo |

---

## MoreInfo

Contenido educativo sobre glucosa, rangos normales y recomendaciones clínicas.

---

## GlucoseMeasurementHistory

Historial completo de mediciones de glucosa.

| Elemento | Notas |
|----------|-------|
| Lista de mediciones | fecha + valor mg/dL + clasificación |

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.1.0 | Baseline | GlucoseOverview + MoreInfo + GlucoseMeasurementHistory |
| v3.7.2 | Rehabilitado | Edición de mediciones de glucosa (había sido deshabilitada) |
