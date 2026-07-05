import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './ui/Card';
import Badge from './ui/Badge';
import TeamEscudo from './TeamEscudo';

export default function PartidoCard({ partido, resultados = [], equipos = [] }) {
  const navigate = useNavigate();

  // Buscar goles
  let golesLocal = partido.golesLocal ?? partido.goles_local ?? partido.golesL;
  let golesVisitante = partido.golesVisitante ?? partido.goles_visitante ?? partido.golesV;

  const res = resultados.find(r => 
    (r.partidoId && String(r.partidoId) === String(partido.id)) ||
    (r.id && String(r.id) === String(partido.id)) ||
    (String(r.local || r.equipoLocal).trim().toLowerCase() === String(partido.local).trim().toLowerCase() && 
     String(r.visitante || r.equipoVisitante).trim().toLowerCase() === String(partido.visitante).trim().toLowerCase() && 
     String(r.fecha || '').trim() === String(partido.fecha || '').trim())
  );

  if (res) {
    golesLocal = golesLocal ?? res.golesLocal ?? res.goles_local ?? res.golesL;
    golesVisitante = golesVisitante ?? res.golesVisitante ?? res.goles_visitante ?? res.golesV;
  }

  const jugado = golesLocal !== undefined && golesVisitante !== undefined && 
                 golesLocal !== null && golesVisitante !== null && 
                 golesLocal !== '' && golesVisitante !== '' && 
                 !isNaN(parseInt(golesLocal, 10)) && !isNaN(parseInt(golesVisitante, 10));

  // Resolver nombres e imágenes de los equipos
  const localTeam = equipos.find(e => 
    String(e.id) === String(partido.local) || 
    String(e.nombre).trim().toLowerCase() === String(partido.local).trim().toLowerCase()
  );
  
  const visitanteTeam = equipos.find(e => 
    String(e.id) === String(partido.visitante) || 
    String(e.nombre).trim().toLowerCase() === String(partido.visitante).trim().toLowerCase()
  );

  const localNombre = localTeam?.nombre || partido.local;
  const visitanteNombre = visitanteTeam?.nombre || partido.visitante;

  const handleCardClick = () => {
    if (partido.id) {
      navigate(`/partidos/${partido.id}`);
    }
  };

  return (
    <Card 
      onClick={partido.id ? handleCardClick : undefined} 
      className="hover:border-acento/40"
    >
      <div className="flex flex-col gap-2.5">
        {/* Header */}
        <div className="flex justify-between items-center text-[10px] font-montserrat font-bold tracking-wider text-gris-secundario uppercase border-b border-gris-borde pb-2">
          <span>{partido.fecha || 'Fecha'}</span>
          <Badge 
            text={jugado ? 'Jugado' : 'Pendiente'} 
            type={jugado ? 'success' : 'default'} 
          />
        </div>

        {/* Marcador */}
        <div className="flex items-center justify-between py-1">
          {/* Local */}
          <div className="w-[38%] flex items-center justify-end gap-2.5 text-right">
            <span className={`text-[11px] md:text-[13px] font-montserrat font-bold tracking-wide uppercase truncate ${
              jugado && parseInt(golesLocal, 10) > parseInt(golesVisitante, 10) ? 'text-blanco' : 'text-gris-secundario'
            }`}>
              {localNombre}
            </span>
             <TeamEscudo equipo={localTeam || { nombre: localNombre }} className="w-8 h-8" textClassName="text-[9px]" />
          </div>

          {/* Goles Box */}
          <div className="w-[20%] flex justify-center">
            <div className="bg-superficie-destacada border border-gris-borde px-3 py-1 rounded-sm flex items-center justify-center gap-2 min-w-[65px]">
              {jugado ? (
                <>
                  <span className="font-anton text-base tracking-wider text-blanco">{golesLocal}</span>
                  <span className="text-acento font-bold text-[10px]">-</span>
                  <span className="font-anton text-base tracking-wider text-blanco">{golesVisitante}</span>
                </>
              ) : (
                <span className="font-montserrat font-bold text-[8px] tracking-widest text-acento">VS</span>
              )}
            </div>
          </div>

          {/* Visitante */}
          <div className="w-[38%] flex items-center justify-start gap-2.5 text-left">
             <TeamEscudo equipo={visitanteTeam || { nombre: visitanteNombre }} className="w-8 h-8" textClassName="text-[9px]" />
            <span className={`text-[11px] md:text-[13px] font-montserrat font-bold tracking-wide uppercase truncate ${
              jugado && parseInt(golesVisitante, 10) > parseInt(golesLocal, 10) ? 'text-blanco' : 'text-gris-secundario'
            }`}>
              {visitanteNombre}
            </span>
          </div>
        </div>

        {/* Footer */}
        {(partido.dia || partido.hora || partido.cancha) && (
          <div className="flex justify-between items-center text-[9px] font-montserrat font-semibold tracking-wider text-gris-secundario uppercase mt-0.5">
            <span>📅 {partido.dia || partido.fechaHora || ''} {partido.hora ? `- ${partido.hora} hs` : ''}</span>
            {partido.cancha && (
              <span className="bg-superficie-destacada/40 px-2 py-0.5 border border-gris-borde rounded-sm">📍 Cancha: {partido.cancha}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
