---
version: 3.7.0
last_modified: 2026-05-14
repo_branch: feat/version-3.7.3
---

# Release Summary — v3.7.0

> Versión con foco en notificaciones push, mejoras al onboarding y expansión del perfil. Se introduce el sistema completo de notificaciones push (pantalla de permisos + lista + preferencias), la selección de país en el perfil, y se refactoriza NewUserIntro con slides específicos y un path alternativo desde el menú. Actualización mayor de infraestructura: React Native 0.79.6, Expo SDK 53, New Architecture habilitada.

---

## Cambios incluidos en esta versión

| # | Feature / Pantalla | Tipo | Descripción |
|---|--------------------|------|-------------|
| 1 | AskForPushNotificationPermissions | Nueva pantalla | Solicitud de permisos push presentada automáticamente desde HomeOverview |
| 2 | Notifications — Overview | Nueva pantalla | Lista de notificaciones con edit mode y alerta de permisos |
| 3 | Notifications — NotificationSettings | Nueva pantalla | Preferencias de notificaciones con 3 switches |
| 4 | Profile — EditCountry | Nueva pantalla | Selección de país con búsqueda y lista alfabética |
| 5 | NewUserIntro | Modificado | IntroSwiper con 4 slides definidos; nuevo path `IntroMenu` para acceso desde menú |
| 6 | Home Navigator | Modificado | Nuevas rutas: `AskForPushNotificationPermissions` y `Notifications` agregadas al stack |
| 7 | Profile Navigator | Modificado | Ruta `EditCountry` agregada; campo "País de residencia" visible en UserProfile |
| 8 | React Native / Expo | Infraestructura | RN 0.73.6 → 0.79.6, Expo SDK 50 → 53, New Architecture habilitada |

---

## Pantallas sin cambios en v3.7.0

Las siguientes pantallas introducidas en v3.6.0 no tuvieron cambios funcionales:
Welcome, MeetUser, NotificationPermission, FirstMeasure, SaveOnboardingProgress.

El orden de tabs (Home / Devices / Medition / Reminders / Share) se mantiene igual que en v3.6.0.

---

## Acceso a Notifications en v3.7.0

La feature de Notifications fue desarrollada e integrada en el HomeNavigator, pero el punto de entrada desde la UI (ícono en header de Home y opción en menú) está deshabilitado (código comentado) en esta versión. La pantalla es accesible programáticamente y la solicitud de permisos push (`AskForPushNotificationPermissions`) sí se dispara automáticamente desde HomeOverview.
