---
modulo: profile
version_produccion: 4.0.0
last_modified: 2026-05-14
pantallas_cubiertas:
  - UserProfile
  - EditName
  - EditBirthdate
  - EditGender
  - EditWeight
  - EditHeight
  - EditPassword
  - EditCountry
  - EditTargets (2 pasos)
  - Menu (MenuOptions)
  - Support
  - ConnectHealth
---

# Test Cases — Módulo Profile

---

## UserProfile

### TC-PROF-001 — UserProfile carga correctamente con datos completos

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario autenticado con perfil completo (todos los campos completados).

**Pasos:**
1. Navegar a UserProfile desde Menu.

**Resultado esperado:**
- Título: "Mi cuenta" visible.
- Secciones visibles: "Mis datos" y "Metas".
- Campos visibles en "Mis datos":
  - Nombre: {firstname} {lastname}
  - E-Mail: {username} (enmascarado de solo lectura)
  - Contraseña: "********" (enmascarada, editable)
  - Sexo biológico: valor traducido (ej: "Mujer", "Hombre", "Otro")
  - Fecha de Nacimiento: formato locale LL (ej: "14 de mayo de 1990")
  - País de residencia: nombre completo (ej: "Argentina")
  - Altura: "{height} cm." (ej: "165 cm.")
  - Peso: "{weight} kg." (ej: "68 kg.")
- Sección "Metas" con targets configurados.

---

### TC-PROF-002 — UserProfile — email es read-only

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en UserProfile.

**Pasos:**
1. Tap en el campo de Email.

**Resultado esperado:**
- No es editable (sin respuesta al tap o indicación visual de read-only).
- Valor mostrado es el username registrado.

---

### TC-PROF-003 — UserProfile — opción Eliminar cuenta visible

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en UserProfile.

**Pasos:**
1. Hacer scroll down para ver el final de la pantalla.

**Resultado esperado:**
- Opción "Eliminar cuenta" (DeleteAccountOptionSection) visible.
- Generalmente roja o con color de advertencia.
- Botón o enlace tocable.

---

## EditName

### TC-PROF-004 — Editar nombre — happy path

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en UserProfile.

**Pasos:**
1. Tap en el campo de nombre.
2. En EditName, limpiar campo y ingresar "Juan Carlos".
3. Tap en "Guardar".

**Resultado esperado:**
- Regresa a UserProfile.
- Nombre actualizado a "Juan Carlos".
- Valor enviado a API (nickname → API).

---

### TC-PROF-005 — EditName — header "Nombre"

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario navega a EditName.

**Pasos:**
1. Observar el header.

**Resultado esperado:**
- Header muestra "Nombre".

---

### TC-PROF-006 — EditName — campo con placeholder

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditName con campo vacío.

**Pasos:**
1. Observar el campo de entrada.

**Resultado esperado:**
- Placeholder: "Tu nombre" visible si el campo está vacío.
- textAlign center.

---

### TC-PROF-007 — EditName — validación mínimo 3 caracteres

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en EditName.

**Pasos:**
1. Ingresar "ab" (2 caracteres).
2. Tap en "Guardar".

**Resultado esperado:**
- Error visible: "El nombre debe tener al menos 3 caracteres" (o similar).
- Botón "Guardar" deshabilitado.
- Campo mantiene foco para reintentar.

---

### TC-PROF-008 — EditName — validación máximo 30 caracteres

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en EditName.

**Pasos:**
1. Intentar ingresar más de 30 caracteres (ej: "Juan Carlos Pérez García López...").

**Resultado esperado:**
- Input bloqueado por maxLength=30.
- No se puede ingresar más de 30 caracteres (automático).

---

### TC-PROF-009 — EditName — nombre exactamente 3 caracteres válido

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en EditName.

**Pasos:**
1. Ingresar "Bob" (exactamente 3 caracteres).
2. Tap en "Guardar".

**Resultado esperado:**
- Validación pasa.
- Nombre se actualiza a "Bob".

---

### TC-PROF-010 — EditName — trim de espacios antes de guardar

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditName.

**Pasos:**
1. Ingresar "  Juan  " (con espacios al inicio y final).
2. Tap en "Guardar".

**Resultado esperado:**
- Campo se trimea antes de enviar a API.
- Se guarda como "Juan" (sin espacios extras).

---

### TC-PROF-011 — EditName — caracteres especiales y emojis

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditName.

**Pasos:**
1. Ingresar "Juan José María" (con acentos).
2. Tap en "Guardar".

**Resultado esperado:**
- Caracteres con acentos se guardan correctamente.
- Se refleja en UserProfile.

---

## EditPassword

### TC-PROF-012 — Cambiar contraseña — happy path

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en UserProfile, registrado con email/password (no provider user).

**Pasos:**
1. Tap en campo "Contraseña" (enmascarado "********").
2. En EditPassword, ingresar nueva contraseña en "Crear contraseña".
3. Repetir la misma contraseña en "Repita su contraseña".
4. Tap en "Guardar".

**Resultado esperado:**
- Cambio de contraseña exitoso.
- Regresa a UserProfile sin errores.
- Nueva contraseña está activa para próximos logins.

---

### TC-PROF-013 — EditPassword — header "Contraseña"

**Tipo:** Happy path | **Prioridad:** Lowa

**Precondiciones:** Usuario en EditPassword.

**Pasos:**
1. Observar el header y textos.

**Resultado esperado:**
- Header: "Contraseña".
- Texto explicativo: "Ingresa tu nueva contraseña".

---

### TC-PROF-014 — EditPassword — campo "Crear contraseña" minLength 8

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en EditPassword.

**Pasos:**
1. Ingresar "123" (3 caracteres) en "Crear contraseña".
2. Tap en "Guardar".

**Resultado esperado:**
- Error visible: "La contraseña debe contener al menos 8 caracteres."
- Botón "Guardar" deshabilitado.

---

### TC-PROF-015 — EditPassword — campo "Crear contraseña" vacío

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en EditPassword.

**Pasos:**
1. Dejar "Crear contraseña" vacío.
2. Tap en "Guardar".

**Resultado esperado:**
- Error visible: "Ingresa una contraseña válida."

---

### TC-PROF-016 — EditPassword — campo "Repita su contraseña" vacío

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en EditPassword con "Crear contraseña" completado.

**Pasos:**
1. Ingresar "Contraseña123" en "Crear contraseña".
2. Dejar "Repita su contraseña" vacío.
3. Tap en "Guardar".

**Resultado esperado:**
- Error visible: "Repita su clave."

---

### TC-PROF-017 — EditPassword — no coinciden las contraseñas

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en EditPassword.

**Pasos:**
1. Ingresar "Contraseña123" en "Crear contraseña".
2. Ingresar "OtraContraseña123" en "Repita su contraseña".
3. Tap en "Guardar".

**Resultado esperado:**
- Error visible: "Las claves no coinciden."
- Botón "Guardar" deshabilitado.

---

### TC-PROF-018 — EditPassword — validación de coincidencia en onBlur retryPassword

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditPassword.

**Pasos:**
1. Ingresar "Contraseña123" en "Crear contraseña".
2. Ingresar "OtraContraseña" en "Repita su contraseña".
3. Tap fuera del campo de confirmación (blur).

**Resultado esperado:**
- Error visible inmediatamente: "Las claves no coinciden."

---

### TC-PROF-019 — EditPassword — toggle mostrar/ocultar contraseña

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditPassword con contraseña ingresada.

**Pasos:**
1. Ingresar "Contraseña123" en "Crear contraseña".
2. Tap en ícono de ojo/toggle para mostrar contraseña.

**Resultado esperado:**
- Contraseña cambia de enmascarada (•••) a texto visible.
- Tap nuevamente para ocultarla.

---

### TC-PROF-020 — EditPassword — contraseña exactamente 8 caracteres válida

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditPassword.

**Pasos:**
1. Ingresar "Contr123" (exactamente 8 caracteres) en ambos campos.
2. Tap en "Guardar".

**Resultado esperado:**
- Validación pasa.
- Contraseña se actualiza.

---

## EditGender

### TC-PROF-021 — Editar sexo biológico — happy path

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en UserProfile.

**Pasos:**
1. Tap en campo "Sexo biológico".

**Resultado esperado:**
- Navega a EditGender.
- Pantalla muestra opciones de sexo biológico.

---

### TC-PROF-022 — EditGender — 3 opciones disponibles

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditGender.

**Pasos:**
1. Observar las opciones.

**Resultado esperado:**
- Opción 1: FEMALE ("mujer", letra "M")
- Opción 2: MALE ("hombre", letra "H")
- Opción 3: OTHER ("otro", letra "O")
- Todas con radio buttons (single-select).

---

### TC-PROF-023 — EditGender — seleccionar "Mujer"

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditGender.

**Pasos:**
1. Tap en opción "mujer".
2. Tap en "Guardar".

**Resultado esperado:**
- Regresa a UserProfile.
- Campo "Sexo biológico" muestra "Mujer".

---

### TC-PROF-024 — EditGender — seleccionar "Hombre"

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditGender.

**Pasos:**
1. Tap en opción "hombre".
2. Tap en "Guardar".

**Resultado esperado:**
- Regresa a UserProfile.
- Campo "Sexo biológico" muestra "Hombre".

---

### TC-PROF-025 — EditGender — seleccionar "Otro"

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditGender.

**Pasos:**
1. Tap en opción "otro".
2. Tap en "Guardar".

**Resultado esperado:**
- Regresa a UserProfile.
- Campo "Sexo biológico" muestra "Otro".

---

### TC-PROF-026 — EditGender — caja info explicativa

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en EditGender.

**Pasos:**
1. Observar la sección de información.

**Resultado esperado:**
- Caja info visible con:
  - Título: "¿Por qué pedimos tu sexo biológico?"
  - Texto: "Para brindarte resultados más precisos, ya que ciertos rangos y valores estándar están relacionados al mismo."
  - Nota aclaratoria: "Esta selección no pretende definir ni limitar tu identidad de género."

---

### TC-PROF-027 — EditGender — validación: opción requerida

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en EditGender sin seleccionar opción.

**Pasos:**
1. Tap en "Guardar" sin seleccionar ninguna opción.

**Resultado esperado:**
- Botón "Guardar" está deshabilitado.
- Error o mensaje: "Debes seleccionar una opción."

---

## EditBirthdate

### TC-PROF-028 — Editar fecha de nacimiento — happy path

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en UserProfile.

**Pasos:**
1. Tap en campo "Fecha de Nacimiento".
2. En EditBirthdate, seleccionar fecha 1990-05-14.
3. Tap en "Guardar".

**Resultado esperado:**
- Regresa a UserProfile.
- Fecha actualizada en formato locale LL (ej: "14 de mayo de 1990").

---

### TC-PROF-029 — EditBirthdate — header "Fecha de Nacimiento"

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en EditBirthdate.

**Pasos:**
1. Observar el header.

**Resultado esperado:**
- Header muestra "Fecha de Nacimiento".
- Ícono: "calendar-today" (MaterialCommunityIcons) visible.

---

### TC-PROF-030 — EditBirthdate — DatePicker con placeholder

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditBirthdate con campo vacío.

**Pasos:**
1. Observar el campo DatePicker.

**Resultado esperado:**
- Placeholder: "Selecciona tu fecha de nacimiento" visible.

---

### TC-PROF-031 — EditBirthdate — validación menor de 18 años

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en EditBirthdate.

**Pasos:**
1. Seleccionar fecha 2010-05-14 (16 años actualmente).
2. Tap en "Guardar".

**Resultado esperado:**
- Error visible: "Debes ser mayor a 18 años para utilizar nuestra aplicación."
- Botón "Guardar" deshabilitado.

---

### TC-PROF-032 — EditBirthdate — validación mayor de 99 años

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en EditBirthdate.

**Pasos:**
1. Seleccionar fecha 1900-05-14 (126 años actualmente).
2. Tap en "Guardar".

**Resultado esperado:**
- Error visible: "Debes ser menor a 99 años para utilizar nuestra aplicación."
- Botón "Guardar" deshabilitado.

---

### TC-PROF-033 — EditBirthdate — rango 18-99 años exactos

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditBirthdate.

**Pasos:**
1. Seleccionar fecha exacta 18 años atrás (hoy - 18 años).
2. Tap en "Guardar".

**Resultado esperado:**
- Validación pasa (es exactamente 18).
- Fecha se guarda.

---

### TC-PROF-034 — EditBirthdate — rango máximo 99 años

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditBirthdate.

**Pasos:**
1. Seleccionar fecha exacta 99 años atrás.
2. Tap en "Guardar".

**Resultado esperado:**
- Validación pasa.
- Fecha se guarda.

---

## EditCountry

### TC-PROF-035 — Editar país de residencia — happy path

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en UserProfile.

**Pasos:**
1. Tap en campo "País de residencia".

**Resultado esperado:**
- Navega a EditCountry.
- Campo de búsqueda visible con placeholder "Buscar".
- Lista de países agrupados alfabéticamente visible.
- Índice lateral A-Z visible.

---

### TC-PROF-036 — EditCountry — búsqueda de país por nombre

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditCountry.

**Pasos:**
1. Ingresar "Arg" en el campo de búsqueda.

**Resultado esperado:**
- Lista filtra en tiempo real.
- "Argentina" visible en los resultados.
- Búsqueda es insensible a mayúsculas.

---

### TC-PROF-037 — EditCountry — búsqueda normalizada (sin tildes)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditCountry.

**Pasos:**
1. Ingresar "cote" en búsqueda (sin tilde).

**Resultado esperado:**
- Retorna "Côte d'Ivoire" (normalización Unicode correcta).
- Búsqueda ignora acentos.

---

### TC-PROF-038 — EditCountry — índice lateral A-Z scroll

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditCountry sin búsqueda activa (campo vacío).

**Pasos:**
1. Tap en letra "M" del índice lateral.

**Resultado esperado:**
- Lista hace scroll hasta sección de países que comienzan con "M".
- Índice solo visible si no hay búsqueda.

---

### TC-PROF-039 — EditCountry — seleccionar país navega atrás

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditCountry.

**Pasos:**
1. Buscar o scroll a "Argentina".
2. Tap en "Argentina".

**Resultado esperado:**
- Regresa automáticamente a UserProfile.
- Campo "País de residencia" actualizado a "Argentina".
- Llamada a API: updateUserCountry() completada.

---

### TC-PROF-040 — EditCountry — ClearButtonMode en búsqueda

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditCountry con texto en búsqueda.

**Pasos:**
1. Ingresar "Arg".
2. Observar el campo de búsqueda.
3. Tap en botón X (clear).

**Resultado esperado:**
- Campo se limpia.
- Lista retorna a vista completa agrupada alfabéticamente.

---

### TC-PROF-041 — EditCountry — FlashList para países (performance)

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en EditCountry con lista completa de países.

**Pasos:**
1. Hacer scroll rápido entre secciones (A-Z).

**Resultado esperado:**
- Scroll es suave sin lag.
- FlashList renderiza eficientemente los items visibles.

---

### TC-PROF-042 — EditCountry — sin resultados de búsqueda

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en EditCountry.

**Pasos:**
1. Ingresar "XYZWQ" (texto que no existe en lista de países).

**Resultado esperado:**
- Estado vacío visible: "No se encontraron países" (o similar).
- Sin crash.
- Opción para limpiar búsqueda y reintentar.

---

## EditWeight

### TC-PROF-043 — Editar peso — happy path

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en UserProfile.

**Pasos:**
1. Tap en campo "Peso" (ej: "68 kg.").
2. En EditWeight, seleccionar nuevo peso 70.5 kg.
3. Tap en "Guardar".

**Resultado esperado:**
- Regresa a UserProfile.
- Campo "Peso" actualizado a "70.5 kg."

---

### TC-PROF-044 — EditWeight — wheel picker entero + decimal

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditWeight.

**Pasos:**
1. Interactuar con el wheel picker.

**Resultado esperado:**
- Rueda con dos secciones: entero + decimal.
- Usuario puede rodar cada sección independientemente.

---

### TC-PROF-045 — EditWeight — unidad kg, rango 20-250

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditWeight.

**Pasos:**
1. Observar los límites.

**Resultado esperado:**
- Unidad mostrada: "kg".
- Rango permitido: 20-250 kg.
- Wheel picker solo permite valores en ese rango.

---

### TC-PROF-046 — EditWeight — separador decimal coma

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditWeight.

**Pasos:**
1. Ingresar o seleccionar 68,5 (coma como separador decimal).

**Resultado esperado:**
- Aplicación acepta coma como separador.
- Valor se guarda como 68.5 internamente.

---

### TC-PROF-047 — EditWeight — validación mínimo 20 kg

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en EditWeight.

**Pasos:**
1. Seleccionar 19 kg.
2. Tap en "Guardar".

**Resultado esperado:**
- Error visible: "Debes pesar entre 20 y 250 kg para utilizar nuestra aplicación."
- Botón "Guardar" deshabilitado.

---

### TC-PROF-048 — EditWeight — validación máximo 250 kg

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en EditWeight.

**Pasos:**
1. Seleccionar 251 kg.
2. Tap en "Guardar".

**Resultado esperado:**
- Error visible: "Debes pesar entre 20 y 250 kg para utilizar nuestra aplicación."
- Botón "Guardar" deshabilitado.

---

### TC-PROF-049 — EditWeight — exactamente 20 kg válido

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditWeight.

**Pasos:**
1. Seleccionar exactamente 20 kg.
2. Tap en "Guardar".

**Resultado esperado:**
- Validación pasa.
- Peso se actualiza a 20 kg.

---

## EditHeight

### TC-PROF-050 — Editar altura — happy path

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en UserProfile.

**Pasos:**
1. Tap en campo "Altura" (ej: "165 cm.").
2. En EditHeight, seleccionar nueva altura 170 cm.
3. Tap en "Guardar".

**Resultado esperado:**
- Regresa a UserProfile.
- Campo "Altura" actualizado a "170 cm."

---

### TC-PROF-051 — EditHeight — wheel picker entero + decimal

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditHeight.

**Pasos:**
1. Interactuar con el wheel picker.

**Resultado esperado:**
- Rueda con dos secciones: entero + decimal.
- Usuario puede rodar cada sección independientemente.

---

### TC-PROF-052 — EditHeight — unidad cm, rango 90-220

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditHeight.

**Pasos:**
1. Observar los límites.

**Resultado esperado:**
- Unidad mostrada: "cm".
- Rango permitido: 90-220 cm.
- Wheel picker solo permite valores en ese rango.

---

### TC-PROF-053 — EditHeight — validación mínimo 90 cm

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en EditHeight.

**Pasos:**
1. Seleccionar 89 cm.
2. Tap en "Guardar".

**Resultado esperado:**
- Error visible: "Debes medir entre 90 y 220 cms para utilizar nuestra aplicación."
- Botón "Guardar" deshabilitado.

---

### TC-PROF-054 — EditHeight — validación máximo 220 cm

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en EditHeight.

**Pasos:**
1. Seleccionar 221 cm.
2. Tap en "Guardar".

**Resultado esperado:**
- Error visible: "Debes medir entre 90 y 220 cms para utilizar nuestra aplicación."
- Botón "Guardar" deshabilitado.

---

### TC-PROF-055 — EditHeight — exactamente 90 cm válido

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditHeight.

**Pasos:**
1. Seleccionar exactamente 90 cm.
2. Tap en "Guardar".

**Resultado esperado:**
- Validación pasa.
- Altura se actualiza a 90 cm.

---

## EditTargets (2 pasos)

### TC-PROF-056 — Editar targets — paso 1 Targets

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en UserProfile, tap en sección "Metas".

**Pasos:**
1. Navega a EditTargets.

**Resultado esperado:**
- Pantalla EditTargets paso 1 visible.
- Título: "Elige tus objetivos".
- Subtítulo: "¿Cuál es tu meta principal hoy?"
- Visible el botón "Elegir frecuencia" (deshabilitado si no hay targets seleccionados).

---

### TC-PROF-057 — EditTargets paso 1 — 6 opciones disponibles

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditTargets paso 1.

**Pasos:**
1. Observar las opciones de targets.

**Resultado esperado:**
- Opción 1: "Controlar mi presión arterial" (control_blood_pressure)
- Opción 2: "Controlar mi frecuencia cardíaca" (control_heart_rate)
- Opción 3: "Hacer seguimiento de mi peso" (control_weight)
- Opción 4: "Monitorear mi glucosa en sangre" (control_glucose)
- Opción 5: "Controlar mi actividad física/pasos" (control_steps)
- Opción 6: "Llevar control general" (control_general)
- Todos con checkboxes (multi-select).

---

### TC-PROF-058 — EditTargets paso 1 — seleccionar un target

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditTargets paso 1.

**Pasos:**
1. Tap en checkbox "Controlar mi presión arterial".

**Resultado esperado:**
- Checkbox está seleccionado.
- Botón "Elegir frecuencia" se habilita.

---

### TC-PROF-059 — EditTargets paso 1 — seleccionar múltiples targets

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditTargets paso 1.

**Pasos:**
1. Seleccionar "Controlar mi presión arterial", "Hacer seguimiento de mi peso", "Llevar control general".

**Resultado esperado:**
- 3 checkboxes están seleccionados.
- Botón "Elegir frecuencia" habilitado.

---

### TC-PROF-060 — EditTargets paso 1 — deseleccionar un target

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con múltiples targets seleccionados.

**Pasos:**
1. Tap en un checkbox seleccionado para deseleccionar.

**Resultado esperado:**
- Checkbox se deselecciona.
- Resto de selecciones se mantienen.

---

### TC-PROF-061 — EditTargets paso 1 — botón deshabilitado sin targets

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en EditTargets paso 1 sin seleccionar ningún target.

**Pasos:**
1. Observar el botón "Elegir frecuencia".

**Resultado esperado:**
- Botón está deshabilitado (gris, sin respuesta al tap).

---

### TC-PROF-062 — EditTargets paso 1 → paso 2 Frequency

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en EditTargets paso 1 con targets seleccionados.

**Pasos:**
1. Tap en botón "Elegir frecuencia".

**Resultado esperado:**
- Navega a EditTargets paso 2.
- Título: "¿Con qué frecuencia planeas cuidarte?"
- Subtítulo: "Esto nos permite sugerirte recordatorios que se adapten a tu ritmo, sin abrumarte."
- Visible el botón "Guardar" (deshabilitado si no hay frequency seleccionada).

---

### TC-PROF-063 — EditTargets paso 2 — 4 opciones de frecuencia

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditTargets paso 2.

**Pasos:**
1. Observar las opciones de frequency.

**Resultado esperado:**
- Opción 1: "Varias veces al día" (con nota: "Ideal para glucómetros")
- Opción 2: "Una vez al día" (con nota: "Ideal para presión arterial")
- Opción 3: "Algunas veces a la semana" (con nota: "Ideal para control de peso")
- Opción 4: "Solo cuando lo necesite" (con nota: "Uso ocasional")
- Single-select (radio buttons).

---

### TC-PROF-064 — EditTargets paso 2 — seleccionar frecuencia

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditTargets paso 2.

**Pasos:**
1. Tap en "Una vez al día".

**Resultado esperado:**
- Radio button está seleccionado.
- Botón "Guardar" se habilita.

---

### TC-PROF-065 — EditTargets paso 2 — cambiar frecuencia seleccionada

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditTargets paso 2 con frecuencia ya seleccionada.

**Pasos:**
1. Tap en otra opción de frecuencia.

**Resultado esperado:**
- Opción anterior se deselecciona.
- Nueva opción se selecciona (radio button).

---

### TC-PROF-066 — EditTargets paso 2 — botón deshabilitado sin frecuencia

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en EditTargets paso 2 sin seleccionar frecuencia.

**Pasos:**
1. Observar el botón "Guardar".

**Resultado esperado:**
- Botón está deshabilitado (gris, sin respuesta al tap).

---

### TC-PROF-067 — EditTargets paso 2 → guardar cambios

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en EditTargets paso 2 con targets y frequency seleccionados.

**Pasos:**
1. Tap en botón "Guardar".

**Resultado esperado:**
- Regresa a UserProfile.
- Sección "Metas" refleja los targets seleccionados.
- En Home, ObjectiveTabs se actualiza con los nuevos targets.

---

### TC-PROF-068 — EditTargets paso 2 — back navega a paso 1

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditTargets paso 2.

**Pasos:**
1. Tap en botón back (o gesto de swipe back).

**Resultado esperado:**
- Regresa a EditTargets paso 1.
- Targets anteriormente seleccionados se mantienen.

---

### TC-PROF-069 — EditTargets paso 1 — back navega a UserProfile

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en EditTargets paso 1.

**Pasos:**
1. Tap en botón back (sin haber avanzado a paso 2).

**Resultado esperado:**
- Regresa a UserProfile.
- Cambios sin guardar se descartan.

---

## Menu (MenuOptions)

### TC-PROF-070 — Menu carga correctamente con todas las opciones

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario accede a Menu desde navigation.

**Pasos:**
1. Navegar a Menu.

**Resultado esperado:**
- Título: "Menu" (o similar) visible.
- Todas las 11 opciones visibles en orden exacto:
  1. "Mi cuenta"
  2. "Notificaciones"
  3. "Agregar dispositivo inálambrico"
  4. "Conectar con app de salud" (solo si healthNativeAvailable=true)
  5. "Soporte"
  6. "Nuestra tienda"
  7. "Calificar app"
  8. "Términos y Condiciones"
  9. "Políticas de Privacidad"
  10. "Versión de Aplicación"
  11. "Cerrar sesión"

---

### TC-PROF-071 — Menu opción 1 — Mi cuenta

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Menu.

**Pasos:**
1. Tap en "Mi cuenta".

**Resultado esperado:**
- Navega a UserProfile.

---

### TC-PROF-072 — Menu opción 2 — Notificaciones

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Menu.

**Pasos:**
1. Tap en "Notificaciones".

**Resultado esperado:**
- Navega a NotificationsPreferences.

---

### TC-PROF-073 — Menu opción 3 — Agregar dispositivo inálambrico

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Menu.

**Pasos:**
1. Tap en "Agregar dispositivo inálambrico".

**Resultado esperado:**
- Navega a tab Devices.

---

### TC-PROF-074 — Menu opción 4 — Conectar con app de salud

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Menu con healthNativeAvailable=true.

**Pasos:**
1. Observar la opción "Conectar con app de salud".

**Resultado esperado:**
- Opción visible solo si healthNativeAvailable=true.
- Tap navega a ConnectHealth.

---

### TC-PROF-075 — Menu opción 5 — Soporte

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Menu.

**Pasos:**
1. Tap en "Soporte".

**Resultado esperado:**
- Navega a pantalla Support.

---

### TC-PROF-076 — Menu opción 6 — Nuestra tienda

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en Menu.

**Pasos:**
1. Tap en "Nuestra tienda".

**Resultado esperado:**
- Abre WebBrowser con URL: https://www.femmto.health/

---

### TC-PROF-077 — Menu opción 7 — Calificar app

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en Menu (Android).

**Pasos:**
1. Tap en "Calificar app".

**Resultado esperado:**
- Abre Play Store de la app (Android).
- En iOS abriría App Store.

---

### TC-PROF-078 — Menu opción 8 — Términos y Condiciones

**Tipo:** Happy path | **Prioridad:** Lowa

**Precondiciones:** Usuario en Menu.

**Pasos:**
1. Tap en "Términos y Condiciones".

**Resultado esperado:**
- Abre PDF en browser externo o webview: https://femmto-app.s3.us-east-1.amazonaws.com/TyC.pdf

---

### TC-PROF-079 — Menu opción 9 — Políticas de Privacidad

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en Menu.

**Pasos:**
1. Tap en "Políticas de Privacidad".

**Resultado esperado:**
- Abre PDF en browser externo o webview (URL en s3).

---

### TC-PROF-080 — Menu opción 10 — Versión de Aplicación

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Menu.

**Pasos:**
1. Tap en "Versión de Aplicación".

**Resultado esperado:**
- Alert simple visible.
- Muestra el número de versión (ej: "4.0.0").
- Botón "Entendido" o "Cerrar" para dismissar.

---

### TC-PROF-081 — Menu opción 11 — Cerrar sesión

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario autenticado en Menu.

**Pasos:**
1. Tap en "Cerrar sesión".

**Resultado esperado:**
- Alert de confirmación visible: 
  - Título: "FEMMTO"
  - Mensaje: "¿Estás seguro que deseas cerrar sesión?"
  - Botones: [Aceptar, Cancelar]

---

### TC-PROF-082 — Menu cerrar sesión — confirmar

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en alert de confirmación "Cerrar sesión".

**Pasos:**
1. Tap en botón "Aceptar".

**Resultado esperado:**
- Función doLogout() se ejecuta.
- Navega a SignInSignUp (Welcome).
- Sesión completamente cerrada.

---

### TC-PROF-083 — Menu cerrar sesión — cancelar

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en alert de confirmación "Cerrar sesión".

**Pasos:**
1. Tap en botón "Cancelar".

**Resultado esperado:**
- Alert se cierra.
- Usuario sigue en Menu.
- Sesión se mantiene activa.

---

## Support

### TC-PROF-084 — Support — 2 opciones visibles

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Support (desde Menu).

**Pasos:**
1. Observar las opciones.

**Resultado esperado:**
- Opción 1: "Ayuda en línea"
- Opción 2: "Contáctanos"

---

### TC-PROF-085 — Support — Ayuda en línea

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Support.

**Pasos:**
1. Tap en "Ayuda en línea".

**Resultado esperado:**
- Abre WhatsApp con número: +5491131262318.

---

### TC-PROF-086 — Support — Contáctanos

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Support.

**Pasos:**
1. Tap en "Contáctanos".

**Resultado esperado:**
- Abre email: hola@femmto.com.

---

## ConnectHealth

### TC-PROF-087 — ConnectHealth — instrucciones para Android

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en ConnectHealth (Android).

**Pasos:**
1. Observar el texto de instrucciones.

**Resultado esperado:**
- Texto visible: "Abre la app Salud Connect > Permisos > Femmto para editar los permisos de compartir"

---

### TC-PROF-088 — ConnectHealth — instrucciones para iOS

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en ConnectHealth (iOS).

**Pasos:**
1. Observar el texto de instrucciones.

**Resultado esperado:**
- Texto visible: "En tu smartphone ve a Configuración > Salud > Femmto App para editar los permisos."

---

### TC-PROF-089 — ConnectHealth — subtítulo explicativo

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en ConnectHealth.

**Pasos:**
1. Observar el subtítulo.

**Resultado esperado:**
- Subtítulo visible: "Puedes agregar o eliminar permisos de importación/exportación a nivel individual para cada tipo de medición."

---

### TC-PROF-090 — ConnectHealth — botón Entendido

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en ConnectHealth.

**Pasos:**
1. Tap en botón "Entendido".

**Resultado esperado:**
- Vuelve a Menu.
- ConnectHealth se cierra.

---

