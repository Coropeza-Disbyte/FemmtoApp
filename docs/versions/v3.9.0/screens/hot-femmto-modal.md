---
version: 3.9.0
screen: hot-femmto-modal
risk_level: low
since: 3.9.0
last_modified: 2026-05-14
source_files:
  - src/components/HotFemmtoModal/index.js
  - src/features/Home/containers/Overview/index.js
spec_file: tests/specs/home/home.spec.js
page_object: src/pages/home/HomePage.js
---

# [Home] HotFemmtoModal — v3.9.0

> Modal promocional que se presenta automáticamente en la Home para usuarios de Argentina. Anuncia la campaña "Hot Femmto" (11–17 de mayo de 2026) con hasta 50% OFF en el marketplace de Femmto. Se muestra una sola vez por día y expira automáticamente el 18 de mayo de 2026.

---

## Acceso

- **Desde:** HomeOverview → `useFocusEffect` → se abre automáticamente 1.2 segundos después de enfocar la pantalla Home
- **Condiciones:** `user.country === 'AR'` **Y** no se mostró en el día actual (AsyncStorage key: `hotFemmtoLastShown`)
- **Expira:** el modal no se muestra después del 18 de mayo de 2026 (`new Date(2026, 4, 18, 0, 0, 0)`)
- **Retorna a:** HomeOverview (cierre del modal)

---

## Elementos de UI

### Header del modal

| Elemento | Notas |
|----------|-------|
| Fondo | `#C8DCEF` con círculos decorativos semitransparentes |
| Fecha | `"Del 11 al 17 de mayo"` |
| Título | `"Hot\nFemmto"` — font Axiforma-Bold, 44px, dos líneas |
| Badge | `"50%"` en color `#6C80A3` + `" hasta OFF en toda la web"` |
| Botón cerrar | `"✕"` — esquina superior derecha → cierra el modal |

### Body del modal

| Elemento | Notas |
|----------|-------|
| Countdown | `"⏱  Termina en [Xd XXhXXm]"` — se actualiza cada minuto en tiempo real hasta `new Date(2026, 4, 18)` |
| Título promo | `"Hasta "` + **`"50% OFF"`** (color `#6C80A3`) + `" en toda la tienda."` |
| Subtítulo | `"Tensiómetros, balanzas, glucómetros y más. Solo por esta semana."` — color `#6D6E71` |
| Botón CTA | `"Ver ofertas"` — fondo `#0A0B0C` (negro) |
| Botón secundario | `"Ahora no"` — cierra el modal |

---

## Tipografía y colores

| Token | Valor |
|-------|-------|
| Font | Axiforma (Regular, SemiBold, Bold) |
| Texto principal | `#262B2D` |
| Texto secundario | `#6D6E71` |
| Acento / badge | `#6C80A3` |
| Botón CTA | `#0A0B0C` |
| Header bg | `#C8DCEF` |
| Border radius | 20px |
| Ancho | 100% |

---

## Lógica de comportamiento

| Condición | Resultado |
|-----------|-----------|
| `user.country !== 'AR'` | Modal no se muestra |
| Fecha actual ≥ 18 de mayo 2026 | Modal no se muestra (expirado) |
| `hotFemmtoLastShown === today` (AsyncStorage) | Modal no se muestra (ya visto hoy) |
| Todas las condiciones OK | Modal se abre 1.2s después del focus en Home |

---

## Acciones del modal

| Acción | Analytics | Resultado |
|--------|-----------|-----------|
| `"Ver ofertas"` | `logPromoBannerAction('hot_femmto', 'go_to_store')` | Abre `https://www.femmto.com` en browser externo |
| `"Ahora no"` | `logPromoBannerAction('hot_femmto', 'dismissed')` | Cierra el modal |
| Botón `✕` (cerrar) | — | Cierra el modal |

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.9.0 | Introducida | Modal promocional "Hot Femmto" segmentado por país (AR), con countdown, CTA al marketplace y lógica de frecuencia diaria |
