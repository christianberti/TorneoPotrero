# Resumen de Cambios: Pestañas de Filtro en Equipos

Hemos incorporado la separación por categorías en el catálogo general de equipos para mantener la consistencia con el resto de las secciones del sitio.

## Modificaciones Realizadas

1. **Filtro de Categorías en Equipos (`Equipos.jsx`)**:
   - Se importó e integró el componente `FilterTabs` en la página de listado de equipos.
   - Permite alternar y filtrar de forma instantánea entre las categorías: **Zona A**, **Zona B**, y **+30**.
   - Los equipos mostrados en la rejilla se limitan exclusivamente a la categoría correspondiente a la pestaña activa.

## Verificación

- **Compilación Exitosa**: El proyecto compila y empaqueta perfectamente (`npm run build`).
