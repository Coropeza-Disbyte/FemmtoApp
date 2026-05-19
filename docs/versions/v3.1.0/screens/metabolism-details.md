---
version: 3.1.0
screen: metabolism-details
risk_level: low
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/MetabolismDetails/containers/Overview/index.js
  - src/features/MetabolismDetails/containers/MoreInfo/index.js
  - src/features/MetabolismDetails/index.js
  - src/features/MetabolismMeasurementHistory/index.js
spec_file: tests/specs/metrics/metricsDetail.spec.js
page_object: src/pages/metrics/MetabolismDetailsPage.js
---

# [Metrics] Metabolismo — Detalle — v3.1.0

> Pantalla de detalle de la métrica de Metabolismo (TMB - Tasa Metabólica Basal y datos relacionados). Muestra mediciones registradas desde balanzas con bioimpedancia.

---

## Acceso

- **Desde:** Home → tap card Metabolismo en "Últimas mediciones"
- **Prerequisito:** usuario autenticado con al menos una medición de metabolismo (requiere balanza con bioimpedancia)
- **Retorna a:** Home (botón atrás)

---

## Stack del módulo Metabolismo

```
MetabolismDetails (Overview) → MoreInfo
                             → MetabolismMeasurementHistory
```

---

## Overview — Pantalla principal

| Elemento | Notas |
|----------|-------|
| Última medición | TMB en kcal + fecha |
| Datos complementarios | edad metabólica, grasa visceral (según dispositivo) |
| Gráfico de evolución | historial visual |
| Botón "Ver historial" | navega a MetabolismMeasurementHistory |
| Botón "Más info" | navega a MoreInfo |

---

## MoreInfo

Contenido educativo sobre metabolismo basal y su relación con la composición corporal.

---

## MetabolismMeasurementHistory

Historial completo de mediciones de metabolismo.

| Elemento | Notas |
|----------|-------|
| Lista de mediciones | fecha + TMB + datos de composición |

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.1.0 | Baseline | Overview + MoreInfo + MetabolismMeasurementHistory |
