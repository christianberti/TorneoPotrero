import React, { useState } from 'react';
import { useTorneoData } from '../hooks/useTorneoData';
import FilterTabs from '../components/ui/FilterTabs';
import Card from '../components/ui/Card';
import TeamEscudo from '../components/TeamEscudo';

export default function Fixture() {
  const { 
    equipos, 
    fixtureZonaA, 
    fixtureZonaB, 
    fixtureMas30, 
    loading, 
    error 
  } = useTorneoData();
  
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
        {/* Cards skeleton */}
        <div className="w-full h-24 bg-superficie border border-gris-borde rounded-md skeleton-anim mb-2"></div>
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

  // 1. Obtener la lista correspondiente a la zona seleccionada
  let rawFixture = [];
  if (activeZona === 'Zona A') rawFixture = fixtureZonaA || [];
  else if (activeZona === 'Zona B') rawFixture = fixtureZonaB || [];
  else if (activeZona === '+30') rawFixture = fixtureMas30 || [];

  // 2. Agrupar los partidos por fecha_numero
  const grouped = {};
  rawFixture.forEach(partido => {
    const fn = parseInt(partido.fecha_numero || 0, 10);
    if (!grouped[fn]) {
      grouped[fn] = [];
    }
    grouped[fn].push(partido);
  });

  // 3. Ordenar las fechas numéricamente
  const sortedFechas = Object.keys(grouped).map(Number).sort((a, b) => a - b);

  const zones = [
    { id: 'Zona A', label: 'Zona A' },
    { id: 'Zona B', label: 'Zona B' },
    { id: '+30', label: '+30' }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-anton text-3xl tracking-wider text-blanco uppercase mb-1">Fixture</h1>
        <p className="font-inter text-xs text-gris-secundario uppercase tracking-wide">Calendario de partidos programados por zona y jornada.</p>
      </div>

      <FilterTabs 
        tabs={zones} 
        activeTabId={activeZona} 
        onTabChange={setActiveZona} 
      />

      {sortedFechas.length === 0 ? (
        <p className="text-center text-xs text-gris-secundario italic py-10 border border-dashed border-gris-borde rounded-md bg-superficie">
          No hay partidos programados para esta zona en el Google Sheet.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {sortedFechas.map(fn => {
            const partidosDeFecha = grouped[fn] || [];

            return (
              <div key={fn} className="flex flex-col gap-3">
                {/* Encabezado FECHA X con fondo transparente y texto blanco */}
                <div className="mb-2 border-b border-gris-borde pb-2">
                  <span className="text-blanco font-montserrat font-bold text-xs md:text-sm tracking-widest uppercase">
                    FECHA {fn}
                  </span>
                </div>

                {/* Lista de partidos en Grid de 2 columnas en desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {partidosDeFecha.map((partido, pIdx) => {
                    const localTeam = equipos.find(e => 
                      String(e.id).trim().toLowerCase() === String(partido.equipo_local_id).trim().toLowerCase() ||
                      String(e.nombre).trim().toLowerCase() === String(partido.equipo_local_id).trim().toLowerCase()
                    );
                    const visitanteTeam = equipos.find(e => 
                      String(e.id).trim().toLowerCase() === String(partido.equipo_visitante_id).trim().toLowerCase() ||
                      String(e.nombre).trim().toLowerCase() === String(partido.equipo_visitante_id).trim().toLowerCase()
                    );

                    const localN = localTeam?.nombre || partido.equipo_local_id;
                    const visitanteN = visitanteTeam?.nombre || partido.equipo_visitante_id;

                    return (
                      <Card key={pIdx}>
                        <div className="flex items-center justify-between py-1">
                          {/* Local */}
                          <div className="w-[42%] flex items-center justify-end gap-2.5 text-right">
                            <span className="font-montserrat font-bold tracking-wide uppercase text-[10px] md:text-xs text-blanco leading-tight whitespace-normal break-words">
                              {localN}
                            </span>
                            <TeamEscudo 
                              equipo={localTeam || { nombre: localN }} 
                              className="w-8 h-8 flex-shrink-0" 
                              textClassName="text-[9px]" 
                            />
                          </div>

                          {/* VS */}
                          <span className="w-[16%] text-center font-montserrat font-bold text-[10px] tracking-widest text-acento">
                            VS
                          </span>

                          {/* Visitante */}
                          <div className="w-[42%] flex items-center justify-start gap-2.5 text-left">
                            <TeamEscudo 
                              equipo={visitanteTeam || { nombre: visitanteN }} 
                              className="w-8 h-8 flex-shrink-0" 
                              textClassName="text-[9px]" 
                            />
                            <span className="font-montserrat font-bold tracking-wide uppercase text-[10px] md:text-xs text-blanco leading-tight whitespace-normal break-words">
                              {visitanteN}
                            </span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
