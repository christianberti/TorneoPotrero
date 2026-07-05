import React, { useState } from 'react';

/**
 * Componente reutilizable para mostrar el escudo de un equipo.
 * Utiliza equipo.escudo_url como fuente principal y cuenta con un
 * fallback de iniciales en caso de que falle la carga o no tenga imagen.
 *
 * @param {Object} props.equipo - Datos del equipo (debe tener nombre y escudo_url/logo/escudo)
 * @param {string} props.className - Clases de Tailwind para tamaño (ej: "w-8 h-8")
 * @param {string} props.textClassName - Clases para el texto de fallback (ej: "text-[9px]")
 * @param {string} props.rounded - Clase de bordes redondeados (ej: "rounded-sm")
 * @param {string} props.padding - Clase de padding interno para la imagen (ej: "p-1")
 */
export default function TeamEscudo({ equipo, className = "w-8 h-8", textClassName = "text-[9px]", rounded = "rounded-sm", padding = "p-1" }) {
  const [imgError, setImgError] = useState(false);
  
  const nombre = equipo?.nombre || 'EQ';
  const escudoUrl = equipo?.escudo_url || equipo?.logo || equipo?.escudo;
  
  const showImg = escudoUrl && !imgError;
  
  if (showImg) {
    return (
      <img 
        src={escudoUrl} 
        alt={nombre} 
        onError={() => setImgError(true)} 
        className={`${className} object-contain`} 
      />
    );
  }
  
  return (
    <div className={`${className} flex items-center justify-center bg-fondo border border-gris-borde ${rounded} font-montserrat font-bold text-gris-secundario ${textClassName}`}>
      {nombre.slice(0, 2).toUpperCase()}
    </div>
  );
}
