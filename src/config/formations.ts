// src/config/formations.ts

type RolePositions = { [role: string]: [number, number, number] };
type FormationSide = { home: RolePositions; away: RolePositions };
type TacticalFormations = { [formationName: string]: FormationSide };

export const TACTICAL_FORMATIONS: TacticalFormations = {
  "4-4-2": {
    home: {
      GK: [-50, 0.6, 0],
      LB: [-30, 0.6, 25], CB1: [-35, 0.6, 10], CB2: [-35, 0.6, -10], RB: [-30, 0.6, -25],
      CDM: [-15, 0.6, 0], LM: [-10, 0.6, 20], RM: [-10, 0.6, -20],
      ST1: [5, 0.6, 10], ST2: [5, 0.6, -10], LW: [0, 0.6, 30],
    },
    away: {
      GK: [50, 0.6, 0],
      LB: [30, 0.6, -25], CB1: [35, 0.6, -10], CB2: [35, 0.6, 10], RB: [30, 0.6, 25],
      CDM: [15, 0.6, 0], LM: [10, 0.6, -20], RM: [10, 0.6, 20],
      ST1: [-5, 0.6, -10], ST2: [-5, 0.6, 10], LW: [0, 0.6, -30],
    },
  },
  "4-3-3": {
    home: {
      GK: [-50, 0.6, 0],
      LB: [-32, 0.6, 28], CB1: [-35, 0.6, 10], CB2: [-35, 0.6, -10], RB: [-32, 0.6, -28],
      CDM: [-20, 0.6, 0], LM: [-10, 0.6, 15], RM: [-10, 0.6, -15],
      LW: [5, 0.6, 25], ST1: [10, 0.6, 5], ST2: [10, 0.6, -5],
    },
    away: {
      GK: [50, 0.6, 0],
      LB: [32, 0.6, -28], CB1: [35, 0.6, -10], CB2: [35, 0.6, 10], RB: [32, 0.6, 28],
      CDM: [20, 0.6, 0], LM: [10, 0.6, -15], RM: [10, 0.6, 15],
      LW: [-5, 0.6, -25], ST1: [-10, 0.6, -5], ST2: [-10, 0.6, 5],
    },
  },
  // Adicione outras formações aqui (ex: "3-5-2", "5-3-2", etc.)
};