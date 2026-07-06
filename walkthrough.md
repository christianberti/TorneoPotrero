# Resumen de Cambios: Simplificación del Fixture de Hojas de Zona

Hemos adecuado el cargador y la interfaz del Fixture para adaptarse a la estructura simplificada sin identificadores de fila ni columnas de estado de partido.

## Modificaciones Realizadas

1. **Mapeo Robusto del Fixture (`useTorneoData.jsx`)**:
   - Se actualizó el mapeador del fixture para generar identificadores virtuales únicos basados en el nombre de la zona, el número de la fecha y el índice de fila (`${zone}-${f.fecha_numero}-${idx}`).
   - La propiedad `jugado` se establece de manera predeterminada en `false` debido a la ausencia de esa columna en las nuevas hojas simplificadas.

2. **Renderizado Seguro con Keys de React (`Fixture.jsx`)**:
   - En el listado de partidos por fecha de la página `Fixture.jsx`, se modificó la propiedad `key` del componente `Card` para utilizar de manera explícita el índice de la fila (`pIdx`) del mapeo interno del grupo, eliminando cualquier expectativa o dependencia con un campo `id` proveniente del Google Sheet.

## Verificación

- **Compilación Exitosa**: El proyecto compila y empaqueta perfectamente (`npm run build`).
