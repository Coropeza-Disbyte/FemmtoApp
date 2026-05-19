---
version: 3.2.0
last_modified: 2026-05-14
type: release-summary
---

# Release Summary — v3.2.0

## Cambios respecto a v3.1.0

| Área | Tipo | Descripción |
|------|------|-------------|
| NewUserIntro | Nueva pantalla | Tutorial de 4 páginas mostrado al completar el onboarding |
| Devices — BloodPressureDevices | Nueva pantalla | Selector de tipo de tensiómetro (brazo / muñeca) |
| Devices — WristInstructions | Nueva pantalla | Instrucciones para tensiómetro de muñeca |
| Devices — SelectDeviceType | Modificado | Tensiómetro ahora navega a BloodPressureDevices en vez de ir directo a LinkPreasureDeviceIntro |
| BluetoothPreasureMeasure | Modificado | Soporte de flag `isWrist` en el flow de medición BLE |

## Pantallas nuevas (screens documentados en esta versión)

- [new-user-intro.md](screens/new-user-intro.md) — Tutorial post-onboarding
- [blood-pressure-devices.md](screens/blood-pressure-devices.md) — Selector brazo / muñeca
- [wrist-instructions.md](screens/wrist-instructions.md) — Instrucciones tensiómetro de muñeca

## Pantallas sin cambios

El resto de las pantallas son idénticas a [v3.1.0](../v3.1.0/). No se duplican.
