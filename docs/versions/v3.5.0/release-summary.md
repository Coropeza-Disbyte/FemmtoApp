---
version: 3.5.0
last_modified: 2026-05-14
type: release-summary
---

# Release Summary — v3.5.0

## Cambios respecto a v3.4.0

| Área | Tipo | Descripción |
|------|------|-------------|
| BluetoothGlucometerMeasure | Nueva pantalla | Flow de medición BT para glucómetros Vivachek y CGH25 con stepper de 5 estados |
| NewGlucometerMedition | Refactorizado | Integración completa de BT: SearchLinkedGlucometer + ConnectGlucometer + BluetoothGlucometerMeasure |
| Reminders | Rediseñado | 3 nuevos tipos de recordatorio (Glucómetro, Medicación, Otro) + opción "Otro" con input de texto libre; nueva UI con tarjetas tipo radio |
| AddGlucoseMeasure | Modificado | Campo `doses` ahora soporta magnitud separada (doses + magnitude: mg/dL) — refactor interno de datos |

## Pantallas nuevas (documentadas en esta versión)

- [bluetooth-glucometer-measure.md](screens/bluetooth-glucometer-measure.md) — Flow BT Vivachek / CGH25

## Pantallas refactorizadas (documentadas en esta versión)

- [new-glucometer-medition.md](screens/new-glucometer-medition.md) — Ahora incluye flow BT completo
- [reminders.md](screens/reminders.md) — Nueva UI + nuevos tipos de recordatorio

## Pantallas sin cambios

Las métricas de Glucosa, Pasos, Frecuencia Cardíaca, Peso, Presión y Metabolismo permanecen iguales. Ver versiones anteriores.
