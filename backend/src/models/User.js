// backend/src/models/User.js - VERSÃO COM SUPORTE A SENHAS ANTIGAS
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  vidasDiarias: {
    type: Number,
    default: 5
  },
  ultimoResetVidas: {
    type: Date,
    default: Date.now
  },
  dataCriacao: {
    type: Date,
    default: Date.now
  }
})

// MIDDLEWARE: Hash apenas se a senha NÃO parece já ser um hash
UserSchema.pre('save', function(next) {
  const user = this
  
  // Verificar se a senha já parece ser um hash bcrypt
  // Bcrypt hashes começam com $2a$, $2b$, $2y$ e têm 60 caracteres
  const isAlreadyHashed = user.senha && (
    user.senha.startsWith('$2a$') ||
    user.senha.startsWith('$2b$') ||
    user.senha.startsWith('$2y$') ||
    user.senha.length === 60
  )
  
  // Se já for hash ou senha não foi modificada, pular
  if (isAlreadyHashed || !user.isModified('senha')) {
    return next()
  }
  
  // Senha em texto plano -> fazer hash
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)
    
    bcrypt.hash(user.senha, salt, (err, hash) => {
      if (err) return next(err)
      user.senha = hash
      next()
    })
  })
})

// Método para comparar senha (aceita texto e hash)
UserSchema.methods.compararSenha = function(senhaDigitada) {
  return new Promise((resolve, reject) => {
    // Se a senha armazenada é hash bcrypt
    if (this.senha.startsWith('$2a$') || this.senha.startsWith('$2b$') || this.senha.startsWith('$2y$')) {
      bcrypt.compare(senhaDigitada, this.senha, (err, isMatch) => {
        if (err) reject(err)
        else resolve(isMatch)
      })
    } else {
      // Senha em texto plano (usuários antigos)
      resolve(this.senha === senhaDigitada)
    }
  })
}

// Método para converter senha antiga para hash
UserSchema.methods.upgradePassword = function() {
  return new Promise((resolve, reject) => {
    // Se já é hash, não fazer nada
    if (this.senha.startsWith('$2a$') || this.senha.startsWith('$2b$') || this.senha.startsWith('$2y$')) {
      resolve(false)
      return
    }
    
    // Converter texto para hash
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return reject(err)
      
      bcrypt.hash(this.senha, salt, (err, hash) => {
        if (err) return reject(err)
        this.senha = hash
        resolve(true)
      })
    })
  })
}

module.exports = mongoose.model('User', UserSchema)