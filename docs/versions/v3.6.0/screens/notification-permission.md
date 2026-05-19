---
version: 3.6.0
screen: notification-permission
risk_level: medium
since: 3.6.0
last_modified: 2026-05-14
source_files:
  - src/features/SignInSignUp/containers/NotificationPermission/index.js
spec_file: tests/specs/auth/signup.spec.js
page_object: src/pages/auth/NotificationPermissionPage.js
---

# [Auth] NotificationPermission — v3.6.0

> Pantalla de solicitud de permisos de notificación como paso del onboarding. Aparece después de que el usuario completa las 4 preguntas de MeetUser. Permite habilitar notificaciones o saltear el paso; en ambos casos avanza a FirstMeasure.

---

## Acceso

- **Desde:** MeetUser → Questions (paso 3, al finalizar, path nuevo usuario) → `NotificationPermission`
- **Prerequisito:** usuario completó las 4 preguntas de MeetUser
- **Retorna a:** Questions (botón atrás)

---

## Posición en el stack

```
SignInSignUpNavigator
  └── NotificationPermission   ← entre MeetUserQuestions y FirstMeasure
```

---

## Elementos de UI

| Elemento | Notas |
|----------|-------|
| Botón atrás | `chevron-back-icon.png` → `navigation.goBack()` |
| Imagen | `notification-image.png` (300×450px) |
| Texto título | `"Te ayudamos a sostener tu hábito de salud día a día."` — fontWeight 700, fontSize 18 |
| Texto descripción | `"Podrás configurar y recibir alertas cuando sea momento de medir..."` |
| Botón principal | `"Recibir notificaciones"` — colorScheme primary |
| Botón secundario | `"Ahora no"` — bg `#CEDFF4`, text color `primary.700` |

### StatusBar

`useStatusBarColorOnFocus('#C7D6E9')`.

---

## Lógica de permisos

| Acción | Lógica | Destino |
|--------|--------|---------|
| "Recibir notificaciones" | `dispatch(requestPermissions(onSuccess, onError))` | `FirstMeasure` (siempre, independiente del resultado) |
| "Ahora no" | skip directo | `FirstMeasure` |
| Resultado del sistema | `logOnboardingPermissionSystemResult({ permission_status })` | — |

### Analytics

| Evento | Cuándo |
|--------|--------|
| `logOnboardingPermissionScreenViewed({ permission_type: 'notifications' })` | `useEffect` al montar |
| `logOnboardingPermissionScreenGrantClicked(...)` | tap "Recibir notificaciones" |
| `logOnboardingPermissionScreenDeniedClicked(...)` | tap "Ahora no" |
| `logOnboardingPermissionSystemResult({ permission_status })` | callback de éxito o error |

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.6.0 | Introducida | Paso de permisos de notificación dentro del onboarding (SignInSignUp) |
