import React, { useState } from 'react';
import { useTorneoData } from '../hooks/useTorneoData';
import RankingTable from '../components/ui/RankingTable';
import JugadorRow from '../components/JugadorRow';
import FilterTabs from '../components/ui/FilterTabs';
import { obtenerTorneo } from '../utils/torneo';

export default function MVP() {
  const { jugadores, equipos, loading, error } = useTorneoData();
  const [activeCategory, setActiveCategory] = useState('Libre');

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {/* Title skeleton */}
        <div className="w-[180px] h-8 bg-superficie border border-gris-borde rounded-md skeleton-anim"></div>
        {/* Tabs skeleton */}
        <div className="flex gap-2 pb-2">
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

  // Filtrar por torneo agrupado (Libre vs +30)
  const matchesCategory = (player) => {
    const team = equipos.find(e => 
      String(e.id) === String(player.equipo) || 
      String(e.nombre).trim().toLowerCase() === String(player.equipo).trim().toLowerCase() ||
      String(e.id) === String(player.equipoId)
    );

    const rawCat = player.categoria ?? player.categoría ?? team?.categoria ?? team?.categoría ?? '';
    const torneoGrupo = obtenerTorneo(rawCat);

    return torneoGrupo.toLowerCase() === activeCategory.toLowerCase();
  };

  // Filtrar y ordenar jugadores con al menos 1 MVP
  const mvps = jugadores
    .filter(j => {
      const m = parseInt(j.mvps ?? j.mvp ?? j.vecesMvp ?? 0, 10);
      return !isNaN(m) && m > 0 && matchesCategory(j);
    })
    .sort((a, b) => {
      const mA = parseInt(a.mvps ?? a.mvp ?? a.vecesMvp ?? 0, 10);
      const mB = parseInt(b.mvps ?? b.mvp ?? b.vecesMvp ?? 0, 10);
      return mB - mA;
    });

  const categories = [
    { id: 'Libre', label: 'Libre' },
    { id: '+30', label: '+30' }
  ];

  const headers = ['#', 'Jugador', 'Equipo', 'Destacados (MVP) ⭐'];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-anton text-3xl tracking-wider text-blanco uppercase mb-1">MVP</h1>
        <p className="font-inter text-xs text-gris-secundario uppercase tracking-wide">Ranking de jugadores elegidos como la figura del partido.</p>
      </div>

      <FilterTabs 
        tabs={categories} 
        activeTabId={activeCategory} 
        onTabChange={setActiveCategory} 
      />

      <RankingTable
        headers={headers}
        data={mvps}
        renderRow={(player, index) => {
          const team = equipos.find(e => 
            String(e.id) === String(player.equipo) || 
            String(e.nombre).trim().toLowerCase() === String(player.equipo).trim().toLowerCase() ||
            String(e.id) === String(player.equipoId)
          );
          const teamName = team ? team.nombre : player.equipo;

          return (
            <JugadorRow 
              key={player.id || player.nombre}
              jugador={player}
              index={index}
              teamName={teamName}
              statValue={player.mvps ?? player.mvp ?? player.vecesMvp ?? 0}
            />
          );
        }}
      />
    </div>
  );
}
