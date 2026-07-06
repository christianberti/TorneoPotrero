import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTorneoData } from '../hooks/useTorneoData';
import { calcularTabla } from '../utils/calcularTabla';
import PartidoCard from '../components/PartidoCard';
import Card from '../components/ui/Card';
import TeamEscudo from '../components/TeamEscudo';

export default function Home() {
  const { 
    equipos, 
    tablaZonaA, 
    tablaZonaB, 
    tablaMas30, 
    proximaFecha,
    loading, 
    error 
  } = useTorneoData();

  // Estados para Carrusel de Tablas por Zona
  const [activeTableIndex, setActiveTableIndex] = useState(0);
  const [isTableAutoPlay, setIsTableAutoPlay] = useState(true);

  // Estados para Carrusel de Próximas Fechas
  const [activeMatchesIndex, setActiveMatchesIndex] = useState(0);
  const [isMatchesAutoPlay, setIsMatchesAutoPlay] = useState(true);

  // 1. Efecto Auto-advance de 5 segundos para Carrusel de Tablas
  useEffect(() => {
    if (!isTableAutoPlay) return;
    const interval = setInterval(() => {
      setActiveTableIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [isTableAutoPlay]);

  // 2. Efecto Auto-advance de 5 segundos para Carrusel de Próximas Fechas
  useEffect(() => {
    if (!isMatchesAutoPlay) return;
    const interval = setInterval(() => {
      setActiveMatchesIndex((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, [isMatchesAutoPlay]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        {/* Title skeleton */}
        <div className="w-[280px] h-12 bg-superficie border border-gris-borde rounded-md skeleton-anim mx-auto mb-4"></div>
        {/* Carousel 1 skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-64 rounded-md bg-superficie border border-gris-borde skeleton-anim"></div>
          <div className="h-64 rounded-md bg-superficie border border-gris-borde skeleton-anim"></div>
          <div className="h-64 rounded-md bg-superficie border border-gris-borde skeleton-anim"></div>
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

  // Categorías fijas de la app
  const zonas = ['Zona A', 'Zona B', '+30'];

  // Obtener y mapear los datos de las posiciones por zona desde las hojas correspondientes
  const getStandingsByZone = (zoneName) => {
    let rawRows = [];
    if (zoneName === 'Zona A') rawRows = tablaZonaA || [];
    else if (zoneName === 'Zona B') rawRows = tablaZonaB || [];
    else if (zoneName === '+30') rawRows = tablaMas30 || [];

    return rawRows.map(row => {
      // Cruzar el equipo_id con la lista de equipos cargada
      const team = equipos.find(e => 
        String(e.id).trim().toLowerCase() === String(row.equipo_id).trim().toLowerCase() ||
        String(e.nombre).trim().toLowerCase() === String(row.equipo_id).trim().toLowerCase()
      );

      const PJ = parseInt(row.pj || 0, 10);
      const GF = parseInt(row.gf || 0, 10);
      const GC = parseInt(row.gc || 0, 10);
      const PTS = parseInt(row.pts || 0, 10);
      const DG = GF - GC; // Recalcular DG en el frontend

      return {
        ...team,
        id: team?.id || row.equipo_id,
        nombre: team?.nombre || row.equipo_id,
        escudo_url: team?.escudo_url || team?.logo || '',
        posicion: row.posicion || '',
        PJ,
        DG,
        PTS
      };
    });
  };

  // Obtener partidos de la próxima fecha desde la hoja ProximaFecha
  const getNextMatchesForZone = (zoneName) => {
    return (proximaFecha || []).filter(row => 
      String(row.zona).trim().toLowerCase() === zoneName.trim().toLowerCase()
    );
  };

  return (
    <div className="flex flex-col gap-10">
      {/* 1. TÍTULO PRINCIPAL (Sin tarjeta contenedora, grande, Anton) */}
      <div className="text-center py-4 mb-2">
        <h1 className="font-anton text-4xl md:text-6xl tracking-wider text-blanco uppercase mb-1">
          Torneo Potrero
        </h1>
        <p className="font-inter text-[10px] md:text-xs text-gris-secundario uppercase tracking-widest font-semibold">
          La plataforma oficial del fútbol amateur.
        </p>
      </div>

      {/* 2. SECCIÓN DE TABLAS POR ZONA */}
      <div>
        <div className="mb-6 border-b border-gris-borde pb-2">
          <span className="text-blanco font-montserrat font-bold text-xs md:text-sm tracking-widest uppercase">
            Tablas de Posiciones
          </span>
        </div>

        {/* Carrusel / Grid Responsivo */}
        <div className="relative">
          <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
            {zonas.map((zona, idx) => {
              const zoneStandings = getStandingsByZone(zona);
              const isActive = activeTableIndex === idx;

              return (
                <div 
                  key={zona} 
                  className={`${isActive ? 'block' : 'hidden'} md:block`}
                >
                  <Card className="h-full flex flex-col justify-between">
                    <div>
                      {/* Nombre de la zona con fondo transparente y letra blanca */}
                      <div className="mb-4 border-b border-gris-borde/40 pb-2">
                        <span className="text-blanco font-montserrat font-bold text-[11px] md:text-xs tracking-widest uppercase">
                          {zona}
                        </span>
                      </div>

                      {/* Lista de equipos */}
                      {zoneStandings.length === 0 ? (
                        <p className="text-xs text-gris-secundario italic py-4">No hay datos en esta zona.</p>
                      ) : (
                        <div className="flex flex-col gap-2 mt-3">
                          {zoneStandings.slice(0, 4).map((team, index) => (
                            <div key={team.id || team.nombre} className="flex justify-between items-center py-1 border-b border-gris-borde/20 last:border-b-0 gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="font-anton text-[10px] text-gris-secundario w-4 text-center flex-shrink-0">{team.posicion || (index + 1)}</span>
                                <span className="font-montserrat font-bold text-blanco tracking-wide uppercase text-[9px] md:text-[10px] leading-[1.1] whitespace-normal break-words">
                                  {team.nombre}
                                </span>
                              </div>
                              <span className="bg-superficie-destacada border border-gris-borde font-anton text-[11px] text-blanco px-2 py-0.5 rounded-sm w-[35px] text-center flex-shrink-0">
                                {team.PTS}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link 
                      to={`/tabla?zona=${encodeURIComponent(zona)}`}
                      className="block text-center text-[9px] font-montserrat font-bold tracking-wider text-acento uppercase mt-5 hover:text-blanco transition-colors border-t border-gris-borde pt-3"
                    >
                      Ver tabla completa &rarr;
                    </Link>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Controles del Carrusel (Sólo Mobile) */}
          <div className="flex flex-col items-center gap-2.5 mt-4 md:hidden">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => {
                  setActiveTableIndex((prev) => (prev - 1 + 3) % 3);
                  setIsTableAutoPlay(false);
                }}
                className="w-8 h-8 rounded-sm bg-superficie border border-gris-borde text-blanco font-bold hover:border-acento transition-colors flex items-center justify-center text-xs"
              >
                &larr;
              </button>
              <div className="flex gap-2">
                {zonas.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveTableIndex(i);
                      setIsTableAutoPlay(false);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      activeTableIndex === i ? 'bg-acento' : 'bg-gris-borde'
                    }`}
                  />
                ))}
              </div>
              <button 
                onClick={() => {
                  setActiveTableIndex((prev) => (prev + 1) % 3);
                  setIsTableAutoPlay(false);
                }}
                className="w-8 h-8 rounded-sm bg-superficie border border-gris-borde text-blanco font-bold hover:border-acento transition-colors flex items-center justify-center text-xs"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECCIÓN DE PRÓXIMAS FECHAS */}
      <div>
        <div className="mb-6 border-b border-gris-borde pb-2">
          <span className="text-blanco font-montserrat font-bold text-xs md:text-sm tracking-widest uppercase">
            Próximos Partidos
          </span>
        </div>

        {/* Carrusel / Grid Responsivo */}
        <div className="relative">
          <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
            {zonas.map((zona, idx) => {
              const zoneMatches = getNextMatchesForZone(zona);
              const isActive = activeMatchesIndex === idx;

              // Helper local para formatear el título de la fecha (ej: "3" -> "FECHA 3")
              const formatFechaTitle = (title) => {
                if (!title) return '';
                const str = String(title).trim();
                if (str.toLowerCase().startsWith('fecha')) {
                  return str.toUpperCase();
                }
                return `FECHA ${str}`.toUpperCase();
              };

              return (
                <div 
                  key={zona} 
                  className={`${isActive ? 'block' : 'hidden'} md:block`}
                >
                  <Card className="h-full flex flex-col justify-between">
                    <div>
                      {/* Nombre de la zona con fondo transparente y letra blanca */}
                      <div className="mb-2 border-b border-gris-borde/40 pb-1.5">
                        <span className="text-blanco font-montserrat font-bold text-[11px] md:text-xs tracking-widest uppercase">
                          {zona}
                        </span>
                      </div>

                      {zoneMatches.length > 0 && (
                        <div className="text-[9px] font-montserrat font-bold tracking-wider text-gris-secundario uppercase mb-3 mt-1.5">
                          {formatFechaTitle(zoneMatches[0].titulo_fecha)}
                        </div>
                      )}

                      {/* Lista de partidos */}
                      {zoneMatches.length === 0 ? (
                        <p className="text-xs text-gris-secundario italic py-4">No hay partidos programados.</p>
                      ) : (
                        <div className="flex flex-col divide-y divide-gris-borde/20">
                          {zoneMatches.map((partido, pIdx) => {
                            // Soporte robusto de claves con fallback para equipo local/visitante
                            const rawLocal = partido.equipo_local_id || partido.equipo_local || partido.local || '';
                            const rawVisitante = partido.equipo_visitante_id || partido.equipo_visitante || partido.visitante || '';

                            const localT = equipos.find(e => 
                              rawLocal && (
                                String(e.id).trim().toLowerCase() === String(rawLocal).trim().toLowerCase() ||
                                String(e.nombre).trim().toLowerCase() === String(rawLocal).trim().toLowerCase()
                              )
                            );
                            const visitanteT = equipos.find(e => 
                              rawVisitante && (
                                String(e.id).trim().toLowerCase() === String(rawVisitante).trim().toLowerCase() ||
                                String(e.nombre).trim().toLowerCase() === String(rawVisitante).trim().toLowerCase()
                              )
                            );
                            
                            const localN = localT?.nombre || rawLocal;
                            const visitanteN = visitanteT?.nombre || rawVisitante;

                            return (
                              <div key={partido.id || pIdx} className="py-2.5 flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                  {/* Local */}
                                  <div className="w-[42%] flex items-center justify-end gap-1.5 text-right">
                                    <span className="font-montserrat font-bold tracking-wide uppercase text-[8px] md:text-[9px] text-blanco leading-[1.1] whitespace-normal break-words">{localN}</span>
                                    <TeamEscudo equipo={localT || { nombre: localN }} className="w-5 h-5 flex-shrink-0" textClassName="text-[7px]" padding="p-0.5" />
                                  </div>
                                  
                                  {/* VS */}
                                  <span className="w-[16%] text-center font-montserrat font-bold text-[8px] tracking-widest text-acento">VS</span>
                                  
                                  {/* Visitante */}
                                  <div className="w-[42%] flex items-center justify-start gap-1.5 text-left">
                                    <TeamEscudo equipo={visitanteT || { nombre: visitanteN }} className="w-5 h-5 flex-shrink-0" textClassName="text-[7px]" padding="p-0.5" />
                                    <span className="font-montserrat font-bold tracking-wide uppercase text-[8px] md:text-[9px] text-blanco leading-[1.1] whitespace-normal break-words">{visitanteN}</span>
                                  </div>
                                </div>

                                {/* Horario */}
                                <div className="text-center text-[8px] font-montserrat font-semibold tracking-wider text-gris-secundario uppercase mt-0.5">
                                  {partido.hora ? `⏰ ${partido.hora} hs` : ''}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Controles del Carrusel (Sólo Mobile) */}
          <div className="flex flex-col items-center gap-2.5 mt-4 md:hidden">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => {
                  setActiveMatchesIndex((prev) => (prev - 1 + 3) % 3);
                  setIsMatchesAutoPlay(false);
                }}
                className="w-8 h-8 rounded-sm bg-superficie border border-gris-borde text-blanco font-bold hover:border-acento transition-colors flex items-center justify-center text-xs"
              >
                &larr;
              </button>
              <div className="flex gap-2">
                {zonas.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveMatchesIndex(i);
                      setIsMatchesAutoPlay(false);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      activeMatchesIndex === i ? 'bg-acento' : 'bg-gris-borde'
                    }`}
                  />
                ))}
              </div>
              <button 
                onClick={() => {
                  setActiveMatchesIndex((prev) => (prev + 1) % 3);
                  setIsMatchesAutoPlay(false);
                }}
                className="w-8 h-8 rounded-sm bg-superficie border border-gris-borde text-blanco font-bold hover:border-acento transition-colors flex items-center justify-center text-xs"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
