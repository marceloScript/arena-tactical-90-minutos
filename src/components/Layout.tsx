// src/components/Layout.tsx
import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Cabeçalho */}
      <header className="bg-green-700 text-white py-4 shadow">
        <div className="container mx-auto px-4 text-2xl font-bold">
          Arena Tactical 90 Minutos
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Rodapé */}
      <footer className="bg-green-800 text-white py-4 text-center text-sm">
        © {new Date().getFullYear()} Arena Tactical. Todos os direitos reservados.
      </footer>
    </div>
  )
}

export default Layout
