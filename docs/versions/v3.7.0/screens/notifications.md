---
version: 3.7.0
screen: notifications
risk_level: medium
since: 3.7.0
last_modified: 2026-05-14
source_files:
  - src/features/Notifications/index.js
  - src/features/Notifications/containers/Overview/index.js
  - src/features/Notifications/containers/EmptyListView/index.js
  - src/features/Notifications/containers/Header/index.js
  - src/features/Notifications/containers/Notification/index.js
  - src/features/Notifications/containers/PermmissionAlert/index.js
  - src/features/Notifications/containers/Recommendations/index.js
  - src/containers/NotificationsPreferences/index.js
spec_file: tests/specs/home/notifications.spec.js
page_object: src/pages/home/NotificationsPage.js
---

# [Home] Notifications — v3.7.0

> Feature completa de notificaciones push introducida en v3.7.0. Comprende dos pantallas dentro del HomeNavigator: la lista de notificaciones (Overview) y la pantalla de preferencias (NotificationSettings). El acceso desde la UI está deshabilitado en esta versión (código comentado), pero las rutas están registradas en el stack de Home.

---

## Acceso

- **Desde:** HomeNavigator → ruta `Notifications` (acceso UI deshabilitado en esta versión; el código `navigation.navigate('Notifications')` está comentado en HomeOverview)
- **Prerequisito:** usuario autenticado con onboarding completo
- **Retorna a:** Home (goBack)

---

## Stack del módulo

```
NotificationsNavigator (dentro de HomeNavigator)
  ├── Overview           ← ruta inicial
  └── NotificationSettings
```

---

## Overview — Lista de notificaciones

### Elementos de UI

| Elemento | Notas |
|----------|-------|
| Header título | `"Notificaciones"` |
| Ícono de configuración | `"configuraciones"` (accesibilityLabel) → navega a `NotificationSettings` |
| Lista | `FlashList` con componente `Notification` por ítem |
| Refresh | `RefreshControl` → `refreshNotifications()` |
| Estado vacío | `EmptyListView` — visible cuando no hay notificaciones |
| Alerta de permisos | `PermissionAlert` — visible cuando `!permissionStatus` (no hay permisos push activos) |

### Edit mode (eliminación múltiple)

| Acción | Lógica |
|--------|--------|
| Activar modo edición | `startNotificationsEditMode()` |
| Seleccionar notificación | `addNotificationToDelete(notification)` |
| Deseleccionar | `removeNotificationToDelete(notification)` |
| Confirmar eliminación | botón eliminar (disponible en modo edición) |

### Redux (state relevante)

| Selector | Fuente |
|----------|--------|
| `permissionStatus` | `pushNotificationsReducer` |
| Lista de notificaciones | `pushNotificationsReducer` |
| Lista de notificaciones a eliminar | `pushNotificationsReducer` |

---

## NotificationSettings — Preferencias de notificaciones

Accesible desde el ícono de engranaje en el header de Overview.

### Elementos de UI

| Elemento | Notas |
|----------|-------|
| Header | `HeaderSection` con botón cerrar → `navigation.goBack()` |
| Descripción | `"Elige las notificaciones que quieres recibir"` — color `neutral.600`, fontWeight 600, fontSize 16 |
| Background | `neutral.50` |

### Switches

| Opción | colorScheme | size |
|--------|-------------|------|
| `"Notificaciones de recordatorio"` | primary | lg |
| `"Notificaciones de motivación"` | primary | lg |
| `"Notificaciones de actualizaciones"` | primary | lg |

Cada switch está separado por `Divider` con color `neutral.400`. Layout: `HStack` con `justify-content: space-between`.

---

## Nota de integración en v3.7.0

El acceso a la pantalla de Notifications desde la UI principal está comentado en esta versión:

- En `HomeOverview`: `navigation.navigate('Notifications')` — comentado
- En `MenuOptions`: opción "Notificaciones" con `notificationIcon` — comentado

La feature está completa y funcional; su punto de entrada visual fue pospuesto para una versión posterior.

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.7.0 | Introducida | Sistema de notificaciones push: lista, edit mode, preferencias con 3 switches |
