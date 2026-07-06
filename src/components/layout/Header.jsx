import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 h-[60px] bg-superficie border-b border-gris-borde flex items-center justify-between px-4 md:px-6">
      <Link to="/" className="flex items-center gap-2 font-anton text-lg tracking-wider text-acento uppercase">
        ⚽ Torneo Potrero
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:block">
        <ul className="flex items-center gap-2">
          {[
            { path: '/', label: 'Inicio' },
            { path: '/fixture', label: 'Fixture' },
            { path: '/tabla', label: 'Tablas' },
            { path: '/equipos', label: 'Equipos' },
            { path: '/goleadores', label: 'Estadísticas' },
            { path: '/reglamento', label: 'Reglamento' },
          ].map(item => {
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`px-3 py-1.5 rounded-sm text-[11px] font-montserrat font-bold tracking-wider uppercase transition-colors duration-200 ${
                    active 
                      ? 'bg-blanco text-fondo' 
                      : 'text-gris-secundario hover:text-blanco'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
