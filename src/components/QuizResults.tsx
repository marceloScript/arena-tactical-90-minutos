// src/components/QuizResults.tsx - VERSÃO FINAL COM CONTROLE DE VIDAS
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useStore } from '@/store/useStore'
import { useNavigate } from 'react-router-dom'
import { 
  Trophy, 
  Star, 
  Target, 
  Heart, 
  Clock, 
  ArrowLeft, 
  Play,
  Share,
  Award,
  TrendingUp,
  BarChart3,
  Crown,
  Zap
} from 'lucide-react'
import { QUIZ_CATEGORIES, DIFFICULTY_LEVELS } from '@/types/quiz'

const QuizResults: React.FC = () => {
  const navigate = useNavigate()
  const { quizSession, userProgress, clearQuizSession, user, decrementLives, getRemainingLives } = useStore()
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [remainingLives, setRemainingLives] = useState(0)

  // Verificar vidas disponíveis
  useEffect(() => {
    if (user?.isPremium) {
      setRemainingLives(999) // Premium tem vidas ilimitadas
    } else {
      // Para usuários gratuitos, verificar vidas reais
      const lives = getRemainingLives ? getRemainingLives() : 5
      setRemainingLives(lives)
      
      // Se não tem vidas, mostrar modal
      if (lives <= 0) {
        setShowPremiumModal(true)
      }
    }
  }, [quizSession, user, getRemainingLives])

  // Se não há sessão finalizada, voltar para seleção
  if (!quizSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhum Resultado Disponível</h2>
            <p className="text-gray-600 mb-4">
              Complete um quiz para ver seus resultados!
            </p>
            <Button onClick={() => navigate('/quiz-selection')}>
              <Play className="h-4 w-4 mr-2" />
              Começar Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalQuestions = quizSession.answers.length
  const correctAnswers = quizSession.answers.filter(answer => answer).length
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
  const score = quizSession.score
  const livesUsed = 5 - quizSession.lives
  const levelUp = userProgress.experience >= (userProgress.level * 100)

  // Calcular tempo médio por pergunta
  const endTime = new Date()
  const startTime = new Date(quizSession.startTime)
  const totalTime = Math.round((endTime.getTime() - startTime.getTime()) / 1000)
  const averageTime = totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0

  // Determinar rank
  const getRank = () => {
    if (accuracy >= 90) return { name: 'Lenda Tática', color: 'text-purple-600', icon: '🏆' }
    if (accuracy >= 80) return { name: 'Mestre Estratégico', color: 'text-yellow-600', icon: '⭐' }
    if (accuracy >= 70) return { name: 'Expert Tático', color: 'text-blue-600', icon: '🎯' }
    if (accuracy >= 60) return { name: 'Jogador Competente', color: 'text-green-600', icon: '⚽' }
    return { name: 'Iniciante Determinado', color: 'text-gray-600', icon: '🌱' }
  }

  const rank = getRank()

  // FUNÇÕES ATUALIZADAS COM VERIFICAÇÃO DE VIDAS
  const handlePlayAgain = () => {
    if (remainingLives <= 0 && !user?.isPremium) {
      setShowPremiumModal(true)
      return
    }
    
    // Decrementar vida apenas se não for premium
    if (!user?.isPremium && decrementLives) {
      decrementLives()
    }
    
    clearQuizSession()
    navigate('/quiz-selection')
  }

  const handleBackToHome = () => {
    clearQuizSession()
    navigate('/')
  }

  const handleNewCategory = () => {
    if (remainingLives <= 0 && !user?.isPremium) {
      setShowPremiumModal(true)
      return
    }
    
    // Decrementar vida apenas se não for premium
    if (!user?.isPremium && decrementLives) {
      decrementLives()
    }
    
    clearQuizSession()
    navigate('/quiz-selection')
  }

  const handleGoPremium = () => {
    setShowPremiumModal(false)
    navigate('/premium')
  }

  const handleCloseModal = () => {
    setShowPremiumModal(false)
    navigate('/')
  }

  const handleShare = () => {
    const shareText = `🎯 Acabei de fazer ${correctAnswers}/${totalQuestions} no Arena Tactical 90 Minutos! Pontuação: ${score} | Rank: ${rank.name}`
    
    if (navigator.share) {
      navigator.share({
        title: 'Meu Resultado no Arena Tactical',
        text: shareText,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(shareText)
      alert('Resultado copiado para a área de transferência! 📋')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      
      {/* MODAL DE SEM VIDAS */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Crown className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-xl text-yellow-700">
                Vidas Esgotadas!
              </CardTitle>
              <CardDescription>
                Você usou todas as suas vidas gratuitas de hoje
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  <strong>Conta Gratuita:</strong> 5 vidas de quiz por dia
                </p>
                
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200 mb-4">
                  <h4 className="font-semibold text-yellow-700 mb-2">🚀 Torne-se Premium e ganhe:</h4>
                  <ul className="text-sm text-yellow-600 space-y-1 text-left">
                    <li>• <strong>Vidas Ilimitadas</strong> - Jogue sem parar!</li>
                    <li>• Conteúdo Exclusivo - Formações especiais</li>
                    <li>• Análise Avançada - Relatórios detalhados</li>
                    <li>• Suporte Prioritário 24/7</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3"
                  onClick={handleGoPremium}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Ver Planos Premium - R$ 29,90/mês
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 py-3"
                  onClick={handleCloseModal}
                >
                  Voltar para Home
                </Button>
              </div>

              <div className="text-center text-xs text-gray-500 pt-2">
                🎯 Junte-se a 10.000+ estrategistas • ⚡ 7 dias de garantia
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        
        {/* Header com Indicador de Vidas */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToHome}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Início
            </Button>
            
            {/* Indicador de Vidas */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border shadow-sm ${
              user?.isPremium 
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300' 
                : remainingLives > 0 
                  ? 'bg-white border-green-200' 
                  : 'bg-red-50 border-red-200'
            }`}>
              <Heart className={`h-4 w-4 ${
                user?.isPremium ? 'text-yellow-500' :
                remainingLives > 0 ? 'text-green-500' : 'text-red-500'
              }`} />
              <span className={`font-semibold ${
                user?.isPremium ? 'text-yellow-700' :
                remainingLives > 0 ? 'text-green-700' : 'text-red-700'
              }`}>
                {user?.isPremium ? 'Vidas Ilimitadas' : `${remainingLives}/5 vidas`}
              </span>
              {user?.isPremium && (
                <Crown className="h-3 w-3 text-yellow-500" />
              )}
            </div>

            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share className="h-4 w-4" />
              Compartilhar
            </Button>
          </div>

          <div className="flex justify-center items-center gap-4 mb-4">
            <Trophy className="h-12 w-12 text-yellow-500" />
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Quiz Concluído!</h1>
              <p className="text-lg text-gray-600">
                {QUIZ_CATEGORIES[quizSession.category]} • {DIFFICULTY_LEVELS[quizSession.difficulty]}
              </p>
            </div>
          </div>
        </div>

        {/* Aviso de Vidas Baixas */}
        {remainingLives <= 2 && !user?.isPremium && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-700">
                    {remainingLives === 0 ? 'Você não tem mais vidas!' : `Atenção! Apenas ${remainingLives} vida(s) restante(s).`}
                  </p>
                  <p className="text-sm text-yellow-600">
                    {remainingLives === 0 
                      ? 'Torne-se Premium para jogar ilimitadamente!' 
                      : 'Considere o Premium para vidas ilimitadas!'}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/premium')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Restante do código do quiz results (mantenha igual) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna 1: Resultados Principais */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card de Rank */}
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-6 text-center">
                <div className="text-6xl mb-4">{rank.icon}</div>
                <h2 className={`text-2xl font-bold ${rank.color} mb-2`}>
                  {rank.name}
                </h2>
                <p className="text-gray-600">
                  Sua precisão de {accuracy.toFixed(1)}% te colocou neste rank!
                </p>
                {accuracy >= 80 && (
                  <div className="mt-3 p-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                    <span className="text-sm font-semibold text-orange-700">
                      🎉 Excelente desempenho!
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ... (mantenha todo o resto do seu código original) */}

          </div>

          {/* Coluna 2: Ações */}
          <div className="space-y-6">
            
            {/* Ações Principal */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Próximos Passos</CardTitle>
                <CardDescription>
                  Continue sua jornada tática
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handlePlayAgain}
                  disabled={remainingLives <= 0 && !user?.isPremium}
                >
                  <Play className="h-5 w-5 mr-2" />
                  {remainingLives <= 0 && !user?.isPremium ? 'Sem Vidas' : 'Jogar Novamente'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={handleNewCategory}
                  disabled={remainingLives <= 0 && !user?.isPremium}
                >
                  <Target className="h-5 w-5 mr-2" />
                  Nova Categoria
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full text-gray-700 hover:bg-gray-100"
                  onClick={handleBackToHome}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Voltar ao Início
                </Button>

                {/* Botão Premium sempre visível para não premium */}
                {!user?.isPremium && (
                  <Button 
                    variant="outline" 
                    className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50 font-semibold"
                    onClick={() => navigate('/premium')}
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Vidas Ilimitadas - Premium
                  </Button>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizResults