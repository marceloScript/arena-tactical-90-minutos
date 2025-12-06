// src/components/Drawer.tsx
import React, { useState } from 'react'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import PlayerCard from './cards/PlayerCard'

const Drawer: React.FC = () => {
  const openPanel = useStore((state) => state.openPanel)
  const setOpenPanel = useStore((state) => state.setOpenPanel)

  const allPlayers = [
    {
      name: 'Maestro',
      position: 'Meio-campista criativo',
      rating: 87,
      price: 1500,
      rarity: 'silver' as const,
      stats: { attack: 80, defense: 50, speed: 70, technique: 90 },
    },
    {
      name: 'Muralha',
      position: 'Zagueiro físico',
      rating: 90,
      price: 1800,
      rarity: 'gold' as const,
      stats: { attack: 45, defense: 92, speed: 60, technique: 65 },
    },
    {
      name: 'Flecha',
      position: 'Atacante veloz',
      rating: 85,
      price: 1400,
      rarity: 'gold' as const,
      stats: { attack: 88, defense: 30, speed: 95, technique: 75 },
    },
    {
      name: 'Regente',
      position: 'Volante estratégico',
      rating: 83,
      price: 1300,
      rarity: 'silver' as const,
      stats: { attack: 65, defense: 75, speed: 68, technique: 78 },
    },
    {
      name: 'Coringa',
      position: 'Meia versátil',
      rating: 79,
      price: 1200,
      rarity: 'bronze' as const,
      stats: { attack: 70, defense: 60, speed: 66, technique: 73 },
    },
    {
      name: 'Tanque',
      position: 'Centroavante finalizador',
      rating: 84,
      price: 1600,
      rarity: 'silver' as const,
      stats: { attack: 85, defense: 40, speed: 55, technique: 68 },
    },
  ]

  const [visibleCount, setVisibleCount] = useState(3)

  const loadMore = () => {
    setVisibleCount((prev) => prev + 3)
  }

  let content: React.ReactNode
  switch (openPanel) {
    case 'camera':
      content = <div>Configurações da Câmera (exemplo)</div>
      break
    case 'strategy':
      content = <div>Estratégias e Táticas (exemplo)</div>
      break
    case 'scout':
      content = (
        <div className="space-y-4">
          <h2 className="text-lg font-bold mb-2">Jogadores Disponíveis</h2>
          <div className="space-y-3">
            {allPlayers.slice(0, visibleCount).map((player, index) => (
              <PlayerCard
                key={index}
                {...player}
                onAcquire={() => alert(`Adquiriu ${player.name}`)}
              />
            ))}
          </div>
          {visibleCount < allPlayers.length && (
            <button
              onClick={loadMore}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              Carregar Mais
            </button>
          )}
        </div>
      )
      break
    case 'career':
      content = (
        <div>
          <h2 className="text-lg font-bold mb-4">Modo Carreira</h2>
          <p>Funcionalidades específicas do modo carreira aqui.</p>
        </div>
      )
      break
    default:
      content = null
  }

  return (
    <div
      className={cn(
        'fixed top-0 right-0 z-50 h-full w-80 bg-gray-900/90 backdrop-blur-md border-l border-gray-700 p-6 text-white shadow-lg transition-transform',
        openPanel ? 'translate-x-0' : 'translate-x-full'
      )}
      style={{ transition: 'transform 0.3s ease-in-out' }}
    >
      <button
        className="mb-4 text-gray-400 hover:text-white"
        onClick={() => setOpenPanel(null)}
        aria-label="Fechar painel"
      >
        ✕ Fechar
      </button>

      <div className="h-full overflow-y-auto pr-2">{content}</div>
    </div>
  )
}

export default Drawer



