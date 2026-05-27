# Automation Quirks — Femmto Mobile Framework

Comportamientos no-obvios del árbol de UI descubiertos durante la automatización y análisis del repo RN.
**Antes de escribir un selector o un tap, consultar esta lista.**

---

## Índice
1. [Mapa de navegación](#1-mapa-de-navegación)
2. [TourGuideZone — todas las zonas](#2-tourguide-zone--todas-las-zonas)
3. [HomeHeader — botón "Nueva medición" (+)](#3-homeheader--botón-nueva-medición-)
4. [native-base Heading vs Text](#4-native-base-heading-vs-text)
5. [Pressable vs TouchableOpacity](#5-pressable-vs-touchableopacity)
6. [testID / accessibilityLabel — qué tiene y qué no](#6-testid--accessibilitylabel--qué-tiene-y-qué-no)
7. [Animated.View — interacción durante animación](#7-animatedview--interacción-durante-animación)
8. [TourGuide — dismissal en Home](#8-tourguide--dismissal-en-home)
9. [MeditionPage — isLoaded() anchor](#9-meditionpage--isloaded-anchor)
10. [Mocha timeout — flows con login completo](#10-mocha-timeout--flows-con-login-completo)
11. [WDIO_GREP — env var vs CLI flag](#11-wdio_grep--env-var-vs-cli-flag)
12. [Regla general: clickable=false en jerarquías mixtas](#12-regla-general-clickablefalse-en-jerarquías-mixtas)
13. [XML Dumps de pantallas clave](#13-xml-dumps-de-pantallas-clave)

---

## 1. Mapa de navegación

### Estructura raíz (`src/navigators/index.js`)
```
NavigationContainer
├── MaintenanceNavigator        ← modo mantenimiento (pantalla bloqueante)
├── ForceUpdateNavigator        ← fuerza actualización (pantalla bloqueante)
├── NewUserIntroNavigator       ← intro primer usuario
├── SignInSignUpNavigator       ← flujo de auth
├── OnBoardingNavigator         ← onboarding (6 steps)
└── TabNavigator                ← app principal
    └── Stack "initTab"
        └── Tab.Navigator (bottom tabs)
            ├── Tab "Home"               accessibilityLabel: 'Home'
            ├── Tab "Devices"            accessibilityLabel: 'Dispositivos'
            ├── Tab "Reminders"          accessibilityLabel: 'Recordatorios'
            └── Tab "Share"              accessibilityLabel: 'Compartir métricas'
```

> El `TabNavigator` está envuelto en `TourGuideProvider` — todas las pantallas de tabs heredan el contexto del tour.

### Navegación desde Home (Stack anidado en tab Home)
```
Home (OverviewContainer)
├── Measure → NewMeditionNavigator
│   ├── MeditionOptions         ← pantalla "Elige cómo te quieres medir"
│   ├── NewPreasureOCRMedition
│   ├── NewScaleMedition
│   └── NewGlucometerMedition
├── UserData → ProfileNavigator
├── WeightDetails, PresureDetails, GlucoseDetails, HeartRateDetails, StepsDetails, MetabolismDetails
├── Menu → MenuNavigator
│   ├── MenuOptions
│   ├── MyData → ProfileNavigator
│   └── Support
├── HealthNativeIntro
├── MeetUserQuestions → MeetUserNavigator
└── Notifications
```

### Navegación desde Devices (Stack anidado en tab Devices)
```
Devices (DevicesListContainer)
├── SelectDeviceType            ← 3 cards para VINCULAR dispositivos nuevos
├── IntroductionPair
├── AddNewBluetoodDevice        ← modal, transparentModal, fade animation
├── Instructions
├── AddNewScale → LinkScaleNavigator
├── NewBluetoothMedition → BluetoothPreasureMeasureNavigator
├── SuccessMeasurement
├── ScaleConnection
├── CheckBluetoothScale
├── Error / Success
├── ResetBluetooth
└── AddNewGlucometerBluetoodDevice ← modal
```

> **Diferencia clave Path 1 vs Path 2:**
> - `Home → Measure → MeditionOptions` → para MEDIR (dispositivos ya vinculados)
> - `Devices → SelectDeviceType` → para VINCULAR un dispositivo nuevo (misma UI visual, distinto componente RN)

---

## 2. TourGuide Zone — todas las zonas

Hay **4 zonas** de TourGuide, todas en la pantalla Home. Se ejecutan en orden 1 → 2 → 3 → 4.

| Zona | Archivo | Qué envuelve | Forma | Texto del tooltip |
|------|---------|--------------|-------|-------------------|
| 1 | `Overview/sections/ObjectiveTabs/widgets/WidgetSection.js` | `View` (collapsable=false) con el widget de objetivo | rectangle | "Aquí verás el seguimiento tus objetivos, tendencias, hábitos y tu progreso actual." |
| 2 | `Overview/sections/ObjectiveTabs/TabsSection.js` | `ScrollView` con los tabs de métricas | rectangle | "Selecciona otras opciones para ver tus otras métricas de control diario." |
| 3 | `Overview/sections/ObjectiveTabs/widgets/WidgetCard.js` | `TouchableOpacity` con ícono Ionicons (menú "...") | circle | "Puedes cambiar el orden en que se muestran los objetivos o editar tu selección." |
| 4 | `src/components/HomeHeader/index.js` | `Image` (NewMeasureIcon) dentro de `TouchableOpacity` | circle | "Suma mediciones en cualquier momento tocando aquí. ¡Tu compañero de salud está listo!" |

### Implicaciones para automatización
- Zona 3 envuelve un `TouchableOpacity` → el hijo interno puede quedar `clickable=false` mientras el tour está activo
- Zona 4 causa el problema conocido del botón "+" (ver sección 3)
- El `TourGuideProvider` envuelve **toda** la app de tabs → si el tour no fue dismissado, puede afectar cualquier elemento de Home
- Estado del tour persiste en **AsyncStorage** del device → `pm clear` lo resetea; `afterEach` force-stop NO lo resetea

---

## 3. HomeHeader — Botón "Nueva medición" (+)

**Archivo RN:** `src/components/HomeHeader/index.js`  
**Archivo framework:** `src/pages/home/HomePage.js → tapNuevaMedicion()`

### Jerarquía real
```jsx
<TouchableOpacity onPress={onNewMeasurePress} style={styles.button}>  ← clickable=true, SIN testID
  <TourGuideZone zone={4} shape="circle">
    <Image alt="Nueva medición" />    ← content-desc="Nueva medición", clickable=false
  </TourGuideZone>
</TouchableOpacity>
```

### Por qué `.click()` no funciona
El `Image` tiene `content-desc="Nueva medición"` pero `clickable=false`. En UIAutomator2, `.click()` en un elemento non-clickable **no propaga** al padre.

### Selector correcto (implementado)
```js
$('android=new UiSelector().className("android.view.ViewGroup").clickable(true).childSelector(new UiSelector().description("Nueva medición"))')
```

### Precondición de scroll
Después de dismissar el tour, el header puede quedar fuera de vista. Se requiere `swipeDown()` antes del tap.

### Fix permanente recomendado (dev)
```jsx
<TouchableOpacity testID="btn-nueva-medicion" ...>
```

---

## 4. native-base Heading vs Text

`<Heading>` de native-base **no es confiable** con el selector `UIAutomator text=`. Visualmente muestra el texto, pero UIAutomator puede no matchearlo.

### Componentes que usan `<Heading>` en pantallas automatizadas

| Componente | Archivo | Texto | Impacto |
|-----------|---------|-------|---------|
| `Header` | `src/components/Header/index.js` | `{title}` (prop dinámica) | Cualquier pantalla que use este Header compartido |
| `ScreenTitle` | `src/components/ScreenTitle/index.js` | `{children}` (prop dinámica) | Títulos de sección en múltiples pantallas |
| BluetoothDeviceConnectionSuccess | `src/containers/BluetoothDeviceConnectionSuccess/...` | "¿Qué monitor de presión estás usando?" | Pantalla de éxito BT |
| NewGlucometerMedition Test | `src/features/NewGlucometerMedition/.../Test/index.tsx` | dinámico | Pantalla de test glucómetro |
| NewScaleMedition ScaleConnection | `src/features/NewScaleMedition/.../ScaleConnection/index.js` | dinámico | Conexión balanza |

### Regla
Para `isLoaded()` y aserciones principales: **nunca usar `$text()` sobre un componente `<Heading>`**.  
Usar un `<Text>` plano visible en la misma pantalla como anchor, o el contenido del body.

```js
// ❌ Puede fallar si el título usa <Heading>
async isLoaded() { await this.waitForScreen(this.$text('Título de la pantalla')); }

// ✅ Usar un <Text> plano del body de la pantalla
async isLoaded() { await this.waitForScreen(this.$text('Texto descriptivo en body')); }
```

---

## 5. native-base Button — text="" en UIAutomator

**Afecta a:** todos los botones que usan el componente `<Button>` de native-base.

### Problema
`native-base Button` renderiza en Android como:
```xml
<android.widget.Button text="" content-desc="Registrar manualmente" clickable="true">
  <android.widget.TextView text="Registrar manualmente" clickable="false" />
</android.widget.Button>
```
El atributo `text` del Button está **vacío**. El texto visible está en el `TextView` hijo, que es `clickable=false`.
`UiSelector().text("Registrar manualmente")` no matchea ninguno de los dos nodos: el Button tiene `text=""` y el TextView tiene el texto pero no es clickeable.

### Regla
Para **botones de acción** (native-base `<Button>`), usar **siempre `$()`** (accessibility id → `content-desc`), nunca `$text()`:

```js
// ❌ Falla — Button.text está vacío en UIAutomator
get btnRegistrarManualmente() { return this.$text('Registrar manualmente'); }

// ✅ Correcto — Button.content-desc tiene el texto del label
get btnRegistrarManualmente() { return this.$('Registrar manualmente'); }
```

### Cuándo aplica
- Componente RN: `<Button>` de native-base (no aplica a `<TouchableOpacity>` nativo)
- Aplica a todos los botones de las pantallas de medición y cualquier otro que use native-base `<Button>`
- Los `<Text>`, badges y labels de texto plano SÍ usan `$text()` correctamente

### Botones corregidos en el framework
| Getter | Page Object | Fix aplicado |
|--------|-------------|-------------|
| `btnRegistrarManualmente` | NewGlucometerPage, NewPresurePage, NewScalePage | `$text()` → `UiScrollable.scrollIntoView` (ver sección scroll abajo) |
| `btnVincularGlucometro` | NewGlucometerPage | `$text()` → `$()` |
| `btnMedicionInalambrica` | NewGlucometerPage, NewPresurePage, NewScalePage | `$text()` → `$()` |
| `btnConectarMonitor` | NewPresurePage | `$text()` → `$()` |
| `btnEscanearPantalla` | NewPresurePage | `$text()` → `$()` |
| `btnConectarBalanza` | NewScalePage | `$text()` → `$()` |

### Botones al fondo del viewport — doble problema
`btnRegistrarManualmente` tiene un segundo problema: está en `y≈1964–2084`, fuera del área visible. Appium reporta `isDisplayed()=false` aunque el XML muestre `displayed="true"`.

Fix: usar `UiScrollable.scrollIntoView` en el getter — hace scroll automático antes de retornar el elemento:
```js
get btnRegistrarManualmente() {
  return $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("Registrar manualmente"))');
}
```
Aplicar este patrón a **cualquier botón de acción que aparezca al fondo de la pantalla**.

---

## 6. Pressable vs TouchableOpacity

La app usa **TouchableOpacity** en casi todo. Solo hay **3 instancias de Pressable** (todas de native-base):

| Archivo | Uso | accessibilityLabel |
|---------|-----|--------------------|
| `src/components/ControllerSelect/Field.js` | Trigger de menú select | `"Open menu"` |
| `src/components/FooterTabs/MeditionTab/index.js` | Botón de tab inferior | prop dinámica |
| `src/components/TabButton/index.js` | Botón de tab inferior | prop dinámica |

### Impacto en UIAutomator
`Pressable` puede renderizar como `android.view.View` en vez de `android.view.ViewGroup`.  
Si un `Pressable` no responde a `.click()`, intentar:
```js
// Buscar por accessibilityLabel en lugar de texto
$('~Open menu')  // para ControllerSelect
```

---

## 6. testID / accessibilityLabel — qué tiene y qué no

### Lo que SÍ tiene accessibilityLabel (usable como `~selector`)

| Elemento | Valor | Archivo |
|----------|-------|---------|
| Tab Home | `'Home'` | `src/navigators/TabNavigator.js` |
| Tab Dispositivos | `'Dispositivos'` | `src/navigators/TabNavigator.js` |
| Tab Recordatorios | `'Recordatorios'` | `src/navigators/TabNavigator.js` |
| Tab Compartir métricas | `'Compartir métricas'` | `src/navigators/TabNavigator.js` |
| Checkbox síntoma | `{name}` (dinámico) | `src/components/SymptomItem/index.js` |
| Radio Share | `'Presión arterial'`, `'Glucosa en sangre'`, `'Peso corporal'` | Share feature |
| Checkbox presión OCR | `'No volver a mostrar estas indicaciones.'` | NewPreasureOCRMedition |
| Menu trigger select | `'Open menu'` | `ControllerSelect/Field.js` |

### Lo que NO tiene testID
**Casi todo el resto de la app.** No hay `testID` en ningún componente de pantalla. Los selectores deben basarse en:
1. `accessibilityLabel` donde existe (tabla arriba)
2. `UIAutomator text=` para textos planos (`<Text>`)
3. `ViewGroup.clickable(true).childSelector()` para botones con imagen/ícono
4. XPath como último recurso

---

## 7. Animated.View — interacción durante animación

Hay **20+ instancias** de `Animated.View` en la app (BouncingBlock, CollapsibleView, MainFooter, transiciones de pantalla, etc.).

### Problema
Intentar hacer `.click()` o `.waitForDisplayed()` en un elemento que está dentro de un `Animated.View` durante la animación puede causar:
- `Element not interactable`
- `StaleElementReferenceError`
- El tap registra pero no genera navegación (el componente aún no está en su posición final)

### Fix
Siempre añadir `driver.pause(ANIMATION_TIMEOUT)` (2000ms) después de acciones que desencadenan animaciones conocidas:
- Dismiss del TourGuide
- Apertura/cierre de modales (`transparentModal`, `fade animation` en DevicesNavigator)
- Transiciones de pantalla con animación personalizada

---

## 8. TourGuide — dismissal en Home

**Archivo:** `src/flows/auth.flow.js → dismissTourIfPresent()`

```js
await btnOmitir.click();
await driver.pause(ANIMATION_TIMEOUT); // 2000ms obligatorio
```

### Comportamiento por APK
| Versión | Comportamiento |
|---------|---------------|
| `< 4.0.0` | Tour no existe → try/catch captura el timeout sin error |
| `>= 4.0.0` | Tour presente en **primer launch** — estado persiste en AsyncStorage |

### Cuándo se resetea el tour
- `adb shell pm clear com.femmto.app` → **sí resetea** (borra AsyncStorage)
- `afterEach` force-stop → **NO resetea** (AsyncStorage persiste entre arranques)
- Segunda ejecución sin `pm clear` → no aparece el tour, `dismissTourIfPresent()` hace timeout silencioso

---

## 9. MeditionPage — isLoaded() anchor

**Archivo:** `src/pages/tabs/MeditionPage.js`

El header de la pantalla usa `<Heading>` (native-base), no `<Text>`.

```js
// ❌ Poco confiable — "Nueva medición" es un <Heading>
async isLoaded() { await this.waitForScreen(this.$text('Nueva medición')); }

// ✅ Correcto — "Elige cómo te quieres medir" es un <Text> plano del body
async isLoaded() { await this.waitForScreen(this.$text('Elige cómo te quieres medir')); }
```

---

## 10. Mocha timeout — flows con login completo

Cualquier spec que use `launchAndLogin()` como precondición necesita al menos **180 segundos**:

| Paso | Tiempo aprox. |
|------|--------------|
| `pm clear` + `am start` + boot app | 10–15s |
| Welcome screen → tap login | 5–10s |
| Ingresar credenciales + submit | 10–15s |
| Tour dismiss + `ANIMATION_TIMEOUT` | 5–25s |
| Home load + navegación | 5–10s |
| **Total peor caso** | **~80s** |

**Configuración en `wdio.conf.js`:**
```js
mochaOpts: {
  ui: 'bdd',
  timeout: 180000,  // nunca bajar de esto si los specs usan launchAndLogin()
}
```

---

## 11. WDIO_GREP — env var vs CLI flag

### Problema
`--mochaOpts.grep "patrón"` por CLI puede resetear el objeto `mochaOpts` completo, perdiendo el `timeout: 180000`. Resultado: todos los `beforeEach` fallan por timeout.

### Fix
```bash
# ✅ Correcto — preserva mochaOpts.timeout
WDIO_GREP="should display the glucometer introduction screen" npx wdio run wdio.conf.js --spec ...

# ⚠️ Riesgoso — puede perder timeout
npx wdio run wdio.conf.js --mochaOpts.grep "..." --spec ...
```

---

## 12. Regla general: clickable=false en jerarquías mixtas

En React Native, cuando una `TouchableOpacity` contiene elementos envueltos en HOCs de terceros (TourGuideZone, Animated.View, etc.), UIAutomator2 puede exponer los hijos internos con `clickable=false`.

**`.click()` en un elemento `clickable=false` NO propaga al padre.**

### Cómo detectarlo
Leer el XML dump de la pantalla en `docs/uiautomator/<pantalla>.xml` y buscar el atributo `clickable="false"` en el elemento target.

### Soluciones (en orden de preferencia)
```js
// Opción A — Selector de padre clickable con childSelector (preferida)
$('android=new UiSelector().className("android.view.ViewGroup").clickable(true).childSelector(new UiSelector().description("TEXTO"))')

// Opción B — Coordenadas W3C (cuando A no encuentra el padre)
const loc  = await element.getLocation();
const size = await element.getSize();
await driver.performActions([{
  type: 'pointer', id: 'finger1',
  parameters: { pointerType: 'touch' },
  actions: [
    { type: 'pointerMove', duration: 0, x: Math.round(loc.x + size.width / 2), y: Math.round(loc.y + size.height / 2) },
    { type: 'pointerDown', button: 0 },
    { type: 'pause', duration: 200 },
    { type: 'pointerUp', button: 0 },
  ],
}]);
await driver.releaseActions();
```

---

## 13. XML Dumps de pantallas clave

Árbol UIAutomator2 real capturado con `driver.getPageSource()` para referencia de selectores.  
Ubicación: `docs/uiautomator/<pantalla>.xml`

| Pantalla | Archivo | Build |
|----------|---------|-------|
| Home (post-login, post-tour) | `home.xml` | v4.0.0 build 1025 |
| MeditionOptions | `medition-options.xml` | v4.0.0 build 1025 |
| NewGlucometerIntro | `glucometer-intro.xml` | v4.0.0 build 1025 |
| NewPresureIntro | `presure-intro.xml` | v4.0.0 build 1025 |
| NewScaleIntro | `scale-intro.xml` | v4.0.0 build 1025 |

**Regenerar dumps:**
```bash
npx wdio run wdio.conf.js --spec scripts/capture-ui-dumps.spec.js
```

**Nota:** Regenerar cuando el build cambie de versión mayor (ej: 4.0.0 → 4.1.0). Para builds del mismo X.Y.Z no es necesario salvo cambios visuales confirmados.

---

## 14. HomePage.isLoaded() — anchor en contenido, no en bottom nav

**Problema:** En Android 16 físico (Motorola Edge 60 Fusion), `~Home` (bottom nav tab, y≈2179-2311 en pantalla de 2400px) puede no ser visible para `waitForDisplayed` durante la animación post-tour. Esto provoca timeout de 30s en todos los tests de Home.

**Regla:** `isLoaded()` en `HomePage` usa `$text('Resumen de hoy')` (TextView plano en y≈136, parte superior del contenido) como anchor, no el tab del bottom nav.

```js
// ❌ Frágil en Android 16 — bottom nav animado post-tour
async isLoaded() { await this.waitForScreen(this.tabHome); }

// ✅ Correcto — TextView estático visible al cargar Home
async isLoaded() { await this.waitForScreen(this.$text('Resumen de hoy')); }
```
