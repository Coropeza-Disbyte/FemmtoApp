---
version: 3.1.0
screen: medition-options
risk_level: high
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/NewMedition/containers/MeditionOptions/index.js
  - src/features/NewMedition/index.js
spec_file: tests/specs/tabs/medition.spec.js
page_object: src/pages/tabs/MeditionPage.js
---

# [Medition] Nueva Medición — Opciones — v3.1.0

> Pantalla del tab "Medición". Es el punto de entrada al flujo de medición. Permite al usuario seleccionar el tipo de dispositivo con el que quiere medir.

---

## Acceso

- **Desde:** tap tab "Medición" en el bottom nav
- **Prerequisito:** usuario autenticado
- **Retorna a:** bottom nav (botón atrás en header)

---

## Elementos de UI

| Elemento | Tipo | Texto visible | Notas |
|----------|------|---------------|-------|
| Header | barra de nav | "Nueva medición" + botón atrás | usa componente `Header` estándar |
| Texto instrucción | texto centrado | "Selecciona el dispositivo a sincronizar con tu smartphone." | color `neutral.600` |
| Opción Tensiómetro | `DeviceOption` | "Tensiómetro" | navega al flujo de medición de presión arterial |
| Opción Balanza | `DeviceOption` | "Balanza" | navega al flujo de medición de peso |
| Opción Glucómetro | `DeviceOption` | "Glucómetro" | navega al flujo de medición de glucosa |

---

## Comportamiento funcional

### Al entrar a la pantalla

Al recibir el foco (`useFocusEffect`), desconecta el dispositivo Bluetooth actualmente conectado (`disconnectCurrentDevice`). Esto garantiza un estado limpio antes de iniciar una nueva medición.

### Rutas de navegación

| Opción seleccionada | Destino |
|--------------------|---------|
| Tensiómetro | `NewPreasureOCRMedition` (flujo OCR / Bluetooth de presión) |
| Balanza | `initScaleMedition` → si éxito: `NewScaleMedition` |
| Glucómetro | `NewGlucometerMedition` |

### Inicialización de balanza

Al seleccionar "Balanza":
1. Dispatch de `initScaleMedition`
2. Si éxito → navega a `NewScaleMedition`
3. Si error → toast de error

---

## Edge cases documentados

- Si el dispatch de `initScaleMedition` falla → se muestra toast de error y el usuario permanece en la pantalla de opciones
- Al desconectar el dispositivo en `useFocusEffect`, si no hay dispositivo conectado no ocurre nada (operación segura)

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.1.0 | Baseline | 3 opciones: Tensiómetro, Balanza, Glucómetro |
| v4.0.0 | Eliminado del nav | La pantalla se mueve al stack de Home; el tab "Medición" se elimina del bottom nav |
