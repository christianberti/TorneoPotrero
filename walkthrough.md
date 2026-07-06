# Resumen de Cambios: Reversión de Filtros en Goleadores (Libre / +30)

Hemos regresado al filtrado de máximos goleadores por torneo (Libre y +30) para adecuarse a la carga de datos del Google Sheet.

## Modificaciones Realizadas

1. **Reversión de Categorías de Filtro (`Goleadores.jsx`)**:
   - Se configuró el estado inicial de selección en `'Libre'`.
   - Se redefinieron las opciones del componente `FilterTabs` a: **Libre** y **+30**.
   - Los registros de la hoja de cálculo se filtran de manera directa comparando la columna `categoria` con estas dos agrupaciones globales, manteniendo el orden de goles descendente y cruce de equipos.

## Verificación

- **Compilación Exitosa**: El proyecto compila y empaqueta perfectamente (`npm run build`).
