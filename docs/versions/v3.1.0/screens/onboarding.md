---
version: 3.1.0
screen: onboarding
risk_level: medium
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/OnBoarding/index.js
  - src/features/OnBoarding/containers/SetName/index.js
  - src/features/OnBoarding/containers/SetPicture/index.js
  - src/features/OnBoarding/containers/SetBirthdate/index.js
  - src/features/OnBoarding/containers/SetGender/index.js
  - src/features/OnBoarding/containers/SetWeight/index.js
  - src/features/OnBoarding/containers/SetHeight/index.js
spec_file: tests/specs/onboarding/onboarding.spec.js
page_object: src/pages/onboarding/
---

# [Onboarding] Onboarding Flow — v3.1.0

> Flujo de configuración inicial del perfil del usuario luego del primer registro. Consta de 6 pasos secuenciales que recopilan datos personales necesarios para el funcionamiento de la app.

---

## Acceso

- **Desde:** Registro exitoso (SignUp) o Login de usuario con perfil incompleto
- **Prerequisito:** usuario autenticado sin perfil completo
- **Retorna a:** Home (al completar todos los pasos)

---

## Lógica de ruta inicial

El navigator determina el paso inicial según el estado del usuario:
- Si `user.displayName` o `user.data.firstname` existen → empieza en `SetPicture`
- Si no existe nombre → empieza en `SetName`

---

## Paso 1 — SetName

| Elemento | Tipo | Notas |
|----------|------|-------|
| Campo nombre | input texto | nombre del usuario |
| Campo apellido | input texto | apellido del usuario |
| Botón continuar | botón primario | avanza al siguiente paso |

---

## Paso 2 — SetPicture

| Elemento | Tipo | Notas |
|----------|------|-------|
| Avatar / foto actual | imagen circular | muestra foto de perfil actual o placeholder |
| Botón cambiar foto | botón/acción | abre selector de imagen (cámara o galería) |
| Botón continuar | botón primario | avanza al siguiente paso |
| Botón omitir | botón secundario o link | salta este paso (foto es opcional) |

---

## Paso 3 — SetBirthdate

| Elemento | Tipo | Notas |
|----------|------|-------|
| Selector de fecha | date picker | formato según plataforma (corregido en Android en v3.1.0) |
| Botón continuar | botón primario | avanza al siguiente paso |

---

## Paso 4 — SetGender

| Elemento | Tipo | Notas |
|----------|------|-------|
| Opciones de género | selector / radio buttons | Masculino / Femenino / Otro (o equivalente) |
| Botón continuar | botón primario | avanza al siguiente paso |

---

## Paso 5 — SetWeight

| Elemento | Tipo | Notas |
|----------|------|-------|
| Input de peso | input numérico | en kg |
| Botón continuar | botón primario | avanza al siguiente paso |

---

## Paso 6 — SetHeight

| Elemento | Tipo | Notas |
|----------|------|-------|
| Input de altura | input numérico | en cm |
| Botón finalizar | botón primario | completa el onboarding y navega al Home |

---

## Edge cases documentados

- El selector de fecha en Android fue corregido en v3.1.0 para tener el mismo diseño que iOS
- Si el usuario ya tiene nombre configurado (ej: login social), el flujo empieza en SetPicture, saltando SetName
- Los datos recopilados se guardan en la base de datos al completar cada paso o al finalizar (verificar comportamiento exacto en cada step)

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.1.0 | Baseline | 6 pasos: SetName, SetPicture, SetBirthdate, SetGender, SetWeight, SetHeight |
| v3.6.0 | Reemplazado | Flujo gamificado tipo Duolingo — pantallas Welcome, MeetUser, NotificationPermission, SaveOnboardingProgress |
