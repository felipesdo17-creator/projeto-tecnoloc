import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importando os arquivos que existem na sua pasta src
import Home from './Home';
import DiagnosticPage from './DiagnosticPage';
import ChecklistPage from './ChecklistPage';
import ManualsPage from './ManualsPage';
import DiagnosticHistory from './DiagnosticHistory';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota Inicial */}
        <Route path="/" element={<Home />} />
        
        {/* Rotas das Funcionalidades */}
        <Route path="/diagnostico" element={<DiagnosticPage />} />
        <Route path="/checklist" element={<ChecklistPage />} />
        <Route path="/manuais" element={<ManualsPage />} />
        <Route path="/historico" element={<DiagnosticHistory />} />
      </Routes>
    </Router>
  );
}

export default App;