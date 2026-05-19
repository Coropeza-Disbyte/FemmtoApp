---
version: 3.2.0
screen: blood-pressure-devices
risk_level: low
since: 3.2.0
last_modified: 2026-05-14
source_files:
  - src/features/Devices/containers/BloodPressureDevices/index.js
spec_file: tests/specs/tabs/devices.spec.js
page_object: src/pages/tabs/DevicesPage.js
---

# [Devices] Blood Pressure Devices — v3.2.0

> Pantalla intermedia que permite seleccionar el tipo de tensiómetro a vincular: de brazo o de muñeca. Se inserta entre SelectDeviceType y LinkPreasureDeviceIntro en el flow de Dispositivos.

---

## Acceso

- **Desde:** Devices → SelectDeviceType → tap "Tensiómetro"
- **Prerequisito:** usuario autenticado, tab Dispositivos
- **Retorna a:** SelectDeviceType (botón atrás)

---

## Cambio en el flow v3.2.0

En v3.1.0, tap "Tensiómetro" en SelectDeviceType navegaba directamente a `LinkPreasureDeviceIntro`. En v3.2.0, agrega una pantalla intermedia:

```
SelectDeviceType → BloodPressureDevices → LinkPreasureDeviceIntro (isWrist: false)
                                        → LinkPreasureDeviceIntro (isWrist: true)
```

---

## Elementos de UI

| Elemento | Tipo | Notas |
|----------|------|-------|
| Header | título "Nueva medición" + botón atrás | |
| Título sección | Text | "Tensiómetros" — `fontWeight 600`, `color neutral.600`, `fontSize xl` |
| DeviceOption brazo | `deviceType="armPressureMonitor"` | "Tensiómetro de brazo" |
| DeviceOption muñeca | `deviceType="wristPressureMonitor"` | "Tensiómetro de muñeca" |

---

## Comportamiento funcional

| Acción | Resultado |
|--------|-----------|
| Tap "Tensiómetro de brazo" | `navigate('LinkPreasureDeviceIntro', { isWrist: false })` |
| Tap "Tensiómetro de muñeca" | `navigate('LinkPreasureDeviceIntro', { isWrist: true })` |
| Tap atrás | `navigation.goBack()` → vuelve a SelectDeviceType |

El parámetro `isWrist` controla el flow posterior: `false` → flow arm estándar; `true` → flow con WristInstructions.

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.2.0 | Introducida | Selector brazo / muñeca antes de LinkPreasureDeviceIntro |
