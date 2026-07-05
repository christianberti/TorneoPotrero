import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTorneoData } from '../hooks/useTorneoData';
import Badge from '../components/ui/Badge';
import TeamEscudo from '../components/TeamEscudo';

export default function PartidoDetalle() {
  const { id } = useParams();
  const { equipos, fixture, resultados, loading, error } = useTorneoData();

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {/* Board skeleton */}
        <div className="w-full h-56 bg-superficie border border-gris-borde rounded-md skeleton-anim"></div>
        {/* Details skeleton */}
        <div className="w-full h-32 bg-superficie border border-gris-borde rounded-md skeleton-anim"></div>
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

  // Buscar el partido en el fixture
  const partido = fixture.find(p => String(p.id) === String(id));

  if (!partido) {
    return (
      <div className="p-5 border border-gris-borde bg-superficie rounded-md text-center">
        <h4 className="font-montserrat font-bold tracking-wider uppercase text-xs mb-2 text-blanco">Partido no encontrado</h4>
        <p className="text-xs font-inter text-gris-secundario mb-4">El partido con ID "{id}" no existe en el fixture.</p>
        <Link to="/fixture" className="px-4 py-2 bg-blanco text-fondo font-montserrat font-bold text-xs tracking-wider uppercase rounded-sm hover:bg-gris-secundario transition-colors">
          Volver al Fixture
        </Link>
      </div>
    );
  }

  // Buscar resultado del partido
  const resultado = resultados.find(r => 
    (r.partidoId && String(r.partidoId) === String(partido.id)) ||
    (r.id && String(r.id) === String(partido.id)) ||
    (String(r.local || r.equipoLocal).trim().toLowerCase() === String(partido.local).trim().toLowerCase() && 
     String(r.visitante || r.equipoVisitante).trim().toLowerCase() === String(partido.visitante).trim().toLowerCase() && 
     String(r.fecha || '').trim() === String(partido.fecha || '').trim())
  );

  // Obtener goles
  let golesLocal = partido.golesLocal ?? partido.goles_local ?? partido.golesL;
  let golesVisitante = partido.golesVisitante ?? partido.goles_visitante ?? partido.golesV;

  if (resultado) {
    golesLocal = golesLocal ?? resultado.golesLocal ?? resultado.goles_local ?? resultado.golesL;
    golesVisitante = golesVisitante ?? resultado.golesVisitante ?? resultado.goles_visitante ?? resultado.golesV;
  }

  const jugado = golesLocal !== undefined && golesVisitante !== undefined && 
                 golesLocal !== null && golesVisitante !== null && 
                 golesLocal !== '' && golesVisitante !== '' && 
                 !isNaN(parseInt(golesLocal, 10)) && !isNaN(parseInt(golesVisitante, 10));

  // Resolver equipos
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

  // Detalles adicionales
  const mvp = resultado?.mvp || resultado?.jugadorPartido || partido?.mvp;
  const cronica = resultado?.cronica || resultado?.comentarios || resultado?.detalles;

  // Parsers de listas
  const parseList = (str) => {
    if (!str || typeof str !== 'string') return [];
    return str.split(',').map(item => item.trim()).filter(Boolean);
  };

  const golesLocalList = parseList(resultado?.golesLocalDetalle || resultado?.goleadoresLocal || resultado?.goleadoresL || partido?.golesLocalDetalle);
  const golesVisitanteList = parseList(resultado?.golesVisitanteDetalle || resultado?.goleadoresVisitante || resultado?.goleadoresV || partido?.golesVisitanteDetalle);
  
  const amarillasLocalList = parseList(resultado?.amarillasLocal || resultado?.tarjetasAmarillasLocal || resultado?.tarjetasLocal);
  const amarillasVisitanteList = parseList(resultado?.amarillasVisitante || resultado?.tarjetasAmarillasVisitante || resultado?.tarjetasVisitante);
  const rojasLocalList = parseList(resultado?.rojasLocal || resultado?.tarjetasRojasLocal);
  const rojasVisitanteList = parseList(resultado?.rojasVisitante || resultado?.tarjetasRojasVisitante);
  
  const generalTarjetas = parseList(resultado?.tarjetas || resultado?.detallesTarjetas || partido?.tarjetas);

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <Link to="/fixture" className="text-[10px] font-montserrat font-bold tracking-wider text-acento uppercase hover:text-blanco transition-colors">
          &larr; Volver al Fixture
        </Link>
      </div>

      <div className="bg-superficie border border-gris-borde rounded-md p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-center text-[10px] font-montserrat font-bold tracking-wider text-gris-secundario uppercase border-b border-gris-borde pb-3">
          <span>{partido.fecha || 'Jornada'}</span>
          <Badge text={jugado ? 'Finalizado' : 'Próximamente'} type={jugado ? 'success' : 'default'} />
        </div>

        {/* Tablero de resultado */}
        <div className="flex items-center justify-between py-4 my-2">
          {/* Local */}
          <div className="w-[38%] flex flex-col items-center gap-3 text-center">
            {localTeam ? (
              <Link to={`/equipos/${localTeam.id || localTeam.nombre}`}>
                <TeamEscudo equipo={localTeam} className="w-16 h-16" textClassName="text-2xl" rounded="rounded-md" padding="p-2" />
              </Link>
            ) : (
              <TeamEscudo equipo={{ nombre: localNombre }} className="w-16 h-16" textClassName="text-2xl" rounded="rounded-md" padding="p-2" />
            )}
            <span className="font-montserrat font-bold tracking-wide uppercase text-xs md:text-sm text-blanco">{localNombre}</span>
          </div>

          {/* Marcador Caja */}
          <div className="w-[20%] flex justify-center">
            <div className="bg-superficie-destacada border border-gris-borde px-6 py-2.5 rounded-sm flex items-center justify-center gap-4 min-w-[90px]">
              {jugado ? (
                <>
                  <span className="font-anton text-2xl md:text-3xl tracking-wider text-blanco">{golesLocal}</span>
                  <span className="text-acento font-bold text-sm">-</span>
                  <span className="font-anton text-2xl md:text-3xl tracking-wider text-blanco">{golesVisitante}</span>
                </>
              ) : (
                <span className="font-montserrat font-bold text-[10px] tracking-widest text-acento">VS</span>
              )}
            </div>
          </div>

          {/* Visitante */}
          <div className="w-[38%] flex flex-col items-center gap-3 text-center">
            {visitanteTeam ? (
              <Link to={`/equipos/${visitanteTeam.id || visitanteTeam.nombre}`}>
                <TeamEscudo equipo={visitanteTeam} className="w-16 h-16" textClassName="text-2xl" rounded="rounded-md" padding="p-2" />
              </Link>
            ) : (
              <TeamEscudo equipo={{ nombre: visitanteNombre }} className="w-16 h-16" textClassName="text-2xl" rounded="rounded-md" padding="p-2" />
            )}
            <span className="font-montserrat font-bold tracking-wide uppercase text-xs md:text-sm text-blanco">{visitanteNombre}</span>
          </div>
        </div>

        {/* Info Básica */}
        <div className="flex flex-col gap-1 items-center text-[10px] font-montserrat font-bold tracking-wider text-gris-secundario uppercase mt-2">
          {(partido.dia || partido.fechaHora) && (
            <div>📅 {partido.dia || partido.fechaHora} {partido.hora ? `a las ${partido.hora} hs` : ''}</div>
          )}
          {partido.cancha && (
            <div className="bg-superficie-destacada/40 px-2 py-0.5 border border-gris-borde rounded-sm mt-1">📍 Cancha: {partido.cancha}</div>
          )}
        </div>

        {/* Detalle de Goles */}
        {jugado && (golesLocalList.length > 0 || golesVisitanteList.length > 0) && (
          <div className="border-t border-gris-borde pt-5 mt-3">
            <div className="flex justify-center mb-4">
              <span className="text-blanco font-montserrat font-bold text-xs md:text-sm tracking-widest uppercase">
                ⚽ Goleadores
              </span>
            </div>
            <div className="flex justify-between text-xs font-inter">
              <div className="w-[45%] text-right flex flex-col gap-1">
                {golesLocalList.map((g, idx) => (
                  <div key={idx} className="text-gris-secundario">{g}</div>
                ))}
                {golesLocalList.length === 0 && <span className="text-gris-borde italic">-</span>}
              </div>
              <div className="w-[10%]"></div>
              <div className="w-[45%] text-left flex flex-col gap-1">
                {golesVisitanteList.map((g, idx) => (
                  <div key={idx} className="text-gris-secundario">{g}</div>
                ))}
                {golesVisitanteList.length === 0 && <span className="text-gris-borde italic">-</span>}
              </div>
            </div>
          </div>
        )}

        {/* Detalle de Tarjetas */}
        {jugado && (amarillasLocalList.length > 0 || rojasLocalList.length > 0 || 
                    amarillasVisitanteList.length > 0 || rojasVisitanteList.length > 0 || 
                    generalTarjetas.length > 0) && (
          <div className="border-t border-gris-borde pt-5 mt-3">
            <div className="flex justify-center mb-4">
              <span className="text-blanco font-montserrat font-bold text-xs md:text-sm tracking-widest uppercase">
                🟨 Tarjetas
              </span>
            </div>
            {generalTarjetas.length > 0 ? (
              <div className="flex flex-col gap-1 text-xs font-inter text-gris-secundario text-center max-w-sm mx-auto">
                {generalTarjetas.map((t, idx) => (
                  <div key={idx} className="bg-superficie-destacada/30 border border-gris-borde/40 px-3 py-1 rounded-sm">• {t}</div>
                ))}
              </div>
            ) : (
              <div className="flex justify-between text-xs font-inter">
                {/* Local Cards */}
                <div className="w-[45%] text-right flex flex-col gap-1">
                  {amarillasLocalList.map((t, idx) => (
                    <div key={`y-l-${idx}`} className="text-gris-secundario">{t} 🟨</div>
                  ))}
                  {rojasLocalList.map((t, idx) => (
                    <div key={`r-l-${idx}`} className="text-alerta font-semibold">{t} 🟥</div>
                  ))}
                  {amarillasLocalList.length === 0 && rojasLocalList.length === 0 && (
                    <span className="text-gris-borde italic">-</span>
                  )}
                </div>
                <div className="w-[10%]"></div>
                {/* Visitante Cards */}
                <div className="w-[45%] text-left flex flex-col gap-1">
                  {amarillasVisitanteList.map((t, idx) => (
                    <div key={`y-v-${idx}`} className="text-gris-secundario">🟨 {t}</div>
                  ))}
                  {rojasVisitanteList.map((t, idx) => (
                    <div key={`r-v-${idx}`} className="text-alerta font-semibold">🟥 {t}</div>
                  ))}
                  {amarillasVisitanteList.length === 0 && rojasVisitanteList.length === 0 && (
                    <span className="text-gris-borde italic">-</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ficha del Partido */}
        <div className="border-t border-gris-borde pt-5 mt-3">
          <div className="flex justify-center mb-4">
            <span className="text-blanco font-montserrat font-bold text-xs md:text-sm tracking-widest uppercase">
              📋 Ficha del Partido
            </span>
          </div>
          
          <div className="flex flex-col gap-1 max-w-sm mx-auto text-xs font-inter text-gris-secundario">
            {mvp && (
              <div className="flex justify-between py-2 border-b border-gris-borde/40">
                <span className="font-montserrat text-[9px] tracking-wider uppercase text-gris-secundario">⭐ Jugador del Partido (MVP)</span>
                <span className="font-bold text-acento">{mvp}</span>
              </div>
            )}

            {partido.arbitro && (
              <div className="flex justify-between py-2 border-b border-gris-borde/40">
                <span className="font-montserrat text-[9px] tracking-wider uppercase text-gris-secundario">👤 Árbitro</span>
                <span className="font-semibold text-blanco">{partido.arbitro}</span>
              </div>
            )}
          </div>
        </div>

        {/* Crónica */}
        {cronica && (
          <div className="border-t border-gris-borde pt-5 mt-3">
            <div className="flex justify-center mb-4">
              <span className="text-blanco font-montserrat font-bold text-xs md:text-sm tracking-widest uppercase">
                📝 Resumen del Encuentro
              </span>
            </div>
            <p className="text-xs font-inter text-gris-secundario leading-relaxed bg-superficie-destacada border border-gris-borde p-4 rounded-md whitespace-pre-line">
              {cronica}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
