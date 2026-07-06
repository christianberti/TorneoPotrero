import React, { useState } from 'react';
import { useTorneoData } from '../hooks/useTorneoData';
import RankingTable from '../components/ui/RankingTable';
import JugadorRow from '../components/JugadorRow';
import FilterTabs from '../components/ui/FilterTabs';

export default function Goleadores() {
  const { goleadores, equipos, loading, error } = useTorneoData();
  const [activeCategory, setActiveCategory] = useState('Zona A');

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {/* Title skeleton */}
        <div className="w-[200px] h-8 bg-superficie border border-gris-borde rounded-md skeleton-anim"></div>
        {/* Tabs skeleton */}
        <div className="flex gap-2 pb-2">
          <div className="w-20 h-8 bg-superficie border border-gris-borde rounded-sm skeleton-anim"></div>
          <div className="w-20 h-8 bg-superficie border border-gris-borde rounded-sm skeleton-anim"></div>
          <div className="w-20 h-8 bg-superficie border border-gris-borde rounded-sm skeleton-anim"></div>
        </div>
        {/* Table skeleton */}
        <div className="w-full h-48 bg-superficie border border-gris-borde rounded-md skeleton-anim"></div>
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

  // 1. Filtrar, cruzar equipos y parsear goles
  const filteredGoleadores = (goleadores || [])
    .filter(row => 
      String(row.categoria || '').trim().toLowerCase() === activeCategory.trim().toLowerCase()
    )
    .map(row => {
      // Cruzar el equipo_id de la fila con el catálogo global de equipos
      const team = equipos.find(e => 
        String(e.id).trim().toLowerCase() === String(row.equipo_id).trim().toLowerCase() ||
        String(e.nombre).trim().toLowerCase() === String(row.equipo_id).trim().toLowerCase()
      );

      const golesVal = parseInt(row.goles || 0, 10);

      return {
        ...row,
        nombre: row.jugador || 'Jugador Sin Nombre',
        teamObj: team,
        golesParsed: golesVal
      };
    })
    .sort((a, b) => b.golesParsed - a.golesParsed);

  const categories = [
    { id: 'Zona A', label: 'Zona A' },
    { id: 'Zona B', label: 'Zona B' },
    { id: '+30', label: '+30' }
  ];

  const headers = ['#', 'Jugador', 'Equipo', 'Goles'];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-anton text-3xl tracking-wider text-blanco uppercase mb-1">Goleadores</h1>
        <p className="font-inter text-xs text-gris-secundario uppercase tracking-wide">Máximos anotadores del torneo por zona.</p>
      </div>

      <FilterTabs 
        tabs={categories} 
        activeTabId={activeCategory} 
        onTabChange={setActiveCategory} 
      />

      {filteredGoleadores.length === 0 ? (
        <p className="text-center text-xs text-gris-secundario italic py-10 border border-dashed border-gris-borde rounded-md bg-superficie mt-4">
          No hay goleadores registrados para esta zona en el Google Sheet.
        </p>
      ) : (
        <RankingTable 
          headers={headers}
          data={filteredGoleadores}
          renderRow={(player, index) => {
            const teamName = player.teamObj ? player.teamObj.nombre : player.equipo_id;

            return (
              <JugadorRow 
                key={player.id || player.nombre || index}
                jugador={player}
                index={index}
                teamName={teamName}
                statValue={player.golesParsed}
              />
            );
          }}
        />
      )}
    </div>
  );
}
