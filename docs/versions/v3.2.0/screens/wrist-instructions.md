---
version: 3.2.0
screen: wrist-instructions
risk_level: medium
since: 3.2.0
last_modified: 2026-05-14
source_files:
  - src/features/NewPreasureOCRMedition/containers/WristInstructions/index.js
spec_file: tests/specs/tabs/devices.spec.js
page_object: src/pages/tabs/DevicesPage.js
---

# [Devices] Wrist Instructions — v3.2.0

> Pantalla de instrucciones para medir la presión arterial con tensiómetro de muñeca. Indica la posición correcta del dispositivo antes de iniciar la medición por Bluetooth.

---

## Acceso

- **Desde:** Devices → SelectDeviceType → BloodPressureDevices → tap "Tensiómetro de muñeca" → LinkPreasureDeviceIntro → (ConnectBluetoothDevice o AddNewBluetoodDevice) → WristInstructions
- **También:** `NewBluetoothMedition` con flag `isWrist: true` puede redirigir a esta pantalla
- **Prerequisito:** tensiómetro de muñeca previamente vinculado o en proceso de vinculación
- **Retorna a:** pantalla anterior (botón atrás)

---

## Elementos de UI

| Elemento | Tipo | Notas |
|----------|------|-------|
| Header | título "Conexión de balanza" + botón atrás | **Nota:** título incorrecto (dice "balanza", debería decir "muñeca") — bug cosmético en v3.2.0 |
| Instrucción central | Text `primary.600` | "Coloca el tensiómetro en tu muñeca y mantenla a la altura del corazón para una medición precisa." |
| Indications | componente | ilustración/indicaciones visuales (sección Indications) |
| Botón "Registrar medición" | tamaño lg, `colorScheme primary` | inicia flow Bluetooth |

---

## Comportamiento funcional

| Acción | Resultado |
|--------|-----------|
| Tap "Registrar medición" | `dispatch(initFlow(...))` → `enableBluetooth()` → si éxito: `navigate('NewBluetoothMedition', { isBluetoothEnabled: true, isWrist: true })` |
| Bluetooth deshabilitado | `navigate('NewBluetoothMedition', { isBluetoothEnabled: false, isWrist: true })` |
| Bluetooth sin permiso | `showAlert('Permita que Femmto use la conexión bluetooth', ...)` con botón "Configuración" → `openAppSettings()` |
| Tap atrás | `navigation.goBack()` |

---

## StatusBar

`useStatusBarColorOnFocus(theme.colors.white)` — fondo blanco en esta pantalla.

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.2.0 | Introducida | Instrucciones para tensiómetro de muñeca + flow BLE con isWrist |
