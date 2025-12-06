// src/components/QuizSession.tsx
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useStore } from '@/store/useStore'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  Clock, 
  Trophy, 
  CheckCircle, 
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { QUIZ_CATEGORIES, DIFFICULTY_LEVELS } from '@/types/quiz'

const QuizSession: React.FC = () => {
  const navigate = useNavigate()
  const { 
    quizSession, 
    currentQuestion, 
    userProgress, 
    answerQuestion, 
    nextQuestion, 
    completeQuiz, // ← MUDOU PARA completeQuiz
    endQuiz 
  } = useStore()

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)

  // Resetar quando mudar de pergunta
  useEffect(() => {
    setSelectedAnswer(null)
    setShowFeedback(false)
    setTimeLeft(30)
  }, [currentQuestion])

  // Timer countdown
  useEffect(() => {
    if (!quizSession || !currentQuestion || showFeedback) return

    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          handleTimeUp()
          return 0
        }
        return time - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizSession, currentQuestion, showFeedback])

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback || !quizSession) return

    setSelectedAnswer(answerIndex)
    const correct = answerQuestion(answerIndex)
    setIsCorrect(correct)
    setShowFeedback(true)
  }

  const handleNextQuestion = () => {
    if (quizSession && quizSession.lives > 0) {
      nextQuestion()
    } else {
      // USAR completeQuiz EM VEZ DE endQuiz
      completeQuiz()
      navigate('/quiz-results')
    }
  }

  const handleTimeUp = () => {
    if (!showFeedback && quizSession) {
      const correct = answerQuestion(-1)
      setIsCorrect(false)
      setSelectedAnswer(-1)
      setShowFeedback(true)
    }
  }

  const handleQuit = () => {
    endQuiz()
    navigate('/quiz-selection')
  }

  // Se não há sessão ativa, voltar para seleção
  if (!quizSession || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sessão não encontrada</h2>
            <p className="text-gray-600 mb-4">
              Não há um quiz ativo no momento.
            </p>
            <Button onClick={() => navigate('/quiz-selection')}>
              Voltar para Seleção
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progress = ((quizSession.currentQuestion) / 10) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={handleQuit}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Sair do Quiz
          </Button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {QUIZ_CATEGORIES[quizSession.category]}
            </h1>
            <p className="text-gray-600">
              Nível: {DIFFICULTY_LEVELS[quizSession.difficulty]}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Vidas */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Heart
                  key={i}
                  className={`h-5 w-5 ${
                    i < quizSession.lives 
                      ? 'text-red-500 fill-red-500' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Pontuação */}
            <div className="flex items-center gap-1">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">{quizSession.score}</span>
            </div>
          </div>
        </div>

        {/* Progresso */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pergunta {quizSession.currentQuestion + 1}</span>
            <span>Progresso: {Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Timer */}
        <div className="flex justify-center mb-8">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            timeLeft > 10 
              ? 'bg-green-100 text-green-700' 
              : timeLeft > 5 
              ? 'bg-yellow-100 text-yellow-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <Clock className="h-4 w-4" />
            <span className="font-mono font-bold">{timeLeft}s</span>
          </div>
        </div>

        {/* Card da Pergunta */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-xl md:text-2xl">
              {currentQuestion.question}
            </CardTitle>
            {currentQuestion.explanation && !showFeedback && (
              <CardDescription>
                💡 Dica: Leia com atenção antes de responder
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent>
            {/* Opções de Resposta */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === index ? "default" : "outline"}
                  className={`justify-start h-auto py-4 px-6 text-left whitespace-normal ${
                    showFeedback
                      ? index === currentQuestion.correctAnswer
                        ? 'bg-green-100 border-green-500 text-green-700 hover:bg-green-100'
                        : selectedAnswer === index
                        ? 'bg-red-100 border-red-500 text-red-700 hover:bg-red-100'
                        : 'bg-gray-50'
                      : selectedAnswer === index
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                      showFeedback
                        ? index === currentQuestion.correctAnswer
                          ? 'bg-green-500 border-green-500 text-white'
                          : selectedAnswer === index
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'border-gray-300'
                        : selectedAnswer === index
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    
                    {/* Ícones de feedback */}
                    {showFeedback && (
                      <>
                        {index === currentQuestion.correctAnswer && (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        )}
                        {selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        )}
                      </>
                    )}
                  </div>
                </Button>
              ))}
            </div>

            {/* Feedback e Explicação */}
            {showFeedback && (
              <div className={`p-4 rounded-lg border ${
                isCorrect 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">Resposta Correta!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="font-semibold text-red-800">Resposta Incorreta</span>
                    </>
                  )}
                </div>
                
                {currentQuestion.explanation && (
                  <p className="text-sm text-gray-700">
                    <strong>Explicação:</strong> {currentQuestion.explanation}
                  </p>
                )}

                {/* Botão Próxima Pergunta */}
                <div className="flex justify-end mt-4">
                  <Button onClick={handleNextQuestion}>
                    {quizSession.lives > 0 ? 'Próxima Pergunta' : 'Ver Resultados'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status do Jogador */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{userProgress.level}</div>
                <div className="text-sm text-gray-600">Nível</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{userProgress.experience}</div>
                <div className="text-sm text-gray-600">XP</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{userProgress.correctAnswers}</div>
                <div className="text-sm text-gray-600">Acertos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{userProgress.totalQuizzes}</div>
                <div className="text-sm text-gray-600">Quizzes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default QuizSession