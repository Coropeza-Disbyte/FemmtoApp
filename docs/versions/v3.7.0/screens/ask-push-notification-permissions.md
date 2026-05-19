---
version: 3.7.0
screen: ask-push-notification-permissions
risk_level: low
since: 3.7.0
last_modified: 2026-05-14
source_files:
  - src/containers/AskForPushNotificationPermissions/index.js
spec_file: tests/specs/home/askPushNotificationPermissions.spec.js
page_object: src/pages/home/AskPushNotificationPermissionsPage.js
---

# [Home] AskForPushNotificationPermissions — v3.7.0

> Pantalla de solicitud de permisos push presentada automáticamente desde HomeOverview cuando la app detecta que el usuario no ha respondido al permiso. Registrada en el HomeNavigator como ruta modal dentro del stack de Home. Ambas acciones (aceptar o rechazar) retornan a la pantalla anterior.

---

## Acceso

- **Desde:** HomeOverview → `navigation.navigate('AskForPushNotificationPermissions')` (disparado automáticamente si el usuario no ha respondido al permiso de notificaciones push)
- **Prerequisito:** usuario autenticado con onboarding completo; permiso push aún no respondido
- **Retorna a:** HomeOverview (`navigation.goBack()` en todos los casos)

---

## Posición en el stack

```
HomeNavigator (Stack)
  └── AskForPushNotificationPermissions   ← ruta en HomeNavigator
```

---

## Elementos de UI

| Elemento | Notas |
|----------|-------|
| Fondo degradado | `LinearGradient` `#CAD8EA` → `#FFFFFF` → `#FFFFFF` → `#FFFFFF` |
| Imagen | `push-notification.png` — width 100%, height 400, marginTop 40 |
| Texto título | `"Recibe recordatorios y novedades que te ayudan a cuidar tu salud."` |
| Texto subtítulo | `"🔔 Te avisaremos cuando sea momento de medir y te mantenemos al día con novedades importantes y actualizaciones."` |
| Botón principal | `"Recibir recordatorios"` — colorScheme primary |
| Botón secundario | `"Ahora no"` — bg `#CEDFF4`, text color `primary.700` |

StatusBar: `useStatusBarColorOnFocus('#CAD8EA')`.

---

## Lógica de acciones

| Acción | Lógica | Resultado |
|--------|--------|-----------|
| `"Recibir recordatorios"` | `dispatch(requestPermissions(onSuccess, onError))` | → `navigation.goBack()` (éxito o error) |
| `"Ahora no"` | `dispatch(markPushPermissionRejected())` | → `navigation.goBack()` |
| Error al solicitar permiso | `dispatch(markPushPermissionRejected())` | → `navigation.goBack()` |

En todos los casos (éxito, error, rechazo) la pantalla retorna a HomeOverview. `markPushPermissionRejected()` evita que la pantalla se vuelva a mostrar.

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.7.0 | Introducida | Solicitud de permisos push presentada automáticamente desde Home al primer uso |
