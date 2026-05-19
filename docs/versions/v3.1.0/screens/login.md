---
version: 3.1.0
screen: login
risk_level: high
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/SignInSignUp/containers/LogIn/index.js
  - src/features/SignInSignUp/containers/LogIn/sections/Form/index.js
spec_file: tests/specs/auth/login.spec.js
page_object: src/pages/auth/LoginPage.js
---

# [Auth] Login Screen — v3.1.0

> Pantalla inicial del flujo de autenticación. Permite ingresar con email/contraseña o con cuenta social (Google / Apple en iOS). Es la primera pantalla que ve el usuario no autenticado.

---

## Acceso

- **Desde:** arranque de la app (usuario no autenticado)
- **Prerequisito:** ninguno
- **Retorna a:** no aplica (es el root del stack auth)

---

## Elementos de UI

| Elemento | Tipo | Texto visible / Label | Notas |
|----------|------|----------------------|-------|
| Imagen de fondo | imagen decorativa | — | ocupa la parte superior de la pantalla |
| Campo email | input texto | placeholder vacío | teclado email, validación formato |
| Campo contraseña | input password | placeholder vacío | texto oculto |
| Botón "Olvidé mi contraseña" | link/botón secundario | "Olvidé mi contraseña" | navega a ResetPassword |
| Botón ingresar | botón primario | "Ingresar" (o similar) | ejecuta doSignIn |
| Botón Google | botón social | "Continuar con Google" | visible en iOS y Android |
| Botón Apple | botón social | "Continuar con Apple" | solo visible en iOS |
| Link registro | texto/link | "Registrarse" (o similar) | navega a SignUp |

---

## Comportamiento funcional

### Login con email y contraseña

1. Usuario ingresa email y contraseña
2. Presiona botón de ingresar
3. Si las credenciales son correctas → navega al Home (o Onboarding si el perfil está incompleto)
4. Si hay error → se muestra toast: "Comprueba que has introducido mail y contraseña correctos"

### Login social

- **Google:** disponible en iOS y Android — abre el flujo de autenticación de Google
- **Apple:** solo visible en iOS — abre el flujo de Sign in with Apple
- Al completarse el flujo social exitosamente → navega al Home o Onboarding

### Navegación

| Acción | Destino |
|--------|---------|
| Tap "Olvidé mi contraseña" | ResetPassword |
| Tap "Registrarse" | SignUp |
| Login exitoso | Home (si perfil completo) / Onboarding (si perfil incompleto) |

---

## Validaciones

- Email debe tener formato válido (validado por `EMAIL_VALIDATOR`)
- Contraseña requerida (no vacía)
- Botón de ingresar deshabilitado mientras los campos no cumplen validación (comportamiento del form)

---

## Edge cases documentados

- Si el usuario se registró con Google e intenta hacer reset de contraseña → error: "Te has registrado con tu usuario Google"
- Si el usuario se registró con Apple e intenta login email/password → error equivalente
- Estado del StatusBar: color primario `theme.colors.primary[100]` en esta pantalla

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.1.0 | Baseline | Login con email/password + Google + Apple (iOS) |
