const SHEET_ID = '1G3XmjRyGVykJbfSrV1zHIZrC9vuQUSm5FwFAYTd3CtQ';
const BASE_URL = `https://opensheet.elk.sh/${SHEET_ID}`;

async function fetchSheetData(sheetName) {
  try {
    const response = await fetch(`${BASE_URL}/${sheetName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet ${sheetName}: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      return [];
    }
    return data;
  } catch (error) {
    console.error(`Error fetching sheet "${sheetName}":`, error);
    return [];
  }
}

export async function getEquipos() {
  return fetchSheetData('Equipos');
}

export async function getJugadores() {
  return fetchSheetData('Jugadores');
}

export async function getFixtureZonaA() {
  return fetchSheetData('FixtureZonaA');
}

export async function getFixtureZonaB() {
  return fetchSheetData('FixtureZonaB');
}

export async function getFixtureMas30() {
  return fetchSheetData('FixtureMas30');
}

export async function getResultados() {
  return fetchSheetData('Resultados');
}

export async function getNoticias() {
  return fetchSheetData('Noticias');
}

export async function getTablaZonaA() {
  return fetchSheetData('TablaZonaA');
}

export async function getTablaZonaB() {
  return fetchSheetData('TablaZonaB');
}

export async function getTablaMas30() {
  return fetchSheetData('TablaMas30');
}

export async function getProximaFecha() {
  return fetchSheetData('ProximaFecha');
}

export async function getGoleadores() {
  return fetchSheetData('Goleadores');
}
