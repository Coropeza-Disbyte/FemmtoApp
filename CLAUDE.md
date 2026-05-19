> Antes de operar, leer: [IA.md](./IA.md) — Quality Intelligence Governance

# Mobile Automation Framework — Especificaciones del Proyecto

## Stack tecnológico

| Componente       | Versión  | Rol                                      |
|------------------|----------|------------------------------------------|
| Node.js          | 22.x     | Runtime                                  |
| WebdriverIO      | 9.27.1   | Test runner y API de automatización      |
| Appium           | 2.19.0   | Servidor de automatización mobile        |
| UiAutomator2     | 3.10.0   | Driver Android (instalado en node_modules) |
| Mocha            | via wdio | Framework de tests (BDD: describe/it)    |
| dotenv           | 16.x     | Variables de entorno                     |

> Appium 2.x tiene el driver UiAutomator2 instalado localmente (en `node_modules`), NO globalmente.
> El Appium global en el sistema es v1.22.3 — NO usar. Siempre correr via `npm run appium` o el service de wdio.

---

## Estructura del proyecto

```
FrameWork Mobile/
├── CLAUDE.md                        ← este archivo
├── wdio.conf.js                     ← configuración central + hooks globales
├── package.json
├── .env                             ← variables locales (gitignored)
├── .env.example                     ← plantilla de variables
├── apps/                            ← APKs (gitignored)
├── screenshots/                     ← capturas en fallo (gitignored, auto-generado)
├── src/
│   ├── config/
│   │   ├── capabilities.js          ← capabilities Android (lee de .env)
│   │   ├── timeouts.js              ← constantes: DEFAULT, LONG, SHORT, ANIMATION
│   │   ├── coverage.js              ← script de cobertura por versión
│   │   └── versions.json            ← registro de versiones + featureCatalog + features por versión
│   ├── pages/
│   │   ├── BasePage.js              ← clase base — NO instanciar directamente
│   │   ├── index.js                 ← barrel export de todos los Page Objects
│   │   ├── auth/                    ← WelcomePage, LoginPage, SignUpPage, ResetPasswordPage,
│   │   │                               NotificationPermissionPage, MeetUserPage, SaveOnboardingProgressPage
│   │   ├── onboarding/              ← SetNamePage, SetBirthdatePage, SetGenderPage,
│   │   │                               SetWeightPage, SetHeightPage, SetPicturePage
│   │   ├── home/                    ← HomePage
│   │   ├── tabs/                    ← DevicesPage, MeditionPage, RemindersPage, SharePage
│   │   ├── profile/                 ← ProfilePage, MenuPage
│   │   ├── metrics/                 ← *DetailsPage, *HistoryPage (Weight, Presure, Glucose,
│   │   │                               HeartRate, Metabolism, Steps)
│   │   └── medition/                ← AddGlucosePage, NewGlucometerPage, NewPresurePage,
│   │                                    NewScalePage, FirstMeasurePage
│   ├── flows/
│   │   └── auth.flow.js             ← loginAs(), launchAndLogin()
│   ├── helpers/
│   │   ├── gestures.js              ← swipeUp/Down/Left, longPress (W3C Actions)
│   │   ├── waitUtils.js             ← waits personalizados
│   │   └── versionGuard.js          ← skipIfBefore(version) — version gating en specs
│   └── fixtures/
│       ├── index.js                 ← barrel export de fixtures
│       └── auth/
│           └── users.json
├── docs/
│   └── specs/                       ← documentación funcional por pantalla
│       ├── auth/                    ← Welcome.md, Login.md, SignUp.md, ResetPassword.md, ...
│       ├── home/                    ← Home.md, AddChangeSymptoms.md, HealthNativeIntro.md
│       ├── medition/                ← FirstMeasure.md, AddGlucoseMeasure.md, ...
│       ├── metrics/                 ← WeightDetails.md, WeightHistory.md, ...
│       ├── profile/                 ← Profile.md, Menu.md
│       └── tabs/                    ← Devices.md, NewMedition.md, Reminders.md, Share.md
└── tests/
    ├── specs/
    │   ├── welcome/                 ← welcome.spec.js
    │   ├── auth/                    ← login, signup, resetPassword, meetUser, saveOnboardingProgress
    │   ├── onboarding/              ← onboarding.spec.js (cubre los 6 steps)
    │   ├── home/                    ← home.spec.js
    │   ├── tabs/                    ← devices, medition, reminders, share
    │   ├── profile/                 ← profile.spec.js (cubre Profile + Menu)
    │   ├── metrics/                 ← metricsDetail.spec.js, measurementHistory.spec.js
    │   └── medition/                ← newMedition.spec.js
    └── suites/
        ├── smoke.js                 ← tests críticos de humo (rápidos, sin features versionadas)
        ├── regression.js            ← cobertura completa, todos los specs
        └── critical.js              ← flujos bloqueantes del negocio
```

---

## Reglas de arquitectura

### Page Objects
- Cada pantalla = un archivo en `src/pages/<modulo>/NombrePage.js`
- **Exportar la clase, nunca el singleton** (`module.exports = NombrePage`, NO `new NombrePage()`)
- Los tests instancian: `const page = new LoginPage()`
- Los getters de locators usan `this.$id()` como primera opción (ver prioridad de locators)
- El método `isLoaded()` es obligatorio en todo Page Object — valida que la pantalla está visible

### Flows
- Un flow es una secuencia de acciones multi-pantalla reutilizable como precondición
- Se ubican en `src/flows/<nombre>.flow.js`
- Los specs **nunca** repiten lógica de navegación — siempre importan el flow correspondiente
- **NUNCA** definir una función local `loginAndGoHome()` o similar dentro de un spec file
- Ejemplo correcto: `await loginAs(users.validUser)` usando `src/flows/auth.flow.js`

### Specs
- Un spec por pantalla/módulo: `tests/specs/<modulo>/nombrePantalla.spec.js`
- Prefijo del describe con el módulo: `describe('[auth] Login Screen', ...)`
- Cada `it` instancia su propio Page Object — nunca compartir instancia entre tests
- Los hooks `beforeEach/afterEach` de ciclo de app van en `wdio.conf.js`, no en los specs
- Los specs solo describen comportamiento: arrange → act → assert
- **Si el spec cubre una feature con `"since": "X.Y.Z"` en versions.json**, debe incluir version guard (ver sección Version Gating)

### Fixtures
- Datos de prueba en `src/fixtures/<modulo>/nombre.json`
- Datos **siempre sintéticos** — nunca credenciales reales
- Acceder via barrel: `require('../fixtures').authUsers` o directo al json del módulo

### Suites
- `smoke`: features core sin constraints de versión — debe correr contra cualquier APK soportado
- `regression`: cobertura completa, corre en pipeline o antes de release
- `critical`: flujos que bloquean al usuario si fallan (login, medición, perfil)
- Las suites no filtran por versión — el filtrado ocurre en cada spec via `versionGuard`

---

## Prioridad de locators (de más a menos estable)

| Prioridad | Estrategia        | Método en BasePage    | Cuándo usar                          |
|-----------|-------------------|-----------------------|--------------------------------------|
| 1         | `resource-id`     | `this.$id('pkg:id/x')` | Primera opción siempre              |
| 2         | `accessibility id`| `this.$('content-desc')` | Si el dev define content-desc     |
| 3         | UIAutomator2 text | `this.$text('Texto')`  | Textos estáticos sin id             |
| 4         | UIAutomator2 contains | `this.$contains('x')` | Textos dinámicos parciales      |
| 5         | XPath             | `$('//...')`          | Último recurso — frágil             |

**Nunca usar índices de posición** (`[0]`, `[1]`) — rompen con cualquier cambio de layout.

> La app actualmente NO tiene `testID` ni `accessibilityLabel`. Los selectores dependen de texto visible.
> Solicitar al equipo dev que agreguen: `<TouchableOpacity testID="login-btn" accessibilityLabel="Ingresar">`

---

## Variables de entorno (`.env`)

```
APP_PATH=./apps/app-debug.apk        # Ruta al APK
APP_PACKAGE=com.example.app          # Package name de la app
APP_ACTIVITY=com.example.app.MainActivity
DEVICE_NAME=emulator-5554            # nombre del device (adb devices)
PLATFORM_VERSION=13.0                # versión de Android
APP_VERSION=3.8.0                    # versión del APK bajo test (activa version gating)
```

`APP_VERSION` es opcional pero **recomendado**: activa los guards en specs con `since`, evitando
que tests de features no disponibles se ejecuten contra APKs más antiguos.

Copiar `.env.example` como `.env` y completar con valores reales antes de ejecutar.

---

## Comandos disponibles

```bash
npm test                             # Todos los specs
npm run test:smoke                   # Suite smoke
npm run test:spec -- --spec tests/specs/auth/login.spec.js          # Spec individual
npm run test:spec -- --spec tests/specs/auth/login.spec.js --spec tests/specs/auth/resetPassword.spec.js  # Múltiples specs
npm run appium                       # Iniciar servidor Appium manualmente
npm run coverage                     # Cobertura de la versión actual (versions.current)
npm run coverage:v3.7.3              # Cobertura de una versión específica
```

> El wdio service levanta Appium automáticamente al correr tests. `npm run appium` es solo para debug manual.

> **IMPORTANTE — uso correcto de `test:spec`:**
> El script es `wdio run wdio.conf.js` (sin `--spec` al final). Siempre pasar `--spec` via `--`:
> ```bash
> npm run test:spec -- --spec <archivo>           # correcto
> npm run test:spec -- --spec <a> --spec <b>      # múltiples specs: repetir el flag
> ```
> **NO usar** `npm run test:spec -- --spec a,b,c` (lista con comas): wdio no lo soporta y falla con "pattern did not match any file".

---

## Hooks globales (wdio.conf.js)

| Hook        | Qué hace                                                      |
|-------------|---------------------------------------------------------------|
| `beforeSuite` | Imprime el nombre de la suite en consola                    |
| `afterTest`   | Si el test falló, toma screenshot automático en `screenshots/` |
| `afterEach`   | Cierra la app (`driver.closeApp()`) — los specs no necesitan `afterEach` |

---

## Cómo agregar una nueva pantalla

1. Crear `src/pages/<modulo>/NombrePantalla.js` extendiendo `BasePage`
2. Agregar al barrel `src/pages/index.js`
3. Crear `tests/specs/<modulo>/nombrePantalla.spec.js`
4. Si la feature es nueva (no existía desde v3.0.1), agregar `"since": "X.Y.Z"` exacto
5. Agregar version guard al describe del spec si tiene `since` (ver sección Version Gating)
6. Actualizar `src/config/versions.json`:
   - Agregar a `featureCatalog`: `pageObjectFile`, `specFile`, `doc`
   - Agregar a la versión actual en `features`: flags + `since` si aplica
   - Agregar la feature a `screensAusentes` de todas las versiones anteriores a su `since`
7. Crear doc en `docs/specs/<modulo>/NombrePantalla.md` con `**Aplica desde:** vX.Y.Z`
8. Agregar el spec a la suite correspondiente en `tests/suites/`
9. Si la pantalla es precondición de otros tests, crear o actualizar un flow en `src/flows/`

---

## Entorno Android — rutas y comandos

`adb` y `emulator` no están en el PATH del sistema. Siempre usar rutas absolutas o los scripts de `package.json`.

### Rutas absolutas (Windows)

```
ADB:      C:\Users\coropeza2\AppData\Local\Android\Sdk\platform-tools\adb.exe
EMULATOR: C:\Users\coropeza2\AppData\Local\Android\Sdk\emulator\emulator.exe
```

### Emuladores disponibles

| AVD | Uso recomendado |
|-----|----------------|
| Pixel_7 | Android 17 |
| Pixel_7_Pro | Alternativo |
| Pixel_7a | Alternativo |
| Pixel_9_Pro_XL | Android 16 — pantalla grande |
| Small_Phone | Pruebas de layout compacto |

### Scripts npm disponibles

```bash
npm run emulator        # Inicia Pixel_7 (AVD por defecto)
npm run emulator:wait   # Espera a que el boot complete (usar tras npm run emulator)
npm run devices         # Lista devices conectados (equivale a adb devices)
```

### Protocolo de arranque antes de ejecutar tests

Cuando el usuario solicita ejecutar el test plan o cualquier suite, seguir este orden **siempre**:

1. **Verificar si hay device activo:**
   ```
   npm run devices
   ```
   Si la lista está vacía → continuar con paso 2. Si hay device → saltar a paso 4.

2. **Iniciar el emulador en background:**
   ```
   npm run emulator
   ```
   (lanzar en background — el emulador tarda ~30 segundos en bootear)

3. **Esperar boot completo:**
   ```
   npm run emulator:wait
   ```
   Esperar mensaje `Device ready` antes de continuar.

4. **Actualizar `.env` con la versión del APK a testear:**
   ```
   APP_PATH=./X.Y.Z(build).apk
   APP_VERSION=X.Y.Z
   ```
   Los APKs disponibles están en la raíz del proyecto (no en `apps/`).

5. **Ejecutar tests:**
   ```bash
   npm run test:smoke       # validación rápida (siempre primero)
   npm test                 # suite completa
   npm run test:spec -- --spec tests/specs/<modulo>/<spec>.spec.js
   ```

### APKs disponibles en la raíz

| Versión | Archivo |
|---------|---------|
| 3.1.0 | `3.1.0.apk` |
| 3.8.0 (build 1017) | `3.8.0(1017).apk` |
| 4.0.0 (build 1022) | `4.0.0(1022).apk` |

### Diagnóstico del entorno (primera vez)

```bash
npx appium driver run uiautomator2 doctor
```

Requisitos del sistema:
- Java JDK 11+ con `JAVA_HOME` configurado
- Android SDK instalado en `C:\Users\coropeza2\AppData\Local\Android\Sdk`
- Emulador creado en Android Studio (AVDs ya configurados — ver tabla arriba)

---

## Convenciones de nombres

| Artefacto        | Convención                          | Ejemplo                    |
|------------------|-------------------------------------|----------------------------|
| Page Object      | PascalCase + sufijo `Page`          | `ProductDetailPage.js`     |
| Flow             | camelCase + sufijo `.flow.js`       | `checkout.flow.js`         |
| Spec             | camelCase + sufijo `.spec.js`       | `productDetail.spec.js`    |
| Fixture file     | camelCase + `.json`                 | `products.json`            |
| Describe label   | `[modulo] Nombre pantalla`          | `[shop] Product Detail`    |
| It label         | `should <verbo> <resultado>`        | `should display price`     |

---

## Lo que NO hacer

- No escribir `xpath` como primera estrategia de localización
- No exportar Page Objects como singleton (`new Page()` en el module.exports)
- No poner `beforeEach/afterEach` en specs para ciclo de app — ya está en los hooks globales
- No hardcodear credenciales, packages o rutas — todo via `.env`
- No usar `touchAction` — está deprecado en Appium 2; usar `driver.performActions` (W3C)
- No agregar specs a `tests/specs/` raíz — siempre dentro de la carpeta del módulo
- **No definir helpers de navegación locales en specs** (ej: `loginAndGoHome()`) — usar `src/flows/auth.flow.js`
- **No usar `"since": ">X.Y.Z"` o `"por confirmar"`** en versions.json — siempre versión exacta o sin campo
- **No agregar una feature con `"since"` sin actualizar `screensAusentes`** en versiones anteriores
- **No marcar `"spec": true` en versions.json si el spec file no existe en disco**
- **No omitir el campo `doc` en featureCatalog** si el archivo `.md` en docs/specs/ existe

---

## Trazabilidad y versions.json

`src/config/versions.json` es el registro central del framework. Tiene tres niveles:

### 1. featureCatalog (top-level, independiente de versión)
Mapea cada feature a sus archivos físicos. Es la fuente de verdad para navegación y verificación:

```json
"featureCatalog": {
  "Login": {
    "pageObjectFile": "src/pages/auth/LoginPage.js",
    "specFile":       "tests/specs/auth/login.spec.js",
    "doc":            "docs/specs/auth/Login.md"
  },
  "HeartRateDetails": {
    "pageObjectFile": "src/pages/metrics/HeartRateDetailsPage.js",
    "specFile":       "tests/specs/metrics/metricsDetail.spec.js",
    "doc":            "docs/specs/metrics/HeartRateDetails.md"
  },
  "AddChangeSymptoms": {
    "doc":            "docs/specs/home/AddChangeSymptoms.md"
  }
}
```

- `pageObjectFile`: solo si `"pageObject": true`
- `specFile`: solo si `"spec": true`
- `doc`: siempre que exista el archivo `.md`
- Un `specFile` puede cubrir múltiples features (ej: `metricsDetail.spec.js` cubre 6 features)

### 2. versions[X.Y.Z].features (por versión)
Flags de cobertura + stack + since para cada feature en esa versión:

```json
"HeartRateDetails": {
  "pageObject": true,
  "spec":       true,
  "stack":      "nested",
  "since":      "3.4.0"
}
```

**Reglas obligatorias:**
- `"since"` debe ser la versión **exacta** donde se introdujo la feature — nunca `">X.Y.Z"` ni `"por confirmar"`
- Si la feature existía desde el inicio del tracking (v3.0.1), omitir el campo `"since"`
- `"pageObject": true` solo si el archivo referenciado en `featureCatalog.pageObjectFile` existe en disco
- `"spec": true` solo si el archivo referenciado en `featureCatalog.specFile` existe en disco

### 3. versions[X.Y.Z].screensAusentes
Lista de features que **no existían** en esa versión. Se usa para excluirlas del coverage report:

```json
"screensAusentes": ["Welcome", "MeetUser", "HeartRateDetails", "StepsDetails"]
```

**Regla:** cuando agregás una feature con `"since": "X.Y.Z"`, debés agregar su nombre a `screensAusentes` de **todas** las versiones anteriores a X.Y.Z que tengan features map.

### Historial en docs/specs/*.md
Cada doc de pantalla tiene:
- `**Aplica desde:** vX.Y.Z` — debe coincidir exactamente con `"since"` en versions.json
- `## Historial de versiones` — solo añadir fila cuando algo cambió. Tipos válidos:
  - `Introducida` — primera aparición de la pantalla
  - `No existía` — confirmar explícitamente que no estaba
  - `Baseline` — primera vez documentada en el framework (sin cambio en la feature)
  - Descripción del cambio — para modificaciones concretas

---

## Version Gating (versionGuard)

Cuando corrés tests contra un APK viejo, los specs de features no disponibles deben **saltearse**, no fallar.

### Cómo usar

```js
// En un spec que cubre una feature con "since": "3.6.0"
const { skipIfBefore } = require('../../src/helpers/versionGuard');

describe('[auth] Welcome Screen', function () {
  before(function () { if (skipIfBefore('3.6.0')) this.skip(); });

  it('should display welcome screen', async () => { ... });
});
```

### Activar version gating

En `.env`, setear la versión del APK bajo test:
```
APP_VERSION=3.3.0
```

Sin `APP_VERSION` en `.env`, los guards no actúan (todos los tests corren) — correcto para la versión actual.

### Qué specs requieren guard

| Spec file | Feature con since | Versión mínima |
|-----------|------------------|----------------|
| `welcome/welcome.spec.js` | Welcome | 3.6.0 |
| `auth/meetUser.spec.js` | MeetUser | 3.6.0 |
| `auth/signup.spec.js` (describe NotificationPermission) | NotificationPermission | 3.6.0 |
| `auth/saveOnboardingProgress.spec.js` | SaveOnboardingProgress | 3.6.0 |
| `metrics/metricsDetail.spec.js` (describes HeartRate y Steps) | HeartRateDetails, StepsDetails | 3.4.0 |
| `metrics/measurementHistory.spec.js` (describes HeartRate y Steps) | HeartRateMeasurementHistory, StepsHistory | 3.4.0 |

---

## Versiones y cobertura

### Comandos
```bash
npm run coverage              # cobertura de la versión actual (versions.current)
npm run coverage:v3.3.0       # cobertura de una versión específica
```

El script `src/config/coverage.js`:
- Lee `featureCatalog` para verificar que los archivos existen en disco (detecta flags incorrectos)
- Filtra features por versión respetando `screensAusentes` y `since`
- Muestra path de spec file y PO por feature para navegación directa
- Reporta porcentaje por stack (auth, tabs, nested, onboarding, medition, home)

### Agregar una versión nueva
1. Hacer `git checkout feat/version-X.X.X` en el repo RN
2. Identificar features nuevas vs versión anterior (comparar carpetas `src/features/`)
3. Agregar entrada en `src/config/versions.json` (ver estructura arriba)
4. Para features nuevas: agregar a `featureCatalog` + crear PO + crear spec + crear doc
5. Agregar `"since": "X.Y.Z"` a la feature en versiones.json y a `screensAusentes` de versiones previas
6. Actualizar el campo `"current"` en `versions.json`

### Versiones con APK disponible
| Versión | APK | Features map |
|---------|-----|-------------|
| 3.0.1 | 3.0.1.apk | completo |
| 3.1.0 | 3.1.0.apk | completo |
| 3.3.0 | — | completo |
| 3.7.3 | 3.8.0(1017).apk | completo |
| 3.8.0 | 3.8.0.apk | completo (current) |

Versiones 3.2.x, 3.4.0–3.7.2: solo `releaseHighlights` + `screensAusentes`, sin features map (APK no disponible).

### Repo React Native
Ruta local: `C:\Users\coropeza2\Desktop\Front FemmtoApp\OCR%20Femmto%20-%20New%20App`
Formato de ramas: `feat/version-X.X.X`
Arquitectura: Features-based (`src/features/<NombreFeature>/`)

---

## Pipeline automático

Cuando el mensaje comienza con `[PIPELINE QA AUTOMÁTICO]`, fue enviado por `run-pipeline.js` — no por el usuario directamente. Aplicar estas reglas **sin pedir confirmación**:

### Caso BUILD FIX — mismo X.Y.Z, build nuevo (ej: 4.0.0/1022 → 4.0.0/1023)

Ejecutar **solo Fases 1 y 2** del protocolo de análisis:
- Fase 1: analizar delta en el repo RN (commits nuevos desde el pull)
- Fase 2: actualizar únicamente los docs de pantallas afectadas en `docs/versions/vX.Y.Z/screens/`
- **NO** tocar el test plan — las pantallas y funcionalidades no cambiaron, solo hubo correcciones

### Caso VERSION BUMP — X.Y.Z creció (ej: 4.0.0 → 4.1.0)

Ejecutar el **protocolo completo (Fases 1 a 4)** incluyendo actualización del test plan.

---

## Protocolo de análisis de versión nueva (OBLIGATORIO)

Cuando el usuario solicita analizar una nueva versión, ejecutar **siempre** los siguientes pasos en orden. No omitir ni reordenar.

### Fase 1 — Análisis del repo RN

1. Leer el branch `feat/version-X.Y.Z` en el repo RN
2. Identificar el delta de pantallas vs la versión anterior:
   - Pantallas **nuevas** (no existían)
   - Pantallas **modificadas** (lógica, UI, navegación o reglas de negocio cambiaron)
   - Pantallas **eliminadas**
3. Identificar cambios en navigators, flows y componentes compartidos

### Fase 2 — Documentación de specs (docs/versions/)

4. Crear `docs/versions/vX.Y.Z/release-summary.md` con tabla de cambios
5. Para cada pantalla nueva o modificada: crear/actualizar `docs/versions/vX.Y.Z/screens/<pantalla>.md`
   - Respetar el contrato de pantallas definido en `IA.md` (objetivo, navegación, validaciones, reglas, APIs, estados, riesgos, analytics, historial)
6. Actualizar `src/config/versions.json`:
   - Agregar entrada de la versión con `features` map
   - Agregar features nuevas a `featureCatalog`
   - Actualizar `screensAusentes` en versiones anteriores
   - Actualizar campo `"current"`

### Fase 3 — Test plan de la nueva versión (docs/test-plan/)

7. Crear carpeta `docs/test-plan/vX.Y.Z/`
8. Copiar el test plan de la versión anterior como base:
   - `plan-de-pruebas.md`
   - `test-cases/TC-*.md` (todos los módulos)
   - `edge-cases/EC-GLOBAL.md`
9. Actualizar `plan-de-pruebas.md`:
   - Campo `version_produccion: X.Y.Z`
   - Sección "Pantallas nuevas en vX.Y.Z vs vX.Y.Z-anterior"
   - Inventario de pantallas si hubo altas o bajas
10. Para cada pantalla **nueva**: agregar TCs en el `TC-<MODULO>.md` correspondiente
    - Al menos 1 happy path + 1 edge case por pantalla nueva
    - Seguir numeración correlativa al final del archivo
11. Para cada pantalla **modificada**: actualizar los TCs afectados con `<!-- actualizado en vX.Y.Z -->`
12. Para cada pantalla **eliminada**: marcar sus TCs como `[DEPRECADO vX.Y.Z]`
13. Actualizar `EC-GLOBAL.md`: agregar edge cases derivados de los cambios de esta versión
14. Actualizar tabla de índice de versiones en `docs/test-plan/README.md`

### Fase 4 — Verificación de completitud

Antes de reportar el análisis como completo, verificar:
- [ ] Toda pantalla del `release-summary.md` tiene spec doc en `docs/versions/vX.Y.Z/screens/`
- [ ] Toda pantalla nueva tiene al menos 1 TC happy path en el test plan de la versión
- [ ] `versions.json` tiene la versión registrada con `"current"` actualizado
- [ ] `docs/test-plan/README.md` tiene la nueva versión en la tabla de índice

### Reglas de inferencia para test cases

Al escribir TCs para una pantalla nueva:
1. Leer el doc de la pantalla (`docs/versions/vX.Y.Z/screens/<pantalla>.md`) como fuente primaria
2. Derivar casos de: estados de UI, validaciones, navegación, reglas de negocio y edge cases documentados
3. Nunca inventar comportamiento no documentado en el spec — marcarlo como inferencia si hay incertidumbre
4. Seguir formato existente: `**Tipo:** Happy path / Negativo / Condicional / Edge case | **Prioridad:** Alta/Media/Baja`

---

## Ejecución de tests por versión

### Preparar entorno para una versión específica

```bash
# 1. Setear la versión del APK en .env
APP_VERSION=X.Y.Z
APP_PATH=./apps/appX.Y.Z.apk

# 2. Verificar device disponible
adb devices

# 3. Correr suite smoke (validación rápida)
npm run test:smoke

# 4. Correr suite completa
npm test

# 5. Correr spec individual
npm run test:spec -- --spec tests/specs/<modulo>/<spec>.spec.js
```

### Relación TC → spec file

| Archivo test plan | Specs correspondientes |
|-------------------|----------------------|
| TC-AUTH.md | `tests/specs/welcome/`, `tests/specs/auth/` |
| TC-HOME.md | `tests/specs/home/home.spec.js` |
| TC-ONBOARDING.md | `tests/specs/onboarding/onboarding.spec.js` |
| TC-PROFILE.md | `tests/specs/profile/profile.spec.js` |
| TC-METRICS.md | `tests/specs/metrics/metricsDetail.spec.js`, `measurementHistory.spec.js` |
| TC-MEDITION.md | `tests/specs/medition/newMedition.spec.js` |
| TC-TABS.md | `tests/specs/tabs/` |
