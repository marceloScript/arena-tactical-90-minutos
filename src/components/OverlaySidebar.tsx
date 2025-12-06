// src/components/OverlaySidebar.tsx
import React from 'react'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal, Users, Shield, Trophy, SunMoon, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store/useStore'

const SidebarOverlay: React.FC = () => {
  const openPanel = useStore((state) => state.openPanel)
  const setOpenPanel = useStore((state) => state.setOpenPanel)
  const gameState = useStore((state) => state.gameState)
  const setGameState = useStore((state) => state.setGameState)

  const togglePanel = (panelName: string) => {
    if (openPanel === panelName) {
      setOpenPanel(null) // fecha se clicar no mesmo botão
    } else {
      setOpenPanel(panelName as any)
    }
  }

  const startGame = () => {
    if (gameState === 'PRE_MATCH') {
      setGameState('PLAYING')
    }
  }

  return (
    <div
      className={cn(
        'fixed left-4 top-4 z-50 flex flex-col gap-4 p-4 rounded-2xl backdrop-blur-md shadow-xl',
        'bg-gray-900/30 border border-gray-700 transition-all'
      )}
    >
      <Button variant="ghost" size="icon" title="Iniciar Simulação" onClick={startGame} disabled={gameState !== 'PRE_MATCH'}>
        <Play className="w-5 h-5 text-white" />
      </Button>
      <Button variant="ghost" size="icon" title="Controle de Câmera" onClick={() => togglePanel('camera')}>
        <SlidersHorizontal className="w-5 h-5 text-white" />
      </Button>
      <Button variant="ghost" size="icon" title="Estratégias/Táticas" onClick={() => togglePanel('strategy')}>
        <Shield className="w-5 h-5 text-white" />
      </Button>
      <Button variant="ghost" size="icon" title="Jogadores/Scouts" onClick={() => togglePanel('scout')}>
        <Users className="w-5 h-5 text-white" />
      </Button>
      <Button variant="ghost" size="icon" title="Modo Carreira" onClick={() => togglePanel('career')}>
        <Trophy className="w-5 h-5 text-white" />
      </Button>
      <Button variant="ghost" size="icon" title="Alternar Tema" onClick={() => alert('Implementar tema claro/escuro')}>
        <SunMoon className="w-5 h-5 text-white" />
      </Button>
    </div>
  )
}

export default SidebarOverlay


