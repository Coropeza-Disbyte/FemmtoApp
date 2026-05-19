---
version: 3.4.0
screen: health-native-intro
risk_level: medium
since: 3.4.0
last_modified: 2026-05-14
source_files:
  - src/features/HealthNativeIntro/index.js
  - src/features/HealthNativeIntro/containers/Overview/index.js
  - src/features/HealthNativeIntro/containers/Instructions/index.js
  - src/features/HealthNativeIntro/containers/Success/index.js
  - src/features/HealthNativeIntro/containers/DownloadHealthConnect/index.js
  - src/features/HealthNativeIntro/stores/actions/index.js
  - src/features/HealthNativeIntro/stores/sagas/index.js
spec_file: tests/specs/home/healthNativeIntro.spec.js
page_object: src/pages/home/HealthNativeIntroPage.js
---

# [Home] Health Native Intro — v3.4.0

> Onboarding de integración con Health Connect (Android) o Apple Health (iOS). Permite al usuario autorizar a Femmto para importar datos de pasos y frecuencia cardíaca desde la plataforma de salud nativa del dispositivo.

---

## Acceso

- **Desde:** Home → tap card Frecuencia Cardíaca o Pasos (si aún no se otorgaron permisos)
- **Automático:** la saga `shouldShowHealthIntro` evalúa si el usuario necesita ver el intro antes de mostrar los datos de salud nativa
- **Prerequisito:** usuario autenticado; en Android, Health Connect instalado (si no está → `DownloadHealthConnect`)
- **Retorna a:** Home Overview (al finalizar o al presionar "Ahora no")

---

## Stack del módulo

```
HealthNativeIntroNavigator
  ├── DownloadHealthConnect   ← Android only, si Health Connect no está instalado
  ├── OverviewHealth          ← pantalla inicial (por defecto)
  ├── Instructions            ← solicitud de permisos
  └── Success                 ← confirmación de permisos otorgados
```

### Initial route

| Param `downloadHealthConnect` | Ruta inicial |
|-------------------------------|--------------|
| `true` | `DownloadHealthConnect` |
| ausente / `false` | `OverviewHealth` |

---

## Lógica de visibilidad (`shouldShowHealthIntro`)

La saga evalúa:
1. Si `healthNativeIntroReducer.showHealthIntro === false` → salta el intro directamente
2. En Android: verifica `healthConnectStatus()`. Si `SDK_AVAILABLE` → muestra `OverviewHealth`. Si no disponible → muestra `DownloadHealthConnect`
3. En iOS: verifica disponibilidad de HealthKit → muestra `OverviewHealth`

---

## DownloadHealthConnect — Solo Android

Pantalla intermedia cuando Health Connect no está instalado.

| Elemento | Notas |
|----------|-------|
| Imagen | `health-onboarding-android-1.png` |
| Título | "Sincroniza automáticamente tus lecturas con Salud Connect" |
| Descripción | "Descarga la aplicación Health Connect para importar y exportar datos..." |
| Botón "Descargar" | Abre Play Store: `market://details?id=com.google.android.apps.healthdata` |
| Botón "Ahora no" | `logHealthNativeAuthorization({ status: 'unauthorized' })` → `finishIntro()` → Home |

Monitorea `AppState`: cuando la app vuelve al primer plano (foco), llama `isHealthConnectAvailable()`. Si ya está disponible → navega a `Instructions`.

---

## OverviewHealth — Pantalla principal

| Elemento | Notas |
|----------|-------|
| Fondo | `LinearGradient` `#C7D6E9 → #FFFFFF` |
| StatusBar | `#CAD8EA` |
| Imagen | Android: `health-onboarding-android-1.png` / iOS: `health-onboarding-ios-1.png` |
| Título | Android: "Sincroniza automáticamente tus lecturas con Salud Connect" / iOS: "…con Salud de Apple" |
| Descripción | Android: "Activa la aplicación Salud Connect para importar y exportar datos…" / iOS: similar |
| Botón "Continuar" | navega a `Instructions` |
| Botón "Ahora no" | `logHealthNativeAuthorization({ status: 'unauthorized' })` → `finishIntro()` → Home `Overview` |

---

## Instructions — Solicitud de permisos

| Elemento | Notas |
|----------|-------|
| Fondo | `LinearGradient` `#C7D6E9 → #FFFFFF` |
| StatusBar | `#CAD8EA` |
| Imagen | Android: `health-onboarding-android-2.png` / iOS: `health-onboarding-ios-2.png` |
| Título | Android: "En la pantalla siguiente selecciona 'Permitir todas' y a continuación 'Permitir'." / iOS: "…selecciona 'Activar todas'…" |
| Descripción | "Mantendremos tus datos privados y protegidos." |
| Botón "Continuar" | `dispatch(requestHealthNativePermissions(...))` → abre diálogo nativo de permisos |

Tanto `onRequestPermissionsSuccess` como `onRequestPermissionsError` navegan a `Success` (el diálogo nativo ya dio la oportunidad al usuario).

---

## Success — Confirmación

| Elemento | Notas |
|----------|-------|
| Fondo | `LinearGradient` `#C7D6E9 → #FFFFFF` |
| StatusBar | `#CAD8EA` |
| Imagen | Android: `health-onboarding-android-3.png` / iOS: `health-onboarding-ios-3.png` |
| Título | Android: "¡Todo listo! La Femmto app ahora está sincronizada con Salud Connect." / iOS: "…con Salud de Apple." |
| Descripción | "Siempre puedes acceder a estas configuraciones a través de la pestaña Compartir en la aplicación Femmto." |
| Botón "Continuar" | `finishIntro()` → `dispatch(refresh())` → Home `Overview` |

---

## Store

| Acción | Efecto |
|--------|--------|
| `setShowIntro(false)` | Oculta el intro en futuras sesiones |
| `finishIntro()` | Pone `showHealthIntro = false` → ejecuta callback |
| `SHOULD_SHOW_HEALTH_NATIVE_INTRO` | Saga que evalúa si mostrar el intro o saltar directo |

---

## Analytics

| Evento | Cuándo |
|--------|--------|
| `logHealthNativeAuthorization({ status: 'unauthorized' })` | Tap "Ahora no" en Overview o DownloadHealthConnect |

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.4.0 | Introducida | Onboarding Health Connect (Android) + Apple Health (iOS) |
