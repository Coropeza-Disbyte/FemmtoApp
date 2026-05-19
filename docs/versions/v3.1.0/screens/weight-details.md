---
version: 3.1.0
screen: weight-details
risk_level: medium
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/WeightDetails/containers/Overview/index.js
  - src/features/WeightDetails/containers/MoreInfo/index.js
  - src/features/WeightDetails/index.js
  - src/features/WeightMeasurementHistory/index.js
spec_file: tests/specs/metrics/metricsDetail.spec.js
page_object: src/pages/metrics/WeightDetailsPage.js
---

# [Metrics] Weight Details — v3.1.0

> Pantalla de detalle de la métrica de Peso. Muestra el resumen de mediciones de peso y composición corporal, con acceso al historial completo.

---

## Acceso

- **Desde:** Home → tap card Peso o card Composición segmentada en "Últimas mediciones"
- **Prerequisito:** usuario autenticado con al menos una medición de peso
- **Retorna a:** Home (botón atrás)

---

## Stack del módulo Weight

```
WeightDetails (Overview) → MoreInfo
                         → WeightMeasurementHistory
```

---

## Overview — Pantalla principal de detalle de Peso

| Elemento | Notas |
|----------|-------|
| Resumen de peso actual | valor en kg + delta respecto a medición anterior |
| Gráfico de evolución | historial visual del peso |
| Composición corporal | datos de grasa, músculo, etc. (si el dispositivo lo mide) |
| Composición segmentada | datos por segmento corporal |
| Botón "Ver historial" | navega a WeightMeasurementHistory |
| Botón "Más info" | navega a MoreInfo |

---

## MoreInfo

Pantalla informativa sobre la métrica de Peso y Composición Corporal. Contenido educativo / explicativo.

---

## WeightMeasurementHistory

Historial completo de mediciones de peso. Lista cronológica de todas las mediciones registradas.

| Elemento | Notas |
|----------|-------|
| Lista de mediciones | fecha + valor en kg + datos de composición |
| Filtros (si aplica) | por período o rango de fechas |

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.1.0 | Baseline | Overview + MoreInfo + WeightMeasurementHistory |
