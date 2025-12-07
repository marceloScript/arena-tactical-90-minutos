// src/App.tsx - VERSÃO FINAL CORRIGIDA
import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import HomePage from './components/HomePage'
import MatchTracker from './components/MatchTracker' // ✅ Import correto
import ChampionshipSystem from './components/ChampionshipSystem'
import PremiumFeatures from './components/PremiumFeatures'
import AuthSystem from './components/AuthSystem'
import Layout from './components/Layout'
import CardsShowcase from './pages/CardsShowcase'
import PremiumPage from './pages/PremiumPage'
import QuizSelection from './components/QuizSelection'
import QuizSession from './components/QuizSession'
import QuizResults from './components/QuizResults'
import { Toaster } from 'react-hot-toast'

// Wrapper para AuthSystem
const AuthSystemWrapper = () => {
  const navigate = useNavigate();
  return <AuthSystem onBack={() => navigate(-1)} />;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/simulator" element={<MatchTracker />} />
          
          <Route path="/auth" element={<AuthSystemWrapper />} />
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
      <Toaster position="top-right" />
    </Router>
  )
}

export default App