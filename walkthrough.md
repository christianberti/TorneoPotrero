# Resumen de Cambios: Rejilla Responsiva de Equipos Reducida

Hemos adecuado el tamaño de las tarjetas de los equipos en el catálogo para optimizar el espacio en pantallas de todos los tamaños.

## Modificaciones Realizadas

1. **Rejilla Compacta (`Equipos.jsx`)**:
   - Se actualizó la rejilla responsiva para mostrar **2 columnas de tarjetas por fila en dispositivos móviles** (`grid-cols-2`).
   - Escala de forma progresiva a 3 columnas en tabletas (`sm:grid-cols-3`), 4 columnas en portátiles (`md:grid-cols-4`) y 5 columnas en pantallas grandes (`lg:grid-cols-5`), reduciendo el tamaño global de las fichas de los clubes.

2. **Adaptación de las Fichas (`EquipoCard.jsx`)**:
   - Se ajustó el tamaño del escudo en las tarjetas (`w-10 h-10` en móviles, escalando a `w-14 h-14` en desktop).
   - Se adaptó la tipografía del nombre del club (`text-[9px]` en móviles) y se añadió soporte de división de palabras (`break-words`) para prevenir desbordes o solapamientos en las tarjetas más pequeñas.

## Verificación

- **Compilación Exitosa**: El proyecto compila y empaqueta perfectamente (`npm run build`).
