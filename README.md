Este é um projeto [Next.js](https://nextjs.org) criado com [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

Primeiro, execute o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra http://localhost:3000 no seu navegador para ver o resultado.

Você pode começar a editar a página modificando o arquivo pages/index.tsx.
A página será atualizada automaticamente conforme você faz alterações no arquivo.

As rotas de API podem ser acessadas em http://localhost:3000/api/hello.
Este endpoint pode ser editado no arquivo pages/api/hello.ts.

O diretório pages/api é mapeado para /api/*.
Os arquivos dentro deste diretório são tratados como rotas de API, em vez de páginas React.

Este projeto utiliza next/font para otimizar e carregar automaticamente a fonte Geist, uma nova família tipográfica da Vercel.

##⚙️ Scripts de Automação (.bat e .exe)

Este projeto possui scripts de automação que facilitam o processo de build, exportação e execução automática do site estático localmente.

### 🧩 atualizar-ajuda-nova.bat
```bash
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
```

### 📝 O que ele faz:

- Finaliza qualquer processo antigo (python.exe ou AjudaNova.exe).
- Aguarda 2 segundos para garantir o encerramento.
- Acessa a pasta do projeto (C:\Users\kaue.santos\Desktop\ajuda-nova).
- Remove a pasta out da build antiga.
- Gera uma nova build do projeto (npm run build).
- Inicia o servidor estático (npm run start-static).
- Exibe o link local do site: http://localhost:8000


### 🚀 iniciar-ajuda-nova.bat
```bash
@echo off
cd /d C:\Users\kaue.santos\Desktop\ajuda-nova
call npm run start-static
```

### 📝 O que ele faz:

Entra na pasta do projeto e inicia o servidor local estático.

Ideal para iniciar o site rapidamente quando não há alterações no código.


### 💻 Executável Automático (AjudaNova.exe)

O arquivo:

AjudaNova.exe


foi criado a partir do script iniciar-ajuda-nova.bat, utilizando uma ferramenta de conversão de .bat para .exe
(ex.: Bat To Exe Converter ou similar).

Esse executável foi adicionado à pasta de inicialização do Windows (shell:startup), o que faz com que:

O site inicie automaticamente toda vez que o computador é ligado ou reiniciado.

O servidor local (http://localhost:8000) comece a funcionar em segundo plano sem abrir o terminal do CMD.


### 🧭 Caminho da inicialização automática:

Para acessar a pasta de inicialização:

Pressione Win + R.

Digite shell:startup e pressione Enter.

Coloque o AjudaNova.exe dentro dessa pasta.


### 🔄 Diferença entre os arquivos

| 🗂️ **Arquivo** | 🧱 **Tipo** | 🧠 **Função** | ⚙️ **Quando usar** |
|:---------------|:-----------:|:--------------|:-------------------|
| `atualizar-ajuda-nova.bat` | `.bat` | Atualiza o projeto, recompila e reinicia o site | Quando há mudanças no código |
| `iniciar-ajuda-nova.bat` | `.bat` | Apenas inicia o site existente | Quando só deseja rodar o site |
| `AjudaNova.exe` | `.exe` | Versão automática que inicia o site ao ligar o PC | Quando quer execução em segundo plano |

### Start PM2

```bash
    pm2 start pm2-site.js --name site-estatico

    pm2 start server.js --name site-estatico
    pm2 save
    pm2 startup
```