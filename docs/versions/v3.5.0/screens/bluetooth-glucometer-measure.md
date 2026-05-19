---
version: 3.5.0
screen: bluetooth-glucometer-measure
risk_level: high
since: 3.5.0
last_modified: 2026-05-14
source_files:
  - src/features/BluetoothGlucometerMeasure/index.js
  - src/features/BluetoothGlucometerMeasure/containers/Conecting/index.js
  - src/containers/GlucometerBluetoothScanMedition/index.js
---

# [Medición] Glucómetro BT — Medición — v3.5.0

> Sub-navigator que gestiona la medición de glucosa via Bluetooth para glucómetros Vivachek (VGM27) y CGH25. Muestra un stepper de 5 estados con instrucciones contextuales por estado. Al completar la medición muestra un resumen antes de navegar a Success.

---

## Acceso

- **Desde:** NewGlucometerMedition → `NewGlucometerBluetoothMedition` (vía `SearchLinkedGlucometerBluetoothDevice`)
- **Prerequisito:** dispositivo glucómetro vinculado; Bluetooth activo
- **Retorna a:** Home (al finalizar) o goBack (botón Salir)

---

## Stack del módulo

```
BluetoothGlucometerMeasureNavigator
  ├── CheckBluetoothMedition   ← inicial si isBluetoothEnabled = false
  └── BluetoothScanMedition    ← inicial si isBluetoothEnabled = true (GlucometerBluetoothScanMedition)
        └── BluetoothDeviceMeasureFail  ← en caso de error (ErrorView)
```

### Initial route

| Param `isBluetoothEnabled` | Ruta inicial |
|----------------------------|--------------|
| `true` | `BluetoothScanMedition` |
| `false` / ausente | `CheckBluetoothMedition` |

---

## CheckBluetoothMedition

Componente compartido con presión. Verifica y activa BT. Params: `redirectRoute="BluetoothScanMedition"`, `title="Nueva medición"`.

---

## BluetoothScanMedition — Pantalla principal de medición

Componente `GlucometerBluetoothScanMeditionContainer`. Gestiona todo el ciclo de medición BT del glucómetro.

### StatusBar

`useStatusBarColorOnFocus('white')`.

### Keep Awake

`activateKeepAwakeAsync()` al enfocar; `deactivateKeepAwake()` al perder foco o antes de eliminar.

### Imagen del dispositivo

| Modelo | Imagen |
|--------|--------|
| `device.model === 'Vivachek'` | `VGM27.png` |
| Default (CGH25) | `CGH25.png` |

La imagen se toma de `bluetoothGlucometerMeasureReducer.device`.

### Estados de medición (measurementStatus)

| Estado | Código | Descripción |
|--------|--------|-------------|
| `IDLE` | 0 | Inactivo |
| `CONNECTING` | 1 | Conectando — Lottie `bluetooth.json` + imagen dispositivo + texto "Conectando dispositivo" |
| `CONNECTED` | 2 | Conectado — `TestStripAnimation` + texto "Inserte la tira reactiva" |
| `STRIP_INSERTED` | 3 | Tira insertada — `TestStripAnimation` + texto "Inserte la tira reactiva" |
| `WAITING_FOR_BLOOD` | 4 | Esperando sangre — `BloodAnimation` + texto "Coloca la sangre en la tira" |
| `MEASURING` | 5 | Midiendo — Lottie `getting-data.json` + texto "Realizando medición..." |
| `COMPLETED` | 6 | Completado — muestra `ResumeContainer` con el valor de glucosa |
| `ERROR` | 7 | Error — navega a `BluetoothDeviceMeasureFail` |
| `DISCONNECTED` | 8 | Desconectado |

El estado solo avanza (nunca retrocede): `getStatusCode(measurementStatus) > getStatusCode(status)`.

### MeasureStepper

Barra de progreso de 5 posiciones mapeadas desde el estado:

| Posición | Estados |
|----------|---------|
| 0 | IDLE, CONNECTING |
| 1 | CONNECTED, STRIP_INSERTED |
| 2 | WAITING_FOR_BLOOD |
| 3 | MEASURING |
| 4 | COMPLETED |

### ResumeContainer (al completar)

Muestra el valor de glucosa obtenido. Botones:
- "Guardar" → `StackActions.replace('Success')`
- "Volver" → `onBackPress()` (detiene operación + goBack)
- "Descartar" → `CommonActions.reset({ routes: [{ name: 'Home' }] })`

### Botones contextuales

| Botón | Visible cuando | Acción |
|-------|---------------|--------|
| "Continuar" | CONNECTED o STRIP_INSERTED (avance manual) | Avanza estado manualmente |
| "Salir" | IDLE..WAITING (no en MEASURING/COMPLETED/ERROR) | `stopOperation()` + goBack |

### Manejo de errores → BluetoothDeviceMeasureFail

| Condición | Título | Razón |
|-----------|--------|-------|
| `TIMEOUT` (message) | "No se completó la medición" | Verifica dispositivo encendido, alcance, icono BT parpadeando |
| `OperationTimedOut` | "No se completó la medición" | Verifica dispositivo encendido y alcance |
| `DeviceDisconnected` | "El monitor de presión se desconectó" | Asegúrate que esté encendido y en alcance |
| `BluetoothPoweredOff` | "Activa el Bluetooth" | Necesario para conectar |
| `ScanStartFailed` | "No pudimos detectar el dispositivo" | Verifica encendido y batería |
| Default | "Inténtalo de nuevo" | Error genérico con código |

> Nota: `OperationCancelled` (sin TIMEOUT) es ignorado silenciosamente.

### Conexión BT

`useGlucometerBLEX(bleManager)` hook. Callbacks: `onMeditionTaken(result)` → llama `stopOperation()` + guarda valor; `onError(error, currentStatus)` → clasifica error y navega a `BluetoothDeviceMeasureFail`.

---

## BluetoothDeviceMeasureFail

`ErrorView` genérico. Props: `title` + `reason` desde `route.params`. Botón atrás → `navigation.goBack()`.

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.5.0 | Introducida | Flow BT Vivachek / CGH25 con stepper de estados |
