---
version: 3.1.0
screen: signup
risk_level: high
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/SignInSignUp/containers/SignUp/index.js
spec_file: tests/specs/auth/signup.spec.js
page_object: src/pages/auth/SignUpPage.js
---

# [Auth] Sign Up Screen — v3.1.0

> Pantalla de registro de nuevo usuario. Permite crear cuenta con email/contraseña o mediante proveedores sociales (Google / Apple en iOS).

---

## Acceso

- **Desde:** Login → tap "Registrarse"
- **Prerequisito:** ninguno
- **Retorna a:** Login (botón atrás absoluto)

---

## Elementos de UI

| Elemento | Tipo | Texto visible / Label | Notas |
|----------|------|----------------------|-------|
| Botón atrás | botón absoluto (AbsoluteBackButton) | ← | vuelve al Login |
| Campo email | input texto | — | teclado email, validación formato |
| Campo nombre | input texto | — | nombre del usuario |
| Campo contraseña | input password | — | texto oculto |
| Campo confirmar contraseña | input password | — | texto oculto; valida que coincida |
| Checkbox T&C | checkbox | texto con link a Política de Privacidad | el botón de registro queda deshabilitado si no está marcado |
| Link política de privacidad | link inline | texto que abre WebBrowser | abre `PRIVACY_POLICES_URL` |
| Botón registrarse | botón primario | "Registrarse" (o similar) | deshabilitado si checkbox no está marcado |
| Botón Google | botón social | "Continuar con Google" | disponible iOS y Android |
| Botón Apple | botón social | "Continuar con Apple" | solo iOS |

---

## Comportamiento funcional

### Registro con email y contraseña

1. Usuario completa los 4 campos
2. Acepta términos y condiciones (checkbox)
3. Presiona registrarse
4. Si éxito → navega al Onboarding
5. Si error → toast de error

### Validación de contraseñas

- Al salir del campo "confirmar contraseña" (`onRetryPasswordBlur`) se comparan ambas contraseñas
- Si no coinciden → error inline: "Las claves no coinciden."

### Flujo social

- Igual que en Login: Google (iOS + Android) y Apple (solo iOS)
- Al completarse → navega al Onboarding o al Home según estado del perfil

---

## Validaciones

- Email: formato válido (`EMAIL_VALIDATOR`)
- Nombre: requerido
- Contraseña: requerida
- Confirmar contraseña: debe coincidir con contraseña
- Checkbox T&C: debe estar marcado para habilitar el botón de registro

---

## Edge cases documentados

- Si las contraseñas no coinciden se muestra error solo al perder el foco del segundo campo, no en tiempo real
- El botón de registro permanece deshabilitado si el checkbox no está marcado, aunque todos los campos sean válidos

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.1.0 | Baseline | Registro email/password + Google + Apple, validación de contraseñas y T&C |
