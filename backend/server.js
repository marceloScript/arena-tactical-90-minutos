// backend/server.js - VERSÃO ATUALIZADA COM STRIPE + QUIZ
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

// Importar rotas existentes
const authRoutes = require('./src/routes/auth')
const quizRoutes = require('./src/routes/quizRoutes')

// IMPORTAR CONTROLLER DO STRIPE
const paymentController = require('./src/controllers/paymentController')

const app = express()

// -----------------------------------------------
// CORS configurado para frontend Vite
// -----------------------------------------------
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))

// ⚠️ IMPORTANTE: A rota do webhook precisa do RAW BODY.
// Por isso, colocamos o express.raw ANTES do express.json.
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.stripeWebhook
)

// O RESTANTE DA API PODE USAR JSON NORMAL
app.use(express.json())

// -----------------------------------------------
// Log
// -----------------------------------------------
app.use((req, res, next) => {
  console.log(`📥 ${new Date().toLocaleTimeString()} ${req.method} ${req.url}`)
  next()
})

// -----------------------------------------------
// Rotas básicas
// -----------------------------------------------
app.get('/', (req, res) => {
  res.json({
    mensagem: '⚽ Arena Tactical 90 Minutos - API Online!',
    status: 'SUCESSO',
    versao: '1.0.0',
    rotas: {
      auth: '/api/auth',
      quiz: '/api/quiz',
      payments: '/api/payments'
    }
  })
})

// Health Check
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }

  res.json({
    status: 'OK',
    database: statusMap[dbStatus] || 'unknown',
    timestamp: new Date().toISOString()
  })
})

// -----------------------------------------------
// Rotas da API
// -----------------------------------------------
app.use('/api/auth', authRoutes)
app.use('/api/quiz', quizRoutes)

// -----------------------------------------------
// ROTA PARA CRIAR CHECKOUT SESSION DO STRIPE
// PRECISA DE MIDDLEWARE DE AUTENTICAÇÃO (você já tem!)
const authMiddleware = require('./src/middleware/auth')

app.post(
  '/api/payments/create-checkout-session',
  authMiddleware, // 🔐 Usuário precisa estar logado
  paymentController.createCheckoutSession
)

// Rota para teste rápido do banco
app.get('/api/test-db', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray()
    res.json({
      status: 'OK',
      collections: collections.map(c => c.name),
      total: collections.length
    })
  } catch (error) {
    res.status(500).json({ erro: error.message })
  }
})

// -----------------------------------------------
// Middleware de erro
// -----------------------------------------------
app.use((err, req, res, next) => {
  console.error('❌ ERRO:', err.message)
  res.status(500).json({
    sucesso: false,
    mensagem: 'Erro interno do servidor',
    erro: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// -----------------------------------------------
// Conexão MongoDB
// -----------------------------------------------
const connectDB = async () => {
  try {
    console.log('🔄 Conectando ao MongoDB Atlas...')

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('✅ MONGODB ATLAS: Conectado com sucesso!')
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`)

    return true
  } catch (error) {
    console.error('❌ ERRO MongoDB:', error.message)
    return false
  }
}

// -----------------------------------------------
// Iniciar servidor
// -----------------------------------------------
const startServer = async () => {
  const isConnected = await connectDB()

  if (!isConnected) {
    console.log('⚠️  Servidor iniciando sem banco de dados...')
  }

  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`🚀 SERVIDOR: http://localhost:${PORT}`)
    console.log('=========================================')
    console.log('✅ BACKEND PRONTO PARA USO!')
    console.log('✅ Frontend: http://localhost:5173')
    console.log('✅ API Quiz disponível em /api/quiz')
    console.log('✅ API Pagamentos disponível em /api/payments')
    console.log('=========================================')
  })
}

process.on('unhandledRejection', (err) => {
  console.error('❌ Promise rejeitada:', err.message)
})

process.on('uncaughtException', (err) => {
  console.error('💥 Erro não capturado:', err)
  process.exit(1)
})

startServer()
