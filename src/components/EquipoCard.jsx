import React from 'react';
import Card from './ui/Card';
import TeamEscudo from './TeamEscudo';

export default function EquipoCard({ equipo }) {
  return (
    <Card className="border-gris-borde p-3 md:p-4">
      <div className="flex flex-col items-center text-center gap-2 py-1">
        <TeamEscudo 
          equipo={equipo} 
          className="w-10 h-10 md:w-14 md:h-14 flex-shrink-0" 
          textClassName="text-xs md:text-sm" 
        />
        
        <div className="font-montserrat font-bold tracking-wide uppercase text-[9px] md:text-xs text-blanco leading-[1.1] whitespace-normal break-words mt-1">
          {equipo.nombre}
        </div>
      </div>
    </Card>
  );
}
