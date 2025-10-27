@echo off
setlocal

echo Finalizando processos antigos...
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im AjudaNova.exe >nul 2>&1
timeout /t 2 >nul

cd /d C:\Users\kaue.santos\Desktop\ajuda-nova

REM Limpar build antiga
echo Limpando pasta out antiga...
rmdir /s /q out
echo Limpando cache do Next.js...
rmdir /s /q .next

REM Gerar build limpa
echo Gerando nova build...
call npm run build

REM Iniciar servidor estático
echo Iniciando servidor estático...
call npm run start-static

echo Projeto atualizado e rodando em http://localhost:8000
pause