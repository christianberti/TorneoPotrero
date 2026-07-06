import React from 'react';
import TeamEscudo from './TeamEscudo';

export default function JugadorRow({ jugador, index, teamName = '', statValue, showTeam = true }) {
  return (
    <tr className="hover:bg-superficie-destacada/10 transition-colors duration-150">
      <td className="px-4 py-3 text-center text-xs font-semibold text-gris-secundario w-[50px]">{index + 1}</td>
      <td className="px-4 py-3 text-left">
        <span className="font-montserrat font-bold tracking-wide uppercase text-xs text-blanco">
          {jugador.nombre || 'Jugador Sin Nombre'}
        </span>
        {jugador.posicion && (
          <span className="block text-[9px] text-gris-secundario font-inter mt-0.5">
            {jugador.posicion}
          </span>
        )}
      </td>
      {showTeam && (
        <td className="px-4 py-3 text-left text-xs text-gris-secundario">
          <div className="flex items-center gap-1.5">
            {jugador.teamObj && (
              <TeamEscudo 
                equipo={jugador.teamObj} 
                className="w-4 h-4 flex-shrink-0" 
                textClassName="text-[6px]" 
              />
            )}
            <span className="font-montserrat font-semibold uppercase text-[10px] md:text-xs text-gris-secundario">
              {teamName || jugador.equipo || 'Independiente'}
            </span>
          </div>
        </td>
      )}
      <td className="px-4 py-3 text-center bg-superficie-destacada font-anton text-base text-blanco w-[80px] border-l border-gris-borde/30">
        {statValue ?? 0}
      </td>
    </tr>
  );
}
