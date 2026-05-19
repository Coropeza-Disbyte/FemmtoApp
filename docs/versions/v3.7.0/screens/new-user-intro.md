---
version: 3.7.0
screen: new-user-intro
risk_level: medium
since: 3.0.1
last_modified: 2026-05-14
source_files:
  - src/features/NewUserIntro/index.js
  - src/features/NewUserIntro/containers/IntroOnboarding/index.js
  - src/features/NewUserIntro/containers/IntroMenu/index.js
  - src/features/NewUserIntro/components/IntroSwiper/index.js
spec_file: tests/specs/onboarding/onboarding.spec.js
page_object: src/pages/onboarding/OnboardingPage.js
---

# [Onboarding] NewUserIntro — v3.7.0

> Flow de introducción a la app que se muestra una sola vez al completar el onboarding. En v3.7.0 se refactorizó para usar el componente `IntroSwiper` (4 slides fijos), se agregó el container `IntroMenu` para el path desde el menú, y el navigator incorpora lógica de ruta inicial dinámica según el parámetro `fromMenu`.

---

## Acceso

- **Path onboarding** (primera vez): navigator activo cuando el usuario completó onboarding pero no vio el intro → ruta inicial `OnboardingSuccess`
- **Path menú**: `Home → Menu → "Ver intro"` → `NewUserIntroNavigator { fromMenu: true }` → ruta inicial `IntroMenu`
- **Retorna a:** Home (`StackActions.popToTop()` en HomeStack)

---

## Stack del módulo

```
NewUserIntroNavigator
  ├── OnboardingSuccess    ← ruta inicial (path onboarding)
  ├── Intro               ← IntroOnboarding container (usa IntroSwiper)
  ├── IntroMenu           ← nuevo en v3.7.0 (ruta inicial si fromMenu=true)
  └── HealthNativeIntro   ← HealthNavigator { isOnboarding: true }
```

### Lógica de ruta inicial

| `route.params.fromMenu` | Ruta inicial |
|-------------------------|--------------|
| `true` | `IntroMenu` |
| ausente / `false` | `OnboardingSuccess` |

---

## IntroSwiper — 4 slides (nuevo en v3.7.0)

El componente `IntroSwiper` reemplaza la pantalla de intro anterior. Muestra 4 slides fijos con paginación:

| Slide | Título | Descripción |
|-------|--------|-------------|
| 1 | `"Todo en un mismo lugar"` | `"Unificá todos tus dispositivos. Registrá y accedé a los datos de todos tus dispositivos FEMMTO desde una sola app."` |
| 2 | `"Agrega una medición"` | `"Usa el botón + para registrar tu primera medición. Suma tu peso, presión y glucosa y lleva un control completo de tu salud."` |
| 3 | `"Explorá tus datos"` | `"Visualiza y reorganiza tus datos como quieras. Tu información de salud cobra vida en tarjetas interactivas que podés ordenar y combinar según tus objetivos."` |
| 4 | `"Generá reportes médicos"` | `"Compartí tu progreso con profesionales. Generá reportes automáticos para enviar a tu médico y hacer seguimiento de tus mediciones."` |

Botón de finalización: activo en el último slide (slide 4).

---

## IntroOnboarding — Path de onboarding

Presenta `IntroSwiper`. Al finalizar (último slide → botón), ejecuta:

```
dispatch(shouldShowHealthNativeIntro(
  goToNativeIntro,       // → HealthNativeIntro
  finishAndGoHome,       // → dispatch(finishIntro) → Home (popToTop)
  goToDownloadHealthConnect  // → HealthNativeIntro { downloadHealthConnect: true }
))
```

La acción `shouldShowHealthNativeIntro` decide el destino según si el dispositivo soporta Health Native.

StatusBar: `theme.colors.primary[100]` al enfocar; reset al salir.

---

## IntroMenu — Path desde menú (nuevo en v3.7.0)

Presenta el mismo `IntroSwiper`. Al finalizar, navega directamente a Home sin verificar HealthNativeIntro:

```
navigation.getParent('HomeStack')?.dispatch(StackActions.popToTop())
```

StatusBar: `theme.colors.primary[100]` al enfocar; reset al salir.

### Diferencia clave entre paths

| | IntroOnboarding | IntroMenu |
|-|----------------|-----------|
| Trigger | Primera vez post-onboarding | Desde menú (fromMenu=true) |
| Al finalizar | Verifica `shouldShowHealthNativeIntro` → puede ir a HealthNativeIntro | Siempre va directo a Home |

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.0.1 | Baseline | Pantalla de intro existente desde el inicio del tracking |
| v3.7.0 | Modificado | Refactorización a IntroSwiper (4 slides); nuevo container IntroMenu para path desde menú; lógica de initialRoute dinámica por `fromMenu` param |
