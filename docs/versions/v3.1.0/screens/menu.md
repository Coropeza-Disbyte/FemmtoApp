---
version: 3.1.0
screen: menu
risk_level: low
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/Menu/containers/MenuOptions/index.js
  - src/features/Menu/containers/Support/index.js
  - src/features/Menu/index.js
spec_file: tests/specs/profile/profile.spec.js
page_object: src/pages/profile/MenuPage.js
---

# [Profile] Menú — v3.1.0

> Pantalla de menú lateral o principal que concentra accesos a: perfil del usuario, soporte y otras opciones generales de la app. Accesible desde el header del Home.

---

## Acceso

- **Desde:** Home header → ícono de menú / perfil
- **Prerequisito:** usuario autenticado
- **Retorna a:** Home (botón atrás)

---

## MenuOptions — Pantalla principal del menú

| Elemento | Tipo | Texto visible | Destino |
|----------|------|---------------|---------|
| Header | barra de nav | título + botón atrás | — |
| Opción "Mis datos" | ítem de menú | "Mis datos" | navega a MyData → ProfileNavigator |
| Opción "Soporte" | ítem de menú | "Soporte" | navega a Support |

---

## Support — Pantalla de soporte

Pantalla de contacto o ayuda al usuario.

| Elemento | Notas |
|----------|-------|
| Contenido de soporte | información de contacto, FAQ o formulario (verificar contenido exacto en el código) |

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.1.0 | Baseline | MenuOptions con acceso a Perfil y Soporte |
