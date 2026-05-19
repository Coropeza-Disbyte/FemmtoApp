---
version: 3.1.0
screen: reminders
risk_level: medium
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/Reminders/containers/RemidersList/index.js
  - src/features/Reminders/containers/Permission/index.js
  - src/features/Reminders/containers/AddReminder/index.js
  - src/features/Reminders/index.js
spec_file: tests/specs/tabs/reminders.spec.js
page_object: src/pages/tabs/RemindersPage.js
---

# [Reminders] Recordatorios — v3.1.0

> Tab de gestión de recordatorios de medición. El usuario puede programar notificaciones para recordar medir en determinados horarios.

---

## Acceso

- **Desde:** tab "Recordatorios" en el bottom nav
- **Prerequisito:** usuario autenticado
- **Retorna a:** bottom nav

---

## Lógica de ruta inicial

El navigator evalúa `permissionStatus` del store de push notifications:
- Si permisos concedidos → `RemidersList`
- Si permisos no concedidos → `Permission`

---

## Permission — Solicitud de permisos

| Elemento | Notas |
|----------|-------|
| Explicación | texto que explica para qué se usan los recordatorios |
| Botón aceptar | solicita permisos de notificaciones al SO → si concedidos: navega a RemidersList |
| Botón omitir / más tarde | puede saltar esta pantalla |

---

## RemidersList — Lista de recordatorios

| Elemento | Tipo | Notas |
|----------|------|-------|
| Lista de recordatorios | lista | muestra los recordatorios configurados |
| Botón agregar | botón o FAB | navega a AddReminder |
| Estado vacío | mensaje | si no hay recordatorios configurados |
| Cada ítem | toggle + horario | permite habilitar/deshabilitar el recordatorio |

---

## AddReminder — Agregar recordatorio

| Elemento | Tipo | Notas |
|----------|------|-------|
| Selector de hora | time picker | hora de la notificación |
| Selector de métrica | selector | qué métrica se recuerda medir |
| Selector de días | días de la semana | qué días se activa el recordatorio |
| Botón guardar | botón primario | crea el recordatorio y vuelve a la lista |

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.1.0 | Baseline | Permission + RemidersList + AddReminder |
| v3.5.0 | Rediseñado | Nueva interfaz más moderna e intuitiva |
