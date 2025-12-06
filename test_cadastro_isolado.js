// test_cadastro_isolado.js
require('dotenv').config()
const mongoose = require('mongoose')

async function testCadastroIsolado() {
  console.log('🧪 TESTE ISOLADO DE CADASTRO')
  
  try {
    // 1. Conectar ao MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB conectado')
    
    // 2. Carregar modelo User ATUAL
    const User = require('./src/models/User')
    console.log('✅ Modelo User carregado')
    
    // 3. Testar criação de usuário DIRETAMENTE
    console.log('\n📝 Testando criação direta no Mongoose...')
    
    const testUser = new User({
      nome: 'Teste Isolado',
      email: 'teste_isolado_' + Date.now() + '@email.com',
      senha: '123456'
    })
    
    console.log('📦 Usuário criado (antes do save):', {
      nome: testUser.nome,
      email: testUser.email,
      hasPassword: !!testUser.senha,
      senhaLength: testUser.senha?.length
    })
    
    // 4. Salvar e verificar
    const savedUser = await testUser.save()
    console.log('✅ Usuário salvo com sucesso!')
    console.log('📊 ID:', savedUser._id)
    console.log('📊 isPremium:', savedUser.isPremium)
    console.log('📊 vidasDiarias:', savedUser.vidasDiarias)
    
    // 5. Verificar se está realmente no banco
    const count = await User.countDocuments()
    console.log(`📊 Total de usuários no banco: ${count}`)
    
    // 6. Testar bcrypt
    console.log('\n🔐 Testando bcrypt...')
    const isMatch = await savedUser.compararSenha('123456')
    console.log('✅ Senha verificada:', isMatch)
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ ERRO DETALHADO:')
    console.error('Mensagem:', error.message)
    console.error('Stack:', error.stack)
    
    // Análise específica de erro do Mongoose
    if (error.name === 'ValidationError') {
      console.error('\n🔍 ERROS DE VALIDAÇÃO:')
      Object.keys(error.errors).forEach(key => {
        const err = error.errors[key]
        console.error(`- ${key}: ${err.message} (valor: ${err.value})`)
      })
    }
    
    if (error.code === 11000) {
      console.error('\n🔍 ERRO DE DUPLICATA (índice único):')
      console.error('Chave duplicada:', error.keyValue)
    }
    
    process.exit(1)
  }
}

testCadastroIsolado()