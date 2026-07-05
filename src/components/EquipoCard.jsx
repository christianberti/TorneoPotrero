import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './ui/Card';
import TeamEscudo from './TeamEscudo';

export default function EquipoCard({ equipo, stats }) {
  const navigate = useNavigate();
  const key = equipo.id || equipo.nombre;

  const handleCardClick = () => {
    navigate(`/equipos/${key}`);
  };

  return (
    <Card onClick={handleCardClick} className="hover:border-acento/40">
      <div className="flex flex-col items-center text-center gap-3 py-2">
        <TeamEscudo 
          equipo={equipo} 
          className="w-16 h-16" 
          textClassName="text-base" 
          rounded="rounded-md" 
          padding="p-2" 
        />
        
        <div className="font-montserrat font-bold tracking-wide uppercase text-xs text-blanco mt-1">{equipo.nombre}</div>
        
        {stats && (
          <div className="flex gap-4 text-[10px] font-montserrat font-bold text-gris-secundario mt-2">
            <div className="flex flex-col items-center bg-superficie-destacada border border-gris-borde px-2.5 py-1 rounded-sm min-w-[45px]">
              <span className="font-anton text-sm text-blanco">{stats.PTS}</span>
              <span className="text-[7px] tracking-widest text-acento">PTS</span>
            </div>
            <div className="flex flex-col items-center bg-superficie-destacada border border-gris-borde px-2.5 py-1 rounded-sm min-w-[45px]">
              <span className="font-anton text-sm text-blanco">{stats.PJ}</span>
              <span className="text-[7px] tracking-widest text-acento">PJ</span>
            </div>
            <div className="flex flex-col items-center bg-superficie-destacada border border-gris-borde px-2.5 py-1 rounded-sm min-w-[45px]">
              <span className="font-anton text-sm text-blanco">{stats.DG > 0 ? `+${stats.DG}` : stats.DG}</span>
              <span className="text-[7px] tracking-widest text-acento">DG</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
