import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  getEquipos, 
  getJugadores, 
  getFixture, 
  getResultados, 
  getNoticias,
  getTablaZonaA,
  getTablaZonaB,
  getTablaMas30
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
        fixture, 
        resultados, 
        noticias,
        tablaZonaA,
        tablaZonaB,
        tablaMas30
      ] = await Promise.all([
        getEquipos(),
        getJugadores(),
        getFixture(),
        getResultados(),
        getNoticias(),
        getTablaZonaA(),
        getTablaZonaB(),
        getTablaMas30(),
      ]);

      setData({
        equipos,
        jugadores,
        fixture,
        resultados,
        noticias,
        tablaZonaA,
        tablaZonaB,
        tablaMas30,
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
