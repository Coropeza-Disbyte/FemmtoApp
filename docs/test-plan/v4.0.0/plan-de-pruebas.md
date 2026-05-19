---
version_produccion: 4.0.0
last_modified: 2026-05-14
---

# Plan de Pruebas E2E — Femmto App v4.0.0

---

## 1. Objetivo

Validar de forma integral el comportamiento funcional de la aplicación móvil Femmto en su versión de producción actual (v4.0.0) mediante pruebas end-to-end automatizadas con WebdriverIO + Appium sobre Android. El plan cubre elementos de UI, flujos de navegación, lógica de negocio, validaciones de formulario y comportamiento condicional por estado de usuario.

---

## 2. Alcance

### Incluido

| Módulo | Qué se valida |
|--------|--------------|
| Auth | Flujo completo de registro nuevo usuario (Welcome → MeetUser → NotificationPermission → FirstMeasure → SaveOnboardingProgress) y login con email/password |
| Home | Pantalla principal con ObjectiveTabs, TourGuide, widgets de métricas, HealthyHabitSection, TrendsSection, grid de métricas, header con routing inteligente |
| Onboarding | NewUserIntro (4 slides), Onboarding steps (SetName, SetBirthdate, SetGender, SetWeight, SetHeight, SetPicture) |
| Profile | Visualización y edición de datos de perfil, selección de país, edición de targets, acceso al menú y cierre de sesión |
| Metrics | Pantallas de detalle de cada métrica (Weight, Pressure, Glucose, HeartRate, Steps, Metabolism) |
| Medition | Flujos de medición manual y Bluetooth para tensiómetro, glucómetro y balanza |
| Tabs | Devices (listado y vinculación), Reminders (CRUD de recordatorios), Share (generación de reportes) |
| Notificaciones | Solicitud de permisos push, lista de notificaciones, preferencias de notificaciones |
| HotFemmtoModal | Visibilidad condicional por país y por fecha, comportamiento de CTA |

### Excluido

- Login con Apple ID (requiere dispositivo físico iOS)
- Conectividad real Bluetooth con dispositivos físicos (cubierto por tests manuales)
- Comportamiento offline / sin conexión a internet
- Notificaciones push reales en dispositivo (requiere entorno certificado)
- Tests de performance o carga

---

## 3. Versión y entorno

| Parámetro | Valor |
|-----------|-------|
| Versión app | 4.0.0 |
| APK | `3.8.0.apk` (usar APK de v4.0.0 cuando esté disponible) |
| Framework | WebdriverIO 9.27.1 + Appium 2.19.0 + UiAutomator2 3.10.0 |
| SO Android | 13.0 |
| Device | Emulador `emulator-5554` o dispositivo físico con USB Debugging |
| Rama de referencia | `feat/version-4.0.0` (repo React Native) |

---

## 4. Tipos de prueba

| Tipo | Descripción | Cobertura |
|------|-------------|-----------|
| Happy path | Flujo principal sin errores con datos válidos | Todos los módulos |
| Negativo | Entradas inválidas, campos vacíos, credenciales incorrectas | Auth, formularios |
| Condicional | Comportamiento que varía según estado del usuario (country, targets, hasSeenTour) | Home, HotFemmtoModal, TourGuide |
| Edge case | Situaciones límite documentadas en `EC-GLOBAL.md` | Todos los módulos |
| Regresión | Verificar que funcionalidad existente no se rompió | Suites smoke + critical |

---

## 5. Prioridades de ejecución

### Prioridad Alta — Bloqueantes del negocio

| TC | Pantalla | Motivo |
|----|----------|--------|
| TC-AUTH-004 | Login email/password | Sin login el usuario no puede usar la app |
| TC-AUTH-010 | MeetUser completo | Bloquea el registro de usuario nuevo |
| TC-AUTH-020 | SaveOnboardingProgress | Bloquea la creación de cuenta |
| TC-HOME-001 | Home carga post-login | Pantalla central de la app |
| TC-HOME-010 | Botón "Nueva medición" | Acceso principal a medición en v4.0 |
| TC-MEDI-001 | PressureOCR manual | Flujo de medición core |
| TC-MEDI-003 | Glucómetro manual | Flujo de medición core |
| TC-MEDI-005 | Balanza manual | Flujo de medición core |

### Prioridad Media — Funcionalidad crítica

| TC | Pantalla |
|----|----------|
| TC-HOME-004 | ObjectiveTabs cambio de tab |
| TC-HOME-008 | HealthyHabit marcar hábito del día |
| TC-PROF-001 | UserProfile visualización de datos |
| TC-PROF-003 | EditCountry selección de país |
| TC-MET-001..007 | Pantallas de detalle por métrica |
| TC-TAB-004 | Crear recordatorio |

### Prioridad Baja — Features complementarias

| TC | Pantalla |
|----|----------|
| TC-HOME-002 | TourGuide primera vez |
| TC-HOME-014 | HotFemmtoModal condicional AR |
| TC-HOME-018 | Notifications lista |
| TC-ONB-001 | NewUserIntro slides |
| TC-TAB-006 | Share generación de reporte |

---

## 6. Suites de ejecución

| Suite | Archivo | Contenido | Cuándo correr |
|-------|---------|-----------|---------------|
| smoke | `tests/suites/smoke.js` | TCs de prioridad alta sin version guard | Antes de cada PR a main |
| critical | `tests/suites/critical.js` | Login + medición + perfil | En cada build de producción |
| regression | `tests/suites/regression.js` | Todos los specs | Antes de cada release |

---

## 7. Datos de prueba

Todos los datos de prueba son **sintéticos**. Definidos en `src/fixtures/auth/users.json`.

| Usuario | Tipo | Uso |
|---------|------|-----|
| `validUser` | Usuario registrado con perfil completo | Login, navegación general |
| `newUser` | Usuario en proceso de registro | Flujos de onboarding |
| `arUser` | Usuario con `country: 'AR'` | Validación HotFemmtoModal |
| `providerUser` | Usuario registrado con Google | SaveOnboardingProgress (flujo sin password) |

---

## 8. Criterios de entrada y salida

### Criterios de entrada (para comenzar a correr)

- APK instalado en el emulador y accesible en `apps/`
- Servidor Appium corriendo (`npm run appium` o service de wdio)
- Variables `.env` configuradas con `APP_VERSION=4.0.0`
- Emulador inicializado y visible en `adb devices`

### Criterios de salida (para declarar el ciclo completo)

- Todos los TCs de prioridad alta en estado PASS
- No hay fallas nuevas en TCs de prioridad media respecto al ciclo anterior
- Screenshots de fallas adjuntos en `screenshots/`
- Reporte de cobertura generado con `npm run coverage`

---

## 9. Pantallas nuevas en v4.0.0 respecto a v3.9.0

| Pantalla | Tipo de cambio | TCs afectados |
|----------|---------------|---------------|
| Home | Rediseño completo (ObjectiveTabs, TourGuide, grid 2 col) | TC-HOME-001 al TC-HOME-013 |
| Bottom nav | 5 tabs → 4 tabs (eliminado "Medición") | TC-HOME-013 |
| Header Home | Botón ayuda → botón "Nueva medición" con routing | TC-HOME-010 |

Las demás pantallas de la app no cambiaron entre v3.9.0 y v4.0.0.
