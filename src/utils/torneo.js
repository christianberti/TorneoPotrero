/**
 * Retorna el torneo correspondiente a partir de la zona o categoría de un equipo.
 * Agrupa "Zona A" y "Zona B" bajo la categoría única "Libre".
 * Mantiene "+30" como su propio torneo separado.
 * 
 * @param {string} zona - La zona o categoría del equipo (ej: "Zona A", "Zona B", "+30")
 * @returns {string} El torneo correspondiente ("Libre" o "+30")
 */
export function obtenerTorneo(zona) {
  if (!zona) return 'Libre';
  const z = String(zona).trim().toLowerCase();
  
  if (z === 'zona a' || z === 'zona b' || z === 'libre') {
    return 'Libre';
  }
  if (z === '+30' || z === 'mas 30' || z === 'mas30' || z === '30') {
    return '+30';
  }
  
  return 'Libre'; // fallback predeterminado
}
