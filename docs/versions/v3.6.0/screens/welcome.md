---
version: 3.6.0
screen: welcome
risk_level: high
since: 3.6.0
last_modified: 2026-05-14
source_files:
  - src/features/SignInSignUp/containers/HaveAccountContainer/index.js
spec_file: tests/specs/welcome/welcome.spec.js
page_object: src/pages/auth/WelcomePage.js
---

# [Auth] Welcome — v3.6.0

> Pantalla de entrada de la app para usuarios no autenticados. Introducida en v3.6.0 como nuevo primer paso del onboarding. Reemplaza el acceso directo al Login. Presenta dos rutas: nuevo usuario (inicia el onboarding completo) o usuario con cuenta existente (va al Login).

---

## Acceso

- **Desde:** arranque de la app (usuario no autenticado)
- **Prerequisito:** ninguno
- **Retorna a:** n/a (es la raíz del stack de auth)

---

## Posición en el stack

```
SignInSignUpNavigator
  └── HaveAccount   ← ruta inicial (este screen)
```

---

## Elementos de UI

| Elemento | Notas |
|----------|-------|
| Fondo degradado | `#C7D6E9` → `#FFFFFF` → `#FFFFFF` (LinearGradient) |
| Imagen logo app | `app-icon.png` (size="lg") |
| Texto | `"Tu salud, conectada."` — fontSize 20, color `dark.700` |
| Botón principal | `"Ingresar por primera vez"` — colorScheme `primary` |
| Botón secundario | `"Ya tengo una cuenta"` — bg `#CEDFF4`, text color `primary.700` |

### StatusBar

`useStatusBarColorOnFocus('#C7D6E9')`.

---

## Navegación

| Acción | Destino |
|--------|---------|
| "Ingresar por primera vez" | `MeetUserQuestions` (MeetUserNavigator) |
| "Ya tengo una cuenta" | `LogIn` |

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.6.0 | Introducida | Nueva pantalla de entrada pre-login como primer paso del onboarding |
