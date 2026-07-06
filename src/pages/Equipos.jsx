import React, { useState } from 'react';
import { useTorneoData } from '../hooks/useTorneoData';
import EquipoCard from '../components/EquipoCard';
import FilterTabs from '../components/ui/FilterTabs';

export default function Equipos() {
  const { equipos, loading, error } = useTorneoData();
  const [activeZona, setActiveZona] = useState('Zona A');

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {/* Title skeleton */}
        <div className="w-[180px] h-8 bg-superficie border border-gris-borde rounded-md skeleton-anim"></div>
        {/* Tabs skeleton */}
        <div className="flex gap-2 pb-2">
          <div className="w-20 h-8 bg-superficie border border-gris-borde rounded-sm skeleton-anim"></div>
          <div className="w-20 h-8 bg-superficie border border-gris-borde rounded-sm skeleton-anim"></div>
          <div className="w-20 h-8 bg-superficie border border-gris-borde rounded-sm skeleton-anim"></div>
        </div>
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="h-32 rounded-md bg-superficie border border-gris-borde skeleton-anim"></div>
          <div className="h-32 rounded-md bg-superficie border border-gris-borde skeleton-anim"></div>
          <div className="h-32 rounded-md bg-superficie border border-gris-borde skeleton-anim"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 border border-red-500/20 bg-red-950/20 text-alerta rounded-md text-center">
        <h4 className="font-montserrat font-bold tracking-wider uppercase text-xs mb-2">Error</h4>
        <p className="text-xs font-inter text-gris-secundario">{error}</p>
      </div>
    );
  }

  // Filtrar equipos por la zona activa
  const filteredEquipos = (equipos || []).filter(team => {
    const cat = String(team.categoria || team.categoría || '').trim().toLowerCase();
    return cat === activeZona.trim().toLowerCase();
  });

  const categories = [
    { id: 'Zona A', label: 'Zona A' },
    { id: 'Zona B', label: 'Zona B' },
    { id: '+30', label: '+30' }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-anton text-3xl tracking-wider text-blanco uppercase mb-1">Equipos</h1>
        <p className="font-inter text-xs text-gris-secundario uppercase tracking-wide">Conocé a los participantes del torneo.</p>
      </div>

      <FilterTabs 
        tabs={categories} 
        activeTabId={activeZona} 
        onTabChange={setActiveZona} 
      />

      {filteredEquipos.length === 0 ? (
        <p className="text-center text-xs text-gris-secundario italic py-10 border border-dashed border-gris-borde rounded-md bg-superficie mt-4">
          No hay equipos registrados para esta zona en este momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {filteredEquipos.map((equipo, index) => (
            <EquipoCard 
              key={equipo.id || equipo.nombre || index} 
              equipo={equipo} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
