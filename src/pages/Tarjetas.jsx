import React, { useState } from 'react';
import { useTorneoData } from '../hooks/useTorneoData';
import RankingTable from '../components/ui/RankingTable';
import FilterTabs from '../components/ui/FilterTabs';
import { obtenerTorneo } from '../utils/torneo';

export default function Tarjetas() {
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

  // Filtrar jugadores con al menos 1 tarjeta
  const amonestados = jugadores
    .filter(j => {
      const y = parseInt(j.amarillas ?? j.amarilla ?? 0, 10);
      const r = parseInt(j.rojas ?? j.roja ?? 0, 10);
      return ((!isNaN(y) && y > 0) || (!isNaN(r) && r > 0)) && matchesCategory(j);
    })
    .sort((a, b) => {
      const rA = parseInt(a.rojas ?? a.roja ?? 0, 10);
      const rB = parseInt(b.rojas ?? b.roja ?? 0, 10);
      if (rB !== rA) return rB - rA;

      const yA = parseInt(a.amarillas ?? a.amarilla ?? 0, 10);
      const yB = parseInt(b.amarillas ?? b.amarilla ?? 0, 10);
      return yB - yA;
    });

  const categories = [
    { id: 'Libre', label: 'Libre' },
    { id: '+30', label: '+30' }
  ];

  const headers = ['#', 'Jugador', 'Equipo', 'Amarillas 🟨', 'Rojas 🟥'];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-anton text-3xl tracking-wider text-blanco uppercase mb-1">Tarjetas</h1>
        <p className="font-inter text-xs text-gris-secundario uppercase tracking-wide">Registro acumulado de amonestaciones y expulsiones.</p>
      </div>

      <FilterTabs 
        tabs={categories} 
        activeTabId={activeCategory} 
        onTabChange={setActiveCategory} 
      />

      <RankingTable
        headers={headers}
        data={amonestados}
        renderRow={(player, index) => {
          const team = equipos.find(e => 
            String(e.id) === String(player.equipo) || 
            String(e.nombre).trim().toLowerCase() === String(player.equipo).trim().toLowerCase() ||
            String(e.id) === String(player.equipoId)
          );
          const teamName = team ? team.nombre : player.equipo;

          return (
            <tr 
              key={player.id || player.nombre} 
              className="hover:bg-superficie-destacada/10 transition-colors duration-150 border-b border-gris-borde"
            >
              <td className="px-4 py-3 text-center text-xs font-semibold text-gris-secundario w-[50px]">{index + 1}</td>
              <td className="px-4 py-3 text-left">
                <span className="font-montserrat font-bold tracking-wide uppercase text-xs text-blanco">{player.nombre}</span>
              </td>
              <td className="px-4 py-3 text-left text-xs text-gris-secundario">{teamName}</td>
              <td className="px-4 py-3 text-center text-xs text-blanco w-[80px]">
                {player.amarillas ?? player.amarilla ?? 0}
              </td>
              <td className="px-4 py-3 text-center bg-superficie-destacada font-anton text-base text-alerta w-[80px] border-l border-gris-borde/30">
                {player.rojas ?? player.roja ?? 0}
              </td>
            </tr>
          );
        }}
      />
    </div>
  );
}
