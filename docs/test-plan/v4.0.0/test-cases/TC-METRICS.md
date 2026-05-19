---
modulo: metrics
version_produccion: 4.0.0
last_modified: 2026-05-14
pantallas_cubiertas:
  - WeightDetails
  - WeightMeasurementHistory
  - PressureDetails (BloodPressure)
  - PressureMeasurementHistory
  - GlucoseDetails
  - GlucoseMeasurementHistory
  - HeartRateDetails
  - HeartRateMeasurementHistory
  - StepsDetails
  - StepsMeasurementHistory
  - MetabolismDetails
---

# Test Cases — Módulo Metrics

> Las pantallas de detalle de métricas siguen un patrón común: visualización del valor más reciente, filtros por período (día/semana/mes), gráfico histórico, acceso al historial completo y funcionalidades de edición/eliminación. Todos los casos incluyen validaciones, edge cases y flujos de error.

---

## WeightDetails — Composición Corporal

### TC-MET-001 — WeightDetails carga con datos del usuario

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con al menos una medición de peso registrada.

**Pasos:**
1. Navegar a WeightDetails desde Home → tap en card Peso.

**Resultado esperado:**
- Pantalla carga sin error.
- Header: `"Composición corporal"`.
- Visible valor de peso más reciente con unidad (kg).
- Gráfico con historial de mediciones visible.
- Selector de período con tabs: `"día"`, `"semana"`, `"mes"`.
- Cards de stats visibles: Peso, BMI, BFP, Masa Magra, Músculo Esquelético, VFR, Hueso, SMI.

---

### TC-MET-002 — WeightDetails: filtrar por período día

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en WeightDetails. Hay mediciones en el período actual.

**Pasos:**
1. Tap en selector de período.
2. Seleccionar `"Día"`.

**Resultado esperado:**
- Gráfico se actualiza mostrando solo mediciones del día actual.
- Stats (promedio, mín, máx) reflejan el período de 24 horas.

---

### TC-MET-003 — WeightDetails: filtrar por período semana

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en WeightDetails con historial de más de 1 semana.

**Pasos:**
1. Tap en selector de período.
2. Seleccionar `"Semana"`.

**Resultado esperado:**
- Gráfico se actualiza mostrando los últimos 7 días.
- Stats reflejan datos de la semana.

---

### TC-MET-004 — WeightDetails: filtrar por período mes

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en WeightDetails con historial de más de 1 mes.

**Pasos:**
1. Tap en selector de período.
2. Seleccionar `"Mes"`.

**Resultado esperado:**
- Gráfico se actualiza mostrando los últimos 30 días.
- Stats reflejan datos del mes.

---

### TC-MET-005 — WeightDetails: tabs internos General vs Segmentada

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en WeightDetails.

**Pasos:**
1. Observar los tabs disponibles: `"General"` y `"Segmentada"`.
2. Tap en `"General"`: muestra composición global.
3. Tap en `"Segmentada"`: muestra desglose por zonas del cuerpo.

**Resultado esperado:**
- Tab General muestra: Peso, BMI, BFP, Masa Magra.
- Tab Segmentada muestra: Músculo Esquelético, VFR, Hueso, SMI.
- Cambio de tab sin recargar datos.

---

### TC-MET-006 — WeightDetails: botón Info en header

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en WeightDetails.

**Pasos:**
1. Tap en botón Info del header.

**Resultado esperado:**
- Se abre modal o sheet con información sobre las métricas mostradas.
- Explicación de qué es BMI, BFP, etc.

---

### TC-MET-007 — WeightDetails: botón Share en header

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en WeightDetails con datos.

**Pasos:**
1. Tap en botón Share del header.

**Resultado esperado:**
- Se abre sheet de compartir (nativa del sistema).
- Opciones: enviar por email, mensaje, etc.

---

### TC-MET-008 — WeightDetails: pull-to-refresh actualiza datos

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en WeightDetails.

**Pasos:**
1. Realizar gesto de pull-to-refresh (tirar hacia abajo).
2. Esperar a que se complete la recarga.

**Resultado esperado:**
- Indicador de carga visible durante el refresh.
- Datos se actualizan desde el servidor.
- Gráfico y stats reflejan los datos más recientes.

---

### TC-MET-009 — WeightDetails: botón "Ver historial"

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en WeightDetails con mediciones.

**Pasos:**
1. Tap en botón `"Ver historial"`.

**Resultado esperado:**
- Navega a WeightMeasurementHistory.

---

### TC-MET-010 — WeightDetails sin mediciones muestra estado vacío

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario sin ninguna medición de peso registrada.

**Pasos:**
1. Navegar a WeightDetails.

**Resultado esperado:**
- Se muestra un estado vacío o mensaje indicando que no hay datos.
- Icono descriptivo visible.
- Texto: `"No hay mediciones registradas"` o similar.
- No hay crash.

---

---

## WeightMeasurementHistory

### TC-MET-011 — WeightMeasurementHistory carga lista de mediciones

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con múltiples mediciones de peso registradas.

**Pasos:**
1. Navegar a WeightMeasurementHistory desde WeightDetails.

**Resultado esperado:**
- Header: `"Historial de peso"`.
- Lista paginada con FlashList (optimizada para performance).
- Cada item muestra: fecha/hora + valor + icono de tendencia (sube/baja/estable).
- Orden cronológico (más recientes al inicio).

---

### TC-MET-012 — WeightMeasurementHistory: formato de item

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en WeightMeasurementHistory.

**Pasos:**
1. Observar un item de la lista.

**Resultado esperado:**
- Formato: `"15/05/2026 14:30 - 75.5 kg ↓"`.
- Tendencia mostrada con icono (↑ aumento, ↓ descenso, → estable).
- Tap en item es interactivo (selecciona para edición o muestra detalles).

---

### TC-MET-013 — WeightMeasurementHistory: pull-to-refresh

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en WeightMeasurementHistory.

**Pasos:**
1. Realizar gesto de pull-to-refresh.

**Resultado esperado:**
- Indicador de carga visible.
- Lista se actualiza con mediciones más recientes.

---

### TC-MET-014 — WeightMeasurementHistory: infinite scroll (paginación)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en WeightMeasurementHistory con más de 20 mediciones.

**Pasos:**
1. Hacer scroll hacia abajo hasta el final de la lista.

**Resultado esperado:**
- Al llegar al final, se ejecuta `loadMoreMeasurements()`.
- Se cargan más items sin recargar toda la lista.
- No hay experiencia de salto.

---

### TC-MET-015 — WeightMeasurementHistory: edit mode (multi-select)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en WeightMeasurementHistory.

**Pasos:**
1. Long-press en un item o buscar botón de edición.
2. Activa el modo edición (multi-select).
3. Seleccionar varios items usando checkboxes.
4. Tap en botón `"Eliminar"`.

**Resultado esperado:**
- Los items seleccionados se marcan con checkboxes.
- Botón `"Eliminar"` se habilita cuando hay selección.
- Tap en eliminar borra las mediciones seleccionadas.
- Lista se actualiza sin refrescar completamente.

---

### TC-MET-016 — WeightMeasurementHistory: eliminar single item

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en WeightMeasurementHistory en modo edición.

**Pasos:**
1. Seleccionar un solo item.
2. Tap en `"Eliminar"`.
3. Confirmar eliminación en modal de confirmación.

**Resultado esperado:**
- El item se elimina de la lista.
- Se ejecuta API de eliminación.
- Lista se actualiza sin dejar huecos.

---

### TC-MET-017 — WeightMeasurementHistory: eliminar múltiples items

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en modo edición con 3+ items seleccionados.

**Pasos:**
1. Seleccionar múltiples items.
2. Tap en `"Eliminar"`.

**Resultado esperado:**
- Modal pide confirmación: `"¿Eliminar N mediciones?"`.
- Al confirmar, todos los items se eliminan.

---

### TC-MET-018 — WeightMeasurementHistory: deseleccionar item en modo edición

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en modo edición con un item seleccionado.

**Pasos:**
1. Tap en el checkbox del item seleccionado.

**Resultado esperado:**
- El item se deselecciona.
- Botón `"Eliminar"` se deshabilita si no hay más selecciones.

---

### TC-MET-019 — WeightMeasurementHistory: estado vacío

**Tipo:** Edge case | **Prioridad:** Baja

**Precondiciones:** Usuario sin mediciones de peso.

**Pasos:**
1. Intentar navegar a WeightMeasurementHistory.

**Resultado esperado:**
- Muestra estado vacío.
- Mensaje indicando que no hay historial.

---

---

## PressureDetails — Presión Arterial

### TC-MET-020 — PressureDetails carga con mediciones de presión

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con al menos una medición de presión registrada.

**Pasos:**
1. Navegar a PressureDetails desde Home o desde medición.

**Resultado esperado:**
- Header: `"Presión Arterial"`.
- Selector de período con tabs: `"día"`, `"semana"`, `"mes"`.
- Cards visibles:
  1. **SYS (sistólica):** valor en mmHg
  2. **DIA (diastólica):** valor en mmHg
  3. **PULSE (pulso):** valor en bpm
  4. **Síntomas:** lista de síntomas registrados con esa medición
- Gráfico de tendencia visible.

---

### TC-MET-021 — PressureDetails: valores mostrados en mmHg

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en PressureDetails con una medición registrada (SYS=130, DIA=85).

**Pasos:**
1. Observar las cards de SYS y DIA.

**Resultado esperado:**
- SYS: `"130 mmHg"`.
- DIA: `"85 mmHg"`.
- Unidad mmHg siempre visible.

---

### TC-MET-022 — PressureDetails: filtrar por período

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en PressureDetails con historial de múltiples períodos.

**Pasos:**
1. Cambiar el período activo (día → semana → mes).

**Resultado esperado:**
- Gráfico actualizado al período seleccionado.
- Stats (promedio SYS, DIA, PULSE) reflejan el período.
- Cards de tendencia se actualizan.

---

### TC-MET-023 — PressureDetails: botón "Ver historial"

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en PressureDetails.

**Pasos:**
1. Tap en botón `"Ver historial"`.

**Resultado esperado:**
- Navega a PressureMeasurementHistory.

---

### TC-MET-024 — PressureDetails: síntomas asociados

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en PressureDetails. Hay una medición con síntomas registrados.

**Pasos:**
1. Observar la card de Síntomas.

**Resultado esperado:**
- Se muestra la lista de síntomas: `"Mareo, Dolor de cabeza"`.
- Si no hay síntomas: muestra `"Sin síntomas"` o está vacío.

---

---

## PressureMeasurementHistory

### TC-MET-025 — PressureMeasurementHistory muestra lista de mediciones

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con múltiples mediciones de presión.

**Pasos:**
1. Navegar a PressureMeasurementHistory desde PressureDetails.

**Resultado esperado:**
- Header: `"Historial de presión"`.
- Lista con FlashList (paginada).
- Formato item: `"15/05/2026 14:30 - 130/85 - 72 bpm"`.
- Si hay síntomas: `"15/05/2026 14:30 - 130/85 - 72 bpm - Mareo, Dolor"`.

---

### TC-MET-026 — PressureMeasurementHistory: edit mode (eliminar)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en PressureMeasurementHistory.

**Pasos:**
1. Activar modo edición.
2. Seleccionar items.
3. Tap en `"Eliminar"`.

**Resultado esperado:**
- Items seleccionados se eliminan.
- Lista se actualiza.

---

---

## GlucoseDetails

### TC-MET-027 — GlucoseDetails carga con mediciones de glucosa

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con al menos una medición de glucosa registrada.

**Pasos:**
1. Navegar a GlucoseDetails desde Home.

**Resultado esperado:**
- Header: `"Glucosa en sangre"`.
- Valor más reciente visible en mg/dL.
- Selector de período: `"día"`, `"semana"`, `"mes"`.
- Gráfico de tendencia con puntos extremos en amarillo (`#FFAD0D`).

---

### TC-MET-028 — GlucoseDetails: puntos extremos en amarillo

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en GlucoseDetails con historial que incluya valores extremos (muy altos/bajos).

**Pasos:**
1. Observar el gráfico.

**Resultado esperado:**
- Puntos con valores extremos se muestran en color amarillo (`#FFAD0D`).
- Otros puntos en color normal (ej: azul).

---

### TC-MET-029 — GlucoseDetails: filtrar por período

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en GlucoseDetails con historial variado.

**Pasos:**
1. Cambiar período (día → semana → mes).

**Resultado esperado:**
- Gráfico se actualiza mostrando el período seleccionado.
- Escala del gráfico se ajusta automáticamente.

---

### TC-MET-030 — GlucoseDetails: unidad mg/dL

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en GlucoseDetails.

**Pasos:**
1. Observar el valor de glucosa más reciente.

**Resultado esperado:**
- Valor siempre en mg/dL (ej: `"95 mg/dL"`).
- Unidad visible y consistente.

---

---

## GlucoseMeasurementHistory

### TC-MET-031 — GlucoseMeasurementHistory muestra lista de mediciones

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con múltiples mediciones de glucosa.

**Pasos:**
1. Navegar a GlucoseMeasurementHistory desde GlucoseDetails.

**Resultado esperado:**
- Header: `"Historial de glucosa"`.
- Formato item: `"15/05/2026 14:30 - 95 mg/dL - Ayunas"` o `"- Postprandial"`.
- Si hay síntomas: se muestran al final del item.

---

### TC-MET-032 — GlucoseMeasurementHistory: tipos de medición visibles

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en GlucoseMeasurementHistory con mediciones de diferentes contextos.

**Pasos:**
1. Observar varios items.

**Resultado esperado:**
- Algunos items muestran `"Ayunas"`.
- Otros muestran `"Postprandial"` o contexto específico.
- Información de contexto siempre visible.

---

---

## HeartRateDetails (disponible desde v3.4.0)

### TC-MET-033 — HeartRateDetails carga con mediciones de frecuencia cardíaca

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con al menos una medición de frecuencia cardíaca registrada.

**Pasos:**
1. Navegar a HeartRateDetails desde Home.

**Resultado esperado:**
- Header: `"Frecuencia Cardíaca"`.
- Valor más reciente visible en bpm.
- Selector de período: `"día"`, `"semana"`, `"mes"`.
- Gráfico de tendencia visible.

---

### TC-MET-034 — HeartRateDetails: valores en bpm

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en HeartRateDetails.

**Pasos:**
1. Observar el valor más reciente.

**Resultado esperado:**
- Valor en formato: `"72 bpm"`.
- Unidad siempre visible.

---

### TC-MET-035 — HeartRateDetails: filtrar por período

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en HeartRateDetails con historial.

**Pasos:**
1. Cambiar período.

**Resultado esperado:**
- Gráfico se actualiza al período seleccionado.

---

### TC-MET-036 — HeartRateDetails: botón "Ver historial"

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en HeartRateDetails.

**Pasos:**
1. Tap en botón `"Ver historial"`.

**Resultado esperado:**
- Navega a HeartRateMeasurementHistory.

---

---

## HeartRateMeasurementHistory

### TC-MET-037 — HeartRateMeasurementHistory muestra lista de mediciones

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con múltiples mediciones de frecuencia cardíaca.

**Pasos:**
1. Navegar a HeartRateMeasurementHistory.

**Resultado esperado:**
- Header: `"Historial de frecuencia cardíaca"`.
- Formato item: `"15/05/2026 14:30 - 72 bpm"`.
- Lista paginada con FlashList.

---

---

## StepsDetails (disponible desde v3.4.0)

### TC-MET-038 — StepsDetails carga con datos de pasos

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con datos de pasos sincronizados desde HealthKit (iOS) o Google Fit (Android).

**Pasos:**
1. Navegar a StepsDetails desde Home.

**Resultado esperado:**
- Header: `"Pasos"`.
- Gráfico donut circular visible.
- Muestra: pasos actuales vs objetivo diario.
- Porcentaje de meta completada visible.

---

### TC-MET-039 — StepsDetails: progreso hacia meta

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en StepsDetails. Objetivo diario: 10,000 pasos. Pasos actuales: 7,500.

**Pasos:**
1. Observar el gráfico donut.

**Resultado esperado:**
- Gráfico muestra 75% completado (7,500 / 10,000).
- Texto adicional: `"7,500 / 10,000 pasos"` o `"Faltan 2,500 pasos"`.

---

### TC-MET-040 — StepsDetails: meta completada

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en StepsDetails. Pasos actuales >= objetivo.

**Pasos:**
1. Observar el gráfico.

**Resultado esperado:**
- Gráfico muestra 100% (o más si se excede).
- Color destacado (ej: verde) indica meta alcanzada.

---

### TC-MET-041 — StepsDetails: sin datos disponibles

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en StepsDetails. HealthKit/Google Fit no sincronizado.

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Se muestra estado vacío.
- Mensaje: `"No hay datos de pasos sincronizados"` o similar.
- Opción para habilitar sincronización.

---

---

## StepsMeasurementHistory

### TC-MET-042 — StepsMeasurementHistory muestra historial de pasos

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con historial de pasos (7+ días).

**Pasos:**
1. Navegar a StepsMeasurementHistory desde StepsDetails.

**Resultado esperado:**
- Header: `"Historial de pasos"`.
- Formato item: `"15/05/2026 - 8,500 pasos"`.
- Muestra si se alcanzó meta con indicador visual.

---

---

## MetabolismDetails

### TC-MET-043 — MetabolismDetails carga con metabolismo basal calculado

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario con perfil completo (peso, altura, género, fecha de nacimiento).

**Pasos:**
1. Navegar a MetabolismDetails.

**Resultado esperado:**
- Header: `"Metabolismo Basal"`.
- Valor calculado visible en kcal/día (ej: `"1,650 kcal/día"`).
- Fórmula usada: Harris-Benedict o Mifflin-St Jeor.
- No hay errores de cálculo.

---

### TC-MET-044 — MetabolismDetails: descripción de metabolismo basal

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en MetabolismDetails.

**Pasos:**
1. Observar información mostrada.

**Resultado esperado:**
- Se incluye descripción: `"Calorías que tu cuerpo quema en reposo"`.
- Explicación clara y accesible.

---

### TC-MET-045 — MetabolismDetails sin perfil completo

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en MetabolismDetails. Falta peso o altura.

**Pasos:**
1. Observar la pantalla.

**Resultado esperado:**
- Se muestra un mensaje indicando que faltan datos.
- Opción para ir a Perfil y completar datos.
- No hay crash.

---

---

## Grid de Métricas en Home

### TC-MET-046 — Grid de métricas en Home muestra 2 columnas

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Home con múltiples targets configurados.

**Pasos:**
1. Hacer scroll hacia abajo en Home hasta la sección `"Métricas de salud"`.

**Resultado esperado:**
- Las cards de métricas se muestran en grid de 2 columnas.
- Cada card ocupa ~48% del ancho.
- Espaciado consistente entre cards.

---

### TC-MET-047 — Grid de métricas: última fila con card impar

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Home con 5 targets (número impar).

**Pasos:**
1. Observar el grid completo.

**Resultado esperado:**
- Filas 1-2: 2 cards cada una (4 cards totales).
- Fila 3: 1 card ocupando el 100% del ancho.

---

### TC-MET-048 — Tap en card de Peso navega a WeightDetails

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Home, grid visible.

**Pasos:**
1. Tap en la card de Peso.

**Resultado esperado:**
- Navega a WeightDetails sin errores.

---

### TC-MET-049 — Tap en card de Presión navega a PressureDetails

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Home, grid visible.

**Pasos:**
1. Tap en la card de Presión.

**Resultado esperado:**
- Navega a PressureDetails.

---

### TC-MET-050 — Tap en card de Glucosa navega a GlucoseDetails

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Home, grid visible.

**Pasos:**
1. Tap en la card de Glucosa.

**Resultado esperado:**
- Navega a GlucoseDetails.

---

### TC-MET-051 — Tap en card de Frecuencia Cardíaca navega a HeartRateDetails

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Home con target de Frecuencia Cardíaca.

**Pasos:**
1. Tap en la card de Frecuencia Cardíaca.

**Resultado esperado:**
- Navega a HeartRateDetails.

---

### TC-MET-052 — Tap en card de Pasos navega a StepsDetails

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Home con target de Pasos.

**Pasos:**
1. Tap en la card de Pasos.

**Resultado esperado:**
- Navega a StepsDetails.

---

### TC-MET-053 — Home sin targets configurados muestra estado vacío

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario nuevo sin targets configurados.

**Pasos:**
1. Observar la sección de métricas en Home.

**Resultado esperado:**
- Grid no visible o muestra estado vacío.
- Mensaje: `"Configura tus objetivos de salud"` o similar.

---

---

## Validaciones y Comportamientos Comunes

### TC-MET-054 — Pantalla de detalle con período sin datos

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en WeightDetails. Selecciona período "día" pero sin mediciones hoy.

**Pasos:**
1. Cambiar a período "día".

**Resultado esperado:**
- Gráfico vacío o con indicación "sin datos".
- Cards de stats vacías o con "--".
- No hay crash.

---

### TC-MET-055 — Gráfico adapta escala automáticamente

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en pantalla de detalle con gráfico.

**Pasos:**
1. Cambiar período de día → semana → mes.

**Resultado esperado:**
- Eje Y del gráfico se ajusta automáticamente a la escala de datos.
- Visualización clara en todos los períodos.

---

### TC-MET-056 — Historial respeta orden cronológico descendente

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en cualquier pantalla de historial.

**Pasos:**
1. Observar el orden de items.

**Resultado esperado:**
- Mediciones más recientes al inicio.
- Orden cronológico inverso (descendente).

---

### TC-MET-057 — Flujo completo: Home → WeightDetails → Historial → Editar → Home

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Home con mediciones de peso.

**Pasos:**
1. Tap en card de Peso → WeightDetails.
2. Tap en "Ver historial" → WeightMeasurementHistory.
3. Activar edit mode, seleccionar 2 mediciones.
4. Tap en "Eliminar" → confirmar.
5. Retroceder a Home (back navigation).

**Resultado esperado:**
- Flujo completo sin errores.
- Las mediciones eliminadas no aparecen en el historial.
- Home se actualiza correctamente.

---

### TC-MET-058 — Share desde WeightDetails incluye datos actuales

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en WeightDetails con datos recientes.

**Pasos:**
1. Tap en botón Share.
2. Seleccionar app de destino (email, Whatsapp, etc.).

**Resultado esperado:**
- Se abre la app nativa seleccionada.
- Incluye resumen: fecha, peso, BMI, etc.
- Formato legible y profesional.

---

### TC-MET-059 — Período seleccionado persiste al retroceder

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en WeightDetails con período "mes" seleccionado.

**Pasos:**
1. Tap en "Ver historial".
2. Retroceder a WeightDetails.

**Resultado esperado:**
- El período sigue siendo "mes" (no se resetea a "semana").
- Preferencia del usuario guardada en sesión.

---

### TC-MET-060 — Todos los valores numéricos con formato localizado

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en cualquier pantalla de métricas.

**Pasos:**
1. Observar números decimales.

**Resultado esperado:**
- Si locale es ES: `"75,5 kg"` (coma como separador).
- Si locale es EN: `"75.5 kg"` (punto como separador).
- Separadores de miles si aplica: `"1.234"` o `"1,234"` según locale.

---
