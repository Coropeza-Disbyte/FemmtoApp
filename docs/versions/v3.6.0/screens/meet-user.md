---
version: 3.6.0
screen: meet-user
risk_level: high
since: 3.6.0
last_modified: 2026-05-14
source_files:
  - src/features/MeetUser/index.js
  - src/features/MeetUser/containers/Greeting/index.js
  - src/features/MeetUser/containers/Instructions/index.js
  - src/features/MeetUser/containers/Questions/index.js
  - src/features/MeetUser/containers/Questions/utils.js
  - src/features/MeetUser/containers/CompleteProfile/index.js
  - src/features/MeetUser/containers/CompleteProfileSuccess/index.js
spec_file: tests/specs/auth/meetUser.spec.js
page_object: src/pages/auth/MeetUserPage.js
---

# [Auth] MeetUser — v3.6.0

> Flow de onboarding para conocer al usuario nuevo. Recopila objetivos de salud, motivaciones, cómo conoció la app y frecuencia de uso. Al finalizar, el usuario nuevo avanza a NotificationPermission; los usuarios existentes que completan su perfil desde Home van a CompleteProfileSuccess.

---

## Acceso

- **Desde (nuevo usuario):** Welcome → "Ingresar por primera vez" → MeetUserQuestions
- **Desde (usuario existente sin perfil):** Home → checkProfileCompleted detecta perfil incompleto → `MeetUserQuestions { completeProfile: true }`
- **Prerequisito:** ninguno (flujo pre-login)
- **Retorna a:** según path (ver navegación por pantalla)

---

## Stack del módulo

```
MeetUserNavigator
  ├── Greeting            ← ruta inicial (onboarding nuevo usuario)
  ├── Instructions
  ├── Questions           ← 4 preguntas con stepper
  ├── CompleteProfile     ← ruta inicial si { completeProfile: true }
  └── CompleteProfileSuccess
```

### Lógica de ruta inicial

| Param `completeProfile` | Ruta inicial |
|-------------------------|--------------|
| `true` | `CompleteProfile` |
| ausente / `false` | `Greeting` |

---

## Greeting — Pantalla de bienvenida

| Elemento | Notas |
|----------|-------|
| Fondo degradado | `#C7D6E9` → blanco |
| Imagen | `greeting.png` (width 100%, height 400) |
| Texto título | `"¡Hola!"` + `"Somos Femmto."` — fontWeight 600, fontSize 24 |
| Texto subtítulo | `"Te acompañamos en el camino hacia una vida más saludable."` |
| Botón | `"Empezar"` — colorScheme primary → navega a `Instructions` |

Analytics: `logOnboardingStart()`.
StatusBar: `useStatusBarColorOnFocus('#C7D6E9')`.

---

## Instructions — Explicación del proceso

| Elemento | Notas |
|----------|-------|
| Fondo degradado | `#C7D6E9` → blanco |
| Imagen | `greeting.png` |
| Texto | `"Queremos conocerte."` + `"Comenzaremos con 4 preguntas rápidas. Luego, haremos tu primera medición para activar tus tarjetas."` |
| Botón | `"Continuar"` → navega a `Questions` |

StatusBar: `useStatusBarColorOnFocus('#C7D6E9')`.

---

## Questions — Cuestionario de 4 pasos

Gestiona 4 secciones con `RemovableView` (hidden por posición). Stepper visual (`QuestionsStepper`) en el header.

### Estado local

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `currentPosition` | number (0–3) | Paso actual |
| `targets` | string[] | Objetivos seleccionados (multi-select) |
| `motivations` | string[] | Motivaciones seleccionadas (multi-select) |
| `howKnow` | string | Cómo conoció la app (single-select) |
| `frequency` | string | Frecuencia de uso (single-select) |

### Paso 0 — Targets (objetivos)

Opciones multi-select con ícono activo/inactivo:

| Valor | Texto |
|-------|-------|
| `control_blood_pressure` | "Controlar mi presión arterial" |
| `control_heart_rate` | "Controlar mi frecuencia cardíaca" |
| `control_weight` | "Hacer seguimiento de mi peso" |
| `control_glucose` | "Monitorear mi glucosa en sangre" |
| `control_steps` | "Controlar mi actividad física/pasos" |
| `control_general` | "Llevar control general" |

Analytics: `logOnboardingGoalsSelected(...)`.

### Paso 1 — Motivations (motivaciones)

Opciones multi-select:

| Valor | Texto |
|-------|-------|
| `medical_recommendation` | "Recomendación médica" |
| `existing_condition` | "Controlar una condición existente" |
| `improve_habits` | "Mejorar mis hábitos" |
| `new_habits` | "Incorporar nuevos hábitos" |
| `quality_of_life` | "Mejorar mi calidad de vida" |
| `all` | "Todas las anteriores" |

Analytics: `logOnboardingMotivationsSelected(...)`.

### Paso 2 — HowKnow (cómo conoció la app)

Single-select:

| Valor | Texto |
|-------|-------|
| `buy_femmto_product` | "Compré un producto Femmto" |
| `medical_recommendation` | "Recomendación médica" |
| `friends_family` | "Amigos/Familiares" |
| `app_store` | "App store/Play store" |
| `social_media` | "Redes sociales/Publicidad" |

Analytics: `logOnboardingSourceSelected(...)`.

### Paso 3 — Frequency (frecuencia)

Single-select con subLabel contextual:

| Valor | Texto | SubLabel |
|-------|-------|----------|
| `several_times_a_day` | "Varias veces al día" | "(Ideal para glucómetros)" |
| `once_a_day` | "Una vez al día" | "(Ideal para presión arterial)" |
| `some_times_a_week` | "Algunas veces a la semana" | "(Ideal para control de peso)" |
| `only_when_needed` | "Solo cuando lo necesite" | "(Uso ocasional)" |

Analytics: `logOnboardingFrequencySelected(...)`.

### Navegación al finalizar

| Condición | Destino |
|-----------|---------|
| `completeProfile = false` (nuevo usuario) | `dispatch(setMeetUserData(...))` → `NotificationPermission` |
| `completeProfile = true` (usuario existente) | `dispatch(completeProfileData(...))` → `CompleteProfileSuccess` |

Validación antes de avanzar del paso 3: todos los campos deben estar completos (`targets.length > 0 && motivations.length > 0 && howKnow !== null && frequency !== null`).

Botón "atrás": en paso 0 → `navigation.goBack()`; en pasos 1–3 → `setCurrentPosition(currentPosition - 1)`.

StatusBar: `useStatusBarColorOnFocus('white')`.

---

## CompleteProfile — Para usuarios existentes

Pantalla de invitación para completar el perfil (solo accesible con `{ completeProfile: true }`).

| Elemento | Notas |
|----------|-------|
| Fondo degradado | `#C7D6E9` → blanco |
| Botón principal | `"Actualizar mis objetivos"` → `logOldUserOnboardingStart()` → `Questions` |
| Botón secundario | `"Ahora no"` → `dispatch(setShowCompleteProfileView(false))` → `navigation.goBack()` |

StatusBar: `useStatusBarColorOnFocus('#C7D6E9')`.

---

## CompleteProfileSuccess — Confirmación para usuario existente

| Elemento | Notas |
|----------|-------|
| Imagen | `success-green-icon.png` |
| Botón | Finalizar → `logOldUserOnboardingComplete()` → `StackActions.replace('initTab')` |

StatusBar: `useStatusBarColorOnFocus('#C7D6E9')`.

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.6.0 | Introducida | Flow de onboarding: cuestionario de 4 pasos + complete profile para usuarios existentes |
