import React from 'react';

interface ScoreboardProps {
  homeScore: number;
  awayScore: number;
  currentTime: number;
  totalTime: number;
  isFirstHalf: boolean;
}

const Scoreboard: React.FC<ScoreboardProps> = ({
  homeScore,
  awayScore,
  currentTime,
  totalTime,
  isFirstHalf
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timePercentage = (currentTime / totalTime) * 100;

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
      <div className="bg-black/80 rounded-lg p-4 text-white">
        {/* Placar */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{homeScore}</div>
            <div className="text-sm text-gray-300">CASA</div>
          </div>

          <div className="text-center px-4">
            <div className="text-lg font-bold mb-1">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs text-gray-400">
              {isFirstHalf ? '1º TEMPO' : '2º TEMPO'}
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">{awayScore}</div>
            <div className="text-sm text-gray-300">VISITANTE</div>
          </div>
        </div>

        {/* Barra de progresso do tempo */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${timePercentage}%` }}
          />
        </div>

        <div className="text-center text-xs text-gray-400">
          {formatTime(totalTime - currentTime)} restantes
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
