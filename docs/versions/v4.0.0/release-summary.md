# v4.0.0 — Release Summary

**Tipo:** Rebranding + Rediseño del Home  
**Fecha aprox.:** 2026

## Cambios de alto impacto

- Bottom nav: 5 tabs → 4 tabs (eliminado tab "Medición")
- Home: FavoritesSelector reemplazado por ObjectiveTabs (tabs por objetivo del usuario)
- Header: botón ayuda → botón "Nueva medición" con routing inteligente por métrica
- Grid de métricas: lista 1 columna → grid 2 columnas, renombrado a "Métricas de salud"
- Sistema de onboarding TourGuide (4 pasos, una sola vez, persiste en AsyncStorage con clave `@femmto/home_tour_v1`)
- TrendsSection y HealthyHabitSection incorporadas al Home
- Paleta de colores por métrica centralizada en `measurementColors.js`
- 15 assets reemplazados en `assets/images/`

## Pantallas afectadas

| Pantalla | Tipo de cambio |
|----------|----------------|
| Home | Rediseño completo |
| HomeHeader | Modificado — botón ayuda reemplazado por "Nueva medición" con routing inteligente |
| Measure (NewMedition) | Movida al stack de Home (ya no es tab en el bottom nav) |
| NewScaleMedition | Flujo actualizado: vinculación inmediata al pararse en la balanza, sin esperar estabilización |
| LinkScale | Actualizado (merge feat/new-scale-measure-flow): Chipsea dispara en `weight > 0`, Senssun iOS usa `setTempWeightCallback`, Welland sin cambios |
| Menu | Ícono de notificaciones actualizado a `bell-menu-icon` |

## Fixes incluidos en build 1024

- `fix(measure)`: botón "Volver" en LinkedSuccess ahora resetea el stack de navegación a Home y despacha `setIsLinkingDevice(false)` — evitaba quedar en estado colgado después de vincular balanza
- `fix(health)`: instrucciones de ConnectHealth diferenciadas por plataforma — Android muestra pasos de Health Connect, iOS muestra ruta Configuración > Privacidad > Salud
- `fix(app)`: eliminados 3 videos de tutorial de tensiómetro del bundle (`all-in-one`, `arm`, `wrist`) — reducción de tamaño del APK

## Fixes incluidos en build 1022–1023

- `fix(tour)`: tour reducido de 5 zonas a 4 pasos; paso 3 apunta al ícono ⋯ del widget (menú de configuración de objetivos)
- `fix(scale)`: vinculación inmediata al pararse en balanza (sin estabilización) — `feat/new-scale-measure-flow`
- `fix(bluetooth)`: corrección de cuelgue en verificación Bluetooth en Android 17+
- `fix(home)`: eliminado dato de pasos de la sección de frecuencia del widget General
- `fix(menu)`: ícono del ítem notificaciones corregido

## Correcciones de documentación detectadas en build 1024

Verificación de código contra docs detectó los siguientes errores en `screens/home.md` (corregidos):

- **HomeHeader path**: el archivo real está en `src/components/HomeHeader/index.js`, no en `src/features/Home/components/HomeHeader.js`
- **Routing "Nueva medición"**: `control_steps` cae al `else` y sí navega a `Measure`; `control_general` también navega a `Measure` — la doc anterior decía "no navega" para ambos
- **Orden de botones header**: orden real es Nueva medición → Notificaciones → Menú (hamburger) — documentado con detalle
- **FeedbackFlow / OptionalUpdateBottomSheet**: componentes persistentes del Home sin documentar, añadidos

## Fixes incluidos en build 1025

- `fix(home)`: corrección de re-aparición del tour guiado — `@femmto/home_tour_v1` se escribe en `AsyncStorage` al **iniciar** el tour (no al completarlo); si el usuario navega fuera a mitad del tour, al volver al Home no vuelve a mostrarse
- `chore(home)`: `HotFemmtoModal` deshabilitado en `Overview/index.js` — import, ref, lógica de show y JSX comentados tras expiración de la promo "Hot Femmto" (18/05/2026); el componente sigue en disco pero ya no se monta

## Screens documentadas en esta versión

- [home.md](screens/home.md)
