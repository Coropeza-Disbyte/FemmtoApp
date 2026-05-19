---
last_modified: 2026-05-14
---

# Test Plan — Framework QA Mobile (Femmto)

> Carpeta centralizada de planes de prueba versionados. Cada versión de producción tiene su propio subdirectorio con plan maestro, casos de prueba y edge cases. Al salir una nueva versión, se crea una carpeta nueva — el historial de versiones anteriores se preserva.

---

## Estructura

```
docs/test-plan/
├── README.md              ← este archivo (índice de versiones + protocolo)
├── v4.0.0/                ← versión de producción inicial del test plan
│   ├── plan-de-pruebas.md
│   ├── test-cases/
│   │   ├── TC-AUTH.md
│   │   ├── TC-HOME.md
│   │   ├── TC-ONBOARDING.md
│   │   ├── TC-PROFILE.md
│   │   ├── TC-METRICS.md
│   │   ├── TC-MEDITION.md
│   │   └── TC-TABS.md
│   └── edge-cases/
│       └── EC-GLOBAL.md
├── v4.1.0/                ← (se crea al analizar la nueva versión)
│   └── ...
└── vX.Y.Z/
    └── ...
```

---

## Índice de versiones

| Versión | Estado | TCs | Edge Cases | Fecha |
|---------|--------|-----|------------|-------|
| v4.0.0 | Producción actual | 123 | 43 | 2026-05-14 |

---

## Protocolo — Crear test plan de nueva versión

Cuando se analiza una versión nueva desde el repo (`feat/version-X.Y.Z`), el flujo completo es:

### Paso 1 — Docs de specs (existente)
- Analizar delta vs versión anterior en el repo RN
- Crear `docs/versions/vX.Y.Z/release-summary.md`
- Crear `docs/versions/vX.Y.Z/screens/*.md` para pantallas nuevas o modificadas
- Actualizar `src/config/versions.json`

### Paso 2 — Test plan de la nueva versión
1. Crear carpeta `docs/test-plan/vX.Y.Z/`
2. Copiar el test plan de la versión anterior como base
3. Actualizar `plan-de-pruebas.md`: campo `version_produccion`, sección de pantallas nuevas vs versión anterior
4. Para cada pantalla **nueva**: agregar TCs en el archivo del módulo correspondiente (`TC-<MODULO>.md`)
5. Para cada pantalla **modificada**: actualizar los TCs afectados, agregar nota `<!-- actualizado en vX.Y.Z -->`
6. Para cada pantalla **eliminada**: marcar TCs como `[DEPRECADO vX.Y.Z]`
7. Actualizar `EC-GLOBAL.md`: agregar edge cases derivados de cambios
8. Actualizar tabla de inventario de pantallas en el `plan-de-pruebas.md` de la nueva versión
9. Actualizar tabla de índice de versiones en este README

### Criterio de completitud
El test plan de una versión está completo cuando:
- Toda pantalla del `release-summary.md` tiene al menos un TC happy path en el módulo correspondiente
- Todos los edge cases identificados en los docs de specs tienen entrada en `EC-GLOBAL.md`
- El `plan-de-pruebas.md` lista correctamente las pantallas nuevas de esa versión

---

## Convención de IDs de test cases

| Módulo | Prefijo | Ejemplo |
|--------|---------|---------|
| Auth | TC-AUTH-### | TC-AUTH-001 |
| Home | TC-HOME-### | TC-HOME-001 |
| Onboarding | TC-ONB-### | TC-ONB-001 |
| Profile | TC-PROF-### | TC-PROF-001 |
| Metrics | TC-MET-### | TC-MET-001 |
| Medition | TC-MEDI-### | TC-MEDI-001 |
| Tabs | TC-TAB-### | TC-TAB-001 |
| Edge Cases Auth | EC-AUTH-## | EC-AUTH-01 |
| Edge Cases Home | EC-HOME-## | EC-HOME-01 |
| Edge Cases Onboarding | EC-ONB-## | EC-ONB-01 |
| Edge Cases Profile | EC-PROF-## | EC-PROF-01 |
| Edge Cases Metrics | EC-MET-## | EC-MET-01 |
| Edge Cases Medition | EC-MEDI-## | EC-MEDI-01 |
| Edge Cases General | EC-GEN-## | EC-GEN-01 |
