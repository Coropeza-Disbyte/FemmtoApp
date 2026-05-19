---
version: 3.1.0
screen: share
risk_level: low
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/Share/containers/Overview/index.js
  - src/features/Share/index.js
spec_file: tests/specs/tabs/share.spec.js
page_object: src/pages/tabs/SharePage.js
---

# [Share] Compartir — v3.1.0

> Tab para compartir reportes de métricas de salud. Permite al usuario generar y enviar resúmenes de sus mediciones.

---

## Acceso

- **Desde:** tab "Compartir" en el bottom nav
- **Prerequisito:** usuario autenticado con mediciones registradas
- **Retorna a:** bottom nav

---

## ShareOverview — Pantalla principal

| Elemento | Tipo | Notas |
|----------|------|-------|
| Contenido de la pantalla | reporte / resumen | métricas del usuario para compartir |
| Opciones de compartir | acciones nativas | permite enviar por WhatsApp, email, etc. |

> El contenido detallado requiere lectura del container `Overview/index.js` del feature Share.

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.1.0 | Baseline | ShareOverview — una pantalla single-screen |
| v3.5.0 | Rediseñado | Nueva interfaz más moderna e intuitiva |
