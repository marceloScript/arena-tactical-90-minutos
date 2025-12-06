// src/types/quiz.ts

// -------------------- Questões --------------------
export interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  category: QuizCategory
  difficulty: Difficulty
  explanation?: string
}

// -------------------- Categorias --------------------
export type QuizCategory =
  | 'regulamento_fifa'
  | 'direito_desportivo'
  | 'agentes_intermediarios'
  | 'teoria_tatica'
  | 'historia_tatica'
  | 'principios_jogo'
  | 'analise_desempenho'
  | 'gestao_clubes'
  | 'metodologia_treinamento'

export type Difficulty = 'facil' | 'medio' | 'dificil' | 'expert'

export const QUIZ_CATEGORIES = {
  regulamento_fifa: 'Regulamento FIFA',
  direito_desportivo: 'Direito Desportivo',
  agentes_intermediarios: 'Agentes e Intermediários',
  teoria_tatica: 'Teoria Tática',
  historia_tatica: 'História Tática',
  principios_jogo: 'Princípios de Jogo',
  analise_desempenho: 'Análise de Desempenho',
  gestao_clubes: 'Gestão de Clubes',
  metodologia_treinamento: 'Metodologia de Treinamento'
}

export const DIFFICULTY_LEVELS = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
  expert: 'Expert'
}

// -------------------- Sessão de Quiz --------------------
export interface QuizSession {
  currentQuestion: number
  score: number
  lives: number
  answers: boolean[]
  startTime: Date
  category: QuizCategory
  difficulty: Difficulty
}

// -------------------- Progresso do Usuário --------------------
export interface UserProgress {
  level: number
  experience: number
  totalQuizzes: number
  correctAnswers: number
  favoriteCategory: QuizCategory
  achievements: string[]
}

// -------------------- Tipos adicionais --------------------
export interface QuizFilters {
  categoria?: QuizCategory | 'todos'   // ✅ agora aceita "todos"
  dificuldade?: Difficulty | 'todos'   // ✅ agora aceita "todos"
  search?: string
  page?: number
  limit?: number
}

export interface QuizAnswer {
  questionId: string
  answer: string
}

export interface BackendQuiz {
  id: string
  titulo: string
  categoria: QuizCategory
  dificuldade: Difficulty
  questions: Question[]
}

export interface QuizResult {
  quizId: string
  score: number
  correctAnswers: number
}

export interface RankingEntry {
  user: { name: string }
  score: number
  position: number
}

export interface UserStats {
  averageScore: number
  quizzesPlayed: number
}