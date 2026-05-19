Por qué el agente del repo necesita información específica
El framework usa selectores basados en texto visible ($text('...'), $contains('...')) porque la app no tiene testID. Entonces lo que el agente del repo RN necesita darte es exactamente eso: los textos que aparecen en pantalla.

Para construir el specs.md y los tests, necesitás 4 cosas de cada pantalla:

Dato	Para qué sirve en el framework
Texto del título de pantalla	isLoaded() en el Page Object
Textos de todos los elementos visibles	Getters de locators
Textos de botones e inputs (placeholders)	Métodos de interacción
A dónde navega cada acción	Flujos en specs
Prompt para extraer specs de UNA versión
Copiá esto y pegalo en el agente del repo RN, posicionado en la rama de la versión que querés analizar:


Estoy construyendo un framework de automatización móvil con Appium + WebdriverIO
para esta app React Native. Necesito que analices todas las pantallas de esta
versión y generes un documento de especificaciones.

El framework usa SOLO selectores de texto visible (no testID, no resource-id).
Por eso necesito exactamente los strings que renderiza cada pantalla.

Para cada pantalla dentro de src/features/ y src/screens/ (o donde estén los
componentes de UI), extraé:

1. NOMBRE DE LA PANTALLA — el nombre del componente o feature folder
2. TÍTULO VISIBLE — el texto exacto que identifica que esta pantalla está cargada
   (ej: el texto del header o el primer Text visible y estático)
3. ELEMENTOS VISIBLES — lista todos los <Text> con su contenido exacto
4. INPUTS — todos los TextInput con su placeholder exacto
5. BOTONES — todos los TouchableOpacity / Pressable / Button con su label o
   texto hijo exacto
6. NAVEGACIÓN — qué pantalla abre cada botón o acción
7. ELEMENTOS CONDICIONALES — elementos que solo aparecen bajo ciertas condiciones
   (usuario logueado, feature flag, estado del store, etc.)

Formato de salida esperado para cada pantalla:

---
## [NombrePantalla]
**Archivo:** src/features/X/screens/Y.js
**Título de carga:** "texto exacto del título"

### Elementos visibles
- "Texto 1"
- "Texto 2"

### Inputs
- placeholder: "Ingrese su email" → campo: email
- placeholder: "Ingrese su contraseña" → campo: password

### Botones
- "Ingresar" → navega a Home / dispara loginAction
- "Olvidaste tu contraseña?" → navega a ResetPassword
- "¿No tenés cuenta? Crear cuenta" → navega a SignUp

### Condicionales
- Badge de notificaciones: visible solo si hay notificaciones no leídas
---

Analizá todas las pantallas que existan en esta versión del repo.
Si un texto es dinámico (viene de API o del nombre del usuario), indicalo
como DINÁMICO en lugar del valor.
Prompt para generar el specs.md de una versión
Una vez que tenés la salida anterior, usá este prompt en el agente del framework (este repo):


Tengo el relevamiento de pantallas de la versión X.Y.Z de la app Femmto.
Necesito que crees el archivo docs/versions/vX.Y.Z/specs.md con la siguiente
estructura por pantalla:

# Pantallas — Femmto vX.Y.Z

## [NombrePantalla]
**Ruta en la app:** (módulo/stack donde vive)
**Disponible desde:** vX.Y.Z

### Cómo identificar que la pantalla está cargada
El texto "[título exacto]" es visible.

### Elementos presentes
| Elemento | Tipo | Texto/Placeholder | Condición |
|---|---|---|---|
| ... | Text | "..." | Siempre |
| ... | Button | "..." | Solo si logueado |

### Flujos de navegación
- "[Texto del botón]" → NombrePantallaDestino
- "[Texto del botón]" → acción local (ej: enviar formulario)

Usá esta data: [pegás el relevamiento del repo aquí]
Prompt para generar los tests desde el specs.md
Una vez que tenés el specs.md, pedile al agente del framework que genere los tests:


Tengo las especificaciones de la pantalla [NombrePantalla] en
docs/versions/vX.Y.Z/specs.md.

Creá el Page Object en src/pages/[modulo]/NombrePage.js y el spec en
tests/specs/[modulo]/nombre.spec.js siguiendo estas reglas del framework:

REGLAS OBLIGATORIAS:
- BasePage está en src/pages/BasePage.js — extendé desde ahí
- Selectores en orden de prioridad: $text('...') > $contains('...') > xpath (nunca)
- isLoaded() es obligatorio — usa el título exacto: "[título exacto]"
- El spec usa describe('[modulo] NombrePantalla', ...) + it('should ...')
- Cada it() instancia su propio Page Object — no compartir entre tests
- Si la feature tiene "since": "X.Y.Z" en versions.json, agregar version guard:
  before(function() { if (skipIfBefore('X.Y.Z')) this.skip(); })
- Login se hace via loginAs() de src/flows/auth.flow.js — nunca reimplementar

ESPECIFICACIONES DE LA PANTALLA:
[pegás el contenido del specs.md aquí]
Flujo completo resumido

1. Posicionarte en rama feat/version-X.Y.Z del repo RN
2. Prompt de extracción → agente RN te da el relevamiento de pantallas
3. Prompt de specs.md  → agente framework crea docs/versions/vX.Y.Z/specs.md
4. Prompt de tests     → agente framework crea Page Objects + specs
5. Actualizar versions.json con las features de esa versión





-------------------------------------------------

Estoy documentando la versión X.Y.Z de esta app React Native para tener
trazabilidad de qué pantallas y funcionalidades existían en cada versión.

Analizá todos los componentes de pantalla dentro de src/features/ y cualquier
otra carpeta que contenga pantallas de UI.

Para cada pantalla generá la siguiente descripción en Markdown:

---
## [Nombre de la pantalla]

**Ubicación en el repo:** src/features/X/...
**Acceso:** cómo llega el usuario a esta pantalla (ej: tab Home, desde Login, etc.)

### Descripción
Una o dos oraciones explicando qué hace esta pantalla.

### Elementos de la pantalla
- Título o header visible
- Todos los textos estáticos relevantes
- Inputs con su label o placeholder
- Botones con su texto exacto
- Imágenes o íconos significativos

### Funcionalidades
- Qué puede hacer el usuario en esta pantalla
- Qué validaciones aplican (ej: campos requeridos)
- Qué datos muestra (estáticos, dinámicos desde API, desde store)

### Navegación
- Desde dónde se accede a esta pantalla
- A dónde lleva cada acción o botón

### Comportamiento condicional
- Elementos o comportamientos que cambian según el estado del usuario,
  permisos, plan, país u otra condición
  (si no hay ninguno, omitir esta sección)
---

Al final del archivo incluí una sección:

## Resumen de pantallas en esta versión
Lista con el nombre de cada pantalla documentada.

No incluyas código, solo descripción funcional en lenguaje natural.
