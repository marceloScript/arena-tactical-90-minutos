import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

interface LivesSystemProps {
  onBack: () => void
}

const LivesSystem: React.FC<LivesSystemProps> = ({ onBack }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle><Heart className="inline-block mr-2" />Sistema de Vidas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-600">
            Cada erro em quizzes fará você perder uma vida. Responda com sabedoria!
          </p>
          <Button onClick={onBack} variant="secondary">
            Voltar à Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default LivesSystem


