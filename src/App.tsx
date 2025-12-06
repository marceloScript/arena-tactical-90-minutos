// src/App.tsx - VERSÃO CORRIGIDA
import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import HomePage from './components/HomePage'
import Field3D from './components/Field3D'
import ChampionshipSystem from './components/ChampionshipSystem'
import LivesSystem from './components/LivesSystem'
import PremiumFeatures from './components/PremiumFeatures'
import AuthSystem from './components/AuthSystem'
import Layout from './components/Layout'
import CardsShowcase from './pages/CardsShowcase'
import PremiumPage from './pages/PremiumPage'
import QuizSelection from './components/QuizSelection'
import QuizSession from './components/QuizSession'
import QuizResults from './components/QuizResults'
import { Toaster } from 'react-hot-toast'

// Wrapper para evitar recarregamento de página e usar a navegação do React Router
const AuthSystemWrapper = () => {
  const navigate = useNavigate();
  return <AuthSystem onBack={() => navigate(-1)} />; // Navega para a página anterior
};

// Wrapper para PremiumFeatures com navegação para home
const PremiumFeaturesWrapper = () => {
  const navigate = useNavigate();
  return <PremiumFeatures onBack={() => navigate('/')} />; // Navega para a home
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/simulator" element={<Field3D />} />
          
          {/* ROTAS CORRIGIDAS - Usando navegação SPA sem recarregar a página */}
          <Route path="/auth" element={<AuthSystemWrapper />} />
          
          {/* As rotas abaixo podem ser placeholders ou páginas a serem desenvolvidas */}
          <Route path="/championships" element={<ChampionshipSystem onBack={() => {}} />} />
          <Route path="/quiz" element={<Navigate to="/quiz-selection" replace />} />
          <Route path="/premium" element={<PremiumFeatures onBack={() => {}} />} />
          
          <Route path="/quiz-selection" element={<QuizSelection />} />
          <Route path="/quiz-session" element={<QuizSession />} />
          <Route path="/quiz-results" element={<QuizResults />} />
          <Route path="/cards" element={<CardsShowcase />} />
          <Route path="/premium/sucesso" element={<PremiumPage />} />
          <Route path="/premium/cancelado" element={<PremiumPage />} />
        </Routes>
      </Layout>
      {/* Adiciona o container para as notificações em toda a aplicação */}
      <Toaster position="top-right" />
    </Router>
  )
}

export default App