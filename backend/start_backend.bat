@echo off
echo =========================================
echo 🚀 INICIANDO ARENA TACTICAL BACKEND
echo =========================================

:restart
echo.
echo 📅 Data/Hora: %date% %time%
echo 📍 Diretório: %cd%
echo.

echo 🔄 Instalando dependências...
call npm install

echo.
echo 🏃 Iniciando servidor...
echo.

node server.js

echo.
echo ⚠️  Servidor caiu. Reiniciando em 5 segundos...
echo.

timeout /t 5 /nobreak > nul
goto restart