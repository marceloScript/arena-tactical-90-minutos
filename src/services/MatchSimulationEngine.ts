// src/services/MatchSimulationEngine.ts - VERSÃO CORRIGIDA
import { useStore, type MatchState } from '@/store/useStore';

// Tipos de eventos do jogo
export type MatchEvent = 
  | 'FOUL_HOME'
  | 'FOUL_AWAY' 
  | 'CORNER_HOME'
  | 'CORNER_AWAY'
  | 'SHOT_ON_TARGET'
  | 'SHOT_OFF_TARGET'
  | 'YELLOW_CARD'
  | 'RED_CARD'
  | 'SUBSTITUTION'
  | 'INJURY'
  | 'PENALTY'
  | 'OFFSIDE';

// Tipos de decisões táticas
export type TacticalDecision =
  | 'HIGH_PRESS'
  | 'MID_PRESS'
  | 'LOW_BLOCK'
  | 'COUNTER_ATTACK'
  | 'POSSESSION'
  | 'WING_PLAY'
  | 'QUICK_FREE_KICK'
  | 'ORGANIZED_ATTACK'
  | 'SUBSTITUTE'
  | 'CHANGE_FORMATION';

// Interface para evento com decisão
export interface DecisionEvent {
  id: string;
  type: MatchEvent;
  message: string;
  time: number;
  decisions: {
    id: TacticalDecision;
    label: string;
    icon: string;
    risk: 'low' | 'medium' | 'high';
    potentialReward: number;
  }[];
  timeout: number;
}

class MatchSimulationEngine {
  private timer: NodeJS.Timeout | null = null;
  private matchStartTime: number = 0;
  private isMatchRunning: boolean = false;
  private currentDecision: DecisionEvent | null = null;
  private decisionTimeout: NodeJS.Timeout | null = null;

  // Configuração do jogo
  private readonly MATCH_CONFIG = {
    FIRST_HALF_DURATION: 300,
    HALFTIME_DURATION: 120,
    SECOND_HALF_DURATION: 300,
    DECISION_TIMEOUT: 15,
    EVENT_INTERVAL_MIN: 30,
    EVENT_INTERVAL_MAX: 90,
  };

  constructor() {
    console.log('MatchSimulationEngine inicializado');
  }

  // ======================= SISTEMA DE TEMPO =======================
  
  startMatch(): void {
    if (this.isMatchRunning) {
      console.warn('Partida já está em andamento');
      return;
    }

    const store = useStore.getState();
    
    // Resetar estado
    store.updateMatchState({
      homeScore: 0,
      awayScore: 0,
      currentTime: 0,
      isFirstHalf: true,
      attackMomentum: 50,
      defenseMomentum: 50,
      possession: 50,
      shots: { home: 0, away: 0 },
      corners: { home: 0, away: 0 },
      fouls: { home: 0, away: 0 },
      isDecisionPending: false,
      decisionTimeLeft: this.MATCH_CONFIG.DECISION_TIMEOUT,
    });

    this.matchStartTime = Date.now();
    this.isMatchRunning = true;
    
    console.log('🏁 Partida iniciada!');
    this.startGameLoop();
  }

  private startGameLoop(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.updateGameState();
    }, 1000);
  }

  private updateGameState(): void {
    if (!this.isMatchRunning) return;

    const store = useStore.getState();
    const currentState = store.matchState;
    
    // Calcular tempo decorrido
    const elapsedSeconds = Math.floor((Date.now() - this.matchStartTime) / 1000);
    const matchTime = elapsedSeconds % (this.MATCH_CONFIG.FIRST_HALF_DURATION + 
                                      this.MATCH_CONFIG.HALFTIME_DURATION + 
                                      this.MATCH_CONFIG.SECOND_HALF_DURATION);
    
    // Determinar fase do jogo
    let gamePhase: 'firstHalf' | 'halftime' | 'secondHalf';
    let displayTime = matchTime;
    let isFirstHalf = true;

    if (matchTime < this.MATCH_CONFIG.FIRST_HALF_DURATION) {
      gamePhase = 'firstHalf';
      displayTime = matchTime;
      isFirstHalf = true;
    } else if (matchTime < this.MATCH_CONFIG.FIRST_HALF_DURATION + this.MATCH_CONFIG.HALFTIME_DURATION) {
      gamePhase = 'halftime';
      displayTime = matchTime - this.MATCH_CONFIG.FIRST_HALF_DURATION;
      isFirstHalf = false;
    } else {
      gamePhase = 'secondHalf';
      displayTime = matchTime - this.MATCH_CONFIG.FIRST_HALF_DURATION - this.MATCH_CONFIG.HALFTIME_DURATION;
      isFirstHalf = false;
    }

    // Atualizar store
    store.updateMatchState({
      currentTime: displayTime,
      isFirstHalf,
    });

    // Gerar eventos aleatórios
    if (gamePhase !== 'halftime' && !currentState.isDecisionPending) {
      this.maybeGenerateEvent(displayTime);
    }

    // Atualizar contador de decisão
    if (currentState.isDecisionPending && currentState.decisionTimeLeft > 0) {
      store.updateMatchState({
        decisionTimeLeft: currentState.decisionTimeLeft - 1,
      });

      if (currentState.decisionTimeLeft <= 1) {
        this.handleDecisionTimeout();
      }
    }

    this.checkMatchEnd(displayTime, gamePhase);
  }

  private checkMatchEnd(currentTime: number, phase: string): void {
    if (phase === 'firstHalf' && currentTime >= this.MATCH_CONFIG.FIRST_HALF_DURATION) {
      this.endFirstHalf();
    } else if (phase === 'secondHalf' && currentTime >= this.MATCH_CONFIG.SECOND_HALF_DURATION) {
      this.endMatch();
    }
  }

  private endFirstHalf(): void {
    console.log('🔄 Fim do 1º tempo! Intervalo de 2 minutos...');
  }

  private endMatch(): void {
    console.log('🏁 FIM DE JOGO!');
    this.stopMatch();
    
    const store = useStore.getState();
    store.updateMatchState({
      isDecisionPending: false,
    });
  }

  stopMatch(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    if (this.decisionTimeout) {
      clearTimeout(this.decisionTimeout);
      this.decisionTimeout = null;
    }
    
    this.isMatchRunning = false;
    this.currentDecision = null;
    
    console.log('⏹️ Partida parada');
  }

  // ======================= SISTEMA DE EVENTOS =======================
  
  private maybeGenerateEvent(currentTime: number): void {
    if (Math.random() > 0.2) return;
    if (currentTime < 30 || currentTime > 270) return;

    const events: MatchEvent[] = [
      'FOUL_HOME',
      'FOUL_AWAY', 
      'CORNER_HOME',
      'CORNER_AWAY',
      'SHOT_ON_TARGET',
      'YELLOW_CARD',
      'SUBSTITUTION',
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    this.triggerEvent(randomEvent, currentTime);
  }

  private triggerEvent(eventType: MatchEvent, currentTime: number): void {
    const event = this.createDecisionEvent(eventType, currentTime);
    this.currentDecision = event;
    
    const store = useStore.getState();
    store.updateMatchState({
      isDecisionPending: true,
      decisionTimeLeft: this.MATCH_CONFIG.DECISION_TIMEOUT,
    });

    console.log(`🎯 EVENTO: ${event.message} (${currentTime}s)`);
    
    this.decisionTimeout = setTimeout(() => {
      this.handleDecisionTimeout();
    }, this.MATCH_CONFIG.DECISION_TIMEOUT * 1000);
  }

  private createDecisionEvent(eventType: MatchEvent, currentTime: number): DecisionEvent {
    const events: Record<MatchEvent, { message: string; decisions: TacticalDecision[] }> = {
      'FOUL_HOME': {
        message: 'Falta a favor do seu time! Como cobrar?',
        decisions: ['QUICK_FREE_KICK', 'ORGANIZED_ATTACK', 'CHANGE_FORMATION'],
      },
      'FOUL_AWAY': {
        message: 'Falta contra seu time! Como se organizar?',
        decisions: ['HIGH_PRESS', 'MID_PRESS', 'LOW_BLOCK'],
      },
      'CORNER_HOME': {
        message: 'Escanteio a favor! Qual estratégia?',
        decisions: ['QUICK_FREE_KICK', 'ORGANIZED_ATTACK', 'SUBSTITUTE'],
      },
      'CORNER_AWAY': {
        message: 'Escanteio contra! Como defender?',
        decisions: ['HIGH_PRESS', 'LOW_BLOCK', 'CHANGE_FORMATION'],
      },
      'SHOT_ON_TARGET': {
        message: 'Finalização perigosa! Reorganizar defesa?',
        decisions: ['HIGH_PRESS', 'COUNTER_ATTACK', 'POSSESSION'],
      },
      'SHOT_OFF_TARGET': {
        message: 'Finalização para fora. Retomar jogo?',
        decisions: ['QUICK_FREE_KICK', 'POSSESSION', 'WING_PLAY'],
      },
      'YELLOW_CARD': {
        message: 'Cartão amarelo! Proteger o jogador?',
        decisions: ['SUBSTITUTE', 'CHANGE_FORMATION', 'LOW_BLOCK'],
      },
      'RED_CARD': {
        message: 'Cartão vermelho! Reorganizar time?',
        decisions: ['CHANGE_FORMATION', 'LOW_BLOCK', 'SUBSTITUTE'],
      },
      'SUBSTITUTION': {
        message: 'Jogador cansado! Substituir?',
        decisions: ['SUBSTITUTE', 'CHANGE_FORMATION', 'HIGH_PRESS'],
      },
      'INJURY': {
        message: 'Jogador lesionado! O que fazer?',
        decisions: ['SUBSTITUTE', 'CHANGE_FORMATION', 'LOW_BLOCK'],
      },
      'PENALTY': {
        message: 'PÊNALTI! Quem cobrar?',
        decisions: ['QUICK_FREE_KICK', 'ORGANIZED_ATTACK', 'CHANGE_FORMATION'],
      },
      'OFFSIDE': {
        message: 'Impedimento! Reiniciar o jogo?',
        decisions: ['QUICK_FREE_KICK', 'POSSESSION', 'COUNTER_ATTACK'],
      },
    };

    const eventConfig = events[eventType];
    
    const decisionMap: Record<TacticalDecision, { label: string; icon: string; risk: 'low' | 'medium' | 'high'; reward: number }> = {
      'HIGH_PRESS': { label: 'Pressão Alta', icon: '🔥', risk: 'high', reward: 25 },
      'MID_PRESS': { label: 'Pressão Média', icon: '⚡', risk: 'medium', reward: 15 },
      'LOW_BLOCK': { label: 'Bloqueio Baixo', icon: '🛡️', risk: 'low', reward: 10 },
      'COUNTER_ATTACK': { label: 'Contra-ataque', icon: '🎯', risk: 'high', reward: 30 },
      'POSSESSION': { label: 'Posse de Bola', icon: '🌀', risk: 'low', reward: 12 },
      'WING_PLAY': { label: 'Jogo pelas Pontas', icon: '↕️', risk: 'medium', reward: 18 },
      'QUICK_FREE_KICK': { label: 'Cobrança Rápida', icon: '🚀', risk: 'high', reward: 35 },
      'ORGANIZED_ATTACK': { label: 'Ataque Organizado', icon: '📊', risk: 'low', reward: 15 },
      'SUBSTITUTE': { label: 'Substituir Jogador', icon: '🔄', risk: 'medium', reward: 20 },
      'CHANGE_FORMATION': { label: 'Mudar Formação', icon: '⚙️', risk: 'medium', reward: 25 },
    };

    const decisions = eventConfig.decisions.map(decisionId => ({
      id: decisionId,
      ...decisionMap[decisionId],
      potentialReward: decisionMap[decisionId].reward,
    }));

    return {
      id: `event_${Date.now()}`,
      type: eventType,
      message: eventConfig.message,
      time: currentTime,
      decisions,
      timeout: this.MATCH_CONFIG.DECISION_TIMEOUT,
    };
  }

  // ======================= SISTEMA DE DECISÕES =======================
  
  processDecision(decisionId: TacticalDecision): void {
    if (!this.currentDecision || !useStore.getState().matchState.isDecisionPending) {
      console.warn('Nenhuma decisão pendente');
      return;
    }

    if (this.decisionTimeout) {
      clearTimeout(this.decisionTimeout);
      this.decisionTimeout = null;
    }

    const store = useStore.getState();
    const currentState = store.matchState;
    
    const chosenDecision = this.currentDecision.decisions.find(d => d.id === decisionId);
    
    if (!chosenDecision) {
      console.error('Decisão inválida:', decisionId);
      return;
    }

    console.log(`✅ Decisão tomada: ${chosenDecision.label} (${chosenDecision.risk})`);

    const momentumChange = this.calculateMomentumChange(chosenDecision.risk, chosenDecision.potentialReward);
    const statChanges = this.calculateStatChanges(decisionId);

    store.updateMatchState({
      isDecisionPending: false,
      decisionTimeLeft: this.MATCH_CONFIG.DECISION_TIMEOUT,
      attackMomentum: Math.max(0, Math.min(100, currentState.attackMomentum + momentumChange.attack)),
      defenseMomentum: Math.max(0, Math.min(100, currentState.defenseMomentum + momentumChange.defense)),
      ...statChanges,
    });

    this.currentDecision = null;
  }

  private handleDecisionTimeout(): void {
    console.log('⏰ Tempo esgotado! Decisão automática (conservadora)');
    
    const store = useStore.getState();
    
    store.updateMatchState({
      isDecisionPending: false,
      decisionTimeLeft: this.MATCH_CONFIG.DECISION_TIMEOUT,
      attackMomentum: Math.max(0, store.matchState.attackMomentum - 5),
      defenseMomentum: Math.max(0, store.matchState.defenseMomentum - 5),
    });

    if (this.decisionTimeout) {
      clearTimeout(this.decisionTimeout);
      this.decisionTimeout = null;
    }
    
    this.currentDecision = null;
  }

  private calculateMomentumChange(risk: 'low' | 'medium' | 'high', potentialReward: number): {
    attack: number;
    defense: number;
  } {
    const riskMultiplier = {
      low: 0.7,
      medium: 1.0,
      high: 1.3,
    };

    const baseChange = potentialReward * riskMultiplier[risk];
    const randomFactor = 0.8 + Math.random() * 0.4;
    
    const totalChange = Math.round(baseChange * randomFactor);
    const attackRatio = 0.5 + (Math.random() * 0.3 - 0.15);
    
    return {
      attack: Math.round(totalChange * attackRatio),
      defense: Math.round(totalChange * (1 - attackRatio)),
    };
  }

  private calculateStatChanges(decisionId: TacticalDecision): Partial<MatchState> {
    const store = useStore.getState();
    const currentState = store.matchState;
    
    const changes: Partial<MatchState> = {};
    
    switch (decisionId) {
      case 'HIGH_PRESS':
        changes.fouls = { 
          home: currentState.fouls.home + 1, 
          away: currentState.fouls.away 
        };
        break;
      case 'COUNTER_ATTACK':
        changes.shots = { 
          home: currentState.shots.home + 1, 
          away: currentState.shots.away 
        };
        break;
      case 'QUICK_FREE_KICK':
        changes.corners = { 
          home: currentState.corners.home + 1, 
          away: currentState.corners.away 
        };
        break;
      case 'SUBSTITUTE':
        break;
      default:
        changes.possession = Math.max(0, Math.min(100, currentState.possession + (Math.random() * 10 - 5)));
    }
    
    return changes;
  }

  // ======================= UTILITÁRIOS =======================
  
  getMatchState() {
    return useStore.getState().matchState;
  }

  isMatchActive(): boolean {
    return this.isMatchRunning;
  }

  getCurrentDecision(): DecisionEvent | null {
    return this.currentDecision;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// Exportar instância singleton
export const matchEngine = new MatchSimulationEngine();