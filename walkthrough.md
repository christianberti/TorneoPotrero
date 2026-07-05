# Resumen de Cambios: Preservación de Orden Fijo desde Google Sheets

Hemos corregido la visualización de la clasificación para respetar de manera estricta el orden y las posiciones definidas de forma manual por el usuario en las hojas del Google Sheet.

## Modificaciones Realizadas

1. **Eliminación del Ordenamiento Dinámico en el Frontend**:
   - Se removió la llamada `.sort(...)` en `Tabla.jsx` y `Home.jsx` al mapear los registros de las hojas `TablaZonaA`, `TablaZonaB` y `TablaMas30`.
   - La aplicación ahora lista a los equipos **exactamente en el mismo orden de filas en el que llegan desde el Google Sheet**, permitiendo al administrador del torneo controlar la lógica de desempates e índices de manera manual en la planilla.

2. **Visualización de la Columna `posicion` del Sheet**:
   - Mapeado el campo `posicion` directo desde la fila del Sheet.
   - Modificados `TablaPosiciones.jsx` y `Home.jsx` para mostrar `team.posicion` si está definida en la fila correspondiente de la planilla, cayendo en el índice físico de la fila (`index + 1`) únicamente si el campo viene vacío.

## Verificación

- **Compilación Exitosa**: El proyecto compila y empaqueta perfectamente (`npm run build`).
