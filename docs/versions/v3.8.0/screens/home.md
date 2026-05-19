---
version: 3.8.0
screen: home
risk_level: high
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/Home/containers/Overview/index.js
  - src/features/Home/components/HomeHeader.js
  - src/features/Home/components/FavoritesSelector.js
  - src/features/Home/components/FavoritesListSheet.js
spec_file: tests/specs/home/home.spec.js
page_object: src/pages/home/HomePage.js
---

# [Home] Home Screen — v3.8.0

> Pantalla principal post-login. En v3.8.0 el Home usa el modelo de favoritos: el usuario selecciona métricas de una lista y la pantalla muestra las "Últimas mediciones" filtradas por esa selección. No existe el sistema de tabs por objetivo ni los widgets de resumen.

---

## Acceso

- **Desde:** Login exitoso / cualquier tab del bottom nav al tocar "Home"
- **Prerequisito:** usuario autenticado
- **Retorna a:** no aplica (es el root del stack Home)

---

## Bottom Navigation Bar

En v3.8.0 el nav tiene 5 tabs:

| Tab | Ícono | Destino |
|-----|-------|---------|
| Home | home | HomeScreen (actual) |
| Devices | devices | DevicesScreen |
| Medición | measure | MeditionScreen |
| Alarmas | alarm | RemindersScreen |
| Compartir | share | ShareScreen |

---

## Header (HomeHeader)

| Elemento | Tipo | Comportamiento |
|----------|------|----------------|
| Logo / nombre usuario | texto | visible en la parte izquierda |
| Ícono notificaciones | botón (size 6) | navega a NotificationsScreen; muestra badge con conteo de no leídas |
| Botón ayuda/videos | botón (help-icon) | accede a recursos de ayuda o videos tutoriales |

> En v4.0.0 el botón de ayuda fue reemplazado por "Nueva medición" y el ícono de notificaciones creció a size 7.
> En v3.8.0 el header tiene borde inferior visible.

---

## FavoritesSelector

Componente central del Home en v3.x. Permite al usuario seleccionar qué métricas quiere ver en el resumen.

| Elemento | Tipo | Detalle |
|----------|------|---------|
| Lista de favoritos activos | chips / tags | métricas seleccionadas por el usuario |
| Botón de edición | botón | abre `FavoritesListSheet` para modificar la selección |

---

## FavoritesListSheet

Bottom sheet para gestionar los favoritos del usuario.

| Elemento | Tipo | Detalle |
|----------|------|---------|
| Lista de métricas disponibles | checkboxes | el usuario activa/desactiva cada métrica |
| Botón guardar | botón primario | persiste la selección en el store (`favourites`) |
| Cierre | swipe down o tap fuera | descarta cambios |

---

## Sección "Últimas mediciones"

Lista vertical de cards de métricas. Filtrada por la lista `favourites` del store.

| Elemento | Tipo | Detalle |
|----------|------|---------|
| Título sección | texto | "Últimas mediciones" |
| Cards de métricas | lista vertical (1 columna) | una card por métrica favorita |
| Card | dato + fecha última medición | toca para navegar al detalle de la métrica |

> En v4.0.0 esta sección fue renombrada a "Métricas de salud" y cambió a grid de 2 columnas filtrado por `user.data.targets`.

---

## Push Notifications (desde v3.8.0)

El header muestra el badge de notificaciones no leídas introducido en esta versión.

- Badge visible cuando hay notificaciones no leídas
- Al tocar navega a `NotificationsScreen`

---

## Edge cases documentados

- Si el usuario no tiene favoritos configurados, la sección "Últimas mediciones" puede aparecer vacía — verificar que muestre un estado vacío y no un crash
- Si se agregan/eliminan métricas del sistema, la lista de favoritos puede quedar con referencias inválidas

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.0.1 | Baseline | Home con FavoritesSelector, lista "Últimas mediciones", 5 tabs en bottom nav |
| v3.8.0 | Baseline | Sin cambios en Home respecto a versiones anteriores; se agrega badge de notificaciones en header (introducido en v3.8.0 junto con el módulo de push notifications) |
