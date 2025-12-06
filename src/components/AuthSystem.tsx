// src/components/AuthSystem.tsx
import React, { useState } from 'react'
import { useStore } from '@/store/useStore'
import { authService } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Lock,
  User, 
  Mail, 
  Crown,
  CheckCircle,
  Star,
  GamepadIcon
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AuthSystemProps {
  onBack: () => void
}

const AuthSystem: React.FC<AuthSystemProps> = ({ onBack }) => {
  const navigate = useNavigate()
  const { login } = useStore()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Função de submit integrada com a API
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        const { token, usuario } = await authService.login(email, password)
        login(token, usuario)
        toast.success('Login bem-sucedido! Bem-vindo de volta.')
      } else {
        const { token, usuario } = await authService.cadastro(name, email, password)
        login(token, usuario)
        toast.success('Conta criada com sucesso! Bem-vindo à Arena.')
      }
      navigate('/') // Redireciona para a home após o sucesso
    } catch (error) {
      toast.error((error as Error).message || 'Ocorreu um erro. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    console.log('Google login...')
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Melhorado */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Home
          </Button>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Arena Tactical
              </h1>
              <p className="text-lg text-gray-600">
                {isLogin ? 'Sua Estratégia Começa Aqui' : 'Junte-se aos Mestres Táticos'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Formulário de Auth - LADO ESQUERDO */}
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                {isLogin ? '🔐 Entrar' : '🚀 Criar Conta'}
              </CardTitle>
              <CardDescription className="text-base">
                {isLogin 
                  ? 'Continue sua jornada rumo à maestria' 
                  : 'Comece a dominar as táticas do futebol'
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Nome Completo</label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Como quer ser chamado?"
                        value={name}
                        onChange={handleNameChange}
                        required={!isLogin}
                        className="pl-10 border-2 border-gray-200 focus:border-blue-500 transition-all"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="seu.melhor@email.com"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      className="pl-10 border-2 border-gray-200 focus:border-blue-500 transition-all"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Senha</label>
                  <div className="relative">
                    <Input
                      type="password"
                      placeholder="Sua senha secreta"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                      className="pl-10 border-2 border-gray-200 focus:border-blue-500 transition-all"
                      minLength={6}
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processando...
                    </div>
                  ) : (
                    isLogin ? '🎯 Entrar na Arena' : '⚡ Criar Minha Conta'
                  )}
                </Button>
              </form>

              {/* Divisor */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500 font-medium">Ou entre rapidamente com</span>
                </div>
              </div>

              {/* Google Login */}
              <Button 
                variant="outline" 
                className="w-full border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 font-medium py-3"
                onClick={handleGoogleLogin}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar com Google
              </Button>

              {/* Alternar entre Login/Cadastro */}
              <div className="text-center mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  {isLogin ? 'Novo na Arena?' : 'Já faz parte do time?'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {isLogin ? '🎉 Crie sua conta gratuita' : '🔓 Faça login aqui'}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* BENEFÍCIOS - LADO DIREITO */}
          <div className="space-y-6">
            
            {/* Card de Vidas Gratuitas */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Star className="h-5 w-5" />
                  Conta Gratuita Inclui:
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-green-200 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <GamepadIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">5 Vidas de Quiz/Dia</div>
                    <div className="text-sm text-gray-600">Teste seu conhecimento tático todos os dias</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-green-200 shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <GamepadIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">3 Vidas de Jogo 3D/Dia</div>
                    <div className="text-sm text-gray-600">Pratique no simulador tático avançado</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-white rounded border">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Todas as Categorias</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white rounded border">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Progresso Salvo</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white rounded border">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Estatísticas</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-white rounded border">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Suporte</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card Premium */}
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-300 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-orange-800">
                  <Crown className="h-6 w-6" />
                  Premium Arena
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Experiência completa sem limites
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-gray-800">R$ 29,90</div>
                  <div className="text-sm text-gray-600">por mês • Cancele quando quiser</div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 p-2 bg-white rounded-lg border">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Vidas Ilimitadas</div>
                      <div className="text-xs text-gray-600">Quiz + Jogo 3D sem restrições</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-white rounded-lg border">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Conteúdo Exclusivo</div>
                      <div className="text-xs text-gray-600">Formações e táticas especiais</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-white rounded-lg border">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Análise Avançada</div>
                      <div className="text-xs text-gray-600">Relatórios detalhados de desempenho</div>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 rounded-lg shadow-lg transition-all transform hover:scale-[1.02]">
                  <Crown className="h-5 w-5 mr-2" />
                  Tornar-se Premium
                </Button>
                
                <div className="text-center mt-3">
                  <span className="text-xs text-gray-500">🎯 7 dias de garantia</span>
                </div>
              </CardContent>
            </Card>

            {/* Card de Destaque */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">🏆</div>
                <h3 className="font-bold text-purple-800 mb-1">Junte-se aos Melhores</h3>
                <p className="text-sm text-purple-600">
                  Mais de 10.000 estrategistas já dominam as táticas conosco
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthSystem