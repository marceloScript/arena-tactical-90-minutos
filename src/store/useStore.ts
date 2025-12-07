// src/store/useStore.ts - VERSÃO CORRIGIDA COMPLETA
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ======================= TYPES =======================
export interface Player {
  id: string;
  name: string;
  role: string;
  color: string;
  isSelected: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

export interface MatchState {
  homeScore: number;
  awayScore: number;
  currentTime: number;
  totalTime: number;
  isFirstHalf: boolean;
  attackMomentum: number;
  defenseMomentum: number;
  possession: number;
  shots: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  isDecisionPending: boolean;
  decisionTimeLeft: number;
}

export interface Store {
  // Authentication
  user: any | null;
  setUser: (user: any | null) => void;
  
  // Quiz
  quizQuestions: QuizQuestion[];
  setQuizQuestions: (questions: QuizQuestion[]) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  score: number;
  setScore: (score: number) => void;
  lives: number;
  setLives: (lives: number) => void;
  
  // Simulator
  homeTeam: Player[];
  awayTeam: Player[];
  setHomeTeam: (team: Player[]) => void;
  setAwayTeam: (team: Player[]) => void;
  homeFormation: string;
  setHomeFormation: (formation: string) => void;
  awayFormation: string;
  setAwayFormation: (formation: string) => void;
  selectedPlayer: Player | null;
  setSelectedPlayer: (player: Player | null) => void;
  
  // Match Tracker (NEW)
  matchState: MatchState;
  updateMatchState: (updates: Partial<MatchState>) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Authentication
      user: null,
      setUser: (user) => set({ user }),
      
      // Quiz
      quizQuestions: [],
      setQuizQuestions: (questions) => set({ quizQuestions: questions }),
      currentQuestionIndex: 0,
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      score: 0,
      setScore: (score) => set({ score }),
      lives: 3,
      setLives: (lives) => set({ lives }),
      
      // Simulator
      homeTeam: [],
      awayTeam: [],
      setHomeTeam: (team) => set({ homeTeam: team }),
      setAwayTeam: (team) => set({ awayTeam: team }),
      homeFormation: '4-3-3',
      setHomeFormation: (formation) => set({ homeFormation: formation }),
      awayFormation: '4-4-2',
      setAwayFormation: (formation) => set({ awayFormation: formation }),
      selectedPlayer: null,
      setSelectedPlayer: (player) => set({ selectedPlayer: player }),
      
      // ======================= MATCH TRACKER =======================
      matchState: {
        homeScore: 0,
        awayScore: 0,
        currentTime: 0,
        totalTime: 300, // 5 minutos
        isFirstHalf: true,
        attackMomentum: 50,
        defenseMomentum: 50,
        possession: 50,
        shots: { home: 0, away: 0 },
        corners: { home: 0, away: 0 },
        fouls: { home: 0, away: 0 },
        isDecisionPending: false,
        decisionTimeLeft: 10
      },

      updateMatchState: (updates) =>
        set((state) => ({ 
          matchState: { ...state.matchState, ...updates } 
        })),
    }),
    {
      name: 'arena-tactical-storage',
      // Opcional: partialize para persistir apenas alguns campos
      // partialize: (state) => ({ 
      //   user: state.user,
      //   score: state.score,
      //   lives: state.lives 
      // }),
    }
  )
);