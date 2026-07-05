import React from 'react';
import { useTorneoData } from '../hooks/useTorneoData';
import { calcularTabla } from '../utils/calcularTabla';
import EquipoCard from '../components/EquipoCard';

export default function Equipos() {
  const { equipos, fixture, resultados, loading, error } = useTorneoData();

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {/* Title skeleton */}
        <div className="w-[180px] h-8 bg-superficie border border-gris-borde rounded-md skeleton-anim"></div>
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

  const standings = calcularTabla(equipos, fixture, resultados);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-anton text-3xl tracking-wider text-blanco uppercase mb-1">Equipos</h1>
        <p className="font-inter text-xs text-gris-secundario uppercase tracking-wide">Conocé a los participantes del torneo y sus estadísticas principales.</p>
      </div>

      {equipos.length === 0 ? (
        <p className="text-center text-xs text-gris-secundario italic py-10 border border-dashed border-gris-borde rounded-md bg-superficie">
          No hay equipos registrados en este momento.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {equipos.map((equipo, index) => {
            const teamStats = standings.find(s => 
              String(s.id) === String(equipo.id) || 
              String(s.nombre).trim().toLowerCase() === String(equipo.nombre).trim().toLowerCase()
            );
            return (
              <EquipoCard 
                key={equipo.id || equipo.nombre || index} 
                equipo={equipo} 
                stats={teamStats} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
