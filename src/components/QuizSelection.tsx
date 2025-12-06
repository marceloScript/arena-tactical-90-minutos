// src/components/QuizSelection.tsx
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { QuizCategory, Difficulty, QUIZ_CATEGORIES, DIFFICULTY_LEVELS } from '@/types/quiz'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Star, Target, Users, Book, BarChart, Building, GraduationCap } from 'lucide-react'

const QuizSelection: React.FC = () => {
  const navigate = useNavigate()
  const { startQuiz } = useStore()
  
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)

  // Ícones para cada categoria
  const categoryIcons = {
    regulamento_fifa: <Book className="h-6 w-6" />,
    direito_desportivo: <GraduationCap className="h-6 w-6" />,
    agentes_intermediarios: <Users className="h-6 w-6" />,
    teoria_tatica: <Target className="h-6 w-6" />,
    historia_tatica: <Star className="h-6 w-6" />,
    principios_jogo: <Play className="h-6 w-6" />,
    analise_desempenho: <BarChart className="h-6 w-6" />,
    gestao_clubes: <Building className="h-6 w-6" />,
    metodologia_treinamento: <GraduationCap className="h-6 w-6" />
  }

  // Descrições para cada categoria
  const categoryDescriptions = {
    regulamento_fifa: 'Regras e regulamentos oficiais da FIFA sobre transferências, contratos e competições',
    direito_desportivo: 'Aspectos legais e jurídicos do futebol profissional',
    agentes_intermediarios: 'Normas e práticas sobre representação de jogadores e clubes',
    teoria_tatica: 'Conceitos fundamentais e sistemas de jogo',
    historia_tatica: 'Evolução das formações e estratégias ao longo do tempo',
    principios_jogo: 'Fundamentos ofensivos e defensivos do futebol',
    analise_desempenho: 'Tecnologia, dados e métricas do futebol moderno',
    gestao_clubes: 'Administração, finanças e estruturação de clubes',
    metodologia_treinamento: 'Métodos e periodização de preparação técnica e tática'
  }

  const handleStartQuiz = () => {
    if (selectedCategory && selectedDifficulty) {
      startQuiz(selectedCategory, selectedDifficulty)
      navigate('/quiz-session')
    }
  }

  const isReadyToStart = selectedCategory && selectedDifficulty

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Home
          </Button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Arena Quiz Tático
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Teste seus conhecimentos e torne-se um expert em futebol
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna 1: Categorias */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Escolha a Categoria
                </CardTitle>
                <CardDescription>
                  Selecione a área do conhecimento que deseja testar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Object.entries(QUIZ_CATEGORIES) as [QuizCategory, string][]).map(([key, name]) => (
                    <Card
                      key={key}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedCategory === key 
                          ? 'ring-2 ring-green-500 bg-green-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCategory(key)}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          selectedCategory === key ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {categoryIcons[key]}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {categoryDescriptions[key]}
                          </p>
                        </div>
                        {selectedCategory === key && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna 2: Dificuldade e Início */}
          <div className="space-y-6">
            {/* Seletor de Dificuldade */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Nível de Dificuldade
                </CardTitle>
                <CardDescription>
                  Escolha o desafio que quer enfrentar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.entries(DIFFICULTY_LEVELS) as [Difficulty, string][]).map(([key, name]) => (
                    <Button
                      key={key}
                      variant={selectedDifficulty === key ? "default" : "outline"}
                      className={`justify-start h-auto py-3 px-4 ${
                        selectedDifficulty === key 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedDifficulty(key)}
                    >
                      <div className="text-left">
                        <div className="font-semibold">{name}</div>
                        <div className="text-xs opacity-80 mt-1">
                          {key === 'facil' && 'Questões básicas'}
                          {key === 'medio' && 'Conhecimento intermediário'}  
                          {key === 'dificil' && 'Para especialistas'}
                          {key === 'expert' && 'Nível avançado'}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Informações da Seleção */}
            {selectedCategory && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">
                    📋 Resumo da Seleção
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Categoria:</span>
                    <span className="font-semibold">{QUIZ_CATEGORIES[selectedCategory]}</span>
                  </div>
                  {selectedDifficulty && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Dificuldade:</span>
                      <span className="font-semibold">{DIFFICULTY_LEVELS[selectedDifficulty]}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Vidas:</span>
                    <span className="font-semibold">5 ❤️</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botão Iniciar */}
            <Button
              size="lg"
              className="w-full h-14 text-lg"
              disabled={!isReadyToStart}
              onClick={handleStartQuiz}
            >
              <Play className="h-5 w-5 mr-2" />
              {isReadyToStart ? 'Iniciar Quiz' : 'Selecione Categoria e Dificuldade'}
            </Button>

            {/* Dica */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Dica:</strong> Cada erro custa uma vida. Responda com sabedoria para alcançar a pontuação máxima!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizSelection