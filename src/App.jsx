import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TorneoProvider } from './hooks/useTorneoData';

// Layout
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';

// Pages
import Home from './pages/Home';
import Fixture from './pages/Fixture';
import Tabla from './pages/Tabla';
import Equipos from './pages/Equipos';
import EquipoDetalle from './pages/EquipoDetalle';
import PartidoDetalle from './pages/PartidoDetalle';
import Goleadores from './pages/Goleadores';
import ValdaMenosVencida from './pages/ValdaMenosVencida';
import Tarjetas from './pages/Tarjetas';
import MVP from './pages/MVP';
import Reglamento from './pages/Reglamento';

export default function App() {
  return (
    <TorneoProvider>
      <BrowserRouter>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/fixture" element={<Fixture />} />
              <Route path="/tabla" element={<Tabla />} />
              <Route path="/equipos" element={<Equipos />} />
              <Route path="/equipos/:id" element={<EquipoDetalle />} />
              <Route path="/partidos/:id" element={<PartidoDetalle />} />
              <Route path="/goleadores" element={<Goleadores />} />
              <Route path="/valla-menos-vencida" element={<ValdaMenosVencida />} />
              <Route path="/tarjetas" element={<Tarjetas />} />
              <Route path="/mvp" element={<MVP />} />
              <Route path="/reglamento" element={<Reglamento />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TorneoProvider>
  );
}
