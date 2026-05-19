---
version: 3.3.0
screen: presure-ocr-medition
risk_level: high
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/NewPreasureOCRMedition/index.js
  - src/features/NewPreasureOCRMedition/containers/Introduction/index.js
  - src/features/NewPreasureOCRMedition/containers/Introduction/sections/Buttons/index.js
  - src/features/NewPreasureOCRMedition/containers/Instructions/index.js
  - src/features/NewPreasureOCRMedition/containers/IntroductionPair/index.js
  - src/features/NewPreasureOCRMedition/containers/OCRCamera/index.js
  - src/navigators/SearchLinkedBluetoothDevice.js
  - src/containers/BluetoothDeviceSearchIntro/index.js
  - src/containers/BluetoothDeviceSearchSuccess/index.js
  - src/containers/BluetoothDeviceSearchFail/index.js
  - src/containers/BluetoothDeviceMeasureFail/index.js
  - src/features/BluetoothPreasureMeasure/index.js
spec_file: tests/specs/medition/newMedition.spec.js
page_object: src/pages/medition/NewPresurePage.js
---

# [Medición] Presión Arterial OCR — v3.3.0

> Flow completo de medición de presión arterial. Refactorizado en v3.3.0 para soportar video instrucciones por tipo de dispositivo, búsqueda automática de dispositivo BT vinculado, y pantalla de error genérica. Mantiene los 3 métodos de medición: Bluetooth, OCR (scan), Manual.

---

## Acceso

- **Desde:** Tab Medición → tap "Tensiómetro" en NewMedition
- **Prerequisito:** usuario autenticado
- **Retorna a:** Tab Medición (botón atrás en Introduction)

---

## Stack completo del módulo (v3.3.0)

```
NewPreasureOCRMeditionNavigator
  ├── Introduction              ← pantalla inicial (entry point)
  ├── Instructions              ← [NUEVO v3.3.0] video instructivo
  ├── OCRCamera                 ← escaneo de pantalla del tensiómetro
  ├── OCRResults                ← resultado del OCR (también acepta entrada manual)
  ├── SuccessMeasurement        ← pantalla de éxito
  ├── AddSymptoms               ← agregar síntomas al resultado
  ├── NewBluetoothMedition      ← BluetoothPreasureMeasureNavigator
  │     ├── CheckBluetoothMedition
  │     ├── BluetoothScanMedition (Conecting — animación Lottie BT)
  │     ├── BluetoothDeviceMeasureFail
  │     └── AddSymptoms
  ├── AddNewBluetoodDevice      ← ConnectBluetoothDevice (vincular nuevo)
  ├── SearchLinkedBluetoothDevice ← [NUEVO v3.3.0] buscar dispositivo vinculado
  │     ├── CheckBluetooth
  │     ├── SearchLinkedBluetoothDeviceIntro  ← animación búsqueda BLE
  │     ├── BluetoothDeviceSearchSuccess      ← dispositivo encontrado
  │     └── BluetoothDeviceSearchFail         ← dispositivo no encontrado (ErrorView)
  └── ErrorMessage              ← [NUEVO v3.3.0] BluetoothDeviceMeasureFail (ErrorView genérico)
```

---

## Introduction — Pantalla inicial

Pantalla de entrada al flow. Comportamiento dinámico según si el usuario tiene dispositivo vinculado.

### Header dinámico

| Condición | Título |
|-----------|--------|
| Sin tensiómetro vinculado (`presureMonitorsDevices.length === 0`) | "Vincula tu tensiómetro" |
| Con tensiómetro vinculado | "Nueva medición" |

### Elementos de UI

| Elemento | Notas |
|----------|-------|
| Imagen | `blood-pressure-monitor-connection.png` |
| InstructionBadge "Bluetooth activado" | ícono bluetooth |
| InstructionBadge "Tensiómetro encendido" | ícono power |
| Sección "Prepara tu conexión" | título `neutral.700` |
| Botones de acción | ver tabla abajo |

### Botones (sección Buttons)

| Botón | Label | Condición | Destino |
|-------|-------|-----------|---------|
| Principal | "Conectar tensiómetro" | `shouldLinkPreasureMonitor = true` | `AddNewBluetoodDevice` (vincular nuevo) |
| Principal | "Medición inalámbrica" | tiene dispositivo vinculado | `SearchLinkedBluetoothDevice` |
| Secundario | "Registrar manualmente" | siempre | `OCRResults (isManual: true)` |
| Terciario | "Escanear pantalla" | Android only | Modal de indicaciones → `OCRCamera` |

### Modal "Escanear pantalla" (Android)

Antes de abrir OCRCamera, muestra `TooltipModal` con recomendaciones:
1. Cámara y pantalla del tensiómetro alineadas
2. Buena iluminación
3. Sin reflejos ni sombras
4. Buena conexión a internet

Incluye checkbox "No volver a mostrar este diálogo." → `setShowIndications(!isSelected)` en store OCR.

### useFocusEffect

Al enfocar: `dispatch(disconnectCurrentDevice())` — desconecta dispositivo BT activo.

### Analytics

| Evento | Cuándo |
|--------|--------|
| `logStartMeasurement({ device_type: 'tensiometro', measure_method: 'ocr' })` | tap "Escanear pantalla" |
| `logStartMeasurement({ device_type: 'tensiometro', measure_method: 'manual' })` | tap "Registrar manualmente" |
| `logStartMeasurement({ device_type: 'tensiometro', measure_method: 'bluetooth' })` | inicia flow BT |

---

## Instructions — Video instructivo [NUEVO v3.3.0]

Pantalla de instrucciones en video antes de medir. El video se selecciona según el tipo de dispositivo vinculado.

### Selección de video (S3 AWS)

| Condición | Video URL |
|-----------|-----------|
| Dispositivo modelo `AH` | `s3.../Video+AIO.mp4` |
| Dispositivo con `isWrist: true` | `s3.../Muñeca+app.mp4` |
| Default (brazo estándar) | `s3.../Video+tensiometro+brazo.mp4` |

El video se lee de `bluetoothPreasureMeasureReducer.device`.

### Elementos de UI

| Elemento | Notas |
|----------|-------|
| WebView (video player) | HTML custom con `<video>` tag, `controlsList="nodownload"`, `disablePictureInPicture` |
| Botón atrás (overlay) | `Ionicons arrow-back-circle`, color white, sobre el video |
| Título "Forma correcta de uso" | `neutral.700`, `fontWeight 600` |
| InstructionBadge "2-3 cm encima del codo" | ícono arm |
| InstructionBadge "Altura del corazón" | ícono heart |
| Botón "Registrar medición" | inicia flow BT |

### Video player — comportamiento

- Reproducción embebida (`playsinline`, `webkit-playsinline`)
- Auto-captura el primer frame como poster (si no hay imagen preview)
- Sin descarga, sin Picture-in-Picture, sin menú contextual
- En iOS y Android

### Acción "Registrar medición"

```
dispatch(initFlow(...)) → enableBluetooth()
  → éxito: StackActions.replace('NewBluetoothMedition', { isBluetoothEnabled: true })
  → sin permiso BT: navigate('NewBluetoothMedition', { isBluetoothEnabled: false })
  → BT no autorizado: showAlert → openAppSettings()
```

---

## SearchLinkedBluetoothDevice — Búsqueda de dispositivo vinculado [NUEVO v3.3.0]

Sub-navigator que busca automáticamente el dispositivo BT previamente vinculado.

### Initial route

| Parámetro `isBluetoothEnabled` | Ruta inicial |
|-------------------------------|--------------|
| `true` | `SearchLinkedBluetoothDeviceIntro` |
| `false` / ausente | `CheckBluetooth` |

### Sub-pantallas

| Pantalla | Descripción |
|----------|-------------|
| `CheckBluetooth` | Verifica estado BT, solicita activación. Param `isSearch: true` |
| `SearchLinkedBluetoothDeviceIntro` | Animación Lottie `bluetooth-connection.json` mientras escanea BLE. Busca el dispositivo de `devicesReducer.presureMonitorsDevices`. Timeout → `BluetoothDeviceSearchFail` |
| `BluetoothDeviceSearchSuccess` | Dispositivo encontrado. StatusBar `#C7D6E9`. Imagen `blood-pressure-monitor-connection-success.png`. Botón "Registrar medición" → `StackActions.replace('NewBluetoothMedition', { isBluetoothEnabled: true })` |
| `BluetoothDeviceSearchFail` | `ErrorView` con `title` y `reason` desde `route.params`. Botón atrás → `goBack()` |

---

## BluetoothDeviceMeasureFail (ErrorMessage) — Error genérico [NUEVO v3.3.0]

Pantalla de error para fallos durante la medición BLE. Usa el componente `ErrorView`.

| Prop | Fuente |
|------|--------|
| `title` | `route.params.title` |
| `reason` | `route.params.reason` |

Botón atrás → `navigation.goBack()`.

---

## BluetoothPreasureMeasure — Sub-navigator de medición BT

Sin cambios estructurales respecto a v3.2.0. Initial route según `route.params.isBluetoothEnabled`.

| Pantalla | Descripción |
|----------|-------------|
| `CheckBluetoothMedition` | Verifica y activa BT |
| `BluetoothScanMedition` | Animación Lottie `bluetooth-scan-data.json`, título "CONECTANDO DISPOSITIVO" |
| `BluetoothDeviceMeasureFail` | Error de medición (`ErrorView`) |
| `AddSymptoms` | Agregar síntomas post-medición |

---

## Manejo de Bluetooth (errores comunes)

| Error | Mensaje | Acción |
|-------|---------|--------|
| Permisos no otorgados (`BluetoothUnauthorized`) | "Permita que Femmto use la conexión bluetooth" | Alert → "Configuración" → `openAppSettings()` |
| BT desactivado | Navega con `isBluetoothEnabled: false` | `CheckBluetooth` / `CheckBluetoothMedition` se encarga |
| Error de conexión genérico | `showAlert` en utils | Botón "Cerrar" |

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.0.1 | Baseline | Flow OCR básico: Introduction → OCR/Manual/BT |
| v3.3.0 | Refactorizado | Video instrucciones, SearchLinkedBluetoothDevice, ErrorMessage, analytics por método |
