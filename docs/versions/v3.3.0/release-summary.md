---
version: 3.3.0
last_modified: 2026-05-14
type: release-summary
---

# Release Summary — v3.3.0

## Cambios respecto a v3.2.0

Esta versión es un **refactor mayor del flow de medición de presión arterial por Bluetooth**.
No se agregan nuevos módulos de feature — todos los cambios ocurren dentro de `NewPreasureOCRMedition`
y los navigators/containers de soporte BLE.

| Área | Tipo | Descripción |
|------|------|-------------|
| NewPreasureOCRMedition — Introduction | Modificado | Lógica `shouldLinkPreasureMonitor`, analytics, nuevo flujo de búsqueda de dispositivo vinculado |
| NewPreasureOCRMedition — Instructions | Nueva pantalla | Video instructivo por tipo de dispositivo (brazo / muñeca / AIO) |
| SearchLinkedBluetoothDevice | Nuevo sub-flow | Busca automáticamente dispositivo BT vinculado → Success / Fail |
| BluetoothDeviceMeasureFail (ErrorMessage) | Nueva pantalla | Error genérico con título + razón para fallas en medición BLE |
| IntroductionPair | Nueva variante | Intro alternativa para vinculación de nuevo dispositivo |
| Timeouts en medición BT | Fix/feat | Manejo de timeouts en el flow de búsqueda y conexión |
| Nomenclatura de dispositivos | Fix | Nombres corregidos para múltiples dispositivos del mismo tipo |

## Pantallas nuevas / actualizadas (documentadas en esta versión)

- [presure-ocr-medition.md](screens/presure-ocr-medition.md) — Flow completo de medición de presión (refactorizado)

## Pantallas sin cambios

El resto de las pantallas son idénticas a [v3.2.0](../v3.2.0/) / [v3.1.0](../v3.1.0/).
