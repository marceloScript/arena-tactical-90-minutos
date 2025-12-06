// src/components/cards/PlayerCard.tsx
import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type PlayerCardProps = {
  name: string
  position: string
  rating: number
  price: number
  rarity: 'bronze' | 'silver' | 'gold'
  stats: {
    attack: number
    defense: number
    speed: number
    technique: number
  }
  onAcquire: () => void
}

const rarityStyles = {
  bronze: {
    bg: 'bg-yellow-800',
    border: 'border-yellow-600',
    text: 'text-white',
  },
  silver: {
    bg: 'bg-gray-500',
    border: 'border-gray-300',
    text: 'text-white',
  },
  gold: {
    bg: 'bg-yellow-400',
    border: 'border-yellow-300',
    text: 'text-black',
  },
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  position,
  rating,
  price,
  rarity,
  stats,
  onAcquire,
}) => {
  const style = rarityStyles[rarity]

  return (
    <div
      className={cn(
        'rounded-xl shadow-xl p-4 w-60 border-2',
        style.bg,
        style.border,
        style.text,
        'hover:scale-105 transition-transform relative'
      )}
    >
      <div className="absolute top-2 right-2 text-sm font-bold bg-black/40 px-2 py-1 rounded text-white">
        ⭐ {rating}
      </div>

      <div className="text-xl font-bold mb-2">{name}</div>
      <div className="text-sm italic mb-2">{position}</div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
        <span>🎯 Ataque: {stats.attack}</span>
        <span>🛡 Defesa: {stats.defense}</span>
        <span>⚡ Velocidade: {stats.speed}</span>
        <span>🎩 Técnica: {stats.technique}</span>
      </div>

      <div className={cn('text-center font-semibold mb-2', rarity === 'gold' ? 'text-gray-900' : 'text-yellow-300')}>
        💰 {price} moedas
      </div>

      <Button onClick={onAcquire} variant="secondary" className="w-full">
        Adquirir
      </Button>
    </div>
  )
}

export default PlayerCard


