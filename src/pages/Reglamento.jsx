import React from 'react';
import Card from '../components/ui/Card';

export default function Reglamento() {
  return (
    <div className="flex flex-col gap-6">
      <div className="mb-6">
        <h1 className="font-anton text-3xl tracking-wider text-blanco uppercase mb-1">Reglamento</h1>
        <p className="font-inter text-xs text-gris-secundario uppercase tracking-wide">Normas oficiales, puntuación y disciplina de Torneo Potrero.</p>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <div className="flex flex-col gap-2">
            <h3 className="font-montserrat font-bold text-xs tracking-wider uppercase text-acento border-b border-gris-borde pb-2 mb-1">
              1. Formato de Competición
            </h3>
            <p className="font-inter text-xs text-gris-secundario leading-relaxed">
              El torneo se disputa bajo la modalidad de fútbol amateur dividida en dos etapas consecutivas:
            </p>
            <ul className="list-disc pl-5 font-inter text-xs text-gris-secundario leading-relaxed flex flex-col gap-1.5 mt-1">
              <li><strong className="text-blanco">Fase Regular:</strong> Liga de todos contra todos a una única rueda de partidos.</li>
              <li><strong className="text-blanco">Fase Eliminatoria:</strong> Clasifican los mejores 8 equipos a los cuartos de final de la Copa de Oro. Del 9° al 16° disputan la Copa de Plata.</li>
            </ul>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <h3 className="font-montserrat font-bold text-xs tracking-wider uppercase text-acento border-b border-gris-borde pb-2 mb-1">
              2. Sistema de Puntuación
            </h3>
            <p className="font-inter text-xs text-gris-secundario leading-relaxed">
              La asignación de puntos en la tabla de posiciones se regirá de la siguiente manera:
            </p>
            <ul className="list-disc pl-5 font-inter text-xs text-gris-secundario leading-relaxed flex flex-col gap-1.5 mt-1">
              <li><strong className="text-blanco">Victoria:</strong> 3 puntos.</li>
              <li><strong className="text-blanco">Empate:</strong> 1 punto para cada equipo.</li>
              <li><strong className="text-blanco">Derrota:</strong> 0 puntos.</li>
              <li><strong className="text-blanco">W.O. (No presentación):</strong> Pérdida del partido por 3-0 y descuento de 1 punto en la tabla.</li>
            </ul>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <h3 className="font-montserrat font-bold text-xs tracking-wider uppercase text-acento border-b border-gris-borde pb-2 mb-1">
              3. Criterios de Desempate
            </h3>
            <p className="font-inter text-xs text-gris-secundario leading-relaxed">
              En caso de igualdad de puntos en la tabla de posiciones al finalizar la fase regular, se aplicarán los siguientes criterios de desempate en orden de prioridad:
            </p>
            <ol className="list-decimal pl-5 font-inter text-xs text-gris-secundario leading-relaxed flex flex-col gap-1.5 mt-1">
              <li>Mayor diferencia de goles general (DG).</li>
              <li>Mayor cantidad de goles a favor (GF).</li>
              <li>Resultado del partido disputado entre los equipos empatados.</li>
              <li>Sorteo oficial de la comisión organizadora.</li>
            </ol>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <h3 className="font-montserrat font-bold text-xs tracking-wider uppercase text-acento border-b border-gris-borde pb-2 mb-1">
              4. Tarjetas y Sanciones
            </h3>
            <p className="font-inter text-xs text-gris-secundario leading-relaxed">
              Las medidas disciplinarias buscan preservar el Fair Play y el respeto en el campo de juego:
            </p>
            <ul className="list-disc pl-5 font-inter text-xs text-gris-secundario leading-relaxed flex flex-col gap-1.5 mt-1">
              <li><strong className="text-blanco">Doble Tarjeta Amarilla:</strong> Expulsión y suspensión automática por 1 partido.</li>
              <li><strong className="text-blanco">Roja Directa:</strong> Expulsión directa y suspensión mínima de 1 fecha (sujeto a informe arbitral).</li>
              <li><strong className="text-blanco">Acumulación de Amarillas:</strong> La acumulación de 5 tarjetas amarillas a lo largo de la fase regular conlleva 1 partido de suspensión.</li>
            </ul>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-2">
            <h3 className="font-montserrat font-bold text-xs tracking-wider uppercase text-acento border-b border-gris-borde pb-2 mb-1">
              5. Disposiciones Generales
            </h3>
            <ul className="list-disc pl-5 font-inter text-xs text-gris-secundario leading-relaxed flex flex-col gap-1.5 mt-1">
              <li>Cada partido consta de dos tiempos reglamentarios de 25 minutos con un descanso de 5 minutos.</li>
              <li>Los equipos deben presentarse uniformados con camisetas numeradas en la espalda.</li>
              <li>Se permiten sustituciones ilimitadas autorizadas por el árbitro con el juego detenido.</li>
              <li>Está terminantemente prohibido el uso de calzado con tapones metálicos.</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
