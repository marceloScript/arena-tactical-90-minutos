// src/components/HomePage.tsx
import React from 'react'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Trophy, Users, Settings, Crown, Play, Target,
  LogIn // ← NOVO ÍCONE ADICIONADO
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  // Array de features CORRIGIDO
  const features = [
    {
      title: 'Simulador 3D Imersivo',
      icon: <Users className="h-8 w-8 text-green-600" />,
      content: [
        'Campo 3D interativo',
        'Múltiplas formações',
        'Táticas avançadas',
        'Campeonatos completos'
      ],
      click: '/simulator'
    },
    {
      title: 'Quiz Interativo',
      icon: <Settings className="h-8 w-8 text-blue-600" />,
      content: [
        'Perguntas sobre táticas',
        'História do futebol',
        'Regras e regulamentos',
        'Sistema de progressão'
      ],
      click: '/quiz-selection'
    },
    {
      title: 'Premium',
      icon: <Crown className="h-8 w-8 text-yellow-600" />,
      content: [
        'Vidas ilimitadas',
        'Conteúdo exclusivo',
        'Equipes personalizadas',
        'Suporte prioritário'
      ],
      click: '/premium'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100 px-4 md:px-12 py-12 flex flex-col items-center">
      <div className="max-w-7xl w-full space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-green-700 drop-shadow-sm">
            Arena Tactical 90 Minutos
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            Onde a estratégia encontra a paixão do futebol. Simule partidas em 3D, teste seus conhecimentos e torne-se um mestre tático.
          </p>
          
          {/* BOTÕES PRINCIPAIS - ATUALIZADO */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate('/simulator')}
              className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              <Play className="h-5 w-5 mr-2" />
              Jogar Agora
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/quiz-selection')}
              className="text-lg px-8 py-4 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold"
            >
              <Settings className="h-5 w-5 mr-2" />
              Aprender com Quiz
            </Button>

            {/* 👇 NOVO BOTÃO DE LOGIN/REGISTRO */}
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="text-lg px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg transition-all transform hover:scale-105"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Entrar / Cadastrar
            </Button>
          </div>

          {/* Mensagem de destaque */}
          <div className="pt-4">
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              🎯 <strong>Novo:</strong> Crie sua conta e ganhe <strong>5 vidas de Quiz + 3 vidas de Jogo 3D</strong> todos os dias!
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ title, icon, content, click }, i) => (
            <Card
              key={i}
              className="hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border-2 border-transparent hover:border-green-200"
              onClick={() => navigate(click)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 shadow">
                  {icon}
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-sm text-gray-600 space-y-1">
                  {content.map((item, j) => (
                    <li key={j}>• {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Championship System */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Sistema de Campeonatos
            </CardTitle>
            <CardDescription className="text-lg text-gray-700">
              Participe de campeonatos nacionais, continentais e mundiais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-gray-600">
              <div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">Nacionais</h3>
                <p>Liga Elite, Copa Nacional, Super Copa</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">Continentais</h3>
                <p>Liga Continental, Copa Continental</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold">Mundiais</h3>
                <p>Mundial de Clubes, Copa Intercontinental</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nova Seção: Benefícios da Conta */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2 text-purple-700">
              <LogIn className="h-6 w-6" />
              Por que criar uma conta?
            </CardTitle>
            <CardDescription className="text-lg text-gray-700">
              Descubra todos os benefícios de fazer parte da Arena Tactical
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg border border-purple-100 shadow-sm">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold text-purple-700">5 Vidas de Quiz</h3>
                <p className="text-sm text-gray-600">Todos os dias</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-100 shadow-sm">
                <div className="text-2xl mb-2">⚽</div>
                <h3 className="font-semibold text-blue-700">3 Vidas de Jogo 3D</h3>
                <p className="text-sm text-gray-600">Diárias gratuitas</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-green-100 shadow-sm">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold text-green-700">Progresso Salvo</h3>
                <p className="text-sm text-gray-600">Estatísticas detalhadas</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-yellow-100 shadow-sm">
                <div className="text-2xl mb-2">🏆</div>
                <h3 className="font-semibold text-yellow-700">Upgrade Premium</h3>
                <p className="text-sm text-gray-600">Vidas ilimitadas</p>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Criar Minha Conta Grátis
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Pronto para começar sua jornada tática?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/simulator')}
              className="text-lg px-12 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              <Play className="h-5 w-5 mr-2" />
              Começar Agora
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth')}
              className="text-lg px-12 py-4 border-2 border-purple-500 text-purple-600 hover:bg-purple-50 font-semibold"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Criar Conta Grátis
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 pt-4">
            🚀 <strong>Sem compromisso:</strong> Crie sua conta em 30 segundos e desbloqueie todos os benefícios!
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage