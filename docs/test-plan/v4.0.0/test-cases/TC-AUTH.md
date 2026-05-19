---
modulo: auth
version_produccion: 4.0.0
last_modified: 2026-05-14
pantallas_cubiertas:
  - Welcome (HaveAccount)
  - Login
  - ResetPassword
  - MeetUser (Greeting, Instructions, Questions, CompleteProfile, CompleteProfileSuccess)
  - NotificationPermission
  - FirstMeasure (Instructions, BluetoothPermission, SelectMeasureType, OnboardingMeasureSuccess)
  - SaveOnboardingProgress (FirstMessage, UserForms)
---

# Test Cases — Módulo Auth

---

## Welcome (HaveAccount)

### TC-AUTH-001 — Pantalla Welcome visible al abrir la app sin sesión

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario no autenticado, app recién instalada o con sesión cerrada.

**Pasos:**
1. Abrir la app.

**Resultado esperado:**
- Se muestra la pantalla Welcome con degradado `#C7D6E9 → #FFFFFF`.
- Visible imagen `app-icon.png`.
- Texto `"Tu salud, conectada."` visible.
- Botón `"Ingresar por primera vez"` habilitado.
- Botón `"Ya tengo una cuenta"` habilitado.

---

### TC-AUTH-002 — Navegación a MeetUser desde Welcome (primera vez)

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** App en pantalla Welcome.

**Pasos:**
1. Tap en `"Ingresar por primera vez"`.

**Resultado esperado:**
- Navega a MeetUser → pantalla Greeting.
- Visible texto `"¡Hola!"` y `"Somos Femmto."`.
- Visible texto `"Te acompañamos en el camino hacia una vida más saludable."`.

---

### TC-AUTH-003 — Navegación a Login desde Welcome (usuario existente)

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** App en pantalla Welcome.

**Pasos:**
1. Tap en `"Ya tengo una cuenta"`.

**Resultado esperado:**
- Navega a pantalla Login.
- Visible campo email con placeholder `"Ingrese su email"`.
- Visible campo password con placeholder `"Ingrese su contraseña"`.

---

## Login

### TC-AUTH-004 — Login exitoso con credenciales válidas

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario registrado y autenticado previamente. App en pantalla Login.

**Pasos:**
1. Ingresar email válido en el campo email.
2. Ingresar contraseña correcta en el campo password.
3. Tap en botón `"Ingresar"`.

**Resultado esperado:**
- No se muestra error.
- Si perfil está completo → navega al TabNavigator (Home).
- Si perfil incompleto → navega a pantalla de completar perfil.

---

### TC-AUTH-005 — Login fallido con contraseña incorrecta

**Tipo:** Negativo | **Prioridad:** Alta

**Precondiciones:** Usuario registrado. App en pantalla Login.

**Pasos:**
1. Ingresar email válido.
2. Ingresar contraseña incorrecta.
3. Tap en `"Ingresar"`.

**Resultado esperado:**
- Se muestra toast/mensaje error: `"Comprueba que has introducido mail y contraseña correctos"`.
- Usuario permanece en pantalla Login.

---

### TC-AUTH-006 — Botón Ingresar deshabilitado con email vacío

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** App en pantalla Login.

**Pasos:**
1. Dejar campo email vacío.
2. Ingresar contraseña válida (8+ caracteres).
3. Verificar estado del botón `"Ingresar"`.

**Resultado esperado:**
- Botón `"Ingresar"` deshabilitado o no interactuable.

---

### TC-AUTH-007 — Botón Ingresar deshabilitado con contraseña vacía

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** App en pantalla Login.

**Pasos:**
1. Ingresar email válido.
2. Dejar campo password vacío.
3. Verificar estado del botón `"Ingresar"`.

**Resultado esperado:**
- Botón `"Ingresar"` deshabilitado o no interactuable.

---

### TC-AUTH-008 — Botón Ingresar deshabilitado con ambos campos vacíos

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** App en pantalla Login.

**Pasos:**
1. No ingresar nada en email ni password.
2. Verificar estado del botón `"Ingresar"`.

**Resultado esperado:**
- Botón `"Ingresar"` deshabilitado.

---

### TC-AUTH-009 — Validación de formato email incorrecto

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** App en pantalla Login.

**Pasos:**
1. Ingresar texto sin formato email válido (ej: "usuario", "usuario@", "usuario@.com").
2. Verificar si hay validación en campo.

**Resultado esperado:**
- Si hay validación en campo → muestra mensaje `"Ingresa una dirección de mail válida."`.
- Si no hay validación en campo → se intenta enviar la solicitud (se captura en servidor).

---

### TC-AUTH-010 — Validación de contraseña menor a 8 caracteres

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** App en pantalla Login.

**Pasos:**
1. Ingresar email válido.
2. Ingresar contraseña con 7 caracteres o menos.

**Resultado esperado:**
- Si hay validación en campo → muestra mensaje `"Debe contener al menos 8 caracteres."`.
- Botón `"Ingresar"` deshabilitado si la validación es activa.

---

### TC-AUTH-011 — Navegación a ResetPassword desde Login

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** App en pantalla Login.

**Pasos:**
1. Tap en link `"Olvidaste tu contraseña?"`.

**Resultado esperado:**
- Navega a pantalla ResetPassword.
- Visible campo email con placeholder `"Email"`.
- Visible botón `"Enviar"`.

---

### TC-AUTH-012 — Navegación a MeetUser desde Login (crear cuenta)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** App en pantalla Login.

**Pasos:**
1. Tap en link `"¿No tenés cuenta?"`.
2. Tap en `"Crear cuenta"` (si aparece como link separado).

**Resultado esperado:**
- Navega a MeetUser → pantalla Greeting (flujo de registro nuevo usuario).

---

### TC-AUTH-013 — Login con Google

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** App en pantalla Login. Cuenta Google disponible en el dispositivo.

**Pasos:**
1. Tap en botón `"Continuar con Google"`.
2. Completar el flujo de autenticación Google (seleccionar cuenta o iniciar sesión).

**Resultado esperado:**
- Si usuario es nuevo (no registrado con Google) → navega a MeetUser.
- Si usuario existente (registrado con Google) → navega al Home (si perfil completo) o a completar perfil.

---

### TC-AUTH-014 — Título formulario Login visible

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** App en pantalla Login.

**Pasos:**
1. Observar el contenido de la pantalla.

**Resultado esperado:**
- Visible título del formulario: `"Ingresa a tu cuenta"`.
- Visible divisor `"ingresar con"` encima de los botones sociales.

---

### TC-AUTH-015 — Navegación desde botones de create account (¿No tenés cuenta?)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** App en pantalla Login.

**Pasos:**
1. Buscar link/botón que diga algo como `"¿No tenés cuenta?"` o similar.
2. Tap en la opción de crear cuenta.

**Resultado esperado:**
- Navega a MeetUser → Greeting (inicio de flujo de registro).

---

## ResetPassword

### TC-AUTH-016 — Solicitud de reset con email válido

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** App en pantalla ResetPassword.

**Pasos:**
1. Ingresar email de usuario registrado.
2. Tap en botón `"Enviar"`.

**Resultado esperado:**
- Se muestra toast de éxito: `"Enviamos tu nueva contraseña a {email}"`.
- Usuario permanece en ResetPassword o navega atrás a Login.

---

### TC-AUTH-017 — Reset con email de usuario Google (error esperado)

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Email de usuario registrado con Google. App en ResetPassword.

**Pasos:**
1. Ingresar email de usuario Google.
2. Tap en `"Enviar"`.

**Resultado esperado:**
- Se muestra toast error: `"Te has registrado con tu usuario Google"`.
- Toast adicional: `"Ingresa usando el login de Google."`.
- Usuario permanece en ResetPassword.

---

### TC-AUTH-018 — Reset con email de usuario Apple (error esperado)

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Email de usuario registrado con Apple. App en ResetPassword.

**Pasos:**
1. Ingresar email de usuario Apple.
2. Tap en `"Enviar"`.

**Resultado esperado:**
- Se muestra toast error: `"Te has registrado con tu usuario Apple"`.
- Toast adicional: `"Ingresa usando el login de Apple."`.
- Usuario permanece en ResetPassword.

---

### TC-AUTH-019 — Reset con email inexistente

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** App en pantalla ResetPassword.

**Pasos:**
1. Ingresar email que no está registrado en el sistema.
2. Tap en `"Enviar"`.

**Resultado esperado:**
- Se muestra toast error: `"La dirección de correo electrónico \ningresada no existe."` (nota: typo original del código).
- Usuario permanece en ResetPassword.

---

### TC-AUTH-020 — Header title ResetPassword visible

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** App en pantalla ResetPassword.

**Pasos:**
1. Observar el header de la pantalla.

**Resultado esperado:**
- Visible título: `"Restablecer Contraseña"`.

---

### TC-AUTH-021 — Instrucciones en ResetPassword visibles

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** App en pantalla ResetPassword.

**Pasos:**
1. Observar el contenido de la pantalla.

**Resultado esperado:**
- Visible instrucción: `"Introduzca su correo electrónico y le eviaremos una nueva contraseña."` (nota: typo "eviaremos" es original del código).

---

## MeetUser — Greeting

### TC-AUTH-022 — Pantalla Greeting visible (MeetUser paso 0)

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario navigó a MeetUser desde Welcome.

**Pasos:**
1. Observar la pantalla Greeting.

**Resultado esperado:**
- Visible texto: `"¡Hola!"`.
- Visible texto: `"Somos Femmto."`.
- Visible texto: `"Te acompañamos en el camino hacia una vida más saludable."`.
- Botón `"Empezar"` habilitado.

---

### TC-AUTH-023 — Navegación Greeting a Instructions

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en MeetUser → Greeting.

**Pasos:**
1. Tap en botón `"Empezar"`.

**Resultado esperado:**
- Navega a pantalla Instructions (MeetUser paso 1).

---

## MeetUser — Instructions

### TC-AUTH-024 — Pantalla Instructions visible (MeetUser paso 1)

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en MeetUser → Instructions.

**Pasos:**
1. Observar la pantalla Instructions.

**Resultado esperado:**
- Visible texto: `"Queremos conocerte."`.
- Visible texto: `"Comenzaremos con 4 preguntas rápidas. Luego, haremos tu primera medición para activar tus tarjetas."`.
- "4 preguntas rápidas" visible en bold.
- Botón `"Continuar"` habilitado.

---

### TC-AUTH-025 — Navegación Instructions a Questions

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en MeetUser → Instructions.

**Pasos:**
1. Tap en botón `"Continuar"`.

**Resultado esperado:**
- Navega a Questions (MeetUser paso 2, step 0 de 3).
- Visible stepper/indicador mostrando "Step 0 de 3" o similar.

---

## MeetUser — Questions (4 pasos principales: Targets, Motivations, HowKnow, Frequency)

### TC-AUTH-026 — Questions Step 0: Targets visible

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en MeetUser → Questions (step 0).

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Visible título: `"Elige tus objetivos"`.
- Visible pregunta: `"¿Cuál es tu meta principal hoy?"`.
- Visible 6 opciones de selección múltiple:
  - `"Controlar mi presión arterial"` (control_blood_pressure)
  - `"Controlar mi frecuencia cardíaca"` (control_heart_rate)
  - `"Hacer seguimiento de mi peso"` (control_weight)
  - `"Monitorear mi glucosa en sangre"` (control_glucose)
  - `"Controlar mi actividad física/pasos"` (control_steps)
  - `"Llevar control general"` (control_general)
- Botón `"Continuar"` deshabilitado (ningún target seleccionado).

---

### TC-AUTH-027 — Questions Step 0: Seleccionar un target

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Questions step 0, sin targets seleccionados.

**Pasos:**
1. Tap en `"Controlar mi presión arterial"`.
2. Verificar que queda seleccionado.

**Resultado esperado:**
- El target queda marcado como activo (visualmente diferente).
- Botón `"Continuar"` se habilita.

---

### TC-AUTH-028 — Questions Step 0: Seleccionar múltiples targets

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Questions step 0.

**Pasos:**
1. Tap en `"Controlar mi presión arterial"`.
2. Tap en `"Hacer seguimiento de mi peso"`.
3. Tap en `"Controlar mi actividad física/pasos"`.
4. Verificar que todos quedan seleccionados simultáneamente.

**Resultado esperado:**
- Los 3 targets quedan marcados como activos.
- Botón `"Continuar"` habilitado.

---

### TC-AUTH-029 — Questions Step 0: Deseleccionar target

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Questions step 0 con al menos 2 targets seleccionados.

**Pasos:**
1. Tap en uno de los targets ya seleccionados.

**Resultado esperado:**
- El target se deselecciona.
- Si quedan otros targets → botón `"Continuar"` sigue habilitado.
- Si no quedan targets → botón `"Continuar"` se deshabilita.

---

### TC-AUTH-030 — Questions Step 0: Continuar sin target (botón bloqueado)

**Tipo:** Negativo | **Prioridad:** Alta

**Precondiciones:** Usuario en Questions step 0, sin ningún target seleccionado.

**Pasos:**
1. Verificar estado del botón `"Continuar"`.
2. Intentar tap en botón (si es posible).

**Resultado esperado:**
- Botón `"Continuar"` deshabilitado.
- No avanza al siguiente step.

---

### TC-AUTH-031 — Questions Step 1: Motivations visible

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Questions step 1.

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Visible título: `"¿Qué te motiva a lograrlo?"`.
- Visible descripción: `"Conocer tu propósito nos ayuda a enfocarte"`.
- Visible 6 opciones de selección múltiple:
  - `"Recomendación médica"`
  - `"Controlar una condición existente"`
  - `"Mejorar mis hábitos"`
  - `"Incorporar nuevos hábitos"`
  - `"Mejorar mi calidad de vida"`
  - `"Todas las anteriores"`
- Botón `"Continuar"` deshabilitado (sin motivaciones seleccionadas).

---

### TC-AUTH-032 — Questions Step 1: Seleccionar motivación

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Questions step 1, sin motivaciones seleccionadas.

**Pasos:**
1. Tap en `"Mejorar mis hábitos"`.

**Resultado esperado:**
- La motivación queda marcada como activa.
- Botón `"Continuar"` se habilita.

---

### TC-AUTH-033 — Questions Step 1: Seleccionar múltiples motivaciones

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Questions step 1.

**Pasos:**
1. Tap en `"Recomendación médica"`.
2. Tap en `"Mejorar mi calidad de vida"`.
3. Verificar que ambas quedan seleccionadas.

**Resultado esperado:**
- Las 2 motivaciones quedan marcadas.
- Botón `"Continuar"` habilitado.

---

### TC-AUTH-034 — Questions Step 1: Continuar sin motivación (botón bloqueado)

**Tipo:** Negativo | **Prioridad:** Alta

**Precondiciones:** Usuario en Questions step 1, sin motivaciones seleccionadas.

**Pasos:**
1. Verificar estado del botón `"Continuar"`.

**Resultado esperado:**
- Botón `"Continuar"` deshabilitado.

---

### TC-AUTH-035 — Questions Step 2: HowKnow visible

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Questions step 2.

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Visible título: `"¿Cómo supiste de Femmto?"`.
- Visible descripción: `"Queremos saber qué canal te trajo a nuestra comunidad."`.
- Visible 5 opciones de selección ÚNICA (radio buttons):
  - `"Compré un producto Femmto"`
  - `"Recomendación médica"`
  - `"Amigos/Familiares"`
  - `"App store/Play store"`
  - `"Redes sociales/Publicidad"`
- Botón `"Continuar"` deshabilitado (sin opción seleccionada).

---

### TC-AUTH-036 — Questions Step 2: Seleccionar opción HowKnow

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Questions step 2, sin opción seleccionada.

**Pasos:**
1. Tap en `"App store/Play store"`.

**Resultado esperado:**
- La opción queda seleccionada.
- Botón `"Continuar"` se habilita.

---

### TC-AUTH-037 — Questions Step 2: Cambiar opción HowKnow (única selección)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Questions step 2 con una opción ya seleccionada.

**Pasos:**
1. Tap en otra opción (ej: `"Recomendación médica"`).

**Resultado esperado:**
- La opción anterior se deselecciona.
- La nueva opción queda seleccionada.
- Botón `"Continuar"` sigue habilitado.

---

### TC-AUTH-038 — Questions Step 2: Continuar sin HowKnow (botón bloqueado)

**Tipo:** Negativo | **Prioridad:** Alta

**Precondiciones:** Usuario en Questions step 2, sin opción seleccionada.

**Pasos:**
1. Verificar estado del botón `"Continuar"`.

**Resultado esperado:**
- Botón `"Continuar"` deshabilitado.

---

### TC-AUTH-039 — Questions Step 3: Frequency visible

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Questions step 3.

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Visible título: `"¿Con qué frecuencia planeas cuidarte?"`.
- Visible descripción: `"Esto nos permite sugerirte recordatorios que se adapten a tu ritmo, sin abrumarte."`.
- Visible 4 opciones de selección ÚNICA con sublabels:
  - `"Varias veces al día"` → `"(Ideal para glucómetros)"`
  - `"Una vez al día"` → `"(Ideal para presión arterial)"`
  - `"Algunas veces a la semana"` → `"(Ideal para control de peso)"`
  - `"Solo cuando lo necesite"` → `"(Uso ocasional)"`
- Botón `"Continuar"` deshabilitado (sin opción seleccionada).

---

### TC-AUTH-040 — Questions Step 3: Seleccionar frecuencia

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Questions step 3, sin opción seleccionada.

**Pasos:**
1. Tap en `"Una vez al día"`.

**Resultado esperado:**
- La opción queda seleccionada.
- Botón `"Continuar"` se habilita.

---

### TC-AUTH-041 — Questions Step 3: Continuar sin frecuencia (botón bloqueado)

**Tipo:** Negativo | **Prioridad:** Alta

**Precondiciones:** Usuario en Questions step 3, sin opción seleccionada.

**Pasos:**
1. Verificar estado del botón `"Continuar"`.

**Resultado esperado:**
- Botón `"Continuar"` deshabilitado.

---

### TC-AUTH-042 — Questions Step 3: Completar flujo → NotificationPermission

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario completó los 4 steps de Questions (targets, motivations, howKnow, frequency) con completeProfile=false.

**Pasos:**
1. Tap en `"Continuar"` en step 3 (Frequency).

**Resultado esperado:**
- Navega a NotificationPermission.
- No navega a FirstMeasure aún.

---

### TC-AUTH-043 — Questions: Navegación atrás (Step 1 → Step 0)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Questions step 1 (Motivations) con selecciones previas en step 0.

**Pasos:**
1. Tap en botón atrás del header.

**Resultado esperado:**
- Retrocede a step 0 (Targets).
- Las selecciones en targets se mantienen (no se pierden).

---

### TC-AUTH-044 — Questions: Navegación atrás (Step 2 → Step 1)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Questions step 2 (HowKnow).

**Pasos:**
1. Tap en botón atrás del header.

**Resultado esperado:**
- Retrocede a step 1 (Motivations).
- Las selecciones de motivations se mantienen.

---

### TC-AUTH-045 — Questions: Navegación atrás (Step 3 → Step 2)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Questions step 3 (Frequency).

**Pasos:**
1. Tap en botón atrás del header.

**Resultado esperado:**
- Retrocede a step 2 (HowKnow).
- La selección de HowKnow se mantiene.

---

### TC-AUTH-046 — Questions: Navegación atrás desde Step 0 (desde Instructions)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Questions step 0 (Targets), navío desde Instructions.

**Pasos:**
1. Tap en botón atrás del header.

**Resultado esperado:**
- Retrocede a Instructions (MeetUser).
- No regresa a Greeting.

---

## MeetUser — CompleteProfile (Usuario existente con perfil incompleto)

### TC-AUTH-047 — Pantalla CompleteProfile visible

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario existente con perfil incompleto. App activa modal `checkProfileCompleted`.

**Pasos:**
1. Observar el modal/pantalla CompleteProfile.

**Resultado esperado:**
- Visible texto: `"¡Hola de nuevo!"`.
- Visible texto: `"Queremos conocerte mejor."`.
- Visible texto: `"Actualizamos la app para darte un seguimiento más personal. Solo te tomará un minuto responder 4 preguntas."`.
- Botón 1: `"Actualizar mi perfil"` habilitado.
- Botón 2: `"Ahora no"` habilitado.

---

### TC-AUTH-048 — CompleteProfile: Iniciar actualización (navega a Questions)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en pantalla CompleteProfile.

**Pasos:**
1. Tap en `"Actualizar mi perfil"`.

**Resultado esperado:**
- Navega a Questions con `completeProfile=true`.
- Los 4 steps (Targets, Motivations, HowKnow, Frequency) se cargan igual que en nuevo usuario.

---

### TC-AUTH-049 — CompleteProfile: Rechazar actualización (Ahora no)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en pantalla CompleteProfile.

**Pasos:**
1. Tap en `"Ahora no"`.

**Resultado esperado:**
- El modal/pantalla se cierra.
- Usuario regresa al Home o pantalla anterior.

---

## MeetUser — CompleteProfileSuccess

### TC-AUTH-050 — Pantalla CompleteProfileSuccess visible

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario completó los 4 steps de Questions con `completeProfile=true`.

**Pasos:**
1. Observar la pantalla CompleteProfileSuccess.

**Resultado esperado:**
- Visible texto: `"¡Todo listo!"`.
- Visible texto: `"Ahora que conocemos mejor tus metas, adaptaremos tu experiencia para que alcanzar tus objetivos de bienestar sea más simple."`.
- Botón `"Finalizar"` habilitado.

---

### TC-AUTH-051 — CompleteProfileSuccess: Finalizar (navega a Home)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en pantalla CompleteProfileSuccess.

**Pasos:**
1. Tap en `"Finalizar"`.

**Resultado esperado:**
- Navega al Home (TabNavigator).

---

## NotificationPermission

### TC-AUTH-052 — Pantalla NotificationPermission visible

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario completó Questions (nuevo usuario con completeProfile=false). Navió a NotificationPermission.

**Pasos:**
1. Observar la pantalla NotificationPermission.

**Resultado esperado:**
- Visible texto: `"Te ayudamos a sostener tu hábito de salud día a día."`.
- Visible descripción: `"Podrás configurar y recibir alertas cuando sea momento de medir y te acompañaremos en tu progreso."`.
- Botón 1: `"Recibir notificaciones"` habilitado.
- Botón 2: `"Ahora no"` habilitado.

---

### TC-AUTH-053 — NotificationPermission: Aceptar notificaciones

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en pantalla NotificationPermission.

**Pasos:**
1. Tap en `"Recibir notificaciones"`.
2. Si aparece diálogo de permisos del sistema → aceptar notificaciones.

**Resultado esperado:**
- Se solicitan permisos de notificación del sistema (Android 13+).
- Navega a FirstMeasure → Instructions independientemente del resultado del permiso.

---

### TC-AUTH-054 — NotificationPermission: Rechazar notificaciones (Ahora no)

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en pantalla NotificationPermission.

**Pasos:**
1. Tap en `"Ahora no"`.

**Resultado esperado:**
- No se solicita permiso de notificación.
- Navega directamente a FirstMeasure → Instructions.

---

## FirstMeasure — Instructions (Onboarding)

### TC-AUTH-055 — Pantalla FirstMeasure Instructions visible

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario llegó a FirstMeasure después de NotificationPermission (nuevo usuario).

**Pasos:**
1. Observar la pantalla FirstMeasure Instructions.

**Resultado esperado:**
- Visible título: `"¡Comencemos con tu primera medición!"`.
- Visible descripción: `"Conecta tu dispositivo Femmto para sincronizar tus datos automáticamente o ingresa el valor de forma manual."`.
- Botón 1: `"Continuar con conexión Bluetooth"` habilitado.
- Botón 2: `"Continuar con medición manual"` habilitado.
- Botón 3: `"Ahora no"` habilitado (si está visible).

---

### TC-AUTH-056 — FirstMeasure: Saltar medición (Ahora no)

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en FirstMeasure → Instructions.

**Pasos:**
1. Tap en `"Ahora no"`.

**Resultado esperado:**
- Navega directamente a SaveOnboardingProgress → FirstMessage.
- Se omite el flujo de medición de Bluetooth y manual.

---

### TC-AUTH-057 — FirstMeasure: Bluetooth con target único peso

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con único target `control_weight`. App en FirstMeasure Instructions.

**Pasos:**
1. Tap en `"Continuar con conexión Bluetooth"`.

**Resultado esperado:**
- Navega a BluetoothPermission.

---

### TC-AUTH-058 — FirstMeasure: Medición manual con target único peso

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con único target `control_weight`. App en FirstMeasure Instructions.

**Pasos:**
1. Tap en `"Continuar con medición manual"`.

**Resultado esperado:**
- Navega directamente a WeightMeasure (sin pasar por SelectMeasureType).
- `isBluetoothMeasure: false`.

---

### TC-AUTH-059 — FirstMeasure: Medición manual con target único presión

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con único target `control_blood_pressure`. App en FirstMeasure Instructions.

**Pasos:**
1. Tap en `"Continuar con medición manual"`.

**Resultado esperado:**
- Navega directamente a BloodPressureMeasure (sin pasar por SelectMeasureType).
- `isBluetoothMeasure: false`.

---

### TC-AUTH-060 — FirstMeasure: Medición manual con target único glucosa

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con único target `control_glucose`. App en FirstMeasure Instructions.

**Pasos:**
1. Tap en `"Continuar con medición manual"`.

**Resultado esperado:**
- Navega directamente a GlucoseMeasure (sin pasar por SelectMeasureType).
- `isBluetoothMeasure: false`.

---

### TC-AUTH-061 — FirstMeasure: Medición manual con múltiples targets

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con múltiples targets (ej: `control_blood_pressure` y `control_weight`). App en FirstMeasure Instructions.

**Pasos:**
1. Tap en `"Continuar con medición manual"`.

**Resultado esperado:**
- Navega a SelectMeasureType (sin ir directamente a una medida específica).

---

### TC-AUTH-062 — FirstMeasure: Medición manual con target control_steps

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con target `control_steps` o múltiples incluyendo steps. App en FirstMeasure Instructions.

**Pasos:**
1. Tap en `"Continuar con medición manual"`.

**Resultado esperado:**
- Si es único target → navega a StepsMeasure (o pantalla equivalente).
- Si hay múltiples targets → navega a SelectMeasureType.

---

## FirstMeasure — SelectMeasureType

### TC-AUTH-063 — Pantalla SelectMeasureType visible

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con múltiples targets. Tapió medición manual en FirstMeasure Instructions.

**Pasos:**
1. Observar la pantalla SelectMeasureType.

**Resultado esperado:**
- Visible título: `"Elige cómo te quieres medir"`.
- Visible subtítulo: `"Selecciona tu dispositivo para registrar una nueva medición."`.
- Visible 3 cards/opciones:
  - Tensiómetro (presión arterial / BloodPressure)
  - Balanza (peso / Weight)
  - Glucómetro (glucosa / Glucose)

---

### TC-AUTH-064 — SelectMeasureType: Seleccionar Tensiómetro

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SelectMeasureType.

**Pasos:**
1. Tap en card de Tensiómetro.

**Resultado esperado:**
- Navega a BloodPressureMeasure.

---

### TC-AUTH-065 — SelectMeasureType: Seleccionar Balanza

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SelectMeasureType.

**Pasos:**
1. Tap en card de Balanza.

**Resultado esperado:**
- Navega a WeightMeasure.

---

### TC-AUTH-066 — SelectMeasureType: Seleccionar Glucómetro

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SelectMeasureType.

**Pasos:**
1. Tap en card de Glucómetro.

**Resultado esperado:**
- Navega a NewGlucometerPage o GlucoseMeasure.

---

## FirstMeasure — OnboardingMeasureSuccess

### TC-AUTH-067 — Pantalla OnboardingMeasureSuccess visible

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario completó una medición en el flujo de onboarding (manual o Bluetooth).

**Pasos:**
1. Observar la pantalla OnboardingMeasureSuccess.

**Resultado esperado:**
- Fondo: LinearGradient `#C7D6E9 → #FFFFFF`.
- Visible icono: `success-green-icon.png`.
- Visible título: `"¡Felicitaciones!"`.
- Visible subtítulo: `"Ya hiciste tu primera medición"`.
- Botón `"Continuar"` habilitado.

---

### TC-AUTH-068 — OnboardingMeasureSuccess: Continuar (navega a SaveProgress)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en pantalla OnboardingMeasureSuccess.

**Pasos:**
1. Tap en botón `"Continuar"`.

**Resultado esperado:**
- Navega a SaveOnboardingProgress → FirstMessage.

---

## SaveOnboardingProgress — FirstMessage

### TC-AUTH-069 — Pantalla FirstMessage visible

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario llegó a SaveOnboardingProgress → FirstMessage.

**Pasos:**
1. Observar la pantalla FirstMessage.

**Resultado esperado:**
- Visible texto: `"No pierdas tu progreso."`.
- Visible texto: `"Vamos a terminar de crear tu perfil."`.
- Botón `"Continuar"` habilitado.

---

### TC-AUTH-070 — FirstMessage: Continuar (navega a UserForms)

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en pantalla FirstMessage.

**Pasos:**
1. Tap en botón `"Continuar"`.

**Resultado esperado:**
- Navega a UserForms (paso 0 → Email).
- Visible stepper mostrando "Step 0/7" o similar (si no es provider user).

---

## SaveOnboardingProgress — UserForms (Multi-step dinámico)

### TC-AUTH-071 — UserForms Step 0: Email visible

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Email (step 0).

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Visible campo email con placeholder `"Email"`.
- Visible 2 checkboxes:
  - Checkbox términos y condiciones
  - Checkbox política de privacidad
- Visible botón `"Continuar"` deshabilitado (sin email válido).
- Visible botones sociales: `"Continuar con Google"` (Android), `"Continuar con Apple"` (iOS).
- Visible divisor `"ingresar con"`.

---

### TC-AUTH-072 — UserForms Step 0: Email válido

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Email.

**Pasos:**
1. Ingresar email válido en el campo.
2. Marcar checkboxes de términos y privacidad.
3. Tap en `"Continuar"`.

**Resultado esperado:**
- Se valida el email localmente (o en servidor).
- Navega al siguiente step (Name step 1).

---

### TC-AUTH-073 — UserForms Step 0: Email inválido

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en UserForms paso Email.

**Pasos:**
1. Ingresar email con formato inválido (ej: "usuario@", "usuario").
2. Marcar checkboxes.
3. Tap en `"Continuar"`.

**Resultado esperado:**
- Se muestra validación de error (si hay).
- No avanza al siguiente step.
- Si no hay validación local → servidor rechaza con error.

---

### TC-AUTH-074 — UserForms Step 0: Checkboxes requeridos

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en UserForms paso Email con email válido.

**Pasos:**
1. Ingresar email válido.
2. No marcar los checkboxes.
3. Tap en `"Continuar"`.

**Resultado esperado:**
- Botón `"Continuar"` deshabilitado (si hay validación activa).
- O no avanza al siguiente step.

---

### TC-AUTH-075 — UserForms Step 0: Social login Google

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en UserForms paso Email. Cuenta Google disponible.

**Pasos:**
1. Tap en `"Continuar con Google"`.
2. Completar flujo de autenticación Google.

**Resultado esperado:**
- Si usuario es nuevo en Femmto → continúa con el onboarding después de vinculación.
- El email se prellenariza con el de Google (si aplica).

---

### TC-AUTH-076 — UserForms Step 1: Name visible

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Name (step 1).

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Visible campo nombre (input text).
- Visible label o placeholder indicando el campo.
- Botón `"Continuar"` deshabilitado (sin nombre).

---

### TC-AUTH-077 — UserForms Step 1: Ingresar nombre válido

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Name.

**Pasos:**
1. Ingresar nombre de 3-30 caracteres (ej: "Juan López").
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Navega a siguiente step (Birthdate step 2).

---

### TC-AUTH-078 — UserForms Step 1: Nombre menor a 3 caracteres

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en UserForms paso Name.

**Pasos:**
1. Ingresar nombre con 2 caracteres o menos.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Validación muestra error o botón está deshabilitado.
- No avanza al siguiente step.

---

### TC-AUTH-079 — UserForms Step 1: Nombre mayor a 30 caracteres

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en UserForms paso Name.

**Pasos:**
1. Ingresar nombre con más de 30 caracteres.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Campo rechaza entrada o valida y rechaza en servidor.
- No avanza al siguiente step.

---

### TC-AUTH-080 — UserForms Step 2: Birthdate visible

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Birthdate (step 2).

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Visible selector de fecha (DatePicker o similar).
- Rango permitido: 18-99 años (calculado desde hoy).
- Botón `"Continuar"` deshabilitado (sin fecha seleccionada).

---

### TC-AUTH-081 — UserForms Step 2: Ingresar birthdate válida

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Birthdate.

**Pasos:**
1. Seleccionar una fecha que corresponda a 25 años atrás (ej: nació en 2001).
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Navega a siguiente step (Gender step 3).

---

### TC-AUTH-082 — UserForms Step 2: Birthdate usuario menor de 18

**Tipo:** Negativo | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Birthdate.

**Pasos:**
1. Seleccionar una fecha que corresponda a menos de 18 años (ej: nació hace 17 años).
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Se muestra validación de error: `"Debes ser mayor a 18 años para utilizar nuestra aplicación."`.
- No avanza al siguiente step.

---

### TC-AUTH-083 — UserForms Step 2: Birthdate usuario mayor de 99

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en UserForms paso Birthdate.

**Pasos:**
1. Seleccionar una fecha que corresponda a más de 99 años atrás (ej: nació en 1905).
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Se muestra validación de error: `"Debes ser menor a 99 años para utilizar nuestra aplicación."`.
- No avanza al siguiente step.

---

### TC-AUTH-084 — UserForms Step 3: Gender visible

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Gender (step 3).

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Visible 2 opciones de selección única:
  - `MALE` (Hombre / Masculino)
  - `FEMALE` (Mujer / Femenino)
- Botón `"Continuar"` deshabilitado (sin género seleccionado).

---

### TC-AUTH-085 — UserForms Step 3: Seleccionar género

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Gender.

**Pasos:**
1. Tap en opción `FEMALE`.

**Resultado esperado:**
- La opción queda seleccionada.
- Botón `"Continuar"` se habilita.
- Tap en `"Continuar"` → navega a siguiente step (Weight step 4).

---

### TC-AUTH-086 — UserForms Step 4: Weight visible

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Weight (step 4).

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Visible campo numérico para peso (input number o spinner).
- Rango permitido: 20-250 kg.
- Botón `"Continuar"` deshabilitado (sin peso ingresado).

---

### TC-AUTH-087 — UserForms Step 4: Ingresar peso válido

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Weight.

**Pasos:**
1. Ingresar peso de 50 kg (en rango 20-250).
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Navega a siguiente step (Height step 5).

---

### TC-AUTH-088 — UserForms Step 4: Peso menor a 20 kg

**Tipo:** Negativo | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Weight.

**Pasos:**
1. Ingresar peso de 19 kg o menor.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Se muestra validación de error: `"Debes pesar entre 20 y 250 kg para utilizar nuestra aplicación."`.
- No avanza al siguiente step.

---

### TC-AUTH-089 — UserForms Step 4: Peso mayor a 250 kg

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en UserForms paso Weight.

**Pasos:**
1. Ingresar peso de 251 kg o mayor.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Se muestra validación de error: `"Debes pesar entre 20 y 250 kg para utilizar nuestra aplicación."`.
- No avanza al siguiente step.

---

### TC-AUTH-090 — UserForms Step 5: Height visible

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Height (step 5).

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Visible campo numérico para altura (input number o spinner).
- Rango permitido: 90-220 cm.
- Botón `"Continuar"` deshabilitado (sin altura ingresada).

---

### TC-AUTH-091 — UserForms Step 5: Ingresar altura válida

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Height.

**Pasos:**
1. Ingresar altura de 165 cm (en rango 90-220).
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Navega a siguiente step (Picture step 6).

---

### TC-AUTH-092 — UserForms Step 5: Altura menor a 90 cm

**Tipo:** Negativo | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Height.

**Pasos:**
1. Ingresar altura de 89 cm o menor.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Se muestra validación de error: `"Debes medir entre 90 y 220 cms para utilizar nuestra aplicación."`.
- No avanza al siguiente step.

---

### TC-AUTH-093 — UserForms Step 5: Altura mayor a 220 cm

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en UserForms paso Height.

**Pasos:**
1. Ingresar altura de 221 cm o mayor.
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Se muestra validación de error: `"Debes medir entre 90 y 220 cms para utilizar nuestra aplicación."`.
- No avanza al siguiente step.

---

### TC-AUTH-094 — UserForms Step 6: Picture visible

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en UserForms paso Picture (step 6).

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Visible opción de subir foto de perfil (botón o área interactiva).
- Visible opción de saltar foto (botón `"Saltar"` o `"Continuar sin foto"`).
- Botón `"Continuar"` habilitado incluso sin foto (foto no es obligatoria).

---

### TC-AUTH-095 — UserForms Step 6: Subir foto

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en UserForms paso Picture.

**Pasos:**
1. Tap en opción de subir foto.
2. Seleccionar imagen de galería o capturar con cámara.
3. Tap en `"Continuar"`.

**Resultado esperado:**
- Foto se sube correctamente.
- Navega al siguiente step (Password step 7, si no es provider user).

---

### TC-AUTH-096 — UserForms Step 6: Saltar foto

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en UserForms paso Picture.

**Pasos:**
1. Tap en opción de saltar (`"Saltar"` o botón equivalente).

**Resultado esperado:**
- Se salta la foto.
- Navega al siguiente step (Password step 7, si no es provider user).

---

### TC-AUTH-097 — UserForms Step 7: Password visible (non-provider user)

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Password (step 7, solo si NO es provider user).

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Visible campo password con placeholder `"Contraseña"`.
- Visible campo retryPassword con placeholder `"Confirmar contraseña"`.
- Requerimiento mínimo: 8 caracteres.
- Botón `"Continuar"` deshabilitado (sin contraseña válida).

---

### TC-AUTH-098 — UserForms Step 7: Ingresar contraseña válida

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Password.

**Pasos:**
1. Ingresar contraseña de 8+ caracteres en campo password (ej: "MiPass123").
2. Ingresar la misma contraseña en campo retryPassword.
3. Tap en `"Continuar"`.

**Resultado esperado:**
- Ambos campos coinciden.
- Se envía `doOnboarding()` con todos los datos (email, name, birthdate, gender, weight, height, picture, password).
- Usuario queda registrado.
- Navega al Home o pantalla de bienvenida.

---

### TC-AUTH-099 — UserForms Step 7: Contraseña menor a 8 caracteres

**Tipo:** Negativo | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Password.

**Pasos:**
1. Ingresar contraseña con 7 caracteres o menos (ej: "Pass12").
2. Tap en `"Continuar"`.

**Resultado esperado:**
- Validación muestra error o botón está deshabilitado.
- No avanza ni se envía el formulario.

---

### TC-AUTH-100 — UserForms Step 7: Contraseñas no coinciden

**Tipo:** Negativo | **Prioridad:** Alta

**Precondiciones:** Usuario en UserForms paso Password.

**Pasos:**
1. Ingresar contraseña en campo password (ej: "MyPassword123").
2. Ingresar diferente contraseña en retryPassword (ej: "MyPassword456").
3. Tap en `"Continuar"`.

**Resultado esperado:**
- Se muestra validación de error: `"Las claves no coinciden."`.
- Botón `"Continuar"` deshabilitado.
- No se envía el formulario.

---

### TC-AUTH-101 — UserForms Step 7: Provider User omite Password

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario es provider user (loginvía Google). En UserForms después de Picture step.

**Pasos:**
1. Observar si aparece el step de Password.

**Resultado esperado:**
- El step Password NO aparece en el stepper.
- Después de Picture → usuario es redirigido al Home (o pantalla de conclusión).
- No se pide contraseña para provider users.

---

### TC-AUTH-102 — UserForms: Error al crear perfil (submit fallido)

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario completó todos los steps del formulario. Servidor retorna error al hacer `doOnboarding()`.

**Pasos:**
1. Completar todos los steps del formulario.
2. En el servidor, simular un error (ej: email duplicado, validación fallida).
3. Tap en botón de submit final.

**Resultado esperado:**
- Se muestra toast/modal de error: `'Error al crear el perfil'` + `'Por favor, intenta nuevamente'`.
- Usuario permanece en UserForms (puede reintentarlo).

---

### TC-AUTH-103 — UserForms: Navegación atrás (Step 1 → Step 0)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en UserForms step 1 (Name).

**Pasos:**
1. Tap en botón atrás del header.

**Resultado esperado:**
- Retrocede a step 0 (Email).
- El email ingresado se mantiene (no se pierde).

---

### TC-AUTH-104 — UserForms: Navegación atrás (Step 7 → Step 6)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en UserForms step 7 (Password).

**Pasos:**
1. Tap en botón atrás del header.

**Resultado esperado:**
- Retrocede a step 6 (Picture).
- La foto seleccionada se mantiene (si la hubiera).

---

### TC-AUTH-105 — UserForms: Stepper muestra progreso correcto

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en UserForms en diferentes steps.

**Pasos:**
1. Observar el stepper en cada step (Email, Name, Birthdate, Gender, Weight, Height, Picture, Password).

**Resultado esperado:**
- Stepper muestra "Step X de Y" donde Y es el total de steps.
- Para non-provider users: "Step X de 8" (Email, Name, Birthdate, Gender, Weight, Height, Picture, Password).
- Para provider users: "Step X de 7" (omite Password).

---
