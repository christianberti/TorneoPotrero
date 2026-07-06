import React from 'react';
import TeamEscudo from './TeamEscudo';

export default function TablaPosiciones({ tabla = [] }) {
  return (
    <div className="w-full overflow-hidden border border-gris-borde rounded-md bg-superficie">
      <table className="w-full border-collapse text-sm font-inter table-fixed">
        <thead>
          <tr className="border-b border-gris-borde">
            {/* # Posición */}
            <th className="px-1 py-2 md:px-2 md:py-3 bg-fondo text-center text-[9px] md:text-[10px] font-montserrat font-bold tracking-wider text-gris-secundario uppercase w-[24px] md:w-[45px]">
              #
            </th>
            {/* Escudo + Nombre Equipo */}
            <th className="px-1.5 py-2 md:px-3 md:py-3 bg-fondo text-left text-[9px] md:text-[10px] font-montserrat font-bold tracking-wider text-gris-secundario uppercase">
              Equipo
            </th>
            {/* PTS Column (highlighted in black color bg-[#0C0C0C], placed before other stats) */}
            <th className="px-1 py-2 md:px-3 md:py-3 bg-[#0C0C0C] border-l border-r border-gris-borde/40 text-center text-[10px] md:text-[11px] font-montserrat font-bold tracking-wider text-blanco uppercase w-[35px] md:w-[50px]">
              PTS
            </th>
            {/* Other Stats */}
            {['PJ', 'PG', 'PE', 'PP', 'GF', 'GC', 'DG'].map(h => (
              <th 
                key={h} 
                className="px-0.5 py-2 md:px-2 md:py-3 bg-fondo text-center text-[9px] md:text-[10px] font-montserrat font-bold tracking-wider text-gris-secundario uppercase w-[24px] md:w-[35px]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gris-borde">
          {tabla.map((team, index) => (
            <tr 
              key={team.id || team.nombre} 
              className="hover:bg-superficie-destacada/5 transition-all duration-200"
            >
              {/* Posición */}
              <td className="px-1 py-2 md:px-2 md:py-3 text-center text-[10px] md:text-xs font-semibold text-gris-secundario">
                {team.posicion || (index + 1)}
              </td>
              {/* Equipo Info */}
              <td className="px-1.5 py-2 md:px-3 md:py-3 text-left">
                <div className="flex items-center gap-1.5 md:gap-2.5">
                  <TeamEscudo 
                    equipo={team} 
                    className="w-4 h-4 md:w-6 md:h-6 flex-shrink-0" 
                    textClassName="text-[6px] md:text-[8px]" 
                    padding="p-0" 
                  />
                  <span className="font-montserrat font-bold tracking-wide uppercase text-[8px] xs:text-[9px] md:text-xs text-blanco leading-[1.1] whitespace-normal break-words">
                    {team.nombre}
                  </span>
                </div>
              </td>
              {/* PTS (placed before rest of cols, with darker bg-[#0C0C0C]) */}
              <td className="px-1 py-2 md:px-3 md:py-3 text-center bg-[#0C0C0C] border-l border-r border-gris-borde/30 font-anton text-xs md:text-base text-blanco">
                {team.PTS}
              </td>
              {/* PJ, PG, PE, PP, GF, GC, DG */}
              <td className="px-0.5 py-2 md:px-2 md:py-3 text-center text-[10px] md:text-xs text-gris-secundario">{team.PJ}</td>
              <td className="px-0.5 py-2 md:px-2 md:py-3 text-center text-[10px] md:text-xs text-gris-secundario">{team.PG}</td>
              <td className="px-0.5 py-2 md:px-2 md:py-3 text-center text-[10px] md:text-xs text-gris-secundario">{team.PE}</td>
              <td className="px-0.5 py-2 md:px-2 md:py-3 text-center text-[10px] md:text-xs text-gris-secundario">{team.PP}</td>
              <td className="px-0.5 py-2 md:px-2 md:py-3 text-center text-[10px] md:text-xs text-gris-secundario">{team.GF}</td>
              <td className="px-0.5 py-2 md:px-2 md:py-3 text-center text-[10px] md:text-xs text-gris-secundario">{team.GC}</td>
              <td className={`px-0.5 py-2 md:px-2 md:py-3 text-center text-[10px] md:text-xs font-semibold ${
                team.DG > 0 ? 'text-emerald-400' : team.DG < 0 ? 'text-alerta' : 'text-gris-secundario'
              }`}>
                {team.DG > 0 ? `+${team.DG}` : team.DG}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
