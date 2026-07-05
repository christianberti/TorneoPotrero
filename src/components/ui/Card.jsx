import React from 'react';

export default function Card({ children, className = '', onClick, title }) {
  const CardComponent = onClick ? 'button' : 'div';
  
  return (
    <CardComponent 
      onClick={onClick} 
      className={`bg-superficie border border-gris-borde rounded-md p-4 w-full text-left transition-all duration-200 ${
        onClick ? 'hover:border-gris-secundario cursor-pointer focus:outline-none' : ''
      } ${className}`}
    >
      {title && (
        <h3 className="font-montserrat font-semibold tracking-wide uppercase text-xs mb-3 text-blanco">
          {title}
        </h3>
      )}
      {children}
    </CardComponent>
  );
}
