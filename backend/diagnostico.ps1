# Teste de conectividade completa
Write-Host "=== DIAGNÓSTICO SISTEMA ===" -ForegroundColor Cyan

# 1. Teste de rede
Test-NetConnection -ComputerName localhost -Port 5000

# 2. Teste API básica
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method Get
    Write-Host "✅ Health Check: OK" -ForegroundColor Green
    $health | Format-List
} catch {
    Write-Host "❌ Health Check Failed" -ForegroundColor Red
}

# 3. Teste direto no MongoDB (via Node)
$testScript = @"
const mongoose = require('mongoose');
require('dotenv').config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
        
        // Testar schema
        const User = require('./src/models/User');
        console.log('✅ Schema loaded');
        
        // Testar índice único
        const indexes = await User.collection.indexes();
        console.log('Indexes:', indexes);
        
        // Listar usuários existentes
        const users = await User.find({}).limit(5);
        console.log('Existing users:', users.length);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

test();
"@

$testScript | Out-File -FilePath test_mongo.js -Encoding UTF8
node test_mongo.js
Remove-Item test_mongo.js
