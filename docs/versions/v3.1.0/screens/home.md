---
version: 3.1.0
screen: home
risk_level: high
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/Home/containers/Overview/index.js
  - src/features/Home/containers/Overview/sections/FavouritesSelector/index.js
  - src/features/Home/containers/Overview/sections/FavoriteListSheet/index.js
  - src/features/Home/containers/Overview/sections/LastMeasurements/index.js
  - src/components/HomeHeader.js
  - src/components/OptionalUpdateBottomSheet.js
spec_file: tests/specs/home/home.spec.js
page_object: src/pages/home/HomePage.js
---

# [Home] Home Screen — v3.1.0

> Pantalla principal post-login. Muestra un resumen de las últimas mediciones filtrado por las métricas que el usuario eligió como favoritas. Incluye acceso rápido a detalles de cada métrica y la posibilidad de editar la selección de tarjetas.

---

## Acceso

- **Desde:** Login / Onboarding completado / tap tab "Home" en el bottom nav
- **Prerequisito:** usuario autenticado con perfil completo
- **Retorna a:** no aplica (es el root del stack Home)

---

## Bottom Navigation Bar

5 tabs en esta versión:

| Tab | Label | Destino |
|-----|-------|---------|
| 0 | Inicio | HomeNavigator (esta pantalla) |
| 1 | Compartir | ShareNavigator |
| 2 | Medición | NewMeditionNavigator |
| 3 | Dispositivos | DevicesNavigator |
| 4 | Recordatorios | RemindersNavigator |

---

## Header (HomeHeader)

| Elemento | Tipo | Comportamiento |
|----------|------|----------------|
| Logo / nombre usuario | texto | parte izquierda del header |
| Ícono ayuda / videos | botón (help-icon, size 6) | accede a contenido de ayuda — navega a DynamicContent |
| Ícono notificaciones | botón (campana) | abre centro de notificaciones o pantalla relacionada |

> En v3.8.0 se agrega el badge de notificaciones no leídas sobre este ícono.
> En v4.0.0 el ícono de ayuda es reemplazado por "Nueva medición" y el ícono de notificaciones crece a size 7.

---

## FavoritesSelector — "Mis tarjetas"

Sección superior del Home. Permite al usuario gestionar qué métricas ve en su resumen.

| Elemento | Tipo | Texto visible |
|----------|------|---------------|
| Título de sección | texto | "Mis tarjetas" |
| Botón editar | botón primario pequeño | "Editar tarjetas" |

- Tap en "Editar tarjetas" → abre `FavoritesListSheet` (bottom sheet)
- Si el usuario no tiene favoritos configurados → el bottom sheet se abre automáticamente al entrar al Home

---

## FavoritesListSheet — Bottom sheet de edición

| Elemento | Tipo | Notas |
|----------|------|-------|
| Lista de métricas | checkboxes | el usuario activa/desactiva cada métrica disponible |
| Botón guardar | botón primario | persiste la selección en el store (`favourites`) y cierra el sheet |
| Cierre | swipe down o tap fuera | descarta cambios |

### Métricas disponibles para seleccionar como favoritas

| Métrica | Enum value |
|---------|-----------|
| Glucosa | `BLOOD_GLUCOSE` |
| Presión arterial | `BLOOD_PREASURE` |
| Composición segmentada | `SEGMENTED_COMPOSITION` |
| Peso | `WEIGHT` |
| Metabolismo | `METABOLISM` |

---

## Sección "Últimas mediciones"

Lista vertical de cards debajo del FavoritesSelector. Solo se renderiza si `favourites` tiene al menos un elemento.

| Card | Condición de visibilidad | Destino al tap |
|------|-------------------------|----------------|
| Glucosa (`BloodGlucoseCard`) | `favourites.includes(BLOOD_GLUCOSE)` | GlucoseDetails |
| Presión (`BloodCard`) | `favourites.includes(BLOOD_PREASURE)` | PresureDetails |
| Composición segmentada (`SegmentedComposition`) | `favourites.includes(SEGMENTED_COMPOSITION)` | WeightDetails (tab 1) |
| Peso (`WeightCard`) | `favourites.includes(WEIGHT)` | WeightDetails (tab 0) |
| Metabolismo (`MetabolimsCard`) | `favourites.includes(METABOLISM)` | MetabolismDetails |

- El orden de las cards en pantalla es fijo (el del código), no personalizable en esta versión
- Si `favourites` está vacío → sección no se renderiza (muestra `View` vacío)

---

## OptionalUpdateBottomSheet

Modal que aparece cuando hay una actualización opcional disponible. Se muestra sobre el Home sin bloquear el uso de la app.

| Elemento | Notas |
|----------|-------|
| Mensaje de actualización disponible | texto informativo |
| Botón "Actualizar" | redirige a la store |
| Botón "Ahora no" o dismiss | cierra el sheet |

---

## Comportamiento al enfocar la pantalla

Al recibir el evento `focus` (entrar a la pantalla):
- Recarga datos del usuario (`loadUserData`)
- Recarga últimas mediciones (`loadLastMeasurements`) con delay de 300ms
- Verifica estado de permisos de push notifications con delay de 500ms
- Verifica dispositivos Welland conectados con delay de 300ms

---

## Edge cases documentados

- Si el usuario no tiene favoritos → el sheet de edición se abre automáticamente al entrar
- Si Bluetooth no tiene permisos → se muestra alert: "Permita que Femmto use la conexión bluetooth" con opción de ir a Configuración
- El sheet de favoritos se cierra automáticamente cuando la pantalla pierde el foco (`blur`)

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.1.0 | Baseline | FavoritesSelector + LastMeasurements + 5 tabs en nav |
| v3.8.0 | Modificado | Badge de notificaciones no leídas en header |
| v4.0.0 | Rebranding completo | FavoritesSelector → ObjectiveTabs; nav 5→4 tabs; header con routing inteligente; grid de métricas; TourGuide; TrendsSection; HealthyHabitSection |
