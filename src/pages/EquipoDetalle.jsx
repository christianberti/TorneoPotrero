import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTorneoData } from '../hooks/useTorneoData';
import Badge from '../components/ui/Badge';
import TeamEscudo from '../components/TeamEscudo';

export default function EquipoDetalle() {
  const { id } = useParams();
  const { 
    equipos, 
    tablaZonaA, 
    tablaZonaB, 
    tablaMas30, 
    loading, 
    error 
  } = useTorneoData();

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {/* Profile Card Skeleton */}
        <div className="w-full h-48 rounded-md bg-superficie border border-gris-borde skeleton-anim"></div>
        {/* Stats Skeleton */}
        <div className="w-full h-24 rounded-md bg-superficie border border-gris-borde skeleton-anim"></div>
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

  // Buscar equipo por ID o Nombre
  const team = equipos.find(e => 
    String(e.id) === String(id) || 
    String(e.nombre).trim().toLowerCase() === String(id).trim().toLowerCase()
  );

  if (!team) {
    return (
      <div className="p-5 border border-gris-borde bg-superficie rounded-md text-center">
        <h4 className="font-montserrat font-bold tracking-wider uppercase text-xs mb-2 text-blanco">Equipo no encontrado</h4>
        <p className="text-xs font-inter text-gris-secundario mb-4">El equipo "{id}" no existe en el torneo.</p>
        <Link to="/equipos" className="px-4 py-2 bg-blanco text-fondo font-montserrat font-bold text-xs tracking-wider uppercase rounded-sm hover:bg-gris-secundario transition-colors">
          Volver a Equipos
        </Link>
      </div>
    );
  }

  // 1. Determinar de qué hoja de posiciones buscar según la zona/categoría del equipo
  const cat = String(team.categoria || team.categoría || '').trim().toLowerCase();
  let rawStandings = [];
  if (cat.includes('zona a') || cat === 'a') rawStandings = tablaZonaA || [];
  else if (cat.includes('zona b') || cat === 'b') rawStandings = tablaZonaB || [];
  else if (cat.includes('+30') || cat.includes('30')) rawStandings = tablaMas30 || [];

  // 2. Buscar la fila correspondiente al equipo en las posiciones
  const row = rawStandings.find(r => 
    String(r.equipo_id).trim().toLowerCase() === String(team.id).trim().toLowerCase() ||
    String(r.equipo_id).trim().toLowerCase() === String(team.nombre).trim().toLowerCase()
  );

  // 3. Extraer y recalcular estadísticas de las posiciones del Sheet
  const PJ = row ? parseInt(row.pj || 0, 10) : 0;
  const PG = row ? parseInt(row.pg || 0, 10) : 0;
  const PE = row ? parseInt(row.pe || 0, 10) : 0;
  const PP = row ? parseInt(row.pp || 0, 10) : 0;
  const GF = row ? parseInt(row.gf || 0, 10) : 0;
  const GC = row ? parseInt(row.gc || 0, 10) : 0;
  const PTS = row ? parseInt(row.pts || 0, 10) : 0;
  const DG = GF - GC; // Recalcular DG
  const rank = row ? (row.posicion || '') : '';

  const delegado = team.delegado || team.contacto || 'No especificado';

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <Link to="/equipos" className="text-[10px] font-montserrat font-bold tracking-wider text-acento uppercase hover:text-blanco transition-colors">
          &larr; Volver a Equipos
        </Link>
      </div>

      {/* Perfil de Equipo */}
      <div className="bg-superficie border border-gris-borde rounded-md p-6 flex flex-col items-center text-center gap-4">
        <TeamEscudo equipo={team} className="w-24 h-24" textClassName="text-3xl" />
        
        <div>
          <h1 className="font-anton text-3xl tracking-wider text-blanco uppercase mb-1">{team.nombre}</h1>
          {team.descripcion && (
            <p className="font-inter text-xs text-gris-secundario max-w-md mx-auto mt-2 leading-relaxed">
              {team.descripcion}
            </p>
          )}
          <div className="mt-3 flex gap-2 justify-center">
            {rank && <Badge text={`Posición #${rank}`} type="info" />}
            {(team.categoria || team.categoría) && (
              <Badge text={team.categoria || team.categoría} type="default" />
            )}
          </div>
        </div>

        {/* Contacto Delegado (Sin teléfono) */}
        <div className="mt-2 text-left bg-superficie-destacada border border-gris-borde rounded-sm p-4 w-full max-w-sm flex flex-col gap-2 text-xs font-inter text-gris-secundario">
          <div className="text-center sm:text-left">
            <strong className="font-montserrat text-[10px] tracking-wider uppercase text-blanco mr-1">👤 Delegado:</strong> {delegado}
          </div>
        </div>

        {/* Estadísticas de Posición Recalculadas */}
        <div className="w-full max-w-md mt-4 border-t border-gris-borde/40 pt-5">
          <div className="mb-4 text-center sm:text-left border-b border-gris-borde/40 pb-2">
            <span className="text-blanco font-montserrat font-bold text-[11px] md:text-xs tracking-widest uppercase">
              Estadísticas en la Tabla
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 w-full text-[10px] font-montserrat font-bold text-gris-secundario">
            {/* PTS en color negro destacado bg-[#0C0C0C] */}
            <div className="flex flex-col items-center bg-[#0C0C0C] border border-gris-borde/60 py-2 rounded-sm">
              <span className="font-anton text-sm text-blanco">{PTS}</span>
              <span className="text-[7px] tracking-widest text-acento mt-0.5">PTS</span>
            </div>
            <div className="flex flex-col items-center bg-superficie-destacada border border-gris-borde py-2 rounded-sm">
              <span className="font-anton text-sm text-blanco">{PJ}</span>
              <span className="text-[7px] tracking-widest text-acento mt-0.5">PJ</span>
            </div>
            <div className="flex flex-col items-center bg-superficie-destacada border border-gris-borde py-2 rounded-sm">
              <span className="font-anton text-sm text-blanco">{PG}</span>
              <span className="text-[7px] tracking-widest text-acento mt-0.5">PG</span>
            </div>
            <div className="flex flex-col items-center bg-superficie-destacada border border-gris-borde py-2 rounded-sm">
              <span className="font-anton text-sm text-blanco">{PE}</span>
              <span className="text-[7px] tracking-widest text-acento mt-0.5">PE</span>
            </div>
            <div className="flex flex-col items-center bg-superficie-destacada border border-gris-borde py-2 rounded-sm">
              <span className="font-anton text-sm text-blanco">{PP}</span>
              <span className="text-[7px] tracking-widest text-acento mt-0.5">PP</span>
            </div>
            <div className="flex flex-col items-center bg-superficie-destacada border border-gris-borde py-2 rounded-sm">
              <span className="font-anton text-sm text-blanco">{GF}</span>
              <span className="text-[7px] tracking-widest text-acento mt-0.5">GF</span>
            </div>
            <div className="flex flex-col items-center bg-superficie-destacada border border-gris-borde py-2 rounded-sm">
              <span className="font-anton text-sm text-blanco">{GC}</span>
              <span className="text-[7px] tracking-widest text-acento mt-0.5">GC</span>
            </div>
            <div className="flex flex-col items-center bg-superficie-destacada border border-gris-borde py-2 rounded-sm">
              <span className="font-anton text-sm text-blanco">{DG > 0 ? `+${DG}` : DG}</span>
              <span className="text-[7px] tracking-widest text-acento mt-0.5">DG</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
