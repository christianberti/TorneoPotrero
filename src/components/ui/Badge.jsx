import React from 'react';

export default function Badge({ text, type = 'default', className = '' }) {
  const getBadgeClass = () => {
    const base = 'inline-flex items-center px-2 py-0.5 text-[9px] font-montserrat font-bold tracking-wider uppercase rounded-sm';
    switch (type) {
      case 'success':
        return `${base} bg-emerald-950/40 text-emerald-400 border border-emerald-800/40`;
      case 'danger':
        return `${base} bg-alerta/20 text-alerta border border-alerta/40`;
      case 'warning':
        return `${base} bg-amber-950/40 text-amber-500 border border-amber-800/40`;
      case 'info':
        return `${base} bg-acento/20 text-acento border border-acento/40`;
      case 'default':
      default:
        return `${base} bg-superficie-destacada text-gris-secundario border border-gris-borde`;
    }
  };

  return (
    <span className={`${getBadgeClass()} ${className}`}>
      {text}
    </span>
  );
}
