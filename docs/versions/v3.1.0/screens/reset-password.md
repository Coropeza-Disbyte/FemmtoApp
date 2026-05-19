---
version: 3.1.0
screen: reset-password
risk_level: medium
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/SignInSignUp/containers/ResetPassword/index.js
spec_file: tests/specs/auth/resetPassword.spec.js
page_object: src/pages/auth/ResetPasswordPage.js
---

# [Auth] Reset Password Screen — v3.1.0

> Pantalla de recuperación de contraseña. El usuario ingresa su email y recibe una nueva contraseña por correo.

---

## Acceso

- **Desde:** Login → tap "Olvidé mi contraseña"
- **Prerequisito:** ninguno
- **Retorna a:** Login (automático al éxito, o botón atrás en header)

---

## Elementos de UI

| Elemento | Tipo | Texto visible / Label | Notas |
|----------|------|----------------------|-------|
| Header | barra de navegación | título + botón atrás | usa componente `Header` estándar |
| Campo email | input texto | — | teclado email, validación formato |
| Botón enviar | botón primario | "Recuperar contraseña" (o similar) | dispara el reset |

---

## Comportamiento funcional

### Flujo exitoso

1. Usuario ingresa email registrado
2. Presiona botón de recuperación
3. Backend envía nueva contraseña al email
4. Se muestra toast de éxito: `"Enviamos tu nueva contraseña a {email}"`
5. Navega automáticamente de vuelta al Login

### Errores manejados

| Condición | Mensaje mostrado |
|-----------|-----------------|
| Email registrado con Google | "Te has registrado con tu usuario Google. Ingresa usando el login de Google." |
| Email registrado con Apple | "Te has registrado con tu usuario Apple. Ingresa usando el login de Apple." |
| Email no existe | "La dirección de correo electrónico ingresada no existe." |
| Error genérico | mensaje del servidor |

---

## Validaciones

- Email: formato válido (`EMAIL_VALIDATOR`)

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.1.0 | Baseline | Reset por email con manejo de errores por provider social |
