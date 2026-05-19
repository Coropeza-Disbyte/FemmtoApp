---
version: 3.6.0
last_modified: 2026-05-14
type: release-summary
---

# Release Summary — v3.6.0

## Cambios respecto a v3.5.0

| Área | Tipo | Descripción |
|------|------|-------------|
| Welcome (HaveAccount) | Nueva pantalla | Pantalla de entrada pre-login: "Ingresar por primera vez" / "Ya tengo una cuenta" |
| MeetUser | Nueva feature | Flow de onboarding: Greeting → Instructions → Questions (4 pasos) → NotificationPermission |
| NotificationPermission | Nueva pantalla | Solicitud de permisos de notificación como paso del onboarding (en SignInSignUp) |
| FirstMeasure | Nueva feature | Primera medición guiada durante onboarding: selección contextual por targets del usuario |
| SaveOnboardingProgress | Nueva feature | Registro de cuenta multi-step (Email, Nombre, Fecha, Género, Peso, Altura, Foto, Contraseña) |
| SignInSignUp | Refactorizado | Ahora es el entry point del onboarding completo; `HaveAccount` reemplaza `LogIn` como ruta inicial |
| Profile | Modificado | Nuevo screen `EditTargets` para cambiar objetivos de salud desde el perfil |
| TabNavigator | Modificado | Nuevo orden de tabs: Home / Dispositivos / Medición / Alarmas / Compartir (antes: Home / Compartir / Medición / Dispositivos / Alarmas) |
| NewPreasureOCRMedition | Modificado | Soporte de params `isOnboarding` + `isBluetoothMeasure`; nuevos screens `InstructionsWithSteps` y `OnboardingMeasureSuccess` |
| NewScaleMedition | Modificado | Soporte de params `isOnboarding` + `isBluetoothMeasure`; nuevo screen `OnboardingMeasureSuccess` |
| NewGlucometerMedition | Modificado | Soporte de params `isOnboarding` + `isBluetoothMeasure`; nuevo screen `OnboardingMeasureSuccess` |
| Home | Modificado | Agrega ruta `MeetUserQuestions` (con `completeProfile: true`) para usuarios existentes que no completaron el perfil |

## Pantallas nuevas (documentadas en esta versión)

- [welcome.md](screens/welcome.md) — Pantalla de entrada HaveAccount
- [meet-user.md](screens/meet-user.md) — Onboarding: cuestionario de objetivos y perfil
- [notification-permission.md](screens/notification-permission.md) — Paso de permisos de notificación en onboarding
- [first-measure.md](screens/first-measure.md) — Primera medición guiada del onboarding
- [save-onboarding-progress.md](screens/save-onboarding-progress.md) — Creación de cuenta multi-step

## Pantallas sin cambios

Reminders, Bluetooth Glucometer, Glucometer Medition, Glucose Details, Glucose History, Weight, Presure, HeartRate, Steps, Metabolism permanecen iguales a su última versión documentada.
