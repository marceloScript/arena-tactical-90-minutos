import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown, Check, X, Star, Shield, Zap, Users, Target, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from "@stripe/stripe-js"
import paymentService from "../services/paymentService"

// Carrega apenas uma vez (corrige o erro de tipo do Stripe)
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY) : null;

interface PremiumFeaturesProps {
  onBack: () => void
}

const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ onBack }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleBecomePremium = async () => {
    if (!stripePromise) {
      alert("Premium temporariamente indisponível");
      return;
    }

    try {
      setLoading(true)
      setError("")

      // 1. Cria sessão no backend
      const response = await paymentService.createCheckoutSession()
      const { sessionId } = response

      if (!sessionId) {
        setError("Erro ao criar sessão de pagamento.")
        setLoading(false)
        return
      }

      // 2. Carrega Stripe JS com a chave publicável (AGORA CERTA)
      const stripe = await stripePromise

      if (!stripe) {
        setError("Erro ao carregar Stripe.")
        setLoading(false)
        return
      }

      // 3. Redireciona para o checkout
      await stripe.redirectToCheckout({ sessionId })
    } catch (err) {
      console.error(err)
      setError("Erro inesperado ao processar pagamento.")
    } finally {
      setLoading(false)
    }
  }

  const features = [
    { name: 'Vidas Ilimitadas', free: '5/dia', premium: 'Ilimitadas' },
    { name: 'Jogo 3D', free: '3/dia', premium: 'Ilimitado' },
    { name: 'Conteúdo Exclusivo', free: <X className="h-4 w-4 text-red-500" />, premium: <Check className="h-4 w-4 text-green-500" /> },
    { name: 'Times Personalizados', free: <X className="h-4 w-4 text-red-500" />, premium: <Check className="h-4 w-4 text-green-500" /> },
    { name: 'Análise Avançada', free: <X className="h-4 w-4 text-red-500" />, premium: <Check className="h-4 w-4 text-green-500" /> },
    { name: 'Suporte Prioritário', free: 'Básico', premium: '24/7' }
  ]

  const premiumBenefits = [
    { icon: <Zap className="h-6 w-6" />, title: 'Vidas Ilimitadas', desc: 'Quiz + Jogo 3D sem restrições' },
    { icon: <Crown className="h-6 w-6" />, title: 'Conteúdo Exclusivo', desc: 'Formações e táticas especiais' },
    { icon: <Target className="h-6 w-6" />, title: 'Análise Avançada', desc: 'Relatórios detalhados de desempenho' },
    { icon: <Users className="h-6 w-6" />, title: 'Comunidade Elite', desc: 'Acesso a grupos exclusivos' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-100 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à Home
          </Button>
          
          <h1 className="text-5xl md:text-6xl font-bold text-yellow-600 mb-4">
            <Crown className="h-12 w-12 inline mr-4 mb-2" />
            Premium Arena
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Experiência completa sem limites. Junte-se aos melhores estrategistas do futebol.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Plano Gratuito */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-700">Conta Gratuita</CardTitle>
              <CardDescription>Ideal para começar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">Grátis</div>
                <div className="text-sm text-gray-600">Sempre</div>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-700 mb-2">🎯 Inclui:</h4>
                  <ul className="text-sm text-green-600 space-y-2">
                    <li>• 5 Vidas de Quiz por dia</li>
                    <li>• 3 Vidas de Jogo 3D por dia</li>
                    <li>• Todas as Categorias</li>
                    <li>• Progresso Salvo</li>
                    <li>• Estatísticas Básicas</li>
                    <li>• Suporte Comunitário</li>
                  </ul>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => navigate('/auth')}
              >
                Continuar Gratuito
              </Button>
            </CardContent>
          </Card>

          {/* Plano Premium */}
          <Card className="border-2 border-yellow-500 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-xl relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                MAIS POPULAR
              </span>
            </div>
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-yellow-700">Premium Arena</CardTitle>
              <CardDescription>Experiência completa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-700">R$ 29,90</div>
                <div className="text-sm text-gray-600">por mês • Cancele quando quiser</div>
              </div>

              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-700 mb-2">🚀 Tudo do Premium:</h4>
                  <ul className="text-sm text-yellow-600 space-y-2">
                    <li>• Vidas Ilimitadas (Quiz + Jogo 3D)</li>
                    <li>• Conteúdo Exclusivo Premium</li>
                    <li>• Análise Avançada de Desempenho</li>
                    <li>• Times Personalizados</li>
                    <li>• Suporte Prioritário 24/7</li>
                    <li>• Acesso Antecipado a Novos Recursos</li>
                  </ul>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center mb-4">
                  {error}
                </div>
              )}

              <Button
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 text-lg shadow-lg"
                onClick={handleBecomePremium}
                disabled={loading}
              >
                <Crown className="h-5 w-5 mr-2" />
                {loading ? "Processando..." : "Tornar-se Premium"}
              </Button>

              <div className="text-center text-sm text-gray-600">
                <Shield className="h-4 w-4 inline mr-1" />
                🎯 7 dias de garantia • 🏆 10.000+ estrategistas
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparação Detalhada */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Comparação de Planos</CardTitle>
            <CardDescription>Veja a diferença entre Gratuito e Premium</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 font-semibold">Recurso</th>
                    <th className="text-center py-4 font-semibold text-gray-700">Gratuito</th>
                    <th className="text-center py-4 font-semibold text-yellow-600">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 font-medium">{feature.name}</td>
                      <td className="text-center py-4 text-gray-600">
                        {feature.free}
                      </td>
                      <td className="text-center py-4 text-yellow-600 font-semibold">
                        {feature.premium}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Benefícios do Premium */}
        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Junte-se aos Melhores</CardTitle>
            <CardDescription className="text-yellow-100">
              Mais de 10.000 estrategistas já dominam as táticas conosco
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {premiumBenefits.map((benefit, index) => (
                <div key={index} className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <div className="flex justify-center mb-3">
                    <div className="bg-white/20 p-3 rounded-full">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-yellow-100 text-sm">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PremiumFeatures