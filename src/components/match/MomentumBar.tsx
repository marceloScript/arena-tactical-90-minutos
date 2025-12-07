import React from 'react';

interface MomentumBarProps {
  attackMomentum: number; // 0-100
  defenseMomentum: number; // 0-100
}

// Barra de momentum ataque/defesa
const MomentumBar: React.FC<MomentumBarProps> = ({
  attackMomentum,
  defenseMomentum
}) => {
  const total = attackMomentum + defenseMomentum;
  const attackPercent = total > 0 ? (attackMomentum / total) * 100 : 50;

  return (
    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-96 bg-black/80 rounded-full p-1">
      <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
        {/* Barra de ataque (vermelha) */}
        <div
          className="absolute left-0 top-0 h-full bg-red-500 transition-all duration-500"
          style={{ width: `${attackPercent}%` }}
        />

        {/* Barra de defesa (azul) */}
        <div
          className="absolute right-0 top-0 h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${100 - attackPercent}%` }}
        />

        {/* Centro */}
        <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white transform -translate-x-0.5" />
      </div>

      <div className="flex justify-between text-xs text-white mt-1">
        <span>🔥 ATK {attackMomentum}%</span>
        <span>🛡️ DEF {defenseMomentum}%</span>
      </div>
    </div>
  );
};

export default MomentumBar;
