# Femmto App — Changelog de Versiones

Trazabilidad unificada de cambios por versión. Cada entrada documenta qué se agregó, modificó o eliminó en esa release. Las especificaciones detalladas de cada pantalla se encuentran en `docs/versions/vX.Y.Z/specs.md`.

---

## v4.0.0 — Rebranding + Rediseño del Home

### Navegación
- **ELIMINADO** Tab "Medición" del bottom nav (pasó de 5 a 4 tabs: Home, Devices, Alarmas, Compartir)
- **NUEVO** Pantalla `Measure` incorporada dentro del stack de Home (accesible desde el header)
- **NUEVO** `TourGuideProvider` envuelve el `TabNavigator` (sistema de onboarding interactivo)

### Header (HomeHeader)
- **REEMPLAZADO** Botón de videos/ayuda (`help-icon`) por botón de nueva medición (`new-measure-icon`)
- **ELIMINADO** Borde inferior del header
- **NUEVO** Routing inteligente desde el header: al presionar "Nueva medición" navega directamente a la pantalla de medición correspondiente según la métrica activa
- **MODIFICADO** Tamaño del ícono de notificaciones: `size="6"` → `size="7"`
- **NUEVO** Zona de TourGuide (zona 5) sobre el botón de nueva medición

### Sección central del Home — FavoritesSelector → ObjectiveTabs
- **ELIMINADO** `FavoritesSelector` y `FavoritesListSheet` (modelo de favoritos)
- **NUEVO** `ObjectiveTabs` — tabs horizontales basados en los objetivos del usuario (`user.data.targets`)
- **NUEVO** Tabs disponibles: Peso · Presión arterial · Glucosa · Pasos · General
- **NUEVO** Orden de tabs personalizable por el usuario (modal `ReorderTabsModal`, persiste en store)
- **NUEVO** Widgets por objetivo: `WeightWidget`, `GlucoseWidget`, `BloodPressureWidget`, `StepsWidget`, `GeneralWidget`
- **NUEVO** `TrendsSection` — sección de tendencias debajo del widget activo
- **NUEVO** `HealthyHabitSection` — sección de hábitos diarios debajo de tendencias

### Sección "Últimas mediciones" → "Métricas de salud"
- **MODIFICADO** Título: "Últimas mediciones" → "Métricas de salud"
- **MODIFICADO** Layout: lista vertical (1 columna) → grid de 2 columnas (48% cada card)
- **MODIFICADO** Filtrado: por lista `favourites` del store → por `user.data.targets`
- **NUEVO** Card de composición segmentada ocupa fila completa (100%) al final del grid
- **NUEVO** Componente genérico `HealthMetricCard` centraliza estilos de todas las cards

### Sistema de onboarding — TourGuide
- **NUEVO** Librería `rn-tourguide` integrada
- **NUEVO** Tour guiado de 5 zonas en el Home, se muestra una única vez (persiste en `AsyncStorage`)
- **NUEVO** Tooltip personalizado `HomeTourTooltip`
- **NUEVO** Scroll automático durante el tour para mostrar cada zona
- **NUEVO** El tour se completa antes de evaluar intro de HealthNative o perfil incompleto

### Store — Home
- **NUEVO** `LOAD_HOME_SUMMARY` / `LOAD_GENERAL_SUMMARY` — carga de resúmenes por métrica
- **NUEVO** `SET_TAB_ORDER` — persiste el orden personalizado de tabs
- **NUEVO** `SET_DAILY_HABIT` — registra cumplimiento del hábito diario
- **NUEVO** Setters individuales: `SET_WEIGHT/BLOOD_PRESSURE/GLUCOSE/STEPS/GENERAL_SUMMARY`

### Tema y assets
- **NUEVO** `src/theme/measurementColors.js` — paleta de colores por métrica:
  - Presión: `#E57373` · Peso: `#64A185` · Glucosa: `#37A1AF` · Pasos: `#D76801` · General: `#7493BA`
  - Delta positivo: `#28B446` · Delta negativo: `#c91f1d`
- **REEMPLAZADOS** 15 assets en `assets/images/`: íconos de header, cards de métricas e íconos de hábitos

---

## v3.9.0 — Banner Promocional HotSale

### Nuevo componente — Modal promocional (`HotFemmtoModal`)
- **NUEVO** Modal promocional que aparece automáticamente después del login
- **NUEVO** Redirige exclusivamente a la tienda oficial de Femmto Argentina
- **NUEVO** Contador visual de tiempo restante de la promoción
- **NUEVO** Comportamiento acotado a usuarios de Argentina (`country === 'AR'`)
- **NUEVO** Lógica de frecuencia: se muestra una vez por día (persiste en `AsyncStorage`)
- **NUEVO** Compatibilidad con cuentas nuevas y existentes
- **NUEVO** Modal adaptable sobre la Home sin afectar componentes inferiores

> Nota: En v4.0.0 el componente `HotFemmtoModal` quedó comentado en el código (desactivado tras el período de campaña). La lógica está preservada para reutilización en futuras campañas (CyberMonday, BlackFriday).

---

## v3.8.0 — Push Notifications Segmentadas

### Push Notifications
- **NUEVO** Sistema de push notifications segmentadas por usuario, dispositivo y comportamiento
- **NUEVO** Pantalla `Notifications` — listado de notificaciones recibidas
- **NUEVO** Indicador de notificaciones no leídas en el header (badge sobre el ícono de campana)

### Fixes
- **FIX** OCR para mediciones de presión arterial en Android

---

## v3.7.3

### Fixes
- **FIX** Balanzas que detectaban medición pero no podían cerrar el modal de confirmación
- **FIX** Múltiples registros de una misma medición

---

## v3.7.2

### Nuevas funcionalidades
- **NUEVO** Visualización y edición del país desde la sección de Perfil
- **REHABILITADO** Edición de mediciones de glucosa y presión arterial (había sido deshabilitado)

### Infraestructura
- **NUEVO** Ajustes en el sistema de notificaciones y gestión de datos (base para futuras funcionalidades)

### Fixes
- **FIX** Errores críticos que generaban crashes

---

## v3.7.1 — Hotfix

### Fixes
- **FIX** Issue de conexión en balanzas B04 y B05

---

## v3.7.0 — Actualización técnica SDKs

### Infraestructura
- **ACTUALIZADO** Todas las SDKs y librerías a sus últimas versiones
- **NUEVO** Adecuación técnica para soporte de páginas de 16KB en Android (requisito de Play Store)

### Fixes
- **FIX** Issue de impedancia reportado en backend

---

## v3.6.0 — Onboarding Gamificado

### Onboarding
- **NUEVO** Flujo de bienvenida gamificado (estilo Duolingo) — recolección de datos de perfil y seteo de objetivos
- **NUEVO** Pantalla `Welcome` — introducción antes del login/registro
- **NUEVO** Pantalla `MeetUser` — preguntas de perfil paso a paso
- **NUEVO** Pantalla `SaveOnboardingProgress` — guardado del progreso del onboarding
- **NUEVO** Pantalla `NotificationPermission` — solicitud de permisos durante el onboarding
- **NUEVO** Datos de perfil y objetivos se guardan en base de datos
- **NUEVO** Tracking de pasos del onboarding en Google Analytics

### Medición — Tensiómetros
- **NUEVO** Instrucciones de preparación pre-medición para tensiómetros de brazo y muñeca
- **NUEVO** Guía visual de postura y posicionamiento del equipo

### Fixes
- **FIX** Android: registros de peso de Android Health ahora se acumulan en historial (antes sobreescribían)

---

## v3.5.0 — Recordatorios, Reportes y Glucómetros Bluetooth

### Módulos rediseñados
- **REDISEÑADO** Módulo de Recordatorios — nueva interfaz más moderna e intuitiva
- **REDISEÑADO** Módulo de Reportes Compartidos — nueva interfaz más moderna e intuitiva

### Dispositivos
- **NUEVO** Integración con glucómetros Bluetooth
- **NUEVO** Flujo de medición de glucosa vía Bluetooth — más rápido y estable

### Performance
- **MEJORADO** Respuesta y rendimiento en el panel de frecuencia cardíaca

### Fixes
- **FIX** Crash al intentar conectar con Android Health en dispositivos con Android 13 o inferior

---

## v3.4.0 — Integración Health Nativa

### Integración con salud del sistema operativo
- **NUEVO** Integración con Apple Health (iOS) — pasos y frecuencia cardíaca
- **NUEVO** Integración con Health Connect (Android) — pasos y frecuencia cardíaca
- **NUEVO** Pantalla `HeartRateDetails` — detalle y métricas de frecuencia cardíaca
- **NUEVO** Pantalla `HeartRateMeasurementHistory` — historial de frecuencia cardíaca
- **NUEVO** Pantalla `StepsDetails` — detalle y métricas de pasos
- **NUEVO** Pantalla `StepsHistory` — historial de pasos
- **NUEVO** Pantalla `HealthNativeIntro` — introducción y solicitud de permisos para la integración

### Naming
- **RENOMBRADO** "Tensiómetros" → "Monitores de Presión" (alineación con mercado MX)

### Fixes
- **FIX** Botón OK visible al guardar notas en mediciones
- **FIX** Parcial BCS09: modal offline cuando el usuario se mide desde la app

---

## v3.3.0 — Rediseño flujo Tensiómetros

### Medición — Tensiómetros
- **REDISEÑADO** Flujo completo de medición de tensiómetros — experiencia más intuitiva y con menor margen de error
- **NUEVO** Pantalla `NewPresureOCRMedition` — medición por OCR (cámara)
- **NUEVO** Pantalla `SuccessPreasureMeasurement` — confirmación exitosa de medición
- **NUEVO** Pantalla `EditPreasureMeasure` — edición de medición de presión
- **NUEVO** Pantalla `BluetoothPreasureMeasure` — medición vía Bluetooth

---

## v3.2.2

### Analytics
- **NUEVO** Events Tracking Revamp — recolección completa de eventos para analítica de usuarios

### Fixes
- **FIX** Flujo de reseñas: evita solicitar la misma reseña si el usuario la omitió
- **FIX** Forzado de actualización vía mensaje de sistema para versiones afectadas

---

## v3.2.1

### Dispositivos
- **NUEVO** SDK para dispositivo AIO (All in One) — en producción, próximamente en mercado

### Engagement
- **NUEVO** Flujo de solicitud de reseñas en stores (OKR: llevar rating a 4.5★)

### Fixes
- **FIX** Reporte de métricas sobredimensionadas — las métricas no se visualizaban correctamente

---

## v3.2.0 — Tensiómetros de muñeca + Onboarding

### Dispositivos
- **NUEVO** Soporte para tensiómetros de muñeca — conexión y registro de mediciones

### Onboarding
- **REFACTORIZADO** Flujo de bienvenida — optimizado en estructura y rendimiento

### Legal
- **ACTUALIZADO** Términos de Servicio y Política de Privacidad

---

## v3.1.0 — Migración AWS + Nuevas funcionalidades (11 de Septiembre)

### Infraestructura
- **NUEVO** Migración completa a AWS

### Dispositivos
- **NUEVO** Integración con báscula corporal BWS12 — registro de mediciones desde el dispositivo

### Disponibilidad
- **NUEVO** App habilitada en Ecuador para iOS

### Perfil / Legal
- **NUEVO** Opción "Eliminar cuenta" en Mi cuenta (cumplimiento legal Android e iOS)

### Módulo Admin
- **NUEVO** Ventanas de mantenimiento — restringe uso de la app durante mantenimiento
- **NUEVO** Actualización requerida — bloquea acceso hasta que el usuario actualice
- **NUEVO** Modal de actualización opcional

### Fixes
- **MEJORADO** Flujo unificado de mediciones para todos los equipos
- **MEJORADO** Recuperación de contraseña — proceso más rápido y sencillo
- **FIX** Componente de fecha de nacimiento en Android — ahora tiene el mismo diseño que iOS
- **FIX** Balanza BCS07 — nombre del usuario visible en el visor de la balanza
