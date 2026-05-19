---
modulo: tabs
version_produccion: 4.0.0
last_modified: 2026-05-14
pantallas_cubiertas:
  - Home (tab 0)
  - Devices (tab 1)
  - Reminders/Alarmas (tab 2)
  - Share/Compartir (tab 3)
nota: En v4.0.0 el tab "Medición" fue eliminado. Bottom nav = 4 tabs exactos con labels específicos.
---

# Test Cases — Módulo Tabs

---

## Bottom Navigation

### TC-TAB-001 — Bottom nav carga con 4 tabs exactos

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario autenticado, en Home.

**Pasos:**
1. Observar el bottom navigation.

**Resultado esperado:**
- Visible el bottom nav con 4 tabs en orden: "Inicio", "Dispositivos", "Alarmas", "Compartir".
- Labels exactos coinciden con los definidos en TabNavigator.js.
- Cada tab tiene su icono visible.

---

### TC-TAB-002 — Navegar entre tabs desde Inicio

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Home (tab 0 activo).

**Pasos:**
1. Tap en tab "Dispositivos" (tab 1).
2. Verificar que cargó Devices.
3. Tap en tab "Alarmas" (tab 2).
4. Verificar que cargó Reminders.
5. Tap en tab "Compartir" (tab 3).
6. Verificar que cargó Share.
7. Tap en tab "Inicio" (tab 0).
8. Verificar que regresó a Home.

**Resultado esperado:**
- La navegación entre tabs es inmediata y sin errores.
- Cada tab carga su contenido correcto.
- Los labels son: "Inicio" (accessibilityLabel: "Home"), "Dispositivos", "Alarmas" (accessibilityLabel: "Recordatorios"), "Compartir" (accessibilityLabel: "Compartir métricas").

---

### TC-TAB-003 — Tap rápido múltiple entre tabs no causa crash

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en Home.

**Pasos:**
1. Realizar taps rápidos y consecutivos entre diferentes tabs (ej: Dispositivos → Alarmas → Compartir → Inicio) sin esperar a que cargue completamente cada uno.

**Resultado esperado:**
- No hay crash.
- No hay estado de navegación duplicado.
- Al final, el tab activo es el del último tap realizado.

---

## Devices (Tab 1)

### TC-TAB-004 — Pantalla Devices carga correctamente

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario autenticado.

**Pasos:**
1. Tap en tab "Dispositivos" (tab 1).

**Resultado esperado:**
- Pantalla con título "Dispositivos" visible.
- Si hay dispositivos vinculados: lista visible con nombre + tipo (icono) + estado de conexión.
- Si no hay dispositivos: estado vacío con imagen devices/no-devices.png + botón "Agregar dispositivo".
- Botón de agregar dispositivo visible en header o como flotante.

---

### TC-TAB-005 — Devices lista agrupada por tipo de dispositivo

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con múltiples dispositivos vinculados (ej: 2 tensiómetros, 1 balanza, 1 glucómetro).

**Pasos:**
1. Navegar a Devices.

**Resultado esperado:**
- Dispositivos agrupados por tipo: Tensiómetros, Balanzas, Glucómetros.
- Cada ítem muestra: nombre + tipo (con icono) + estado de conexión (conectado/desconectado).
- Orden exacto de agrupación respetado.

---

### TC-TAB-006 — Pull-to-refresh en Devices

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en Devices con dispositivos.

**Pasos:**
1. Hacer pull-down (deslizar hacia abajo) en la lista de dispositivos.

**Resultado esperado:**
- Indicador de refresh visible (spinner).
- La lista se refresca.
- Estados de conexión se actualizan.

---

### TC-TAB-007 — Swipe right en dispositivo muestra opciones Edit/Delete/Connect

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Devices con al menos un dispositivo.

**Pasos:**
1. Hacer swipe right (deslizar hacia la derecha) en un dispositivo de la lista.

**Resultado esperado:**
- Aparecen 3 opciones: Edit (cambiar nombre), Delete (desvincular), Connect (conectar para medición).
- Las opciones son claramente visibles y tocables.

---

### TC-TAB-008 — Swipe Edit — cambiar nombre del dispositivo

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Devices con dispositivo visible con swipe abierto.

**Pasos:**
1. Tap en opción "Edit".
2. En el modal/pantalla de edición, ingresar un nuevo nombre.
3. Guardar cambios.

**Resultado esperado:**
- El nombre del dispositivo en la lista se actualiza.
- Swipe se cierra.

---

### TC-TAB-009 — Swipe Delete — desvincular dispositivo

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Devices con dispositivo visible con swipe abierto.

**Pasos:**
1. Tap en opción "Delete".
2. Confirmar eliminación (si hay alert de confirmación).

**Resultado esperado:**
- Dispositivo desaparece de la lista.
- Contador total de dispositivos se decrementa.

---

### TC-TAB-010 — Swipe Connect — conectar dispositivo para medición

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Devices con dispositivo vinculado pero desconectado.

**Pasos:**
1. Tap en opción "Connect".

**Resultado esperado:**
- Se abre el flujo de conexión Bluetooth (ConnectBluetoothDevice).
- Mensaje "Buscando dispositivos..." visible.
- Lista de dispositivos Bluetooth cercanos visible.

---

### TC-TAB-011 — SelectDeviceType — agregar nuevo dispositivo paso 1

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Devices, sin dispositivo vinculado.

**Pasos:**
1. Tap en botón "Agregar dispositivo".

**Resultado esperado:**
- Navega a pantalla SelectDeviceType.
- Visibles 3 opciones: "Tensiómetro", "Balanza", "Glucómetro".

---

### TC-TAB-012 — Seleccionar Tensiómetro en SelectDeviceType

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SelectDeviceType.

**Pasos:**
1. Tap en "Tensiómetro".

**Resultado esperado:**
- Navega a flujo de Bluetooth para Tensiómetro.
- Busca dispositivos Bluetooth cercanos de tipo Tensiómetro.

---

### TC-TAB-013 — Seleccionar Balanza en SelectDeviceType

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SelectDeviceType.

**Pasos:**
1. Tap en "Balanza".

**Resultado esperado:**
- Navega a flujo de Bluetooth para Balanza.
- Busca dispositivos Bluetooth cercanos de tipo Balanza.

---

### TC-TAB-014 — Seleccionar Glucómetro en SelectDeviceType

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en SelectDeviceType.

**Pasos:**
1. Tap en "Glucómetro".

**Resultado esperado:**
- Navega a flujo de Bluetooth para Glucómetro.
- Busca dispositivos Bluetooth cercanos de tipo Glucómetro.

---

### TC-TAB-015 — ConnectBluetoothDevice — búsqueda de dispositivos

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en ConnectBluetoothDevice, Bluetooth activado en dispositivo.

**Pasos:**
1. Esperar a que complete la búsqueda.

**Resultado esperado:**
- Mensaje "Buscando dispositivos..." visible durante búsqueda.
- Lista de dispositivos Bluetooth cercanos aparece.
- Cada dispositivo muestra nombre y señal RSSI.

---

### TC-TAB-016 — Conectar dispositivo Bluetooth desde lista

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en ConnectBluetoothDevice con dispositivos detectados.

**Pasos:**
1. Tap en un dispositivo de la lista.
2. Tap en botón "Conectar".

**Resultado esperado:**
- Spinner/loading visible.
- Mensaje "Dispositivo conectado" aparece tras conexión exitosa.
- Regresa a Devices con el nuevo dispositivo en la lista.

---

### TC-TAB-017 — SearchLinkedBluetoothDevice — lista de vinculados previos

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario tiene al menos un dispositivo Bluetooth vinculado previamente.

**Pasos:**
1. Abrir ConnectBluetoothDevice.
2. Verificar si hay sección/pestaña de "Dispositivos vinculados previamente".

**Resultado esperado:**
- Si el componente SearchLinkedBluetoothDevice está presente: muestra lista de dispositivos ya vinculados.
- Permiten reconectar sin buscar nuevamente.

---

### TC-TAB-018 — Bluetooth desactivado — error message

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Bluetooth desactivado en el dispositivo Android.

**Pasos:**
1. Navegar a Devices.
2. Tap en "Agregar dispositivo" → SelectDeviceType → seleccionar un tipo.
3. Intentar conectar.

**Resultado esperado:**
- Prompt/alert para activar Bluetooth visible.
- Opción para ir a Configuración del dispositivo.
- Sin crash.

---

### TC-TAB-019 — Ningún dispositivo en rango — estado vacío

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario en ConnectBluetoothDevice con Bluetooth activado pero sin dispositivos en rango.

**Pasos:**
1. Esperar a que complete búsqueda (10+ segundos).

**Resultado esperado:**
- Mensaje "No se encontraron dispositivos" o similar visible.
- Botón para reintentar búsqueda.
- Opción para volver atrás.

---

### TC-TAB-020 — Devices estado vacío sin ningún dispositivo

**Tipo:** Edge case | **Prioridad:** Baja

**Precondiciones:** Usuario nuevo sin dispositivos vinculados.

**Pasos:**
1. Navegar a Devices.

**Resultado esperado:**
- Imagen devices/no-devices.png visible.
- Botón "Agregar dispositivo" prominente.
- Mensaje claro: "No tienes dispositivos vinculados".

---

## Reminders/Alarmas (Tab 2)

### TC-TAB-021 — Pantalla Alarmas carga correctamente

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario autenticado.

**Pasos:**
1. Tap en tab "Alarmas" (tab 2).

**Resultado esperado:**
- Pantalla con título "Recordatorios" visible.
- Si hay recordatorios: lista visible con nombre + hora (HH:mm) + días (Lu Ma Mi Ju Vi Sa Do) + toggle ON/OFF.
- Si no hay: estado vacío con "No tienes recordatorios" + botón "Agregar recordatorio".

---

### TC-TAB-022 — Reminders lista muestra recordatorios con formato exacto

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario con al menos 2 recordatorios creados (ej: Presión a las 09:00 Lu-Mi-Vi, Peso a las 20:30 todos los días).

**Pasos:**
1. Navegar a Reminders.

**Resultado esperado:**
- Cada ítem muestra:
  - Nombre del producto (ej: "Tensiómetro", "Balanza", "Glucómetro", "Medicación", "Otro")
  - Hora exacta en formato HH:mm (ej: "09:00")
  - Días repetición con abreviaciones: Lu Ma Mi Ju Vi Sa Do
  - Toggle ON/OFF (verde si activo, gris si inactivo)

---

### TC-TAB-023 — Toggle recordatorio ON → OFF

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Reminders con recordatorio activo (toggle verde).

**Pasos:**
1. Tap en el toggle del recordatorio para desactivarlo.

**Resultado esperado:**
- Toggle cambia a gris (OFF).
- Recordatorio se desactiva sin eliminarse.
- Persiste en la lista pero sin notificaciones.

---

### TC-TAB-024 — Toggle recordatorio OFF → ON

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Reminders con recordatorio inactivo (toggle gris).

**Pasos:**
1. Tap en el toggle del recordatorio para activarlo.

**Resultado esperado:**
- Toggle cambia a verde (ON).
- Recordatorio se activa.
- Notificaciones push se reanudan.

---

### TC-TAB-025 — Botón Edit en header — modo múltiple selección

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Reminders con al menos 2 recordatorios.

**Pasos:**
1. Tap en botón "Edit" (o ícono de edición) en el header.

**Resultado esperado:**
- Modo de edición activado.
- Checkboxes aparecen al lado de cada recordatorio.
- Botón "Delete" aparece activo en el header.
- Botón "Edit" cambia a "Cancel" para salir del modo.

---

### TC-TAB-026 — Multi-select y eliminar recordatorios en masa

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Reminders en modo Edit, con múltiples recordatorios.

**Pasos:**
1. Seleccionar 2 recordatorios (tap en checkbox).
2. Tap en botón "Delete".
3. Confirmar eliminación si hay alert.

**Resultado esperado:**
- Los recordatorios seleccionados se eliminan.
- La lista se actualiza.
- Modo Edit se cierra automáticamente.

---

### TC-TAB-027 — Crear recordatorio nuevo — agregar recordatorio

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Reminders.

**Pasos:**
1. Tap en botón "Agregar recordatorio" (header o estado vacío).

**Resultado esperado:**
- Navega a pantalla AddReminder.
- Formulario vacío visible con campos:
  - SelectProduct (dropdown)
  - Time picker
  - DayRepetition (checkboxes)
  - Botón "Guardar"

---

### TC-TAB-028 — AddReminder — SelectProduct Tensiómetro

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en AddReminder.

**Pasos:**
1. Tap en dropdown SelectProduct.
2. Seleccionar "Tensiómetro".

**Resultado esperado:**
- Dropdown cierra.
- "Tensiómetro" aparece en el campo SelectProduct.
- Valor mapeado internamente: BLOOD_PREASURE_MONITOR.

---

### TC-TAB-029 — AddReminder — SelectProduct Balanza

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en AddReminder.

**Pasos:**
1. Tap en dropdown SelectProduct.
2. Seleccionar "Balanza".

**Resultado esperado:**
- Dropdown cierra.
- "Balanza" aparece en el campo.
- Valor mapeado internamente: SCALE.

---

### TC-TAB-030 — AddReminder — SelectProduct Glucómetro

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en AddReminder.

**Pasos:**
1. Tap en dropdown SelectProduct.
2. Seleccionar "Glucómetro".

**Resultado esperado:**
- Dropdown cierra.
- "Glucómetro" aparece en el campo.
- Valor mapeado internamente: BLOOD_GLUCOSE_MONITOR.

---

### TC-TAB-031 — AddReminder — SelectProduct Medicación

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en AddReminder.

**Pasos:**
1. Tap en dropdown SelectProduct.
2. Seleccionar "Medicación".

**Resultado esperado:**
- Dropdown cierra.
- "Medicación" aparece en el campo.
- Valor mapeado internamente: MEDICATION.

---

### TC-TAB-032 — AddReminder — SelectProduct Otro (custom)

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en AddReminder.

**Pasos:**
1. Tap en dropdown SelectProduct.
2. Seleccionar "Otro".

**Resultado esperado:**
- Dropdown cierra.
- "Otro" aparece en el campo.
- Campo de texto adicional se habilita para ingresar nombre custom.
- Valor mapeado internamente: OTHER.

---

### TC-TAB-033 — AddReminder — Time picker — ingresar hora exacta

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en AddReminder.

**Pasos:**
1. Tap en campo Time picker.
2. Seleccionar hora 14:30 (2:30 PM).
3. Confirmar selección.

**Resultado esperado:**
- Campo Time picker muestra "14:30".
- Formato es HH:mm.

---

### TC-TAB-034 — AddReminder — DayRepetition — seleccionar múltiples días

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en AddReminder.

**Pasos:**
1. Tap en checkboxes de DayRepetition.
2. Seleccionar: lunes, miércoles, viernes (Lu, Mi, Vi).

**Resultado esperado:**
- Checkboxes para Lu, Mi, Vi están seleccionados (ej: con checkmark).
- Resto de días sin seleccionar.

---

### TC-TAB-035 — AddReminder — DayRepetition — todos los días

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en AddReminder.

**Pasos:**
1. Seleccionar todos los checkboxes de días (Lu, Ma, Mi, Ju, Vi, Sa, Do).

**Resultado esperado:**
- Todos los 7 días están seleccionados.
- Los 7 checkmarks visibles.

---

### TC-TAB-036 — AddReminder — guardar recordatorio nuevo

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en AddReminder con todos los campos completados (ej: Tensiómetro, 09:00, Lu-Mi-Vi).

**Pasos:**
1. Tap en botón "Guardar".

**Resultado esperado:**
- Regresa a pantalla Reminders.
- Nuevo recordatorio visible en la lista con los datos ingresados.
- Llamada a API addNewReminder() completada.
- Toggle del nuevo recordatorio inicia en ON (verde).

---

### TC-TAB-037 — AddReminder — validación: producto requerido

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en AddReminder sin seleccionar producto.

**Pasos:**
1. Dejar SelectProduct vacío o sin seleccionar.
2. Completar hora y días.
3. Tap en "Guardar".

**Resultado esperado:**
- Error/validación visible indicando que producto es requerido.
- Botón "Guardar" deshabilitado o bloqueado.

---

### TC-TAB-038 — AddReminder — validación: hora requerida

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en AddReminder.

**Pasos:**
1. Seleccionar producto y días.
2. Dejar Time picker vacío.
3. Tap en "Guardar".

**Resultado esperado:**
- Error indicando que hora es requerida.
- Botón "Guardar" deshabilitado.

---

### TC-TAB-039 — AddReminder — validación: al menos 1 día

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en AddReminder.

**Pasos:**
1. Seleccionar producto y hora.
2. No seleccionar ningún día (DayRepetition vacío).
3. Tap en "Guardar".

**Resultado esperado:**
- Error indicando que debe seleccionar al menos 1 día.
- Botón "Guardar" deshabilitado.

---

### TC-TAB-040 — Editar recordatorio existente — edit mode

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Reminders con al menos un recordatorio. No está en modo Edit.

**Pasos:**
1. Tap directamente en un recordatorio (no en el toggle).

**Resultado esperado:**
- Navega a pantalla AddReminder en modo edición.
- Campos están precompletados con los datos del recordatorio actual (reminderToEdit).

---

### TC-TAB-041 — Editar recordatorio — cambiar hora

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en AddReminder en modo edición.

**Pasos:**
1. Modificar la hora (ej: de 09:00 a 15:00).
2. Tap en "Guardar".

**Resultado esperado:**
- Regresa a Reminders.
- Recordatorio actualizado con la nueva hora.
- Llamada a API editReminder() completada.

---

### TC-TAB-042 — Editar recordatorio — cambiar días

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en AddReminder en modo edición con recordatorio que tiene Lu-Mi-Vi.

**Pasos:**
1. Quitar Vi (viernes).
2. Agregar Sa (sábado).
3. Tap en "Guardar".

**Resultado esperado:**
- Regresa a Reminders.
- Recordatorio ahora muestra: Lu Ma Sa.

---

### TC-TAB-043 — Reminders estado vacío

**Tipo:** Edge case | **Prioridad:** Baja

**Precondiciones:** Usuario sin recordatorios creados.

**Pasos:**
1. Navegar a Reminders.

**Resultado esperado:**
- Mensaje "No tienes recordatorios" visible.
- Botón "Agregar recordatorio" prominente.
- Imagen o ícono de estado vacío visible.

---

### TC-TAB-044 — Reminders PermissionAlert sin push notifications

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario con recordatorios pero permisos push denegados en el sistema.

**Pasos:**
1. Navegar a Reminders.

**Resultado esperado:**
- Alert visible: "Las notificaciones están desactivadas. Actívalas en Configuración para recibir recordatorios."
- Opción para ir a Configuración del sistema.
- Lista de recordatorios sigue visible detrás del alert.

---

## Share/Compartir (Tab 3)

### TC-TAB-045 — Pantalla Share carga correctamente

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario autenticado.

**Pasos:**
1. Tap en tab "Compartir" (tab 3).

**Resultado esperado:**
- Pantalla con título "Compartir mediciones" visible.
- Secciones visibles: Destinatario, Período, Métricas.
- Botón "Compartir" visible en la parte inferior.

---

### TC-TAB-046 — Share — Sección Destinatario — radio options

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Share.

**Pasos:**
1. Observar la sección Destinatario.

**Resultado esperado:**
- 2 opciones radio: "Doctor" y "Familia".
- Solo una puede estar seleccionada a la vez.
- Valor por defecto: "Doctor" (o sin selección, confirmar según comportamiento actual).

---

### TC-TAB-047 — Share — Seleccionar Destinatario "Doctor"

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Share.

**Pasos:**
1. Tap en radio "Doctor".

**Resultado esperado:**
- Radio "Doctor" seleccionado (marcado).
- Radio "Familia" deseleccionado.

---

### TC-TAB-048 — Share — Seleccionar Destinatario "Familia"

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Share.

**Pasos:**
1. Tap en radio "Familia".

**Resultado esperado:**
- Radio "Familia" seleccionado.
- Radio "Doctor" deseleccionado.

---

### TC-TAB-049 — Share — Sección Período — opciones generales

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Share, sin seleccionar solo Glucosa.

**Pasos:**
1. Tap en dropdown Período.

**Resultado esperado:**
- Opciones visibles:
  - "Últimos 14 días"
  - "Últimos 30 días"
  - "Últimos 45 días"
  - "Últimos 60 días"
  - "Otro"

---

### TC-TAB-050 — Share — Período "Últimos 14 días"

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Share.

**Pasos:**
1. Seleccionar "Últimos 14 días" en Período.

**Resultado esperado:**
- Dropdown muestra "Últimos 14 días".
- DatePicker no aparece (no es "Otro").

---

### TC-TAB-051 — Share — Período "Otro" — DatePicker de/a

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Share.

**Pasos:**
1. Seleccionar "Otro" en Período.

**Resultado esperado:**
- DatePicker con rango from/to aparece.
- Campos: "Desde" y "Hasta" con selectores de fecha.
- Usuario puede seleccionar rango personalizado.

---

### TC-TAB-052 — Share — Período "Otro" — seleccionar fechas personalizadas

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Share con Período "Otro" seleccionado.

**Pasos:**
1. Tap en "Desde" → seleccionar 2026-05-01.
2. Tap en "Hasta" → seleccionar 2026-05-14.

**Resultado esperado:**
- Campos muestran las fechas seleccionadas.
- Formato de fecha coincide con locale del dispositivo.

---

### TC-TAB-053 — Share — Sección Métricas — checkboxes visibles

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Share.

**Pasos:**
1. Observar la sección Métricas.

**Resultado esperado:**
- 3 opciones visibles:
  1. "Presión Arterial" (icono: heart-rate-icon.png)
  2. "Peso corporal" (icono: scale-icon.png) — incluye BMI
  3. "Glucosa en sangre" (icono: glucose-share-icon.png)
- Todos son checkboxes (multi-select).

---

### TC-TAB-054 — Share — Seleccionar métrica "Presión Arterial"

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Share.

**Pasos:**
1. Tap en checkbox "Presión Arterial".

**Resultado esperado:**
- Checkbox está seleccionado (checkmark visible).

---

### TC-TAB-055 — Share — Seleccionar métrica "Peso corporal"

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Share.

**Pasos:**
1. Tap en checkbox "Peso corporal".

**Resultado esperado:**
- Checkbox está seleccionado.
- Nota visible: "Incluye BMI".

---

### TC-TAB-056 — Share — Seleccionar métrica "Glucosa en sangre"

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Share.

**Pasos:**
1. Tap en checkbox "Glucosa en sangre".

**Resultado esperado:**
- Checkbox está seleccionado.

---

### TC-TAB-057 — Share — Seleccionar múltiples métricas

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Share.

**Pasos:**
1. Seleccionar "Presión Arterial", "Peso corporal" y "Glucosa en sangre" (todos).

**Resultado esperado:**
- Los 3 checkboxes están seleccionados.

---

### TC-TAB-058 — Share — Compartir con todas las opciones completas

**Tipo:** Happy path | **Prioridad:** Alta

**Precondiciones:** Usuario en Share con:
- Destinatario: "Doctor"
- Período: "Últimos 30 días"
- Métricas: "Presión Arterial" + "Peso corporal" seleccionadas.

**Pasos:**
1. Tap en botón "Compartir".

**Resultado esperado:**
- Share sheet nativo del sistema se abre.
- Opciones: Email, WhatsApp, Google Drive, etc.
- Usuario puede seleccionar destino.
- Reporte se adjunta/comparte correctamente.

---

### TC-TAB-059 — Share — botón "Compartir" deshabilitado sin métricas

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en Share sin seleccionar ninguna métrica.

**Pasos:**
1. Observar el botón "Compartir".
2. Intentar tap en el botón.

**Resultado esperado:**
- Botón está deshabilitado (gris, sin respuesta al tap).
- Mensaje indicando "Selecciona al menos una métrica" visible.

---

### TC-TAB-060 — Share — Solo Glucosa tiene período limitado

**Tipo:** Happy path | **Prioridad:** Media

**Precondiciones:** Usuario en Share.

**Pasos:**
1. Seleccionar solo "Glucosa en sangre" en Métricas.
2. Tap en dropdown Período.

**Resultado esperado:**
- Opciones de período solo para Glucosa:
  - "Últimos 14 días"
  - "Otro"
- Opciones "Últimos 30/45/60 días" NO aparecen (específicas para otras métricas).

---

### TC-TAB-061 — Share — Sin mediciones — estado mensaje

**Tipo:** Edge case | **Prioridad:** Media

**Precondiciones:** Usuario sin ninguna medición registrada.

**Pasos:**
1. Navegar a Share.

**Resultado esperado:**
- Mensaje: "No tienes mediciones registradas aún" (o similar).
- Botón "Compartir" deshabilitado.
- Botón para ir a registrar medición visible.

---

### TC-TAB-062 — Share — Período "Otro" validación de rango

**Tipo:** Negativo | **Prioridad:** Media

**Precondiciones:** Usuario en Share con Período "Otro".

**Pasos:**
1. Seleccionar "Desde" = 2026-05-14.
2. Seleccionar "Hasta" = 2026-05-01 (anterior a "Desde").

**Resultado esperado:**
- Validación: error "La fecha final debe ser posterior a la inicial" (o similar).
- Botón "Compartir" deshabilitado.

---

### TC-TAB-063 — Share — Pull-to-refresh datos de mediciones

**Tipo:** Happy path | **Prioridad:** Baja

**Precondiciones:** Usuario en Share.

**Pasos:**
1. Hacer pull-down para refrescar.

**Resultado esperado:**
- Spinner visible.
- Datos de mediciones se actualizan desde API.
- Últimas mediciones reflejadas en el período seleccionado.

---

