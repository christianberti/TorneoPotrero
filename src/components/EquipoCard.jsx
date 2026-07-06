import React from 'react';
import Card from './ui/Card';
import TeamEscudo from './TeamEscudo';

export default function EquipoCard({ equipo }) {
  return (
    <Card className="border-gris-borde">
      <div className="flex flex-col items-center text-center gap-3 py-2">
        <TeamEscudo 
          equipo={equipo} 
          className="w-16 h-16" 
          textClassName="text-base" 
        />
        
        <div className="font-montserrat font-bold tracking-wide uppercase text-xs text-blanco mt-1">
          {equipo.nombre}
        </div>
      </div>
    </Card>
  );
}
