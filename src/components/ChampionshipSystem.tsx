import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ChampionshipSystemProps {
  onBack: () => void
}

const ChampionshipSystem: React.FC<ChampionshipSystemProps> = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Campeonatos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">
            Em breve: participe de ligas nacionais, continentais e mundiais!
          </p>
          <Button onClick={onBack} variant="secondary">
            Voltar à Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChampionshipSystem

