# v4.0.0 — Release Summary

**Tipo:** Rebranding + Rediseño del Home  
**Fecha aprox.:** 2026

## Cambios de alto impacto

- Bottom nav: 5 tabs → 4 tabs (eliminado tab "Medición")
- Home: FavoritesSelector reemplazado por ObjectiveTabs (tabs por objetivo del usuario)
- Header: botón ayuda → botón "Nueva medición" con routing inteligente por métrica
- Grid de métricas: lista 1 columna → grid 2 columnas, renombrado a "Métricas de salud"
- Sistema de onboarding TourGuide (5 zonas, una sola vez, persiste en AsyncStorage)
- TrendsSection y HealthyHabitSection incorporadas al Home
- Paleta de colores por métrica centralizada en `measurementColors.js`
- 15 assets reemplazados en `assets/images/`

## Pantallas afectadas

| Pantalla | Tipo de cambio |
|----------|----------------|
| Home | Rediseño completo |
| HomeHeader | Modificado |
| Measure | Movida al stack de Home (ya no es tab) |

## Screens documentadas en esta versión

- [home.md](screens/home.md)
