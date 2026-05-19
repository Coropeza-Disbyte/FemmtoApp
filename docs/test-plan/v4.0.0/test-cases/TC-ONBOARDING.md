---
modulo: onboarding
version_produccion: 4.0.0
last_modified: 2026-05-14
pantallas_cubiertas:
  - NewUserIntro (IntroSwiper 4 slides, path onboarding, path menú)
  - SetName
  - SetBirthdate
  - SetGender
  - SetWeight
  - SetHeight
  - SetPicture
---

# Test Cases — Módulo Onboarding

---

## NewUserIntro (IntroSwiper)

### TC-ONB-001 — IntroSwiper muestra los 4 slides en orden correcto

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario que completó el registro y ve el intro por primera vez (path onboarding).

**Pasos:**
1. Observar el slide 1.
2. Deslizar al slide 2.
3. Deslizar al slide 3.
4. Deslizar al slide 4.

**Resultado esperado:**
- Slide 1: título `"Todo en un mismo lugar"`, descripción sobre unificación de dispositivos FEMMTO.
- Slide 2: título `"Agrega una medición"`, descripción sobre uso del botón `+`.
- Slide 3: título `"Explorá tus datos"`, descripción sobre tarjetas interactivas.
- Slide 4: título `"Generá reportes médicos"`, descripción sobre compartir con profesionales.

---

### TC-ONB-002 — Navegar entre slides usando deslizamiento

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en IntroSwiper, slide 1.

**Pasos:**
1. Deslizar hacia la izquierda.
2. Verificar que se avanza al siguiente slide.
3. Deslizar hacia la derecha desde slide 2.
4. Verificar que retrocede al slide 1.

**Resultado esperado:**
- El deslizamiento de izquierda a derecha avanza y retrocede entre slides sin errores.
- Animación de transición suave visible.

---

### TC-ONB-003 — Botón finalizar disponible solo en el último slide

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en IntroSwiper.

**Pasos:**
1. Verificar que el botón de finalización no está activo o visible en slides 1, 2 y 3.
2. Deslizar hasta el slide 4.
3. Verificar el botón de finalización.

**Resultado esperado:**
- El botón de finalización solo está visible en el slide 4.
- Botón tiene texto `"Finalizar"` o similar.

---

### TC-ONB-004 — Finalizar intro desde path onboarding navega a Home

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en slide 4 del IntroSwiper (path onboarding, no desde menú).

**Pasos:**
1. Tap en el botón finalizar del slide 4.

**Resultado esperado:**
- Navega a Home.
- No vuelve a mostrar el intro en sesiones posteriores.
- No muestra HealthNativeIntro.

---

### TC-ONB-005 — Finalizar intro desde menú navega a Home directamente

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Menu → acceso a "Ver intro" → IntroSwiper con `fromMenu: true`.

**Pasos:**
1. Observar el IntroSwiper (mismo contenido de 4 slides).
2. Llegar al slide 4 y tap en finalizar.

**Resultado esperado:**
- Navega directamente a Home (popToTop).
- NO navega a HealthNativeIntro.

---

### TC-ONB-006 — IntroSwiper soporta gesto de pan (swipe) en dispositivos grandes

**Tipo:** Edge case | **Prioridad:** Baja

**Precondiciones:** Usuario en IntroSwiper en dispositivo con pantalla grande (Pixel_9_Pro_XL).

**Pasos:**
1. Realizar swipe lento y swipe rápido entre slides.
2. Verificar respuesta en ambos casos.

**Resultado esperado:**
- Ambos gestos avanzan/retroceden correctamente.
- No hay comportamiento inesperado en pantallas grandes.

---

## SetName

### TC-ONB-007 — SetName: ingresar nombre válido y avanzar

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en step SetName del onboarding de perfil.

**Pasos:**
1. Verificar que el título es `"Completa tu nombre"`.
2. Ingresar un nombre válido (ej: `"Juan Pérez"`) en el campo `"Tu nombre"`.
3. Tap en `"Continuar"`.

**Resultado esperado:**
- Navega al siguiente step (SetBirthdate).
- El campo de texto tiene `textAlign: center`.

---

### TC-ONB-008 — SetName: valor default con user.displayName existente

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SetName. El objeto user tiene `displayName` preestablecido (ej: `"María García"`).

**Pasos:**
1. Observar el campo de texto al cargar la pantalla.

**Resultado esperado:**
- El campo muestra el nombre preexistente como valor default.
- El usuario puede editarlo o mantenerlo.

---

### TC-ONB-009 — SetName: campo vacío bloquea avance

**Tipo:** Negativo | **Prioridad:** Alta

**Precondiciones:** Usuario en SetName con campo vacío.

**Pasos:**
1. No ingresar nombre.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- No avanza.
- Botón deshabilitado o mensaje de validación visible.

---

### TC-ONB-010 — SetName: nombre menor a 3 caracteres es inválido

**Tipo:** Negativo | **Prioridad:** Alta

**Precondiciones:** Usuario en SetName.

**Pasos:**
1. Ingresar un nombre con 2 caracteres (ej: `"Jo"`).
2. Tap en `"Continuar"`.

**Resultado esperado:**
- No avanza.
- Validación activa: mínimo 3 caracteres requerido.

---

### TC-ONB-011 — SetName: nombre exactamente 3 caracteres es válido

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en SetName.

**Pasos:**
1. Ingresar un nombre con exactamente 3 caracteres (ej: `"Ana"`).
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Avanza correctamente.
- Validación acepta el límite inferior (minLength=3).

---

### TC-ONB-012 — SetName: nombre mayor a 30 caracteres es rechazado

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en SetName.

**Pasos:**
1. Intentar ingresar un nombre con 31 caracteres o más.

**Resultado esperado:**
- El campo rechaza la entrada o la trunca al máximo permitido (maxLength=30).
- El usuario no puede escribir más de 30 caracteres.

---

### TC-ONB-013 — SetName: nombre exactamente 30 caracteres es válido

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en SetName.

**Pasos:**
1. Ingresar un nombre con exactamente 30 caracteres.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Avanza correctamente.
- El nombre se guarda con todos los 30 caracteres.

---

### TC-ONB-014 — SetName: autoCapitalize funciona en primera letra

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en SetName.

**Pasos:**
1. Ingresar un nombre en minúsculas (ej: `"juan pérez"`).

**Resultado esperado:**
- El autoCapitalize=words convierte: `"Juan Pérez"`.
- Primera letra de cada palabra en mayúscula.

---

## SetBirthdate

### TC-ONB-015 — SetBirthdate: seleccionar fecha válida y avanzar

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en step SetBirthdate.

**Pasos:**
1. Verificar que el título es `"Fecha de nacimiento"`.
2. Tap en el campo de fecha (DatePicker).
3. Seleccionar una fecha que corresponda a una edad entre 18 y 99 años (ej: `"15/05/1990"`).
4. Tap en `"Continuar"`.

**Resultado esperado:**
- Navega al step SetGender.
- El placeholder dice `"Selecciona tu fecha de nacimiento"`.

---

### TC-ONB-016 — SetBirthdate: usuario menor a 18 años es rechazado

**Tipo:** Negativo | **Prioridad:** Alta

**Precondiciones:** Usuario en SetBirthdate.

**Pasos:**
1. Seleccionar una fecha que corresponda a un usuario menor a 18 años.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- No avanza.
- Se muestra el error exacto: `"Debes ser mayor a 18 años para utilizar nuestra aplicación."`

---

### TC-ONB-017 — SetBirthdate: usuario exactamente 18 años es válido

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en SetBirthdate.

**Pasos:**
1. Seleccionar una fecha que corresponda a cumplir exactamente 18 años hoy.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Avanza correctamente.
- Valida el límite inferior (18 años inclusive).

---

### TC-ONB-018 — SetBirthdate: usuario mayor a 99 años es rechazado

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en SetBirthdate.

**Pasos:**
1. Seleccionar una fecha que corresponda a una edad mayor a 99 años (ej: `"01/01/1910"`).
2. Tap en `"Continuar"`.

**Resultado esperado:**
- No avanza.
- Se muestra el error exacto: `"Debes ser menor a 99 años para utilizar nuestra aplicación."`

---

### TC-ONB-019 — SetBirthdate: usuario exactamente 99 años es válido

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en SetBirthdate.

**Pasos:**
1. Seleccionar una fecha que corresponda a cumplir exactamente 99 años.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Avanza correctamente.
- Valida el límite superior (99 años inclusive).

---

### TC-ONB-020 — SetBirthdate: sin fecha seleccionada bloquea avance

**Tipo:** Negativo | **Prioridad:** Alta

**Precondiciones:** Usuario en SetBirthdate sin haber seleccionado fecha.

**Pasos:**
1. Tap en `"Continuar"` sin seleccionar fecha.

**Resultado esperado:**
- No avanza.
- Botón deshabilitado o mensaje indicando que debe seleccionar una fecha.

---

## SetGender

### TC-ONB-021 — SetGender: seleccionar género y avanzar

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en step SetGender.

**Pasos:**
1. Verificar que el título es `"Sexo biológico"`.
2. Verificar la caja de información con texto sobre por qué se pide el sexo biológico.
3. Seleccionar una opción de género (GenderEnum.MALE o GenderEnum.FEMALE).
4. Tap en `"Continuar"`.

**Resultado esperado:**
- Navega al step SetWeight.
- Se muestra información: `"¿Por qué pedimos tu sexo biológico?"`.
- Disclaimer: `"Esta selección no pretende definir ni limitar tu identidad de género."`

---

### TC-ONB-022 — SetGender: opción MALE disponible y seleccionable

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SetGender.

**Pasos:**
1. Observar las opciones disponibles.
2. Tap en opción MALE.
3. Tap en `"Continuar"`.

**Resultado esperado:**
- Opción MALE se marca como seleccionada.
- Avanza a SetWeight.

---

### TC-ONB-023 — SetGender: opción FEMALE disponible y seleccionable

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SetGender.

**Pasos:**
1. Tap en opción FEMALE.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Opción FEMALE se marca como seleccionada.
- Avanza a SetWeight.

---

### TC-ONB-024 — SetGender: sin género seleccionado bloquea avance

**Tipo:** Negativo | **Prioridad:** Alta

**Precondiciones:** Usuario en SetGender sin haber seleccionado género.

**Pasos:**
1. Tap en `"Continuar"` sin seleccionar género.

**Resultado esperado:**
- No avanza.
- Botón deshabilitado o mensaje indicando que debe seleccionar un género.

---

### TC-ONB-025 — SetGender: cambiar selección es posible

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en SetGender con MALE seleccionado.

**Pasos:**
1. Tap en MALE.
2. Tap en FEMALE.

**Resultado esperado:**
- La selección se cambia correctamente (MALE se deselecciona, FEMALE se selecciona).

---

## SetWeight

### TC-ONB-026 — SetWeight: ingresar peso válido y avanzar

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en step SetWeight.

**Pasos:**
1. Verificar que el título es `"Peso"`.
2. Ingresar un peso válido (ej: `"75.5"`) en el campo.
3. Tap en `"Continuar"`.

**Resultado esperado:**
- Navega al step SetHeight.
- El valor se guarda correctamente.

---

### TC-ONB-027 — SetWeight: acepta formato con punto decimal

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SetWeight.

**Pasos:**
1. Ingresar un peso con punto: `"72.3"`.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Avanza correctamente.
- El valor se interpreta como 72.3 kg.

---

### TC-ONB-028 — SetWeight: acepta formato con coma decimal

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SetWeight.

**Pasos:**
1. Ingresar un peso con coma: `"75,5"`.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Avanza correctamente.
- El valor se interpreta como 75.5 kg (normalización de coma a punto).

---

### TC-ONB-029 — SetWeight: peso mínimo 20 kg es válido

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en SetWeight.

**Pasos:**
1. Ingresar `"20"`.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Avanza correctamente (límite inferior inclusivo).

---

### TC-ONB-030 — SetWeight: peso menor a 20 kg es rechazado

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en SetWeight.

**Pasos:**
1. Ingresar `"19.9"`.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- No avanza.
- Mensaje de error: `"Debes pesar entre 20 y 250 kg para utilizar nuestra aplicación."`

---

### TC-ONB-031 — SetWeight: peso máximo 250 kg es válido

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en SetWeight.

**Pasos:**
1. Ingresar `"250"`.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Avanza correctamente (límite superior inclusivo).

---

### TC-ONB-032 — SetWeight: peso mayor a 250 kg es rechazado

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en SetWeight.

**Pasos:**
1. Ingresar `"250.1"`.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- No avanza.
- Mensaje de error: `"Debes pesar entre 20 y 250 kg para utilizar nuestra aplicación."`

---

### TC-ONB-033 — SetWeight: campo vacío bloquea avance

**Tipo:** Negativo | **Prioridad:** Alta

**Precondiciones:** Usuario en SetWeight con campo vacío.

**Pasos:**
1. Tap en `"Continuar"` sin ingresar peso.

**Resultado esperado:**
- No avanza.
- Botón deshabilitado o validación visible.

---

## SetHeight

### TC-ONB-034 — SetHeight: ingresar altura válida y avanzar

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en step SetHeight.

**Pasos:**
1. Verificar que el título es `"Altura"`.
2. Ingresar una altura válida (ej: `"175"`) en el campo.
3. Tap en `"Continuar"`.

**Resultado esperado:**
- Navega al step SetPicture.
- El valor se guarda correctamente.

---

### TC-ONB-035 — SetHeight: acepta formato con punto decimal

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SetHeight.

**Pasos:**
1. Ingresar una altura con punto: `"175.5"`.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Avanza correctamente.
- El valor se interpreta como 175.5 cm.

---

### TC-ONB-036 — SetHeight: acepta formato con coma decimal

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SetHeight.

**Pasos:**
1. Ingresar una altura con coma: `"180,2"`.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Avanza correctamente.
- El valor se normaliza a 180.2 cm.

---

### TC-ONB-037 — SetHeight: altura mínima 90 cm es válida

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en SetHeight.

**Pasos:**
1. Ingresar `"90"`.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Avanza correctamente (límite inferior inclusivo).

---

### TC-ONB-038 — SetHeight: altura menor a 90 cm es rechazada

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en SetHeight.

**Pasos:**
1. Ingresar `"89.9"`.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- No avanza.
- Mensaje de error: `"Debes medir entre 90 y 220 cms para utilizar nuestra aplicación."`

---

### TC-ONB-039 — SetHeight: altura máxima 220 cm es válida

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en SetHeight.

**Pasos:**
1. Ingresar `"220"`.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Avanza correctamente (límite superior inclusivo).

---

### TC-ONB-040 — SetHeight: altura mayor a 220 cm es rechazada

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en SetHeight.

**Pasos:**
1. Ingresar `"220.1"`.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- No avanza.
- Mensaje de error: `"Debes medir entre 90 y 220 cms para utilizar nuestra aplicación."`

---

### TC-ONB-041 — SetHeight: campo vacío bloquea avance

**Tipo:** Negativo | **Prioridad:** Alta

**Precondiciones:** Usuario en SetHeight con campo vacío.

**Pasos:**
1. Tap en `"Continuar"` sin ingresar altura.

**Resultado esperado:**
- No avanza.
- Botón deshabilitado o validación visible.

---

## SetPicture

### TC-ONB-042 — SetPicture: skip foto es opcional

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en step SetPicture.

**Pasos:**
1. Observar los botones disponibles.
2. Tap en opción para omitir o continuar sin foto.

**Resultado esperado:**
- Onboarding se completa.
- Navega a Home o NewUserIntro (según flujo).
- Se guarda el perfil sin foto.

---

### TC-ONB-043 — SetPicture: seleccionar foto de galería

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en step SetPicture. Galería con al menos una imagen disponible.

**Pasos:**
1. Tap en opción para seleccionar foto de galería.
2. Seleccionar una imagen.
3. Confirmar selección.
4. Tap en `"Continuar"`.

**Resultado esperado:**
- La imagen seleccionada se previsualiza.
- Se inicia la carga (dispatch uploadPicture).
- Al completar, navega a Home o NewUserIntro.

---

### TC-ONB-044 — SetPicture: preview de foto seleccionada

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SetPicture después de seleccionar una foto.

**Pasos:**
1. Observar el preview de la foto.

**Resultado esperado:**
- La foto se muestra en la zona de preview.
- Usuario puede confirmar o seleccionar otra foto.

---

### TC-ONB-045 — SetPicture: cambiar foto seleccionada

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en SetPicture con una foto ya seleccionada.

**Pasos:**
1. Tap en la foto para cambiarla.
2. Seleccionar una foto diferente.

**Resultado esperado:**
- El preview se actualiza con la nueva foto.

---

### TC-ONB-046 — SetPicture: ruta SetName si no existe displayName

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SetPicture. El objeto user NO tiene `displayName` ni `data.firstname`.

**Pasos:**
1. Seleccionar foto o skip.
2. Completar el step.

**Resultado esperado:**
- Después de SetPicture, navega a SetName (flujo retrocede para recolectar nombre).

---

### TC-ONB-047 — SetPicture: ruta directa SetBirthdate si existe displayName

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SetPicture. El objeto user tiene `displayName` preestablecido.

**Pasos:**
1. Seleccionar foto o skip.
2. Completar el step.

**Resultado esperado:**
- Navega directamente a SetBirthdate (salta SetName).

---

### TC-ONB-048 — SetPicture: fotografía con cámara (si disponible)

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en SetPicture con cámara disponible en el dispositivo.

**Pasos:**
1. Tap en opción de fotografía con cámara.
2. Capturar una foto.
3. Confirmar.

**Resultado esperado:**
- La foto capturada se previsualiza.
- Al tap en `"Continuar"`, se guarda la foto.

---

### TC-ONB-049 — SetPicture: upload de foto se completa correctamente

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SetPicture con foto seleccionada. Conexión de red activa.

**Pasos:**
1. Tap en `"Continuar"` después de seleccionar foto.
2. Esperar a que se complete la carga.

**Resultado esperado:**
- El dispatch `uploadPicture` se ejecuta sin errores.
- La foto se guarda en el perfil del usuario.
- Navega a la siguiente pantalla.

---

### TC-ONB-050 — Flujo completo de onboarding de nombre a foto

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario inicia onboarding desde SetName.

**Pasos:**
1. Completar SetName con `"Carlos López"`.
2. Completar SetBirthdate con fecha válida.
3. Completar SetGender seleccionando MALE.
4. Completar SetWeight con `"75.5"`.
5. Completar SetHeight con `"180"`.
6. Skip foto en SetPicture.

**Resultado esperado:**
- El flujo completo se ejecuta sin interrupciones.
- Se guarda el perfil completo: `{ name, birthdate, gender, weight, height }`.
- Navega a Home o NewUserIntro.
- Se ejecuta `doOnboarding()` con datos completos.

---
