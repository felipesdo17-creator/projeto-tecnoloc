import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. A Home está na raiz (src/Home.jsx)
import Home from './Home';

// 2. As outras páginas estão dentro da pasta components
import DiagnosticPage from './components/DiagnosticPage';
import ChecklistPage from './components/ChecklistPage';
import ManualsPage from './components/ManualsPage';
import DiagnosticHistory from './components/DiagnosticHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/diagnostico" element={<DiagnosticPage />} />
        <Route path="/checklist" element={<ChecklistPage />} />
        <Route path="/manuais" element={<ManualsPage />} />
        <Route path="/historico" element={<DiagnosticHistory />} />
      </Routes>
    </Router>
  );
}

export default App;