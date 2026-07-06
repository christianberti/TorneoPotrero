# Resumen de Cambios: Optimizaciones en la Sección de Próximos Partidos del Home

Hemos corregido la carga de los equipos locales en la sección de próximos encuentros de la página de inicio, simplificado el título de la sección y formateado correctamente la visualización de la jornada.

## Modificaciones Realizadas

1. **Resolución Robusta de Equipos Locales/Visitantes (`Home.jsx`)**:
   - Para prevenir inconsistencias debido a variaciones en los nombres de las columnas del Google Sheet en la pestaña de `ProximaFecha`, se implementó una lectura flexible con fallback: `partido.equipo_local_id || partido.equipo_local || partido.local` para el equipo local, y su equivalente para el visitante.
   - Esto resolvió el problema por el cual el equipo local no se mostraba (quedaba vacío), al no haber coincidencia exacta de la clave del objeto.

2. **Formateo de la Jornada / Fecha (`Home.jsx`)**:
   - Se añadió un formateador local `formatFechaTitle` en las tarjetas para asegurar que si el valor de la columna `titulo_fecha` en el Sheet es simplemente un número (ej: `"3"`), se pinte con el prefijo `"FECHA 3"` en el subtítulo, de forma uniforme y en mayúsculas.

3. **Título de la Sección Simplificado (`Home.jsx`)**:
   - Se cambió el título de la sección de `"Próximos Partidos por Zona"` a `"Próximos Partidos"`.

## Verificación

- **Compilación Exitosa**: El proyecto compila y empaqueta perfectamente (`npm run build`).
