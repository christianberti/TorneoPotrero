import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTorneoData } from '../hooks/useTorneoData';
import TablaPosiciones from '../components/TablaPosiciones';
import FilterTabs from '../components/ui/FilterTabs';

export default function Tabla() {
  const { 
    equipos, 
    tablaZonaA, 
    tablaZonaB, 
    tablaMas30, 
    loading, 
    error 
  } = useTorneoData();
  const [searchParams] = useSearchParams();
  
  // Inicializar la zona a partir de la query string (ej: ?zona=Zona%20A) o por defecto en 'Zona A'
  const initialZona = searchParams.get('zona') || 'Zona A';
  const [activeZona, setActiveZona] = useState(initialZona);

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
        <div className="w-full h-64 bg-superficie border border-gris-borde rounded-md skeleton-anim"></div>
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

  // 1. Seleccionar los datos correspondientes según la pestaña activa
  let rawRows = [];
  if (activeZona === 'Zona A') rawRows = tablaZonaA || [];
  else if (activeZona === 'Zona B') rawRows = tablaZonaB || [];
  else if (activeZona === '+30') rawRows = tablaMas30 || [];

  // 2. Mapear, cruzar y recalcular estadísticas de las posiciones
  const tablaFiltrada = rawRows.map(row => {
    // Intentar encontrar el equipo original por id o nombre
    const team = equipos.find(e => 
      String(e.id).trim().toLowerCase() === String(row.equipo_id).trim().toLowerCase() ||
      String(e.nombre).trim().toLowerCase() === String(row.equipo_id).trim().toLowerCase()
    );

    const PJ = parseInt(row.pj || 0, 10);
    const PG = parseInt(row.pg || 0, 10);
    const PE = parseInt(row.pe || 0, 10);
    const PP = parseInt(row.pp || 0, 10);
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
      PG,
      PE,
      PP,
      GF,
      GC,
      DG,
      PTS
    };
  });

  const categories = [
    { id: 'Zona A', label: 'Zona A' },
    { id: 'Zona B', label: 'Zona B' },
    { id: '+30', label: '+30' }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-anton text-3xl tracking-wider text-blanco uppercase mb-1">Posiciones</h1>
        <p className="font-inter text-xs text-gris-secundario uppercase tracking-wide">Clasificación general de los equipos del torneo.</p>
      </div>

      <FilterTabs 
        tabs={categories} 
        activeTabId={activeZona} 
        onTabChange={setActiveZona} 
      />

      {tablaFiltrada.length === 0 ? (
        <p className="text-center text-xs text-gris-secundario italic py-10 border border-dashed border-gris-borde rounded-md bg-superficie">
          No hay datos para esta zona en el Google Sheet.
        </p>
      ) : (
        <TablaPosiciones tabla={tablaFiltrada} />
      )}
    </div>
  );
}
