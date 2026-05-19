---
version: 3.5.0
screen: reminders
risk_level: medium
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/Reminders/index.js
  - src/features/Reminders/containers/RemidersList/index.js
  - src/features/Reminders/containers/Permission/index.js
  - src/features/Reminders/containers/AddReminder/index.js
  - src/features/Reminders/containers/AddReminder/sections/SelectProduct/index.js
  - src/features/Reminders/containers/AddReminder/sections/DayRepetition/index.js
  - src/enums/ReminderProductEnum.js
spec_file: tests/specs/tabs/reminders.spec.js
page_object: src/pages/tabs/RemindersPage.js
---

# [Reminders] Recordatorios — v3.5.0

> Tab de gestión de recordatorios de medición. Rediseñado en v3.5.0: nueva UI con tarjetas tipo Radio para selección de producto, nuevos tipos de recordatorio (Glucómetro, Medicación, Otro) y opción "Otro" con campo de texto libre.

---

## Acceso

- **Desde:** tab "Recordatorios" en el bottom nav
- **Prerequisito:** usuario autenticado
- **Retorna a:** bottom nav

---

## Stack del módulo

```
RemindersNavigator
  ├── Permission     ← si permisos de notificaciones no concedidos
  └── RemidersList   ← inicial (si permisos ya concedidos)
        └── AddReminder
```

---

## Permission — Solicitud de permisos

Sin cambios respecto a v3.1.0.

---

## RemidersList — Lista de recordatorios

| Elemento | Notas |
|----------|-------|
| Header "Recordatorios" | botón atrás → Home |
| `FlashList` de recordatorios | componente `Reminder` por ítem |
| Modo edición | toggle `editMode` via botón en header |
| Cada `Reminder` | nombre del recordatorio + hora + días + toggle activo/inactivo |
| Estado vacío | `EmptyListView` |
| `PermissionAlert` | alerta si permisos de notificación revocados |
| Botón "Agregar recordatorio" | navega a `AddReminder` |

Acciones por recordatorio: `activateReminder` / `desactivateReminder` / `deleteReminder`.

---

## AddReminder — Agregar / editar recordatorio

Formulario con react-hook-form. Soporta creación y edición (via `route.params.reminder`).

### Header

Título: `"Agregar recordatorios"`. Botón atrás → goBack.

### Secciones del formulario

#### 1. SelectProduct — Tipo de recordatorio [REDISEÑADO v3.5.0]

Nuevo diseño con tarjetas tipo Radio (NativeBase `<Radio.Group>`). Cada opción muestra: texto descriptivo + ícono (activo/inactivo).

| Valor enum | Texto visible | Ícono |
|------------|--------------|-------|
| `BLOOD_PREASURE_MONITOR` | "Medición de presión arterial" | `heart-rate-icon.png` / `heart-rate-active-icon.png` |
| `SCALE` | "Medición de balanza" | `scale-icon.png` / `scale-active-icon.png` |
| `BLOOD_GLUCOSE_MONITOR` | "Medición de glucosa en sangre" | `glucose-share-icon.png` / `glucose-share-active-icon.png` |
| `MEDICATION` | "Tomar medicación" | `medication-icon.png` / `medication-active-icon.png` |
| `OTHER` | "Otro recordatorio" | `other-icon.png` / `other-active-icon.png` |

> En v3.4.0 solo existían `BLOOD_PREASURE_MONITOR` y `SCALE`. En v3.5.0 se agregaron `BLOOD_GLUCOSE_MONITOR`, `MEDICATION` y `OTHER`.

Al seleccionar `OTHER` → aparece un campo `<Input>` de texto libre para el nombre personalizado del recordatorio.

El `name` del form se deriva de la selección:
- `BLOOD_PREASURE_MONITOR` → `"Presión arterial"`
- `SCALE` → `"Peso corporal"`
- `BLOOD_GLUCOSE_MONITOR` → `"Glucosa en sangre"`
- `MEDICATION` → `"Medicación"`
- `OTHER` → valor del `<Input>` libre

#### 2. DayRepetition — Días de repetición [REDISEÑADO v3.5.0]

Selector visual de días de la semana. Cada día es un `<Pressable>` circular (35×35px):
- Fondo `primary[600]` + texto blanco si seleccionado
- Fondo blanco + texto negro si no seleccionado

Días disponibles: `DaysEnumValues` (todos los días de la semana con abreviatura).

#### 3. Horario

`ControllerReminderDateTimePickerInput` en modo `"time"`. Formato: `"H:mm a"`. Título: "Selecciona el horario".

### Botón "Guardar recordatorio"

Deshabilitado si: `!watch('time') || !watch('name') || !selectedDays.length`.

Analytics: `logCreateReminder(...)`.

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.1.0 | Baseline | Permission + RemidersList + AddReminder (solo Tensiómetro y Balanza) |
| v3.5.0 | Rediseñado | Nueva UI tipo Radio cards + nuevos tipos: Glucómetro, Medicación, Otro (con texto libre) |
