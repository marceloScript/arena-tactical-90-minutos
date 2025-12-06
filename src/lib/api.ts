// src/lib/api.ts - SERVIÇO COMPATÍVEL COM SEU PROJETO
import { QuizFilters, QuizAnswer, BackendQuiz, QuizResult, RankingEntry, UserStats } from '@/types/quiz'

// Sugestão: Definir um tipo para o usuário para evitar o uso de `any`.
// Este tipo deve espelhar a estrutura COMPLETA do seu modelo de usuário no backend.
export interface User {
  id: string;
  nome: string;
  email: string;
  isPremium: boolean;
  dailyLives: number;
  lastLifeReset: string;
  // Adicione outras propriedades relevantes (ex: level, experience, avatar, etc.)
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Função auxiliar para requisições
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')

  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })
  
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status} - ${response.statusText}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.mensagem || errorBody.message || JSON.stringify(errorBody);
    } catch {}
    throw new Error(errorMessage);
  }
  
  return response.json()
}

// ----------------------
// SERVIÇO DE QUIZ
// ----------------------
export const quizService = {
  buscarQuizzes: async (filters?: QuizFilters) => {
    const params = new URLSearchParams()
    if (filters?.categoria && filters.categoria !== 'todos') params.append('categoria', filters.categoria)
    if (filters?.dificuldade && filters.dificuldade !== 'todos') params.append('dificuldade', filters.dificuldade)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    
    const query = params.toString()
    return apiRequest<{ quizzes: BackendQuiz[]; total: number }>(`/quiz${query ? `?${query}` : ''}`)
  },
  
  buscarQuizPorId: async (id: string) => {
    return apiRequest<{ quiz: BackendQuiz }>(`/quiz/${id}`)
  },
  
  submeterRespostas: async (quizId: string, respostas: QuizAnswer[], tempoTotalQuiz?: number) => {
    return apiRequest<{
      sucesso: boolean
      pontuacaoTotal: number
      acertos: number
      erros: number
      precisao: number
      vidasUsadas: number
      vidasRestantes: number
      resultadoId: string
    }>(`/quiz/${quizId}/submeter`, {
      method: 'POST',
      body: JSON.stringify({ respostas, tempoTotalQuiz }),
    })
  },

  buscarRanking: async (categoria?: string, page?: number, limit?: number) => {
    const params = new URLSearchParams()
    if (categoria) params.append('categoria', categoria)
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())
    
    const query = params.toString()
    return apiRequest<{ ranking: RankingEntry[]; total: number; minhaPosicao?: number }>(
      `/quiz/ranking${query ? `?${query}` : ''}`
    )
  },

  buscarResultados: async (categoria?: string, page?: number, limit?: number) => {
    const params = new URLSearchParams()
    if (categoria && categoria !== 'todos') params.append('categoria', categoria)
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())
    
    const query = params.toString()
    return apiRequest<{ resultados: QuizResult[]; total: number; estatisticas: UserStats }>(
      `/quiz/usuario/resultados${query ? `?${query}` : ''}`
    )
  },

  buscarEstatisticas: async () => {
    return apiRequest<{
      ranking: RankingEntry[]
      resultadosRecentes: QuizResult[]
      estatisticasPorCategoria: { categoria: string; pontuacaoMedia: number; quizzesJogados: number }[]
      progressoDiario: { data: string; quizzesCompletos: number }[]
    }>('/quiz/usuario/estatisticas')
  },

  avaliarQuiz: async (quizId: string, avaliacao: number) => {
    return apiRequest<{ avaliacaoMedia: number; totalAvaliacoes: number }>(
      `/quiz/${quizId}/avaliar`,
      {
        method: 'POST',
        body: JSON.stringify({ avaliacao }),
      }
    )
  },

  criarQuiz: async (quizData: Partial<BackendQuiz>) => {
    return apiRequest<{ quiz: BackendQuiz }>('/quiz', {
      method: 'POST',
      body: JSON.stringify(quizData),
    })
  }
}

// ----------------------
// SERVIÇO DE AUTENTICAÇÃO
// ----------------------
export const authService = {
  login: async (email: string, senha: string) => {
    return apiRequest<{ token: string; usuario: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    })
  },

  cadastro: async (nome: string, email: string, senha: string) => {
    return apiRequest<{ token: string; usuario: User }>('/auth/cadastro', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha }),
    })
  },

  getPerfil: async () => {
    return apiRequest<{ usuario: User }>('/auth/perfil')
  },

  // FUNÇÕES ADICIONADAS PARA SINCRONIZAR ESTADO COM O BACKEND
  decrementUserLife: async () => {
    return apiRequest<{ usuario: User }>('/user/decrement-life', {
      method: 'POST',
    });
  },

  resetUserLives: async () => {
    return apiRequest<{ usuario: User }>('/user/reset-lives', {
      method: 'POST',
    });
  }
}

// ----------------------
// SERVIÇO DE PAGAMENTO (STRIPE)
// ----------------------
export const paymentService = {
  createCheckoutSession: async () => {
    return apiRequest<{ sessionId: string }>(
      '/payment/create-checkout-session',
      {
        method: 'POST',
      }
    )
  },
}

// ----------------------
// HOOK FINAL
// ----------------------
export const useApi = () => {
  return {
    quiz: quizService,
    auth: authService,
    payment: paymentService, // AGORA DISPONÍVEL
  }
}
