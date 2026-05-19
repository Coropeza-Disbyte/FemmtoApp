---
modulo: medition
version_produccion: 4.0.0
last_modified: 2026-05-14
pantallas_cubiertas:
  - MeditionOptions (punto de entrada con 3 cards)
  - NewPresureOCRMedition (Introduction, OCRCamera, OCRResults)
  - SuccessPressureMeasurement
  - NewScaleMedition (Introduction, entrada manual)
  - NewGlucometerMedition (Introduction, AddGlucoseMeasure)
  - OnboardingMeasureSuccess
  - SelectMeasureType (si múltiples targets)
---

# Test Cases — Módulo Medition

> En v4.0.0 el acceso principal a la medición es el botón "Nueva medición" en el header del Home. El tab "Medición" del bottom nav fue eliminado. La nueva entrada inteligente navega según la cantidad de targets del usuario.

---

## Punto de entrada: NewMeasurement desde Home

### TC-MEDI-001 — Botón nueva medición en Home navega según targets

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Home con perfil completo.

**Pasos:**
1. Buscar el icono `new-measure-icon.png` en el header de Home.
2. Tap en el botón "Nueva medición".

**Resultado esperado:**
- Si el usuario tiene 1 solo target: navega directamente al flujo de medición específico (ej: NewPresureOCRMedition).
- Si el usuario tiene múltiples targets: navega a MeditionOptions o SelectMeasureType.

---

### TC-MEDI-002 — Usuario con 1 target (Presión) navega directamente a NewPresureOCRMedition

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Home. Solo tiene 1 target de medición: Presión Arterial.

**Pasos:**
1. Tap en botón "Nueva medición".

**Resultado esperado:**
- Navega directamente a NewPresureOCRMedition.Introduction sin pasar por MeditionOptions.

---

### TC-MEDI-003 — Usuario con 1 target (Peso) navega directamente a NewScaleMedition

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Home. Solo tiene 1 target de medición: Peso.

**Pasos:**
1. Tap en botón "Nueva medición".

**Resultado esperado:**
- Navega directamente a NewScaleMedition.Introduction.
- Se ejecuta initFlow para el contexto de peso.

---

### TC-MEDI-004 — Usuario con 1 target (Glucosa) navega directamente a NewGlucometerMedition

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Home. Solo tiene 1 target de medición: Glucosa.

**Pasos:**
1. Tap en botón "Nueva medición".

**Resultado esperado:**
- Navega directamente a NewGlucometerMedition.Introduction.

---

## MeditionOptions: selección de dispositivo (múltiples targets)

### TC-MEDI-005 — MeditionOptions muestra 3 cards de dispositivos

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en MeditionOptions (múltiples targets configurados).

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Header: `"Nueva medición"`.
- Subtítulo: `"Elige cómo te quieres medir"`.
- Descripción: `"Selecciona tu dispositivo para registrar una nueva medición."`.
- 3 cards visibles:
  1. Blood Pressure Monitor (tensiómetro)
  2. Scale (balanza)
  3. Glucometer (glucómetro)

---

### TC-MEDI-006 — Seleccionar Presión en MeditionOptions

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en MeditionOptions.

**Pasos:**
1. Tap en card "Blood Pressure Monitor".

**Resultado esperado:**
- Navega a NewPresureOCRMedition.Introduction.

---

### TC-MEDI-007 — Seleccionar Peso en MeditionOptions

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en MeditionOptions.

**Pasos:**
1. Tap en card "Scale".

**Resultado esperado:**
- Navega a NewScaleMedition.Introduction.
- Se ejecuta initFlow para contexto de peso.

---

### TC-MEDI-008 — Seleccionar Glucosa en MeditionOptions

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en MeditionOptions.

**Pasos:**
1. Tap en card "Glucometer".

**Resultado esperado:**
- Navega a NewGlucometerMedition.Introduction.

---

### TC-MEDI-009 — MeditionOptions es accesible desde FirstMeasure en onboarding

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en FirstMeasure (onboarding) con múltiples targets. Selecciona "Registrar ahora".

**Pasos:**
1. Tap en opción para registrar medición.

**Resultado esperado:**
- Navega a SelectMeasureType o MeditionOptions.
- Flag `isOnboarding: true` se mantiene en el estado de navegación.

---

## NewPresureOCRMedition — Flujo de Presión Arterial

### TC-MEDI-010 — NewPresureOCRMedition.Introduction sin monitor vinculado

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en NewPresureOCRMedition.Introduction. Sin monitor Bluetooth vinculado.

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Header: `"Vincula tu monitor de presión"`.
- Imagen: `blood-pressure-monitor-connection.png`.
- Texto: `"Prepara tu conexión"`.
- 3 badges visibles: `"Bluetooth activado"`, `"Monitor encendido"`.
- 3 botones:
  1. `"Tomar foto"` → OCRCamera
  2. `"Entrada manual"` → OCRResults (pre-poblado con sys=0, dia=0, pulse=0)
  3. `"Usar Bluetooth"` → modal ConnectBluetoothDevice

---

### TC-MEDI-011 — NewPresureOCRMedition.Introduction con monitor vinculado

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en NewPresureOCRMedition.Introduction. Tiene un monitor Bluetooth vinculado.

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Header: `"Nueva medición"` (no menciona vinculación).
- Resto de contenido idéntico.
- El botón "Usar Bluetooth" navega directamente a SearchLinkedBluetoothDevice.

---

### TC-MEDI-012 — OCRCamera: capturar foto de tensiómetro

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en OCRCamera. Cámara disponible.

**Pasos:**
1. Apuntar la cámara a la pantalla de un tensiómetro.
2. Capturar la foto.

**Resultado esperado:**
- La foto se captura correctamente.
- Se envía a OCR para extracción de valores (sistólica, diastólica, pulso).
- Navega a OCRResults con valores extraídos automáticamente.

---

### TC-MEDI-013 — OCRResults: entrada manual de presión

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en OCRResults.Introduction selecciona "Entrada manual".

**Pasos:**
1. Ingresar SYS: `"120"`.
2. Ingresar DIA: `"80"`.
3. Ingresar PULSE: `"72"`.
4. Tap en `"Confirmar"`.

**Resultado esperado:**
- La medición se guarda correctamente.
- Si no es onboarding: navega a SuccessPressureMeasurement.
- Si es onboarding: navega a OnboardingMeasureSuccess.

---

### TC-MEDI-014 — OCRResults: validación SYS fuera de rango mínimo

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en OCRResults con valores editables.

**Pasos:**
1. Ingresar SYS: `"39"` (menor a 40).
2. Intentar confirmar.

**Resultado esperado:**
- Validación activa: bloquea confirmación.
- SYS debe estar entre 40 y 280 mmHg.

---

### TC-MEDI-015 — OCRResults: validación SYS límite inferior válido

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en OCRResults.

**Pasos:**
1. Ingresar SYS: `"40"` (exactamente el mínimo).
2. Ingresar DIA: `"60"`.
3. Ingresar PULSE: `"70"`.
4. Tap en `"Confirmar"`.

**Resultado esperado:**
- Avanza correctamente (límite inferior inclusivo).

---

### TC-MEDI-016 — OCRResults: validación SYS fuera de rango máximo

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en OCRResults.

**Pasos:**
1. Ingresar SYS: `"281"` (mayor a 280).
2. Intentar confirmar.

**Resultado esperado:**
- Validación activa: bloquea confirmación.
- SYS debe estar entre 40 y 280 mmHg.

---

### TC-MEDI-017 — OCRResults: validación SYS límite superior válido

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en OCRResults.

**Pasos:**
1. Ingresar SYS: `"280"` (exactamente el máximo).
2. Ingresar DIA: `"60"`.
3. Ingresar PULSE: `"70"`.
4. Tap en `"Confirmar"`.

**Resultado esperado:**
- Avanza correctamente (límite superior inclusivo).

---

### TC-MEDI-018 — OCRResults: validación DIA fuera de rango

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en OCRResults.

**Pasos:**
1. Ingresar DIA: `"19"` (menor a 20) o `"201"` (mayor a 200).
2. Intentar confirmar.

**Resultado esperado:**
- Validación activa: DIA debe estar entre 20 y 200 mmHg.

---

### TC-MEDI-019 — OCRResults: validación PULSE fuera de rango

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en OCRResults.

**Pasos:**
1. Ingresar PULSE: `"29"` (menor a 30) o `"201"` (mayor a 200).
2. Intentar confirmar.

**Resultado esperado:**
- Validación activa: PULSE debe estar entre 30 y 200 bpm.

---

### TC-MEDI-020 — OCRResults: todos los valores en límites válidos

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en OCRResults.

**Pasos:**
1. Ingresar SYS: `"120"`, DIA: `"80"`, PULSE: `"70"`.
2. Tap en `"Confirmar"`.

**Resultado esperado:**
- Avanza sin errores de validación.
- Se guarda la medición.

---

## SuccessPressureMeasurement

### TC-MEDI-021 — SuccessPressureMeasurement muestra opciones después de medir presión

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario completó una medición de presión (no en onboarding).

**Pasos:**
1. Observar la pantalla de éxito.

**Resultado esperado:**
- Título: `"Medición registrada"`.
- Opciones disponibles:
  1. AddSymptoms (si aplica)
  2. Nueva medición
  3. Ver detalles
  4. Ir a inicio
- Se puede hacer tap en cualquiera de estas opciones.

---

### TC-MEDI-022 — Tap en "Agregar síntomas" desde SuccessPressureMeasurement

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SuccessPressureMeasurement.

**Pasos:**
1. Tap en opción `"Agregar síntomas"`.

**Resultado esperado:**
- Navega a AddChangeSymptoms.
- Se vincula la medición de presión al registro de síntomas.

---

### TC-MEDI-023 — Tap en "Nueva medición" desde SuccessPressureMeasurement

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SuccessPressureMeasurement.

**Pasos:**
1. Tap en opción `"Nueva medición"`.

**Resultado esperado:**
- Reinicia el flujo de medición (retorna a MeditionOptions o al punto de entrada).

---

### TC-MEDI-024 — Tap en "Ver detalles" desde SuccessPressureMeasurement

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SuccessPressureMeasurement.

**Pasos:**
1. Tap en opción `"Ver detalles"`.

**Resultado esperado:**
- Navega a PressureDetails.
- Se muestra la medición recién registrada.

---

### TC-MEDI-025 — Tap en "Ir a inicio" desde SuccessPressureMeasurement

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SuccessPressureMeasurement.

**Pasos:**
1. Tap en opción `"Ir a inicio"`.

**Resultado esperado:**
- Navega a Home.

---

## NewScaleMedition — Flujo de Peso

### TC-MEDI-026 — NewScaleMedition.Introduction sin balanza vinculada

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en NewScaleMedition.Introduction. Sin balanza Bluetooth vinculada.

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Header: `"Vincula tu balanza"`.
- 2 botones:
  1. `"Entrada manual"` → navega a pantalla de entrada de peso
  2. `"Usar Bluetooth"` → modal ConnectBluetoothDevice

---

### TC-MEDI-027 — NewScaleMedition.Introduction con balanza vinculada

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en NewScaleMedition.Introduction. Tiene una balanza Bluetooth vinculada.

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Header: `"Nueva medición"`.
- Resto de opciones idéntico.

---

### TC-MEDI-028 — Agregar peso manualmente

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en flujo de entrada manual de peso.

**Pasos:**
1. Ingresar valor de peso: `"72.5"`.
2. Tap en `"Confirmar"`.

**Resultado esperado:**
- La medición se guarda correctamente.
- Se muestra confirmación.
- El valor aparece actualizado en WeightDetails.

---

### TC-MEDI-029 — Validación peso fuera de rango mínimo

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en flujo de entrada de peso.

**Pasos:**
1. Ingresar peso: `"19.9"` (menor a 20 kg).
2. Intentar confirmar.

**Resultado esperado:**
- Validación activa: peso debe estar entre 20 y 250 kg.

---

### TC-MEDI-030 — Validación peso límite inferior válido

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en flujo de entrada de peso.

**Pasos:**
1. Ingresar peso: `"20"`.
2. Tap en `"Confirmar"`.

**Resultado esperado:**
- Avanza correctamente (límite inferior inclusivo).

---

### TC-MEDI-031 — Validación peso fuera de rango máximo

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en flujo de entrada de peso.

**Pasos:**
1. Ingresar peso: `"250.1"` (mayor a 250 kg).
2. Intentar confirmar.

**Resultado esperado:**
- Validación activa: peso debe estar entre 20 y 250 kg.

---

### TC-MEDI-032 — Validación peso límite superior válido

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en flujo de entrada de peso.

**Pasos:**
1. Ingresar peso: `"250"`.
2. Tap en `"Confirmar"`.

**Resultado esperado:**
- Avanza correctamente (límite superior inclusivo).

---

### TC-MEDI-033 — Peso con 0 o negativo es rechazado

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en flujo de entrada de peso.

**Pasos:**
1. Intentar ingresar `"0"` o un valor negativo como peso.
2. Intentar confirmar.

**Resultado esperado:**
- Validación activa: peso debe ser positivo y estar en el rango válido.
- Botón deshabilitado o mensaje de error visible.

---

### TC-MEDI-034 — Balanza Bluetooth: conectar dispositivo

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario selecciona "Usar Bluetooth" en NewScaleMedition. Balanza Bluetooth disponible y previnculada.

**Pasos:**
1. Esperar a que se conecte automáticamente.
2. Subirse a la balanza.

**Resultado esperado:**
- El dispositivo se conecta correctamente.
- El valor de peso se recibe automáticamente desde la balanza.
- Se muestra para confirmación antes de guardar.

---

## NewGlucometerMedition — Flujo de Glucosa

### TC-MEDI-035 — NewGlucometerMedition.Introduction sin glucómetro vinculado

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en NewGlucometerMedition.Introduction. Sin glucómetro Bluetooth vinculado.

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Header: `"Vincula tu glucómetro"` o `"Nueva medición"`.
- Opciones disponibles:
  1. `"Entrada manual"` → AddGlucoseMeasure
  2. `"Usar Bluetooth"` → modal ConnectBluetoothDevice

---

### TC-MEDI-036 — AddGlucoseMeasure: entrada manual de glucosa

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en pantalla AddGlucoseMeasure.

**Pasos:**
1. Ingresar valor de glucosa: `"95"`.
2. Seleccionar contexto de medición: `"Ayunas"`.
3. Agregar síntomas (opcional): tap para agregar.
4. Tap en `"Confirmar"`.

**Resultado esperado:**
- La medición se guarda correctamente.
- Los valores aparecen en GlucoseDetails.

---

### TC-MEDI-037 — AddGlucoseMeasure: contexto de medición postprandial

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en pantalla AddGlucoseMeasure.

**Pasos:**
1. Ingresar valor de glucosa: `"150"`.
2. Seleccionar contexto: `"Postprandial"` (2 horas después de comer).
3. Tap en `"Confirmar"`.

**Resultado esperado:**
- Avanza correctamente.
- Se guarda el contexto junto con la medición.

---

### TC-MEDI-038 — AddGlucoseMeasure: agregar síntomas

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en pantalla AddGlucoseMeasure con valor de glucosa ingresado.

**Pasos:**
1. Tap en opción para agregar síntomas.
2. Seleccionar síntomas disponibles.
3. Confirmar.

**Resultado esperado:**
- Los síntomas se vinculan a la medición.
- Se muestran en el historial de glucosa.

---

### TC-MEDI-039 — Glucómetro Bluetooth: conectar y recibir medición

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario selecciona "Usar Bluetooth" en NewGlucometerMedition. Glucómetro Bluetooth disponible.

**Pasos:**
1. Esperar a que se conecte el dispositivo.
2. Realizar la medición en el glucómetro físico.

**Resultado esperado:**
- El glucómetro se conecta automáticamente.
- El valor de glucosa se recibe desde el dispositivo.
- Se muestra para confirmación antes de guardar.

---

## OnboardingMeasureSuccess

### TC-MEDI-040 — OnboardingMeasureSuccess después de medición en onboarding

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario completó una medición durante el onboarding.

**Pasos:**
1. Observar la pantalla de éxito.

**Resultado esperado:**
- Fondo: LinearGradient `#C7D6E9` → `#FFFFFF`.
- Icono: `success-green-icon.png` visible.
- Título: `"¡Felicitaciones!"`.
- Subtítulo: `"Ya hiciste tu primera medición"`.
- Botón: `"Continuar"`.

---

### TC-MEDI-041 — Tap en "Continuar" desde OnboardingMeasureSuccess

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en OnboardingMeasureSuccess.

**Pasos:**
1. Tap en botón `"Continuar"`.

**Resultado esperado:**
- Navega a SaveOnboardingProgress.
- El flujo de onboarding continúa hacia la finalización.

---

## SelectMeasureType (Onboarding con múltiples targets)

### TC-MEDI-042 — SelectMeasureType en onboarding con 3 targets

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en FirstMeasure durante onboarding. Tiene múltiples targets configurados.

**Pasos:**
1. Tap en opción `"Registrar ahora"`.

**Resultado esperado:**
- Navega a SelectMeasureType.
- Muestra las 3 cards de dispositivos:
  1. Tensiómetro
  2. Balanza
  3. Glucómetro

---

### TC-MEDI-043 — Seleccionar medición de presión en onboarding

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SelectMeasureType (onboarding).

**Pasos:**
1. Tap en card "Tensiómetro".

**Resultado esperado:**
- Navega a NewPresureOCRMedition con flag `isOnboarding: true`.

---

### TC-MEDI-044 — Seleccionar medición de peso en onboarding

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SelectMeasureType (onboarding).

**Pasos:**
1. Tap en card "Balanza".

**Resultado esperado:**
- Navega a NewScaleMedition con flag `isOnboarding: true`.

---

### TC-MEDI-045 — Seleccionar medición de glucosa en onboarding

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SelectMeasureType (onboarding).

**Pasos:**
1. Tap en card "Glucómetro".

**Resultado esperado:**
- Navega a NewGlucometerMedition con flag `isOnboarding: true`.

---

## Flujos con Bluetooth

### TC-MEDI-046 — ConnectBluetoothDevice modal aparece cuando no hay dispositivo vinculado

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario selecciona "Usar Bluetooth" sin dispositivo vinculado previamente.

**Pasos:**
1. Tap en opción "Usar Bluetooth".

**Resultado esperado:**
- Se abre modal `ConnectBluetoothDevice`.
- Instruye al usuario a vincular el dispositivo.
- Opción para escanear o seleccionar dispositivo existente.

---

### TC-MEDI-047 — SearchLinkedBluetoothDevice cuando dispositivo ya vinculado

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario tiene dispositivo Bluetooth vinculado. Selecciona "Usar Bluetooth".

**Pasos:**
1. Tap en opción "Usar Bluetooth".

**Resultado esperado:**
- Navega directamente a SearchLinkedBluetoothDevice.
- No abre modal de emparejamiento.
- Busca y conecta el dispositivo previnculado.

---

## Validaciones comunes

### TC-MEDI-048 — Campo vacío bloquea confirmación

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en cualquier pantalla de entrada de valor (presión, peso, glucosa).

**Pasos:**
1. No ingresar ningún valor.
2. Tap en `"Confirmar"`.

**Resultado esperado:**
- Botón deshabilitado o validación visible.
- No avanza sin valor.

---

### TC-MEDI-049 — Valores no numéricos son rechazados

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en pantalla de entrada de valor.

**Pasos:**
1. Ingresar caracteres no numéricos (letras, símbolos especiales).

**Resultado esperado:**
- El campo rechaza la entrada o solo acepta números y punto/coma.
- Validación de formato activa.

---

### TC-MEDI-050 — Flujo completo: nuevo medición presión → síntomas → Home

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Home con 1 target de presión.

**Pasos:**
1. Tap en botón "Nueva medición" → NewPresureOCRMedition.
2. Seleccionar "Entrada manual".
3. Ingresar SYS=130, DIA=85, PULSE=75.
4. Tap en "Agregar síntomas".
5. Seleccionar síntomas (ej: Mareo, Dolor de cabeza).
6. Confirmar medición.
7. Tap en "Ir a inicio".

**Resultado esperado:**
- La medición se registra correctamente con síntomas.
- Se retorna a Home sin errores.
- Los datos se guardan en la base de datos del usuario.

---
