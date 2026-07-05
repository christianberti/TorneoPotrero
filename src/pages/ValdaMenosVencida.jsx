import React, { useState } from 'react';
import { useTorneoData } from '../hooks/useTorneoData';
import { calcularTabla } from '../utils/calcularTabla';
import RankingTable from '../components/ui/RankingTable';
import FilterTabs from '../components/ui/FilterTabs';
import { obtenerTorneo } from '../utils/torneo';

export default function ValdaMenosVencida() {
  const { equipos, jugadores, fixture, resultados, loading, error } = useTorneoData();
  const [activeCategory, setActiveCategory] = useState('Libre');

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {/* Title skeleton */}
        <div className="w-[220px] h-8 bg-superficie border border-gris-borde rounded-md skeleton-anim"></div>
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
  const matchesCategory = (team) => {
    const rawCat = team.categoria ?? team.categoría ?? '';
    const torneoGrupo = obtenerTorneo(rawCat);
    return torneoGrupo.toLowerCase() === activeCategory.toLowerCase();
  };

  // Calcular tabla general para obtener partidos jugados (PJ) y goles en contra (GC)
  const standings = calcularTabla(equipos, fixture, resultados);

  // Mapear vallas a arqueros o equipos
  const vallasCalculadas = standings
    .filter(team => {
      if (team.PJ === 0) return false;
      
      const originalTeam = equipos.find(e => 
        String(e.id) === String(team.id) || 
        String(e.nombre).trim().toLowerCase() === String(team.nombre).trim().toLowerCase()
      );
      
      return originalTeam ? matchesCategory(originalTeam) : true;
    })
    .map(team => {
      // Intentar encontrar un arquero para este equipo en Jugadores
      const teamPlayers = jugadores.filter(j => 
        (j.equipoId && String(j.equipoId) === String(team.id)) ||
        (j.equipo && String(j.equipo).trim().toLowerCase() === String(team.id).trim().toLowerCase()) ||
        (j.equipo && String(j.equipo).trim().toLowerCase() === String(team.nombre).trim().toLowerCase())
      );

      const arquero = teamPlayers.find(j => {
        const pos = String(j.posicion || j.puesto || '').toLowerCase();
        return pos.includes('arquero') || pos.includes('arquera') || 
               pos.includes('portero') || pos.includes('goalkeeper') || 
               pos.includes('gk') || pos.includes('golero') || pos.includes('arquero/a');
      });

      if (arquero) {
        return {
          id: arquero.id || arquero.nombre,
          nombre: arquero.nombre,
          equipo: team.nombre,
          PJ: team.PJ,
          GC: team.GC,
          promedio: team.GC / team.PJ,
          tipo: 'arquero',
          posicionOriginal: arquero.posicion
        };
      } else {
        return {
          id: team.id || team.nombre,
          nombre: `Valla ${team.nombre}`,
          equipo: team.nombre,
          PJ: team.PJ,
          GC: team.GC,
          promedio: team.GC / team.PJ,
          tipo: 'equipo'
        };
      }
    });

  // Ordenar de menor a mayor promedio de goles recibidos por partido
  const vallasSorted = [...vallasCalculadas].sort((a, b) => {
    if (a.promedio !== b.promedio) {
      return a.promedio - b.promedio;
    }
    if (b.PJ !== a.PJ) {
      return b.PJ - a.PJ;
    }
    return a.GC - b.GC;
  });

  const categories = [
    { id: 'Libre', label: 'Libre' },
    { id: '+30', label: '+30' }
  ];

  const headers = ['#', 'Guardameta / Valla', 'Equipo', 'PJ', 'Goles Recibidos', 'Promedio'];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-anton text-3xl tracking-wider text-blanco uppercase mb-1">Valla Menos Vencida</h1>
        <p className="font-inter text-xs text-gris-secundario uppercase tracking-wide">Ranking de arqueros y vallas ordenados por menor cantidad de goles recibidos por partido.</p>
      </div>

      <FilterTabs 
        tabs={categories} 
        activeTabId={activeCategory} 
        onTabChange={setActiveCategory} 
      />

      <RankingTable
        headers={headers}
        data={vallasSorted}
        renderRow={(item, index) => {
          return (
            <tr 
              key={item.id} 
              className="hover:bg-superficie-destacada/10 transition-colors duration-150 border-b border-gris-borde"
            >
              <td className="px-4 py-3 text-center text-xs font-semibold text-gris-secundario w-[50px]">{index + 1}</td>
              <td className="px-4 py-3 text-left">
                <span className="font-montserrat font-bold tracking-wide uppercase text-xs text-blanco">{item.nombre}</span>
                {item.tipo === 'arquero' && (
                  <span className="block text-[9px] text-gris-secundario font-inter mt-0.5">
                    🧤 Arquero ({item.posicionOriginal || 'Arquero'})
                  </span>
                )}
                {item.tipo === 'equipo' && (
                  <span className="block text-[9px] text-gris-secundario font-inter mt-0.5">
                    🛡️ Valla Colectiva
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-left text-xs text-gris-secundario">{item.equipo}</td>
              <td className="px-4 py-3 text-center text-xs text-gris-secundario">{item.PJ}</td>
              <td className="px-4 py-3 text-center text-xs font-semibold text-blanco w-[80px]">{item.GC}</td>
              <td className="px-4 py-3 text-center bg-superficie-destacada font-anton text-base text-emerald-400 w-[80px] border-l border-gris-borde/30">
                {item.promedio.toFixed(2)}
              </td>
            </tr>
          );
        }}
      />
    </div>
  );
}
