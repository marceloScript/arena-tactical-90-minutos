// fix_passwords.js
require('dotenv').config()
const mongoose = require('mongoose')

async function fixPasswords() {
  console.log('🔧 Corrigindo senhas antigas...')
  
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Conectado ao MongoDB')
    
    const User = require('./src/models/User')
    
    // Buscar todos os usuários
    const users = await User.find({})
    console.log(`📊 Encontrados ${users.length} usuários`)
    
    let fixed = 0
    
    for (const user of users) {
      // Verificar se senha é texto plano
      const isPlainText = !user.senha.startsWith('$2a$') && 
                         !user.senha.startsWith('$2b$') && 
                         !user.senha.startsWith('$2y$')
      
      if (isPlainText) {
        console.log(`🔄 Convertendo senha de: ${user.email}`)
        
        // Converter para hash
        const bcrypt = require('bcryptjs')
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(user.senha, salt)
        
        user.senha = hash
        await user.save()
        fixed++
        console.log(`✅ Senha convertida para hash`)
      }
    }
    
    console.log(`🎉 ${fixed} senhas corrigidas!`)
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }
}

fixPasswords()