// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { DeckPage } from './pages/DeckPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppShell } from './layouts/AppShell';
import { RfpListPage } from './pages/rfp/RfpListPage';
import { NewAnalysisPage } from './pages/rfp/NewAnalysisPage';
import { ProcessingPage } from './pages/rfp/ProcessingPage';
import { ResultsPage } from './pages/rfp/ResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/deck" element={<DeckPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/rfp"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<RfpListPage />} />
          <Route path="new" element={<NewAnalysisPage />} />
          <Route path=":id/processing" element={<ProcessingPage />} />
          <Route path=":id" element={<ResultsPage />} />
        </Route>

        {/* Redirects */}
        <Route path="/dashboard" element={<Navigate to="/rfp" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
