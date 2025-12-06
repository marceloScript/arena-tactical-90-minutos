// backend/src/routes/auth.js - VERSÃO COMPLETA CORRIGIDA
const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Middleware para verificar token
const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' })
  }
  
  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET || 'arena_tactical_secret')
    req.user = verificado
    next()
  } catch (error) {
    return res.status(401).json({ erro: 'Token inválido' })
  }
}

// Cadastro de usuário
router.post('/cadastro', async (req, res) => {
  console.log('🔍 CADASTRO: Processando requisição...')
  
  try {
    const { nome, email, senha } = req.body
    
    console.log('📝 Dados recebidos:', { nome, email, senha: senha ? '***' : undefined })
    
    // Validação básica
    if (!nome || !email || !senha) {
      console.log('❌ Validação falhou: campos obrigatórios')
      return res.status(400).json({ 
        erro: 'Campos obrigatórios faltando',
        campos: { nome: !nome, email: !email, senha: !senha }
      })
    }
    
    // Verificar se usuário já existe
    console.log('🔍 Verificando se email já existe:', email)
    const usuarioExistente = await User.findOne({ email: email.toLowerCase() })
    
    if (usuarioExistente) {
      console.log('❌ Email já cadastrado:', email)
      return res.status(400).json({ erro: 'Email já cadastrado' })
    }
    
    // Criar novo usuário
    console.log('🔄 Criando novo usuário...')
    const novoUsuario = new User({
      nome,
      email: email.toLowerCase(),
      senha
    })
    
    console.log('💾 Salvando usuário no banco...')
    await novoUsuario.save()
    console.log('✅ Usuário salvo com ID:', novoUsuario._id)
    
    // Criar token JWT
    const token = jwt.sign(
      { userId: novoUsuario._id, email: novoUsuario.email },
      process.env.JWT_SECRET || 'arena_tactical_secret',
      { expiresIn: '7d' }
    )
    
    console.log('🎉 Cadastro concluído com sucesso!')
    
    res.status(201).json({
      mensagem: 'Usuário cadastrado com sucesso!',
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        isPremium: novoUsuario.isPremium,
        vidasDiarias: novoUsuario.vidasDiarias
      },
      token
    })
    
  } catch (error) {
    console.error('🔥 ERRO NO CADASTRO:')
    console.error('Mensagem:', error.message)
    console.error('Stack:', error.stack)
    
    // Enviar erro detalhado em desenvolvimento
    const erroDetalhado = process.env.NODE_ENV === 'development' ? {
      mensagem: error.message,
      stack: error.stack,
      nome: error.name
    } : undefined
    
    res.status(500).json({
      erro: 'Erro ao cadastrar usuário',
      detalhes: erroDetalhado
    })
  }
})

// Login de usuário (VERSÃO ROBUSTA)
router.post('/login', async (req, res) => {
  try {
    console.log('🔍 LOGIN: Processando...')
    const { email, senha } = req.body
    
    if (!email || !senha) {
      console.log('❌ Dados incompletos')
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' })
    }
    
    // Buscar usuário
    const usuario = await User.findOne({ email: email.toLowerCase() })
    
    if (!usuario) {
      console.log('❌ Usuário não encontrado:', email)
      return res.status(401).json({ erro: 'Email ou senha incorretos' })
    }
    
    console.log('🔐 Verificando senha para:', email)
    
    // Comparar senha com fallback para texto plano
    let senhaCorreta = false
    try {
      // Tentar método bcrypt primeiro
      if (usuario.compararSenha) {
        senhaCorreta = await usuario.compararSenha(senha)
      }
    } catch (bcryptError) {
      console.log('⚠️  Fallback: verificando senha em texto')
      // Fallback para senha em texto (usuários antigos sem hash)
      if (usuario.senha === senha) {
        senhaCorreta = true
        console.log('✅ Senha em texto válida (usuário antigo)')
      }
    }
    
    if (!senhaCorreta) {
      console.log('❌ Senha incorreta')
      return res.status(401).json({ erro: 'Email ou senha incorretos' })
    }
    
    // Criar token
    const token = jwt.sign(
      { userId: usuario._id, email: usuario.email },
      process.env.JWT_SECRET || 'arena_tactical_secret',
      { expiresIn: '7d' }
    )
    
    console.log('✅ Login bem-sucedido para:', email)
    
    res.json({
      mensagem: 'Login realizado com sucesso!',
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        isPremium: usuario.isPremium,
        vidasDiarias: usuario.vidasDiarias
      },
      token
    })
    
  } catch (error) {
    console.error('🔥 ERRO NO LOGIN:', error.message)
    console.error('Stack:', error.stack)
    
    res.status(500).json({ 
      erro: 'Erro no servidor',
      detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Perfil do usuário (protegida)
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const usuario = await User.findById(req.user.userId)
    
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' })
    }
    
    res.json({
      mensagem: 'Perfil carregado com sucesso!',
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        isPremium: usuario.isPremium,
        vidasDiarias: usuario.vidasDiarias,
        dataCriacao: usuario.dataCriacao
      }
    })
    
  } catch (error) {
    console.error('Erro no perfil:', error)
    res.status(500).json({ erro: 'Erro no servidor' })
  }
})

// Atualizar para Premium
router.put('/upgrade-premium', verificarToken, async (req, res) => {
  try {
    const usuario = await User.findById(req.user.userId)
    
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' })
    }
    
    usuario.isPremium = true
    usuario.vidasDiarias = 999 // Vidas ilimitadas
    
    await usuario.save()
    
    res.json({
      mensagem: '🎉 Parabéns! Agora você é usuário Premium!',
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        isPremium: usuario.isPremium,
        vidasDiarias: usuario.vidasDiarias
      }
    })
    
  } catch (error) {
    console.error('Erro no upgrade:', error)
    res.status(500).json({ erro: 'Erro no servidor' })
  }
})

// Verificar vidas
router.get('/vidas', verificarToken, async (req, res) => {
  try {
    const usuario = await User.findById(req.user.userId)
    
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' })
    }
    
    // Verificar se precisa resetar vidas diárias
    const hoje = new Date().toDateString()
    const ultimoReset = new Date(usuario.ultimoResetVidas).toDateString()
    
    if (hoje !== ultimoReset && !usuario.isPremium) {
      usuario.vidasDiarias = 5
      usuario.ultimoResetVidas = new Date()
      await usuario.save()
    }
    
    res.json({
      vidas: usuario.vidasDiarias,
      isPremium: usuario.isPremium,
      ultimoReset: usuario.ultimoResetVidas,
      mensagem: usuario.isPremium ? 'Vidas ilimitadas (Premium)' : `${usuario.vidasDiarias} vidas restantes hoje`
    })
    
  } catch (error) {
    console.error('Erro ao verificar vidas:', error)
    res.status(500).json({ erro: 'Erro no servidor' })
  }
})

// Resetar vidas (para testes)
router.post('/reset-vidas', verificarToken, async (req, res) => {
  try {
    const usuario = await User.findById(req.user.userId)
    
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' })
    }
    
    usuario.vidasDiarias = 5
    usuario.ultimoResetVidas = new Date()
    await usuario.save()
    
    res.json({
      mensagem: 'Vidas resetadas para 5',
      vidas: usuario.vidasDiarias
    })
    
  } catch (error) {
    console.error('Erro ao resetar vidas:', error)
    res.status(500).json({ erro: 'Erro no servidor' })
  }
})

module.exports = router