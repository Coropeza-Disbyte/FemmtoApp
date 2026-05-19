# Mobile Automation Framework

Framework E2E para Android nativo — Appium 2 + WebdriverIO 9.

## Pre-requisitos

- Node.js 18+
- Java JDK 11+
- Android SDK (ANDROID_HOME configurado)
- Android Studio con un emulador creado **o** dispositivo físico con USB debugging activo
- Appium Doctor: `npx appium-doctor --android` para verificar el entorno

## Setup

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Instalar driver UiAutomator2:
   ```bash
   npx appium driver install uiautomator2
   ```

3. Copiar variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Editar `.env` con los datos reales de tu app y dispositivo.

4. Colocar el APK en `apps/app-debug.apk` (o configurar `APP_PATH` en `.env`).

## Ejecutar tests

```bash
# Todos los tests
npm test

# Solo la suite smoke
npm run test:smoke

# Un spec específico
npm run test:spec -- --spec tests/specs/login.spec.js
```

## Agregar una nueva pantalla

1. Crear `src/pages/NombrePantalla.js` extendiendo `BasePage`
2. Definir getters con los locators (resource-id recomendado)
3. Crear `tests/specs/nombrePantalla.spec.js`
4. Agregar el spec a la suite correspondiente en `tests/suites/`

## Estructura de locators (prioridad)

| Estrategia          | Cuándo usar                        |
|---------------------|------------------------------------|
| `resource-id`       | Primera opción — es el más estable |
| `accessibility id`  | Si el dev define content-desc      |
| `UIAutomator2`      | Scroll, búsqueda compleja          |
| `xpath`             | Último recurso                     |

## Herramientas útiles

- **Appium Inspector**: para inspeccionar elementos de la app visualmente
- **adb shell uiautomator dump**: dump del árbol de vistas desde terminal
