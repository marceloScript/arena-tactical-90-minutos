// src/pages/CardsShowcase.tsx
import React, { useState } from 'react'
import PlayerCard from '@/components/cards/PlayerCard'

const CardsShowcase: React.FC = () => {
  const [acquired, setAcquired] = useState<string[]>([])

  const handleAcquire = (name: string) => {
    alert(`VocÃª adquiriu: ${name}`)
    setAcquired((prev) => [...prev, name])
  }

  const mockPlayers = [
    {
      name: 'Meia Criativo',
      position: 'Meio-campista',
      rarity: 'silver' as const,
      rating: 85,
      price: 900,
      stats: { attack: 72, defense: 40, speed: 68, technique: 85 },
    },
    {
      name: 'Zagueiro de ForÃ§a',
      position: 'Defensor',
      rarity: 'bronze' as const,
      rating: 78,
      price: 600,
      stats: { attack: 50, defense: 82, speed: 58, technique: 62 },
    },
    {
      name: 'Ponta Veloz',
      position: 'Atacante',
      rarity: 'gold' as const,
      rating: 90,
      price: 1200,
      stats: { attack: 88, defense: 30, speed: 92, technique: 80 },
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950 p-10 text-white flex flex-wrap gap-8 justify-center items-center">
      {mockPlayers.map((player) => (
        <PlayerCard
          key={player.name}
          {...player}
          onAcquire={() => handleAcquire(player.name)}
        />
      ))}
    </div>
  )
}

export default CardsShowcase


