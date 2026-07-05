import React, { useState, useEffect } from 'react';
import { useTorneoData } from '../hooks/useTorneoData';
import FilterTabs from '../components/ui/FilterTabs';
import PartidoCard from '../components/PartidoCard';

export default function Fixture() {
  const { equipos, fixture, resultados, loading, error } = useTorneoData();
  const [activeFecha, setActiveFecha] = useState('');

  // Obtener la lista ordenada de fechas única del fixture
  const fechasSet = new Set(fixture.map(p => p.fecha).filter(Boolean));
  const fechasList = Array.from(fechasSet).sort((a, b) => {
    const numA = parseInt(String(a).replace(/\D/g, ''), 10);
    const numB = parseInt(String(b).replace(/\D/g, ''), 10);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return String(a).localeCompare(String(b));
  });

  // Establecer la primera fecha como activa por defecto cuando carguen los datos
  useEffect(() => {
    if (fechasList.length > 0 && !activeFecha) {
      // Intentar establecer la primera fecha pendiente como activa
      const partidosConEstado = fixture.map(partido => {
        const res = resultados.find(r => 
          (r.partidoId && String(r.partidoId) === String(partido.id)) ||
          (r.id && String(r.id) === String(partido.id)) ||
          (String(r.local || r.equipoLocal).trim().toLowerCase() === String(partido.local).trim().toLowerCase() && 
           String(r.visitante || r.equipoVisitante).trim().toLowerCase() === String(partido.visitante).trim().toLowerCase() && 
           String(r.fecha || '').trim() === String(partido.fecha || '').trim())
        );
        const gl = partido.golesLocal ?? partido.goles_local ?? partido.golesL;
        const gv = partido.golesVisitante ?? partido.goles_visitante ?? partido.golesV;
        const tieneGolesDirectos = gl !== undefined && gv !== undefined && gl !== null && gv !== null && gl !== '' && gv !== '';
        return { ...partido, jugado: !!res || tieneGolesDirectos };
      });

      const primeraFechaPendiente = fechasList.find(fecha => {
        const partidosDeFecha = partidosConEstado.filter(p => p.fecha === fecha);
        return partidosDeFecha.some(p => !p.jugado);
      });

      setActiveFecha(primeraFechaPendiente || fechasList[0]);
    }
  }, [fechasList, fixture, resultados, activeFecha]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {/* Title skeleton */}
        <div className="w-[180px] h-8 bg-superficie border border-gris-borde rounded-md skeleton-anim"></div>
        {/* Tabs skeleton */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <div className="w-20 h-8 bg-superficie border border-gris-borde rounded-sm skeleton-anim flex-shrink-0"></div>
          <div className="w-20 h-8 bg-superficie border border-gris-borde rounded-sm skeleton-anim flex-shrink-0"></div>
          <div className="w-20 h-8 bg-superficie border border-gris-borde rounded-sm skeleton-anim flex-shrink-0"></div>
        </div>
        {/* Cards skeleton */}
        <div className="w-full h-24 bg-superficie border border-gris-borde rounded-md skeleton-anim"></div>
        <div className="w-full h-24 bg-superficie border border-gris-borde rounded-md skeleton-anim"></div>
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

  const tabs = fechasList.map(f => ({ id: f, label: f }));
  const partidosFiltrados = fixture.filter(p => p.fecha === activeFecha);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-anton text-3xl tracking-wider text-blanco uppercase mb-1">Fixture</h1>
        <p className="font-inter text-xs text-gris-secundario uppercase tracking-wide">Calendario de partidos y resultados por jornada.</p>
      </div>

      {fechasList.length === 0 ? (
        <p className="text-center text-xs text-gris-secundario italic py-10 border border-dashed border-gris-borde rounded-md bg-superficie">
          No hay partidos programados en el fixture todavía.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <FilterTabs 
            tabs={tabs} 
            activeTabId={activeFecha} 
            onTabChange={setActiveFecha} 
          />

          <div className="flex flex-col gap-3">
            {partidosFiltrados.map((partido, index) => (
              <PartidoCard 
                key={partido.id || index} 
                partido={partido} 
                resultados={resultados} 
                equipos={equipos} 
              />
            ))}
            {partidosFiltrados.length === 0 && (
              <p className="text-center text-xs text-gris-secundario italic py-4">
                No hay partidos para esta fecha.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
