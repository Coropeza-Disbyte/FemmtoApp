---
version: 3.1.0
screen: devices
risk_level: high
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/Devices/containers/DeviceList/index.js
  - src/features/Devices/containers/SelectDeviceType/index.js
  - src/features/Devices/index.js
  - src/containers/LinkPreasureDeviceIntro/index.js
  - src/containers/ResetBluetooth/index.js
  - src/navigators/ConnectBluetoothDevice.js
spec_file: tests/specs/tabs/devices.spec.js
page_object: src/pages/tabs/DevicesPage.js
---

# [Devices] Dispositivos — v3.1.0

> Tab de gestión de dispositivos vinculados. Permite ver, agregar y conectar dispositivos Bluetooth (tensiómetros y balanzas). En v3.1.0 se incorpora soporte para la báscula BWS12.

---

## Acceso

- **Desde:** tab "Dispositivos" en el bottom nav
- **Prerequisito:** usuario autenticado; Bluetooth habilitado
- **Retorna a:** bottom nav

---

## DeviceList — Pantalla principal

| Elemento | Tipo | Notas |
|----------|------|-------|
| Lista de dispositivos vinculados | lista | muestra dispositivos ya emparejados por el usuario |
| Botón agregar dispositivo | botón o FAB | navega a SelectDeviceType |
| Estado vacío | mensaje | si no hay dispositivos vinculados |

---

## SelectDeviceType — Selección de tipo de dispositivo

| Elemento | Tipo | Texto visible | Destino |
|----------|------|---------------|---------|
| Opción Tensiómetro | ítem | "Tensiómetro" / "Monitor de Presión" | LinkPreasureDeviceIntro |
| Opción Balanza | ítem | "Balanza" | LinkScaleNavigator (LinkScale) |

---

## Flujo de vinculación de tensiómetro

1. `SelectDeviceType` → tap Tensiómetro → `LinkPreasureDeviceIntro`
2. `LinkPreasureDeviceIntro` → introduce el dispositivo al usuario → `ConnectBluetoothDevice`
3. `ConnectBluetoothDevice` → escanea y conecta el dispositivo Bluetooth → `BluetoothPreasureMeasureNavigator`
4. Al confirmar medición → `SuccessPreasureMeasurement`

## Flujo de vinculación de balanza (BWS12 y otras)

1. `SelectDeviceType` → tap Balanza → `LinkScaleNavigator`
2. Flujo de vinculación de balanza → `ScaleConnection`
3. Si éxito → `Success`; si error → `Error`

---

## ResetBluetooth

Pantalla de restablecimiento de conexión Bluetooth. Accesible si hay problemas de conectividad.

---

## Edge cases documentados

- Si Bluetooth está desactivado → se muestra prompt para habilitarlo antes de continuar
- Si el dispositivo ya está vinculado y vuelve a escanearse → comportamiento a verificar (duplicación o reutilización)
- `ScaleConnection` → `Error` usa los mismos containers de `NewScaleMedition`

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.1.0 | Baseline | DeviceList + SelectDeviceType + flujos de tensiómetro y balanza (incluye BWS12) |
| v3.2.0 | Modificado | Soporte para tensiómetros de muñeca |
| v3.4.0 | Renombrado | "Tensiómetros" → "Monitores de Presión" |
