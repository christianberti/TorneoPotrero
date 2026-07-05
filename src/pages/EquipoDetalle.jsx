import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTorneoData } from '../hooks/useTorneoData';
import { calcularTabla } from '../utils/calcularTabla';
import PartidoCard from '../components/PartidoCard';
import Badge from '../components/ui/Badge';
import TeamEscudo from '../components/TeamEscudo';

export default function EquipoDetalle() {
  const { id } = useParams();
  const { equipos, jugadores, fixture, resultados, loading, error } = useTorneoData();

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {/* Profile Card Skeleton */}
        <div className="w-full h-48 rounded-md bg-superficie border border-gris-borde skeleton-anim"></div>
        {/* Roster Skeleton */}
        <div className="w-full h-32 rounded-md bg-superficie border border-gris-borde skeleton-anim"></div>
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

  // Calcular tabla y obtener posición/estadísticas
  const standings = calcularTabla(equipos, fixture, resultados);
  const statsIndex = standings.findIndex(s => 
    String(s.id) === String(team.id) || 
    String(s.nombre).trim().toLowerCase() === String(team.nombre).trim().toLowerCase()
  );
  const stats = statsIndex !== -1 ? standings[statsIndex] : null;
  const rank = statsIndex !== -1 ? statsIndex + 1 : '-';

  // Filtrar y ordenar alfabéticamente los jugadores de este equipo
  const plantel = jugadores
    .filter(j => 
      (j.equipoId && String(j.equipoId) === String(team.id)) ||
      (j.equipo && String(j.equipo).trim().toLowerCase() === String(team.id).trim().toLowerCase()) ||
      (j.equipo && String(j.equipo).trim().toLowerCase() === String(team.nombre).trim().toLowerCase())
    )
    .sort((a, b) => {
      const nameA = String(a.nombre || '').trim();
      const nameB = String(b.nombre || '').trim();
      return nameA.localeCompare(nameB);
    });

  // Filtrar partidos del equipo
  const partidosEquipo = fixture.filter(p => 
    String(p.local) === String(team.id) || 
    String(p.local).trim().toLowerCase() === String(team.nombre).trim().toLowerCase() ||
    String(p.visitante) === String(team.id) || 
    String(p.visitante).trim().toLowerCase() === String(team.nombre).trim().toLowerCase()
  );

  const delegado = team.delegado || team.contacto || 'No especificado';
  const telefono = team.telefono || team.teléfono || team.celular || 'No especificado';

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <Link to="/equipos" className="text-[10px] font-montserrat font-bold tracking-wider text-acento uppercase hover:text-blanco transition-colors">
          &larr; Volver a Equipos
        </Link>
      </div>

      {/* Perfil de Equipo */}
      <div className="bg-superficie border border-gris-borde rounded-md p-6 flex flex-col items-center text-center gap-4">
        <TeamEscudo equipo={team} className="w-24 h-24" textClassName="text-3xl" rounded="rounded-md" padding="p-2" />
        
        <div>
          <h1 className="font-anton text-3xl tracking-wider text-blanco uppercase mb-1">{team.nombre}</h1>
          {team.descripcion && (
            <p className="font-inter text-xs text-gris-secundario max-w-md mx-auto mt-2 leading-relaxed">
              {team.descripcion}
            </p>
          )}
          <div className="mt-3 flex gap-2 justify-center">
            <Badge text={`Posición #${rank}`} type="info" />
            {(team.categoria || team.categoría) && (
              <Badge text={team.categoria || team.categoría} type="default" />
            )}
          </div>
        </div>

        {/* Contacto Delegado */}
        <div className="mt-2 text-left bg-superficie-destacada border border-gris-borde rounded-sm p-4 w-full max-w-sm flex flex-col gap-2 text-xs font-inter text-gris-secundario">
          <div><strong className="font-montserrat text-[10px] tracking-wider uppercase text-blanco mr-1">👤 Delegado:</strong> {delegado}</div>
          <div><strong className="font-montserrat text-[10px] tracking-wider uppercase text-blanco mr-1">📞 Teléfono:</strong> {telefono}</div>
        </div>

        {/* Estadísticas de Posición */}
        {stats && (
          <div className="grid grid-cols-5 gap-2 w-full max-w-sm mt-2 text-[10px] font-montserrat font-bold text-gris-secundario">
            <div className="flex flex-col items-center bg-superficie-destacada border border-gris-borde py-1.5 rounded-sm">
              <span className="font-anton text-sm text-blanco">{stats.PTS}</span>
              <span className="text-[7px] tracking-widest text-acento">PTS</span>
            </div>
            <div className="flex flex-col items-center bg-superficie-destacada border border-gris-borde py-1.5 rounded-sm">
              <span className="font-anton text-sm text-blanco">{stats.PJ}</span>
              <span className="text-[7px] tracking-widest text-acento">PJ</span>
            </div>
            <div className="flex flex-col items-center bg-superficie-destacada border border-gris-borde py-1.5 rounded-sm">
              <span className="font-anton text-sm text-blanco">{stats.PG}</span>
              <span className="text-[7px] tracking-widest text-acento">PG</span>
            </div>
            <div className="flex flex-col items-center bg-superficie-destacada border border-gris-borde py-1.5 rounded-sm">
              <span className="font-anton text-sm text-blanco">{stats.PE}</span>
              <span className="text-[7px] tracking-widest text-acento">PE</span>
            </div>
            <div className="flex flex-col items-center bg-superficie-destacada border border-gris-borde py-1.5 rounded-sm">
              <span className="font-anton text-sm text-blanco">{stats.PP}</span>
              <span className="text-[7px] tracking-widest text-acento">PP</span>
            </div>
          </div>
        )}
      </div>

      {/* Partidos */}
      <div>
        <div className="mb-4 border-b border-gris-borde pb-2">
          <span className="text-blanco font-montserrat font-bold text-xs md:text-sm tracking-widest uppercase">
            Partidos
          </span>
        </div>
        {partidosEquipo.length === 0 ? (
          <p className="text-center text-xs text-gris-secundario italic py-4">No hay partidos programados para este equipo.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {partidosEquipo.map((partido, index) => (
              <PartidoCard 
                key={partido.id || index} 
                partido={partido} 
                resultados={resultados} 
                equipos={equipos} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Plantel */}
      <div>
        <div className="mb-4 border-b border-gris-borde pb-2">
          <span className="text-blanco font-montserrat font-bold text-xs md:text-sm tracking-widest uppercase">
            Plantel de Jugadores
          </span>
        </div>
        {plantel.length === 0 ? (
          <p className="text-center text-xs text-gris-secundario italic py-4">No hay jugadores registrados en este equipo.</p>
        ) : (
          <div className="w-full overflow-x-auto border border-gris-borde rounded-md bg-superficie no-scrollbar">
            <table className="w-full border-collapse text-sm font-inter min-w-[500px]">
              <thead>
                <tr className="border-b border-gris-borde">
                  <th className="px-4 py-3 bg-fondo text-left text-[10px] font-montserrat font-bold tracking-wider text-gris-secundario uppercase">Nombre</th>
                  <th className="px-4 py-3 bg-fondo text-left text-[10px] font-montserrat font-bold tracking-wider text-gris-secundario uppercase">Posición</th>
                  <th className="px-3 py-3 bg-fondo text-center text-[10px] font-montserrat font-bold tracking-wider text-gris-secundario uppercase w-[60px]">Goles</th>
                  <th className="px-3 py-3 bg-fondo text-center text-[10px] font-montserrat font-bold tracking-wider text-gris-secundario uppercase w-[50px]">🟨</th>
                  <th className="px-3 py-3 bg-fondo text-center text-[10px] font-montserrat font-bold tracking-wider text-gris-secundario uppercase w-[50px]">🟥</th>
                  <th className="px-3 py-3 bg-superficie-destacada text-center text-[10px] font-montserrat font-bold tracking-wider text-blanco uppercase w-[60px]">MVP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gris-borde">
                {plantel.map((player) => (
                  <tr key={player.id || player.nombre} className="hover:bg-superficie-destacada/10 transition-colors duration-150">
                    <td className="px-4 py-3 text-left font-montserrat font-bold tracking-wide uppercase text-xs text-blanco">{player.nombre}</td>
                    <td className="px-4 py-3 text-left text-xs text-gris-secundario">{player.posicion || 'N/A'}</td>
                    <td className="px-3 py-3 text-center text-xs font-semibold text-blanco">{player.goles || 0}</td>
                    <td className="px-3 py-3 text-center text-xs text-gris-secundario">{player.amarillas || 0}</td>
                    <td className={`px-3 py-3 text-center text-xs font-bold ${player.rojas > 0 ? 'text-alerta' : 'text-gris-secundario'}`}>
                      {player.rojas || 0}
                    </td>
                    <td className="px-3 py-3 text-center bg-superficie-destacada font-anton text-base text-blanco border-l border-gris-borde/30">
                      {player.mvps || player.mvp || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
