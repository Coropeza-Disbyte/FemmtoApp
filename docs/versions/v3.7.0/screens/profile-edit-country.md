---
version: 3.7.0
screen: profile-edit-country
risk_level: low
since: 3.7.0
last_modified: 2026-05-14
source_files:
  - src/features/Profile/containers/EditCountry/index.js
spec_file: tests/specs/profile/profile.spec.js
page_object: src/pages/profile/ProfilePage.js
---

# [Profile] EditCountry — v3.7.0

> Nueva pantalla agregada al ProfileNavigator en v3.7.0. Permite al usuario seleccionar su país de residencia. Presenta una lista de países agrupada alfabéticamente con búsqueda en tiempo real e índice lateral. Al seleccionar un país, hace dispatch de `updateUserCountry()` y retorna a UserProfile.

---

## Acceso

- **Desde:** UserProfile → campo `"País de residencia"` (componente `EditableField`) → `navigation.navigate('EditCountry')`
- **Prerequisito:** usuario autenticado
- **Retorna a:** UserProfile (`navigation.goBack()` implícito al seleccionar)

---

## Posición en el stack

```
ProfileNavigator
  ├── UserProfile       ← campo "País de residencia" con onPress
  └── EditCountry       ← esta pantalla (nueva en v3.7.0)
```

---

## Elementos de UI

| Elemento | Notas |
|----------|-------|
| Search input | `SearchInput` — búsqueda en tiempo real con normalización Unicode |
| Lista | `FlashList` con sticky headers alfabéticos (letra de grupo) |
| Ítem | Nombre del país; tap → selección inmediata |
| Índice lateral | Barra con letras del alfabeto para saltar a cada grupo |

---

## Lógica de búsqueda y lista

- Países agrupados por letra inicial (sticky headers).
- Búsqueda normaliza caracteres Unicode (ej: "México" matchea con "mexico").
- Offsets de scroll precomputados para navegación por índice sin layout thrash.
- País actual del usuario (`authReducer.user?.country`) se marca como seleccionado.

---

## Acción al seleccionar

| Evento | Lógica |
|--------|--------|
| Tap en país | `dispatch(updateUserCountry(country))` → regresa a UserProfile |

---

## Campo en UserProfile

El campo de país se muestra en `UserProfile` como:

```
EditableField
  title:  "País de residencia"
  value:  getCountryName(country) || "—"
  onPress: navigation.navigate('EditCountry')
```

---

## Historial de versiones

| Versión | Tipo | Descripción |
|---------|------|-------------|
| v3.7.0 | Introducida | Selección de país de residencia en el perfil del usuario |
