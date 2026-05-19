---
version: 3.6.0
screen: save-onboarding-progress
risk_level: high
since: 3.6.0
last_modified: 2026-05-14
source_files:
  - src/features/SaveOnboardingProgress/index.js
  - src/features/SaveOnboardingProgress/containers/FirstMessage/index.js
  - src/features/SaveOnboardingProgress/containers/UserForms/index.js
  - src/features/SaveOnboardingProgress/containers/UserForms/sections/Email/index.js
  - src/features/SaveOnboardingProgress/containers/UserForms/sections/Name/index.js
  - src/features/SaveOnboardingProgress/containers/UserForms/sections/BirthDate/index.js
  - src/features/SaveOnboardingProgress/containers/UserForms/sections/Gender/index.js
  - src/features/SaveOnboardingProgress/containers/UserForms/sections/Weight/index.js
  - src/features/SaveOnboardingProgress/containers/UserForms/sections/Height/index.js
  - src/features/SaveOnboardingProgress/containers/UserForms/sections/ProfilePicture/index.js
  - src/features/SaveOnboardingProgress/containers/UserForms/sections/Password/index.js
spec_file: tests/specs/auth/saveOnboardingProgress.spec.js
page_object: src/pages/auth/SaveOnboardingProgressPage.js
---

# [Auth] SaveOnboardingProgress — Registro de cuenta — v3.6.0

> Flow de creación de cuenta al finalizar el onboarding. Consiste en dos pantallas: un mensaje motivacional para continuar y un formulario multi-step con react-hook-form que recopila los datos necesarios para crear la cuenta. Al completar el formulario, se despacha `doOnboarding` y el usuario queda registrado.

---

## Acceso

- **Desde:** OnboardingMeasureSuccess → "Continuar" → `SaveProgress` (en SignInSignUpNavigator)
- **Prerequisito:** usuario completó MeetUser + FirstMeasure
- **Retorna a:** OnboardingMeasureSuccess (botón atrás en FirstMessage)

---

## Stack del módulo

```
SaveOnboardingProgressNavigator
  ├── FirstMessage   ← ruta inicial
  └── UserForms      ← formulario multi-step
```

---

## FirstMessage — Mensaje motivacional

| Elemento | Notas |
|----------|-------|
| Fondo degradado | `#C7D6E9` → blanco |
| Texto título | `"No pierdas tu progreso."` — fontWeight 600, fontSize 24 |
| Texto subtítulo | `"Vamos a terminar de crear tu perfil."` |
| Botón | `"Continuar"` → `logSignUpStarted()` → `UserForms` |

StatusBar: `useStatusBarColorOnFocus('#C7D6E9')`.

---

## UserForms — Formulario multi-step

Gestiona todos los campos con `react-hook-form` y avanza entre secciones con `RemovableView`. Stepper visual (`FormStepper`) en el header.

### Steps del formulario

Los steps se filtran dinámicamente según si el usuario es un Provider User (Google/Apple):

| Step ID | Campo | Omitido si |
|---------|-------|-----------|
| `email` | Email | nunca |
| `name` | Nombre | `isProviderUser && displayName existe` |
| `birthdate` | Fecha de nacimiento | nunca |
| `gender` | Género | nunca |
| `weight` | Peso | nunca |
| `height` | Altura | nunca |
| `picture` | Foto de perfil | nunca |
| `password` | Contraseña | `isProviderUser` |

### Valores del formulario

| Campo | Tipo | Default |
|-------|------|---------|
| `email` | string | `''` |
| `name` | string | `''` |
| `birthdate` | date | `null` |
| `gender` | string | `null` |
| `weight` | number | `null` |
| `height` | number | `null` |
| `picture` | any | `null` |
| `password` / `retryPassword` | string | `''` |

### Navegación interna

- Botón "Continuar" (único para todos los steps) — deshabilitado si el step actual no está completo.
- Botón atrás (imagen `chevron-left-icon.png`) — en step 0 → `navigation.goBack()`; en steps > 0 → retrocede un step.

### Aceptación de términos

Campos `isTermAccepted` e `isPrivacyPolicyAccepted` (probablemente en step de email o password — exacta posición en secciones individuales).

### Submit final

`dispatch(doOnboarding(...))` con todos los datos del formulario.

Analytics:
- `logSignUpStep(...)` — al avanzar cada step
- `logSignUp(...)` — al completar el formulario
- `logOnboardingComplete(...)` — al finalizar

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.6.0 | Introducida | Formulario de registro multi-step al final del onboarding (reemplaza el signup clásico) |
