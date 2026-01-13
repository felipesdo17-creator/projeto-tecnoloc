import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importando os componentes
import DiagnosticPage from './components/DiagnosticPage';
import AdminPage from './components/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* ROTA 1: Tela Principal (Diagnóstico do Técnico) */}
        <Route path="/" element={<DiagnosticPage />} />

        {/* ROTA 2: Tela Administrativa (Cadastro de Manuais) */}
        <Route path="/admin" element={<AdminPage />} />

        {/* ROTA DE SEGURANÇA: Qualquer endereço errado volta para o início */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;