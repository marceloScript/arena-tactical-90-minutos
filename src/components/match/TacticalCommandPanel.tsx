import React from 'react';
import { Button } from '@/components/ui/button';

interface TacticalCommandPanelProps {
  onTacticalDecision: (decision: string) => void;
  isDecisionPending: boolean;
  decisionTimeLeft: number;
}

// Painel de comandos táticos com 6 botões
const TacticalCommandPanel: React.FC<TacticalCommandPanelProps> = ({
  onTacticalDecision,
  isDecisionPending,
  decisionTimeLeft
}) => {
  const tacticalOptions = [
    { id: 'attack_left', label: '🚀 Ataque Esquerda', description: 'Ataque pelo flanco esquerdo' },
    { id: 'attack_center', label: '⚡ Ataque Centro', description: 'Ataque direto pelo centro' },
    { id: 'attack_right', label: '🚀 Ataque Direita', description: 'Ataque pelo flanco direito' },
    { id: 'defend_left', label: '🛡️ Defende Esquerda', description: 'Reforça defesa esquerda' },
    { id: 'defend_center', label: '🛡️ Defende Centro', description: 'Reforça defesa central' },
    { id: 'defend_right', label: '🛡️ Defende Direita', description: 'Reforça defesa direita' }
  ];

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
      <div className="bg-black/80 rounded-lg p-4">
        {isDecisionPending && (
          <div className="text-center mb-4">
            <div className="text-white text-lg font-bold mb-2">
              DECISÃO TÁTICA - Tempo: {decisionTimeLeft}s
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${(decisionTimeLeft / 10) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          {tacticalOptions.map((option) => (
            <Button
              key={option.id}
              onClick={() => onTacticalDecision(option.id)}
              disabled={!isDecisionPending}
              className="h-16 flex flex-col items-center justify-center text-xs font-bold"
              variant={option.id.includes('attack') ? 'default' : 'secondary'}
            >
              <div className="text-lg">{option.label.split(' ')[0]}</div>
              <div>{option.label.split(' ').slice(1).join(' ')}</div>
            </Button>
          ))}
        </div>

        {!isDecisionPending && (
          <div className="text-center mt-4 text-gray-400">
            Aguardando próximo momento de decisão...
          </div>
        )}
      </div>
    </div>
  );
};

export default TacticalCommandPanel;
