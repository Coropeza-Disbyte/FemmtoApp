---
version: 3.6.0
screen: first-measure
risk_level: high
since: 3.6.0
last_modified: 2026-05-14
source_files:
  - src/features/FirstMeasure/index.js
  - src/features/FirstMeasure/containers/Instructions/index.js
  - src/features/FirstMeasure/containers/BluetoothPermission/index.js
  - src/features/FirstMeasure/containers/SelectMeasureType/index.js
  - src/containers/OnboardingMeasureSuccess/index.js
spec_file: tests/specs/medition/newMedition.spec.js
page_object: src/pages/medition/FirstMeasurePage.js
---

# [Medición] FirstMeasure — Primera medición de onboarding — v3.6.0

> Flow de primera medición guiada durante el onboarding. El usuario elige medir vía Bluetooth o manualmente. La selección del tipo de medición es contextual: si el usuario tiene un único objetivo compatible, se navega directamente al tipo correspondiente; si tiene múltiples o un objetivo general, se muestra la pantalla de selección. Al completar la medición, avanza a OnboardingMeasureSuccess → SaveProgress (registro de cuenta).

---

## Acceso

- **Desde:** NotificationPermission → `FirstMeasure`
- **Prerequisito:** usuario completó MeetUser + permisos de notificación (paso puede haber sido salteado)
- **Retorna a:** NotificationPermission (botón atrás en Instructions)

---

## Stack del módulo

```
FirstMeasureNavigator
  ├── Instructions        ← ruta inicial
  ├── BluetoothPermission
  ├── SelectMeasureType
  ├── BloodPressureMeasure → NewPreasureOCRMeditionNavigator { isOnboarding: true }
  ├── WeightMeasure       → NewScaleMeditionNavigator { isOnboarding: true }
  └── GlucoseMeasure      → NewGlucometerMeditionNavigator { isOnboarding: true }
```

---

## Instructions — Pantalla inicial

| Elemento | Notas |
|----------|-------|
| Botón atrás | `chevron-back-icon.png` → `navigation.goBack()` |
| Fondo degradado | `#C7D6E9` → blanco |
| Botón "Usar Bluetooth" | → `BluetoothPermission` |
| Botón "Registrar manualmente" | lógica contextual por targets (ver tabla) |
| Botón "Saltar" | → `SaveProgress` directamente |

Analytics: `logOnboardingTrialMeasureScreenViewed()` en `useEffect`.
StatusBar: `useStatusBarColorOnFocus('#C7D6E9')`.

### Lógica de navegación manual (según `userTargets`)

| Condición | Destino |
|-----------|---------|
| `targets.length > 1` | `SelectMeasureType { isBluetoothMeasure: false }` |
| `control_general` ∈ targets | `SelectMeasureType { isBluetoothMeasure: false }` |
| `control_steps` ∈ targets | `SelectMeasureType { isBluetoothMeasure: false }` |
| `control_blood_pressure` o `control_heart_rate` ∈ targets (único) | `BloodPressureMeasure { isBluetoothMeasure: false }` |
| `control_weight` ∈ targets (único) | `WeightMeasure { isBluetoothMeasure: false }` |
| `control_glucose` ∈ targets (único) | `GlucoseMeasure { isBluetoothMeasure: false }` |
| fallback | `SelectMeasureType { isBluetoothMeasure: false }` |

---

## BluetoothPermission — Solicitud de Bluetooth

| Elemento | Notas |
|----------|-------|
| Botón atrás | → `navigation.goBack()` |
| Imagen | `bluetooth-permission-image.png` |
| Botón "Usar Bluetooth" | `dispatch(enableBluetooth(onSuccess, onFail))` |
| Botón "Continuar sin Bluetooth" | → `SelectMeasureType { isBluetoothMeasure: false }` |

### Lógica de éxito BT (igual que manual, con `isBluetoothMeasure: true`)

| Condición | Destino |
|-----------|---------|
| `targets.length > 1` / `control_general` / `control_steps` | `SelectMeasureType { isBluetoothMeasure: true }` |
| `control_blood_pressure` o `control_heart_rate` (único) | `BloodPressureMeasure { isBluetoothMeasure: true }` |
| `control_weight` (único) | `WeightMeasure { isBluetoothMeasure: true }` |
| `control_glucose` (único) | `GlucoseMeasure { isBluetoothMeasure: true }` |
| fallback | `SelectMeasureType { isBluetoothMeasure: true }` |

Analytics: `logOnboardingPermissionScreenViewed({ permission_type: 'bluetooth' })` al montar.
StatusBar: `useStatusBarColorOnFocus('#C7D6E9')`.

---

## SelectMeasureType — Selección de tipo de medición

Muestra 3 opciones (`DeviceCard`) cuando el usuario tiene múltiples targets.

| Opción | Destino |
|--------|---------|
| Tensiómetro / Presión arterial | `BloodPressureMeasure { isBluetoothMeasure }` |
| Balanza / Peso | `WeightMeasure { isBluetoothMeasure }` |
| Glucómetro | `GlucoseMeasure { isBluetoothMeasure }` |

`useFocusEffect` → `dispatch(disconnectCurrentDevice())` al enfocar.
StatusBar: `useStatusBarColorOnFocus('white')`.

---

## Medición embebida (isOnboarding: true)

Los navigators `NewPreasureOCRMedition`, `NewScaleMedition` y `NewGlucometerMedition` reciben `{ isOnboarding: true }` como `initialParams` y adaptan su comportamiento:

- **NewPreasureOCRMedition**: si `isOnboarding && !isBluetoothMeasure` → ruta inicial `OCRResults` (salta Introduction).
- **NewScaleMedition**: si `isOnboarding && !isBluetoothMeasure` → ruta inicial `ManualScaleMeasurement`; si `isOnboarding && isBluetoothMeasure` → `Introduction`.
- **NewGlucometerMedition**: si `isOnboarding && !isBluetoothMeasure` → ruta inicial `AddGlucoseMeasurement`; si `isOnboarding && isBluetoothMeasure` → `IntroductionGlucometerContainer`.

Al completar la medición en modo onboarding, todos navegan a `OnboardingMeasureSuccess`.

---

## OnboardingMeasureSuccess — Confirmación de medición

Pantalla de éxito post-medición en onboarding.

| Elemento | Notas |
|----------|-------|
| Imagen | `success-green-icon.png` |
| Fondo degradado | `#C7D6E9` → blanco |
| Botón | `"Continuar"` → `navigation.navigate('SaveProgress')` |

Params recibidos: `{ isBluetooth: bool, measureType: string }`.
Analytics: `logOnboardingTrialMeasureCompleted({ measure_method, measure_type })` en `useEffect`.
StatusBar: `useStatusBarColorOnFocus('#C7D6E9')`.

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.6.0 | Introducida | Primera medición guiada contextual por targets del usuario, dentro del onboarding |
