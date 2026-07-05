import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  const moreSubRoutes = [
    { path: '/goleadores', label: 'Goleadores', icon: '⚽' },
    { path: '/valla-menos-vencida', label: 'Valla Menos Vencida', icon: '🧤' },
    { path: '/tarjetas', label: 'Tarjetas', icon: '🟨' },
    { path: '/mvp', label: 'MVP', icon: '⭐' },
    { path: '/reglamento', label: 'Reglamento', icon: '📖' },
  ];

  const isMoreActive = moreSubRoutes.some(route => isActive(route.path));

  const handleCloseMenu = () => {
    setShowMoreMenu(false);
  };

  return (
    <>
      {/* Mobile Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-[65px] bg-superficie border-t border-gris-borde flex justify-around items-center z-40 pb-safe md:hidden">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-1/5 h-full text-[9px] font-montserrat font-bold tracking-wider uppercase gap-1 ${
            isActive('/') ? 'text-acento' : 'text-gris-secundario'
          }`} 
          onClick={handleCloseMenu}
        >
          <span className="text-base">🏠</span>
          <span>Inicio</span>
        </Link>
        <Link 
          to="/fixture" 
          className={`flex flex-col items-center justify-center w-1/5 h-full text-[9px] font-montserrat font-bold tracking-wider uppercase gap-1 ${
            isActive('/fixture') ? 'text-acento' : 'text-gris-secundario'
          }`} 
          onClick={handleCloseMenu}
        >
          <span className="text-base">📅</span>
          <span>Fixture</span>
        </Link>
        <Link 
          to="/tabla" 
          className={`flex flex-col items-center justify-center w-1/5 h-full text-[9px] font-montserrat font-bold tracking-wider uppercase gap-1 ${
            isActive('/tabla') ? 'text-acento' : 'text-gris-secundario'
          }`} 
          onClick={handleCloseMenu}
        >
          <span className="text-base">🏆</span>
          <span>Tabla</span>
        </Link>
        <Link 
          to="/equipos" 
          className={`flex flex-col items-center justify-center w-1/5 h-full text-[9px] font-montserrat font-bold tracking-wider uppercase gap-1 ${
            isActive('/equipos') ? 'text-acento' : 'text-gris-secundario'
          }`} 
          onClick={handleCloseMenu}
        >
          <span className="text-base">👥</span>
          <span>Equipos</span>
        </Link>
        <button 
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className={`flex flex-col items-center justify-center w-1/5 h-full text-[9px] font-montserrat font-bold tracking-wider uppercase gap-1 ${
            showMoreMenu || isMoreActive ? 'text-acento' : 'text-gris-secundario'
          }`}
        >
          <span className="text-base">➕</span>
          <span>Más</span>
        </button>
      </nav>

      {/* Drawer Overlay */}
      {showMoreMenu && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 md:hidden"
          onClick={handleCloseMenu}
        ></div>
      )}

      {/* Drawer Menu */}
      <div 
        className={`fixed left-0 right-0 bg-superficie border-t border-gris-borde rounded-t-lg px-5 pt-4 pb-8 z-50 transition-all duration-300 ease-out md:hidden ${
          showMoreMenu ? 'bottom-0' : '-bottom-full'
        }`}
      >
        <div className="w-10 h-1 bg-gris-borde rounded-full mx-auto mb-4"></div>
        <h3 className="text-xs font-montserrat font-bold tracking-wider uppercase text-center text-blanco mb-4">Más Secciones</h3>
        <div className="grid grid-cols-2 gap-3">
          {moreSubRoutes.map((route) => {
            const active = isActive(route.path);
            return (
              <Link
                key={route.path}
                to={route.path}
                className={`flex flex-col items-center gap-2 p-3 rounded-md border text-center transition-all duration-200 ${
                  active 
                    ? 'bg-acento/10 text-acento border-acento/40 font-bold' 
                    : 'bg-superficie-destacada text-blanco border-gris-borde hover:border-gris-secundario'
                }`}
                onClick={handleCloseMenu}
              >
                <span className="text-xl">{route.icon}</span>
                <span className="text-[11px] font-montserrat tracking-wider uppercase">{route.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
