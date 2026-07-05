import React from 'react';

export default function FilterTabs({ tabs = [], activeTabId, onTabChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 text-xs font-montserrat font-bold tracking-wider uppercase rounded-sm border transition-all duration-200 whitespace-nowrap ${
              isActive
                ? 'bg-blanco text-fondo border-blanco'
                : 'bg-superficie text-gris-secundario border-gris-borde hover:text-blanco hover:border-gris-secundario'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
