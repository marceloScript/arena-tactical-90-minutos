// src/components/ui/BackHomeButton.tsx
import React from 'react'
import { FaHome } from 'react-icons/fa'

interface BackHomeButtonProps {
  onClick: () => void
}

const BackHomeButton: React.FC<BackHomeButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-900/30 backdrop-blur-md border border-gray-700 text-white hover:bg-gray-800 transition"
      title="Voltar ao Home"
    >
      <FaHome size={20} />
    </button>
  )
}

export default BackHomeButton
