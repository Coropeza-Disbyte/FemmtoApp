---
version: 3.1.0
screen: presure-details
risk_level: medium
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/PresureDetails/Overview/index.js
  - src/features/PresureDetails/MoreInfo/index.js
  - src/features/PresureDetails/index.js
  - src/features/PreasureMeasurementHistory/index.js
spec_file: tests/specs/metrics/metricsDetail.spec.js
page_object: src/pages/metrics/PresureDetailsPage.js
---

# [Metrics] Presión Arterial — Detalle — v3.1.0

> Pantalla de detalle de la métrica de Presión Arterial. Muestra el resumen de mediciones (sistólica/diastólica/pulso) con acceso al historial.

---

## Acceso

- **Desde:** Home → tap card Presión en "Últimas mediciones"
- **Prerequisito:** usuario autenticado con al menos una medición de presión
- **Retorna a:** Home (botón atrás)

---

## Stack del módulo Presión

```
PresureDetails (PresureOverview) → MoreInfo
                                 → PreasureMeasurementHistory
```

---

## PresureOverview — Pantalla principal

| Elemento | Notas |
|----------|-------|
| Última medición | sistólica / diastólica / pulso + fecha |
| Clasificación | indicador de rango (Normal, Elevada, etc.) |
| Gráfico de evolución | historial visual de presión |
| Botón "Ver historial" | navega a PreasureMeasurementHistory |
| Botón "Más info" | navega a MoreInfo |

---

## MoreInfo

Contenido educativo sobre presión arterial, rangos normales y recomendaciones.

---

## PreasureMeasurementHistory

Historial completo de mediciones de presión arterial.

| Elemento | Notas |
|----------|-------|
| Lista de mediciones | fecha + sistólica/diastólica/pulso |
| Clasificación por medición | indicador de rango por registro |

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.1.0 | Baseline | PresureOverview + MoreInfo + PreasureMeasurementHistory |
| v3.4.0 | Renombrado | "Tensiómetros" → "Monitores de Presión" en todo el módulo |
