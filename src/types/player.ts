export interface Player {
  id: number;
  name: string;
  role: string; // Idealmente, um tipo de união como 'GK' | 'LB' | 'RB' ...
  color: string;
  isSelected?: boolean;
}