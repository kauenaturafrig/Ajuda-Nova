@echo off
setlocal

REM === Fecha o processo antigo (AjudaNova.exe ou python http.server) ===
echo Finalizando processos antigos...

taskkill /f /im python.exe >nul 2>&1
taskkill /f /im AjudaNova.exe >nul 2>&1

REM === Aguardar para garantir encerramento ===
timeout /t 2 >nul

REM === Caminho do projeto ===
cd /d C:\Users\kaue.santos\Desktop\ajuda-nova

REM === Limpar build antiga ===
echo Limpando pasta out antiga...
rmdir /s /q out

REM === Build e export ===
echo Gerando nova build...
call npm run build

REM === Iniciar novamente ===
echo Iniciando servidor estático...
call npm run start-static

echo Projeto atualizado e rodando em http://localhost:8000
pause
