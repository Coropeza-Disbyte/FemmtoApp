---
version: 3.2.0
screen: new-user-intro
risk_level: low
since: 3.2.0
last_modified: 2026-05-14
source_files:
  - src/features/NewUserIntro/index.js
  - src/features/NewUserIntro/containers/Intro/index.js
  - src/features/NewUserIntro/containers/Intro/sections/Page1/index.js
  - src/features/NewUserIntro/containers/Intro/sections/Page2/index.js
  - src/features/NewUserIntro/containers/Intro/sections/Page3/index.js
  - src/features/NewUserIntro/containers/Intro/sections/Page4/index.js
spec_file: tests/specs/auth/newUserIntro.spec.js
page_object: src/pages/auth/NewUserIntroPage.js
---

# [Auth] New User Intro — v3.2.0

> Tutorial de bienvenida de 4 páginas mostrado al completar el onboarding por primera vez. Explica las funcionalidades principales de la app. También accesible desde el menú (SupportContent).

---

## Acceso

- **Automático:** al completar el onboarding → saga `setShowIntro(true)` → root navigator muestra `NewUserIntroNavigator` antes de Home
- **Desde menú:** Home → Menu → "Cómo usar" → navega a `SupportContent` (mismo componente)
- **Prerequisito:** `user.onboarding_completed === true && showIntro === true` (store `newUserIntroReducer.showIntro`)
- **Retorna a:** Home Overview (al presionar "Empezar" en la última página)

---

## Condición de visibilidad (root navigator)

```js
if (user && showIntro && user.onboarding_completed) {
  return <NewUserIntroNavigator />;
}
```

El flag `showIntro` se activa en la saga de OnBoarding al completar el flow y se limpia (`false`) cuando el usuario presiona "Empezar" en la última página (`finishIntro` saga).

---

## Stack del módulo

```
NewUserIntroNavigator
  └── Intro (Swiper de 4 páginas)
```

---

## Intro — Pantalla principal

Swiper horizontal de 4 páginas con `react-native-swiper`. Sin paginación nativa — usa `PageIndicator` propio (puntos).

| Elemento | Tipo | Notas |
|----------|------|-------|
| StatusBar | color `theme.colors.primary[100]` | se restaura al salir |
| Swiper | componente | `loop={false}`, sin botones nativos, sin paginación nativa |
| PageIndicator | puntos | posición absolute, `bottom: 3%`, muestra página activa |
| Botón "Continuar" | avanza al siguiente | presente en páginas 1-3 |
| Botón "Empezar" | finaliza el intro | página 4, llama `finishIntro()` → navega a `Overview` |

### Contenido por página

| Página | Título | Subtítulo / Descripción |
|--------|--------|--------------------------|
| 1 | "Todo en un mismo lugar" | "Unificá todos tus dispositivos. Registrá y accedé a los datos de todos tus dispositivos FEMMTO desde una sola app." |
| 2 | "Agrega una medición" | "Usa el botón + para registrar tu primera medición. Suma tu peso, presión y glucosa y lleva un control completo de tu salud." |
| 3 | "Explorá tus datos" | "Visualiza y reorganiza tus datos como quieras. Tu información de salud cobra vida en tarjetas interactivas que podés ordenar y combinar según tus objetivos." |
| 4 | "Generá reportes médicos" | "Compartí tu progreso con profesionales. Generá reportes automáticos para enviar a tu médico y hacer seguimiento de tus mediciones." |

Cada página incluye una imagen ilustrativa (`assets/images/intro/intro-{1..4}.png`).

---

## Store

| Acción | Tipo | Efecto |
|--------|------|--------|
| `setShowIntro(true)` | SET_SHOW_INTRO | Muestra el intro al completar onboarding |
| `finishIntro()` | FINISH_INTRO | Pone `showIntro = false` → navega a Overview |
| `reset()` | RESET | Restaura estado inicial |

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.2.0 | Introducida | Tutorial post-onboarding de 4 páginas con Swiper |
