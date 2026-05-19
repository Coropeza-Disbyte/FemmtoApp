---
version: 3.5.0
screen: new-glucometer-medition
risk_level: high
since: 3.3.0
last_modified: 2026-05-14
source_files:
  - src/features/NewGlucometerMedition/index.tsx
  - src/features/NewGlucometerMedition/containers/Introduction/index.tsx
  - src/features/NewGlucometerMedition/containers/Introduction/sections/Buttons/index.js
  - src/features/NewGlucometerMedition/containers/Success/index.tsx
  - src/navigators/ConnectGlucometerBluetoothDevice.js
  - src/navigators/SearchLinkedGlucometerBluetoothDevice.js
  - src/features/BluetoothGlucometerMeasure/index.js
spec_file: tests/specs/medition/newMedition.spec.js
page_object: src/pages/medition/NewGlucometerPage.js
---

# [Medición] Glucómetro — Nueva medición — v3.5.0

> Flow completo de nueva medición de glucosa en sangre. Refactorizado en v3.5.0 para incluir medición Bluetooth con glucómetros Vivachek y CGH25. Soporta dos métodos: Bluetooth (con búsqueda automática del dispositivo vinculado o vinculación de uno nuevo) y Manual.

---

## Acceso

- **Desde:** Tab Medición → tap "Glucómetro" en NewMedition
- **Prerequisito:** usuario autenticado
- **Retorna a:** Tab Medición (botón atrás en Introduction)

---

## Stack completo del módulo (v3.5.0)

```
NewGlucometerMeditionNavigator
  ├── IntroductionGlucometerContainer  ← pantalla inicial (entry point)
  ├── AddGlucoseMeasurement            ← ManualGlucometerMeasurement (medición manual / edición)
  ├── Success                          ← confirmación post-medición
  ├── AddNewGlucometerBluetoodDevice   ← ConnectGlucometerBluetoothDevice (vincular nuevo)
  ├── SearchLinkedGlucometerBluetoothDevice ← buscar dispositivo vinculado [NUEVO v3.5.0]
  └── NewGlucometerBluetoothMedition   ← BluetoothGlucometerMeasureNavigator [NUEVO v3.5.0]
```

**Cambio respecto a v3.4.0:** en v3.4.0 el navigator solo tenía `Introduction → AddGlucoseMeasurement → Success`. En v3.5.0 se agregaron los flows de BT.

---

## IntroductionGlucometerContainer — Pantalla inicial

### Header dinámico

| Condición | Título |
|-----------|--------|
| `glucometerDevices.length === 0` (sin dispositivo vinculado) | "Vincula tu glucómetro" |
| Con dispositivo vinculado | "Nueva medición" |

### Elementos de UI

| Elemento | Notas |
|----------|-------|
| Imagen | `glucometer-connection.png` |
| InstructionBadge "Bluetooth activado" | ícono bluetooth |
| InstructionBadge "Glucómetro encendido" | ícono power |
| Sección "Prepara tu conexión" | color `neutral.700` |
| Botones | ver tabla abajo |

### StatusBar

`useStatusBarColorOnFocus('white')`.

### Botones (sección Buttons)

| Botón | Label | Condición | Acción |
|-------|-------|-----------|--------|
| Principal | "Vincular glucómetro" | `shouldLinkGlucometer = true` | `enableBluetooth` → `AddNewGlucometerBluetoodDevice` |
| Principal | "Medición inalámbrica" | tiene dispositivo vinculado | `initFlow` → `enableBluetooth` → `SearchLinkedGlucometerBluetoothDevice` |
| Secundario | "Registrar manualmente" | siempre | `initFlow` → `AddGlucoseMeasurement` |

### Flujo BT — detalle

```
"Medición inalámbrica":
  enableBluetooth(
    onSuccess → SearchLinkedGlucometerBluetoothDevice { isBluetoothEnabled: true }
    onFail:
      BluetoothUnauthorized → showAlert → openAppSettings
      else → SearchLinkedGlucometerBluetoothDevice { isBluetoothEnabled: false }
  )

"Vincular glucómetro":
  enableBluetooth(
    onSuccess → loadBluetoothState → AddNewGlucometerBluetoodDevice { isBluetoothEnabled: true/false }
    onFail: showAlert → openAppSettings
  )
```

---

## SearchLinkedGlucometerBluetoothDevice — Búsqueda de dispositivo vinculado [NUEVO v3.5.0]

Sub-navigator que busca automáticamente el glucómetro previamente vinculado.

### Initial route

| Param `isBluetoothEnabled` | Ruta inicial |
|----------------------------|--------------|
| `true` | `SearchLinkedBluetoothDeviceIntro` |
| `false` / ausente | `CheckBluetooth` |

### Sub-pantallas

| Pantalla | Descripción |
|----------|-------------|
| `CheckBluetooth` | Verifica BT. Param `redirectRoute="SearchLinkedBluetoothDeviceIntro"`, `title="Nueva medición"` |
| `SearchLinkedBluetoothDeviceIntro` | `GlucometerBluetoothDeviceSearchIntroContainer` — animación Lottie BLE scan |
| `BluetoothDeviceSearchSuccess` | `GlucometerBluetoothDeviceSearchSuccessContainer` — dispositivo encontrado. Transición: fade |
| `BluetoothDeviceSearchFail` | `BluetoothDeviceSearchFailContainer` — ErrorView si no se encontró |

Al encontrar el dispositivo → `BluetoothDeviceSearchSuccess` → navega a `NewGlucometerBluetoothMedition` con `isBluetoothEnabled: true`.

---

## ConnectGlucometerBluetoothDevice — Vincular nuevo glucómetro [NUEVO v3.5.0]

Sub-navigator para vincular un glucómetro nuevo (primera vez).

### Initial route

| Param `isBluetoothEnabled` | Ruta inicial |
|----------------------------|--------------|
| `true` | `BluethoodDeviceConectionIntro` |
| `false` / ausente | `CheckBluetooth` |

### Sub-pantallas

| Pantalla | Descripción |
|----------|-------------|
| `CheckBluetooth` | Verifica BT. `redirectRoute="BluethoodDeviceConectionIntro"`, `title="Nuevo dispositivo"` |
| `BluethoodDeviceConectionIntro` | `GlucometerBluethoodDeviceConectionIntroContainer` — instrucciones de vinculación |
| `BluetoothDeviceSuccessConnected` | `GlucometerBluetoothDeviceConnectionSuccessContainer` — vinculación exitosa. Transición: fade |
| `BluetoothDeviceConnectionFail` | `BluetoothDeviceConnectionFailContainer` — error de vinculación |

---

## NewGlucometerBluetoothMedition — Medición BT [NUEVO v3.5.0]

`BluetoothGlucometerMeasureNavigator`. Ver [bluetooth-glucometer-measure.md](bluetooth-glucometer-measure.md) para especificación completa.

---

## Success — Confirmación

| Elemento | Notas |
|----------|-------|
| Componente | `SuccessScreen` con `title="Medición registrada correctamente"` |
| StatusBar | `theme.colors.primary[500]` al enfocar; resetea al salir |
| Navegación | Auto-redirect a Home en 2 000 ms via `CommonActions.reset` |
| Back handler | `useBackHandler` → intercepta botón atrás → redirige a Home |

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.3.0 | Baseline | Introduction + Manual (AddGlucoseMeasurement) + Success |
| v3.5.0 | Refactorizado | Integración BT: SearchLinkedGlucometer, ConnectGlucometer, BluetoothGlucometerMeasure |
