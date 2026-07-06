import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getEquipos, 
  getJugadores, 
  getResultados, 
  getNoticias,
  getTablaZonaA,
  getTablaZonaB,
  getTablaMas30,
  getFixtureZonaA,
  getFixtureZonaB,
  getFixtureMas30,
  getProximaFecha,
  getGoleadores
} from '../lib/sheets';

const TorneoDataContext = createContext(null);

export function TorneoProvider({ children }) {
  const [data, setData] = useState({
    equipos: [],
    jugadores: [],
    fixture: [],
    resultados: [],
    noticias: [],
    tablaZonaA: [],
    tablaZonaB: [],
    tablaMas30: [],
    fixtureZonaA: [],
    fixtureZonaB: [],
    fixtureMas30: [],
    proximaFecha: [],
    goleadores: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        equipos, 
        jugadores, 
        resultados, 
        noticias,
        tablaZonaA,
        tablaZonaB,
        tablaMas30,
        fixtureZonaA,
        fixtureZonaB,
        fixtureMas30,
        proximaFecha,
        goleadores
      ] = await Promise.all([
        getEquipos(),
        getJugadores(),
        getResultados(),
        getNoticias(),
        getTablaZonaA(),
        getTablaZonaB(),
        getTablaMas30(),
        getFixtureZonaA(),
        getFixtureZonaB(),
        getFixtureMas30(),
        getProximaFecha(),
        getGoleadores(),
      ]);

      const mapFixture = (f, zone, idx) => ({
        id: `${zone}-${f.fecha_numero || 0}-${idx}`,
        fecha: `Fecha ${f.fecha_numero}`,
        fecha_numero: parseInt(f.fecha_numero || 0, 10),
        local: f.equipo_local_id,
        visitante: f.equipo_visitante_id,
        jugado: false,
        dia: '',
        hora: '',
        cancha: '',
        zona: zone
      });

      setData({
        equipos,
        jugadores,
        resultados,
        noticias,
        tablaZonaA,
        tablaZonaB,
        tablaMas30,
        fixtureZonaA,
        fixtureZonaB,
        fixtureMas30,
        proximaFecha,
        goleadores,
        fixture: [
          ...fixtureZonaA.map((f, idx) => mapFixture(f, 'Zona A', idx)),
          ...fixtureZonaB.map((f, idx) => mapFixture(f, 'Zona B', idx)),
          ...fixtureMas30.map((f, idx) => mapFixture(f, '+30', idx)),
        ]
      });
    } catch (err) {
      console.error('Error loading tournament data:', err);
      setError('No se pudo cargar la información del torneo. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const value = {
    ...data,
    loading,
    error,
    refreshData: loadData,
  };

  return (
    <TorneoDataContext.Provider value={value}>
      {children}
    </TorneoDataContext.Provider>
  );
}

export function useTorneoData() {
  const context = useContext(TorneoDataContext);
  if (!context) {
    throw new Error('useTorneoData debe usarse dentro de un TorneoProvider');
  }
  return context;
}
