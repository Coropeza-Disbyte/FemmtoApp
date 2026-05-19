---
version: 3.1.0
screen: profile
risk_level: medium
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/Profile/containers/UserProfile/index.js
  - src/features/Profile/index.js
spec_file: tests/specs/profile/profile.spec.js
page_object: src/pages/profile/ProfilePage.js
---

# [Profile] Mi cuenta — v3.1.0

> Pantalla de perfil del usuario. Muestra y permite editar los datos personales: nombre, email, contraseña, género, fecha de nacimiento, altura y peso. Incluye la opción de eliminar la cuenta (introducida en v3.1.0).

---

## Acceso

- **Desde:** Menu → "Mis datos" / Home header → ícono de usuario (según versión)
- **Prerequisito:** usuario autenticado
- **Retorna a:** pantalla anterior (botón atrás en header)

---

## Elementos de UI

| Elemento | Tipo | Texto visible | Editable |
|----------|------|---------------|----------|
| Header | barra de nav | "Mi cuenta" + botón atrás | — |
| Foto de perfil | imagen circular (`UserPicture`) | — | no editable desde esta pantalla en v3.1.0 |
| Campo Nombre | `EditableField` | "Nombre" + valor | sí → navega a EditName |
| Campo E-Mail | `EditableField` | "E-Mail" + valor | no (solo lectura) |
| Campo Contraseña | `EditableField` | "Contraseña" + "********" | sí → navega a EditPassword |
| Campo Género | `EditableField` | "Género" + valor | sí → navega a EditGender |
| Campo Fecha de nacimiento | `EditableField` | "Fecha de nacimiento" + valor | sí → navega a EditBirthdate |
| Campo Altura | `EditableField` | "Altura" + valor en cm | sí → navega a EditHeight |
| Campo Peso | `EditableField` | "Peso" + valor en kg | sí → navega a EditWeight |
| Sección Eliminar cuenta | `DeleteAccountOptionSection` | "Eliminar cuenta" | — |

---

## Pantallas de edición (sub-screens del stack Profile)

| Pantalla | Qué edita |
|----------|-----------|
| EditName | Nombre y apellido |
| EditPassword | Contraseña actual y nueva |
| EditGender | Género (opciones: Masculino / Femenino / Otro) |
| EditBirthdate | Fecha de nacimiento (date picker) |
| EditHeight | Altura en cm |
| EditWeight | Peso en kg |

Cada pantalla de edición tiene su propio header con botón atrás y botón de guardar.

---

## Eliminar cuenta

Introducida en v3.1.0 para cumplimiento legal Android e iOS.

| Elemento | Comportamiento |
|----------|----------------|
| Opción "Eliminar cuenta" | muestra confirmación al usuario |
| Confirmación | dispatch `removeUser` → si éxito: dispatch `doLogout` → navega al Login |

- El evento se loguea en Analytics: `DELETE_ACCOUNT`

---

## Edge cases documentados

- El email no es editable — es el identificador de la cuenta y solo se muestra
- Si la eliminación de cuenta falla → toast de error (comportamiento de `showToastError`)
- El StatusBar cambia a color blanco al enfocar esta pantalla (`useStatusBarColorOnFocus('white')`)

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.1.0 | Baseline | Perfil editable + opción Eliminar cuenta |
| v3.7.2 | Modificado | Visualización y edición del país desde Perfil |
