/**
 * Calcula la tabla de posiciones a partir de los equipos, el fixture y los resultados.
 * Soporta búsqueda de goles tanto en la lista de resultados como directamente en el fixture.
 * Soporta vinculación por ID o por Nombre de equipo.
 * 
 * @param {Array} equipos - Lista de equipos
 * @param {Array} fixture - Lista de partidos programados
 * @param {Array} resultados - Lista de resultados registrados
 * @returns {Array} Tabla de posiciones ordenada
 */
export function calcularTabla(equipos = [], fixture = [], resultados = []) {
  if (!equipos || equipos.length === 0) return [];

  // Inicializar estadísticas para cada equipo
  const tablaMap = {};
  equipos.forEach(team => {
    // Usamos el ID del equipo como clave, o su nombre si no tiene ID
    const key = team.id || team.nombre;
    if (key) {
      tablaMap[key] = {
        ...team,
        id: team.id || '',
        nombre: team.nombre || 'Equipo Sin Nombre',
        logo: team.logo || '',
        escudo_url: team.escudo_url || '',
        PJ: 0,
        PG: 0,
        PE: 0,
        PP: 0,
        GF: 0,
        GC: 0,
        DG: 0,
        PTS: 0
      };
    }
  });

  // Procesar cada partido del fixture
  fixture.forEach(partido => {
    if (!partido.local || !partido.visitante) return;

    let golesLocal = null;
    let golesVisitante = null;
    let jugado = false;

    // 1. Buscar en la lista de resultados (coincidencia por ID o por local/visitante/fecha)
    const resultado = resultados.find(res => {
      const matchById = partido.id && res.partidoId && String(res.partidoId) === String(partido.id);
      const matchByGeneralId = partido.id && res.id && String(res.id) === String(partido.id);
      const matchByTeamsAndDate = 
        String(res.local || res.equipoLocal).trim().toLowerCase() === String(partido.local).trim().toLowerCase() &&
        String(res.visitante || res.equipoVisitante).trim().toLowerCase() === String(partido.visitante).trim().toLowerCase() &&
        String(res.fecha || '').trim() === String(partido.fecha || '').trim();
      
      return matchById || matchByGeneralId || matchByTeamsAndDate;
    });

    if (resultado) {
      const gl = resultado.golesLocal ?? resultado.goles_local ?? resultado.golesL;
      const gv = resultado.golesVisitante ?? resultado.goles_visitante ?? resultado.golesV;
      if (gl !== undefined && gv !== undefined && gl !== null && gv !== null && gl !== '' && gv !== '') {
        golesLocal = parseInt(gl, 10);
        golesVisitante = parseInt(gv, 10);
        jugado = !isNaN(golesLocal) && !isNaN(golesVisitante);
      }
    }

    // 2. Si no se encontró en resultados, buscar goles directamente en la fila del fixture
    if (!jugado) {
      const gl = partido.golesLocal ?? partido.goles_local ?? partido.golesL;
      const gv = partido.golesVisitante ?? partido.goles_visitante ?? partido.golesV;
      if (gl !== undefined && gv !== undefined && gl !== null && gv !== null && gl !== '' && gv !== '') {
        golesLocal = parseInt(gl, 10);
        golesVisitante = parseInt(gv, 10);
        jugado = !isNaN(golesLocal) && !isNaN(golesVisitante);
      }
    }

    if (jugado) {
      // Buscar los equipos en nuestro mapa de estadísticas
      // Puede ser que el fixture guarde el ID del equipo o el nombre directamente
      const localKey = Object.keys(tablaMap).find(key => 
        String(tablaMap[key].id) === String(partido.local) || 
        String(tablaMap[key].nombre).trim().toLowerCase() === String(partido.local).trim().toLowerCase()
      );

      const visitanteKey = Object.keys(tablaMap).find(key => 
        String(tablaMap[key].id) === String(partido.visitante) || 
        String(tablaMap[key].nombre).trim().toLowerCase() === String(partido.visitante).trim().toLowerCase()
      );

      if (localKey && visitanteKey) {
        const localStats = tablaMap[localKey];
        const visitanteStats = tablaMap[visitanteKey];

        localStats.PJ += 1;
        visitanteStats.PJ += 1;

        localStats.GF += golesLocal;
        localStats.GC += golesVisitante;
        visitanteStats.GF += golesVisitante;
        visitanteStats.GC += golesLocal;

        if (golesLocal > golesVisitante) {
          localStats.PG += 1;
          localStats.PTS += 3;
          visitanteStats.PP += 1;
        } else if (golesLocal < golesVisitante) {
          visitanteStats.PG += 1;
          visitanteStats.PTS += 3;
          localStats.PP += 1;
        } else {
          localStats.PE += 1;
          localStats.PTS += 1;
          visitanteStats.PE += 1;
          visitanteStats.PTS += 1;
        }

        localStats.DG = localStats.GF - localStats.GC;
        visitanteStats.DG = visitanteStats.GF - visitanteStats.GC;
      }
    }
  });

  // Convertir el mapa en un array y ordenar
  return Object.values(tablaMap).sort((a, b) => {
    // 1. Puntos (descendente)
    if (b.PTS !== a.PTS) {
      return b.PTS - a.PTS;
    }
    // 2. Diferencia de gol (descendente)
    if (b.DG !== a.DG) {
      return b.DG - a.DG;
    }
    // 3. Goles a favor (descendente)
    return b.GF - a.GF;
  });
}
