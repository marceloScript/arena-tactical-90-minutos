import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// === Imports principais ===
import { authService, type User } from '@/lib/api';
import * as THREE from 'three';

import type { GameState, BallState } from '@/types/simulatorTypes';
import type {
  QuizSession,
  UserProgress,
  Question,
  QuizCategory,
  Difficulty
} from '@/types/quiz';

import type { Player } from '@/types/player';
import { quizQuestions, getRandomQuestions } from '@/data/quizQuestions';


// ======================================================
//                FUNÇÕES AUXILIARES
// ======================================================
const getRandomQuestion = (category: QuizCategory, difficulty: Difficulty): Question => {
  const filtered = quizQuestions.filter(
    q => q.category === category && q.difficulty === difficulty
  );

  if (filtered.length === 0) {
    const fallback = quizQuestions.filter(q => q.category === category);
    return (fallback.length ? fallback : getRandomQuestions(1))[0];
  }

  return filtered[Math.floor(Math.random() * filtered.length)];
};

const shouldResetLives = (lastReset: string): boolean => {
  const today = new Date().toDateString();
  const last = new Date(lastReset).toDateString();
  return today !== last;
};


// ======================================================
//                     TIPO DA STORE
// ======================================================
interface Store {
  // Painel
  openPanel: 'camera' | 'strategy' | 'scout' | 'career' | null;
  setOpenPanel: (panel: Store["openPanel"]) => void;

  // Simulador
  homeTeam: Player[];
  awayTeam: Player[];
  homeFormation: string;
  awayFormation: string;
  setHomeFormation: (formation: string) => void;
  setAwayFormation: (formation: string) => void;

  // Autenticação
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;

  // Quiz
  quizSession: QuizSession | null;
  currentQuestion: Question | null;
  userProgress: UserProgress;

  startQuiz: (category: QuizCategory, difficulty: Difficulty) => void;
  answerQuestion: (answerIndex: number) => boolean;
  nextQuestion: () => void;
  endQuiz: () => void;
  completeQuiz: () => void;
  clearQuizSession: () => void;

  // Vidas
  getRemainingLives: () => number;
  decrementLives: () => Promise<void>;
  resetDailyLives: () => Promise<void>;

  // Set manual
  setUser: (user: User) => void;

  // Game engine
  gameState: GameState;
  ball: BallState;
  selectedPlayer: Player | null;
  setGameState: (state: GameState) => void;
  updateBall: (updates: Partial<BallState>) => void;
  setSelectedPlayer: (player: Player | null) => void;
}


// ======================================================
//                       STORE FINAL
// ======================================================
export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // =========================== UI =================================
      openPanel: null,
      setOpenPanel: (panel) => set({ openPanel: panel }),

      // ======================= SIMULADOR 3D ===========================
      homeTeam: [
        { id: 1, name: 'Goleiro', role: 'GK', color: '#0077b6' },
        { id: 2, name: 'Zagueiro 1', role: 'CB1', color: '#0077b6' },
        { id: 3, name: 'Zagueiro 2', role: 'CB2', color: '#0077b6' },
        { id: 4, name: 'Lateral Esq.', role: 'LB', color: '#0077b6' },
        { id: 5, name: 'Lateral Dir.', role: 'RB', color: '#0077b6' },
        { id: 6, name: 'Volante', role: 'CDM', color: '#00b4d8' },
        { id: 7, name: 'Meia Esq.', role: 'LM', color: '#00b4d8' },
        { id: 8, name: 'Meia Dir.', role: 'RM', color: '#00b4d8' },
        { id: 9, name: 'Atacante 1', role: 'ST1', color: '#ade8f4' },
        { id: 10, name: 'Atacante 2', role: 'ST2', color: '#ade8f4' },
        { id: 11, name: 'Ponta', role: 'LW', color: '#ade8f4' }
      ],

      awayTeam: [
        { id: 12, name: 'Goleiro', role: 'GK', color: '#d00000' },
        { id: 13, name: 'Zagueiro 1', role: 'CB1', color: '#d00000' },
        { id: 14, name: 'Zagueiro 2', role: 'CB2', color: '#d00000' },
        { id: 15, name: 'Lateral Esq.', role: 'LB', color: '#d00000' },
        { id: 16, name: 'Lateral Dir.', role: 'RB', color: '#d00000' },
        { id: 17, name: 'Volante', role: 'CDM', color: '#dc2f02' },
        { id: 18, name: 'Meia Esq.', role: 'LM', color: '#dc2f02' },
        { id: 19, name: 'Meia Dir.', role: 'RM', color: '#dc2f02' },
        { id: 20, name: 'Atacante 1', role: 'ST1', color: '#e85d04' },
        { id: 21, name: 'Atacante 2', role: 'ST2', color: '#e85d04' },
        { id: 22, name: 'Ponta', role: 'LW', color: '#e85d04' }
      ],

      homeFormation: '4-4-2',
      awayFormation: '4-3-3',
      setHomeFormation: (formation) => set({ homeFormation: formation }),
      setAwayFormation: (formation) => set({ awayFormation: formation }),

      // ======================= AUTENTICAÇÃO =======================
      user: null,
      token: null,

      login: (token, user) => {
        localStorage.setItem('token', token);
        set({ token, user });
      },

      logout: () => {
        localStorage.removeItem('token');

        set({
          token: null,
          user: null,
          quizSession: null,
          currentQuestion: null,
          openPanel: null,
        });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
          const { usuario } = await authService.getPerfil();
          get().login(token, usuario);
        } catch {
          console.warn("Token inválido.");
          get().logout();
        }
      },

      // ======================= QUIZ =======================
      userProgress: {
        level: 1,
        experience: 0,
        totalQuizzes: 0,
        correctAnswers: 0,
        favoriteCategory: 'teoria_tatica',
        achievements: []
      },

      quizSession: null,
      currentQuestion: null,

      startQuiz: (category, difficulty) => {
        const { user, getRemainingLives, decrementLives } = get();

        if (!user) throw new Error('Usuário não autenticado.');

        if (!user.isPremium && getRemainingLives() <= 0)
          throw new Error('Sem vidas disponíveis.');

        const session: QuizSession = {
          currentQuestion: 0,
          score: 0,
          lives: 5,
          answers: [],
          startTime: new Date(),
          category,
          difficulty
        };

        if (!user.isPremium) decrementLives();

        set({
          quizSession: session,
          currentQuestion: getRandomQuestion(category, difficulty)
        });
      },

      answerQuestion: (answerIndex) => {
        const { quizSession, currentQuestion, userProgress } = get();
        if (!quizSession || !currentQuestion) return false;

        const correct = answerIndex === currentQuestion.correctAnswer;
        const newLives = correct ? quizSession.lives : quizSession.lives - 1;

        if (newLives <= 0) {
          set({
            quizSession: { ...quizSession, lives: 0 },
            userProgress: {
              ...userProgress,
              totalQuizzes: userProgress.totalQuizzes + 1
            }
          });
          return correct;
        }

        const updatedProgress: UserProgress = {
          ...userProgress,
          experience: userProgress.experience + (correct ? 10 : 5),
          correctAnswers: correct
            ? userProgress.correctAnswers + 1
            : userProgress.correctAnswers,
          totalQuizzes: userProgress.totalQuizzes + 1
        };

        updatedProgress.level = Math.floor(updatedProgress.experience / 100) + 1;
        if (correct) updatedProgress.favoriteCategory = quizSession.category;

        const updatedSession = {
          ...quizSession,
          score: correct ? quizSession.score + 10 : quizSession.score,
          lives: newLives,
          answers: [...quizSession.answers, correct],
          currentQuestion: quizSession.currentQuestion + 1
        };

        set({
          quizSession: updatedSession,
          userProgress: updatedProgress
        });

        return correct;
      },

      nextQuestion: () => {
        const { quizSession } = get();
        if (!quizSession) return;

        set({
          currentQuestion: getRandomQuestion(
            quizSession.category,
            quizSession.difficulty
          )
        });
      },

      endQuiz: () => {
        const { userProgress } = get();

        set({
          currentQuestion: null,
          userProgress: {
            ...userProgress,
            totalQuizzes: userProgress.totalQuizzes + 1
          }
        });
      },

      completeQuiz: () => {
        const { userProgress } = get();

        set({
          currentQuestion: null,
          userProgress: {
            ...userProgress,
            totalQuizzes: userProgress.totalQuizzes + 1
          }
        });
      },

      clearQuizSession: () => set({ quizSession: null, currentQuestion: null }),

      // ======================= VIDAS =======================
      getRemainingLives: () => {
        const { user } = get();
        if (!user) return 0;

        if (user.isPremium) return 999;

        if (shouldResetLives(user.lastLifeReset)) return 5;

        return user.dailyLives;
      },

      decrementLives: async () => {
        const { user } = get();
        if (!user || user.isPremium) return;

        try {
          const { usuario } = await authService.decrementUserLife();
          set({ user: usuario });
        } catch (err) {
          console.error("Erro ao decrementar vida:", err);
        }
      },

      resetDailyLives: async () => {
        const { usuario } = await authService.resetUserLives();
        set({ user: usuario });
      },

      // ======================= SET USER MANUAL =======================
      setUser: (user) => set({ user }),

      // ======================= GAME ENGINE =======================
      gameState: 'PRE_MATCH',
      ball: {
        position: new THREE.Vector3(0, 0.5, 0),
        velocity: new THREE.Vector3(0, 0, 0),
      },
      selectedPlayer: null,

      setGameState: (state) => set({ gameState: state }),

      updateBall: (updates) =>
        set((s) => ({ ball: { ...s.ball, ...updates } })),

      setSelectedPlayer: (player) => set({ selectedPlayer: player }),
    }),

    // ======================= persist =======================
    {
      name: 'arena-tactical-storage',
      partialize: (state) => ({
        token: state.token
      })
    }
  )
);
