📞 Sistema Interno de Ramais — Backend + Frontend (Next.js)

Este projeto é um sistema interno de consulta e administração de ramais, desenvolvido para uso exclusivo dentro da empresa, sem dependência de serviços externos (Firebase, Auth0, etc).

A stack foi escolhida para simplicidade, controle total e baixo custo, priorizando robustez e manutenção fácil.

🎯 Objetivo do Sistema

Centralizar ramais telefônicos por unidade

Permitir busca eficiente (100% no backend)

Oferecer tela administrativa (CRUD) por unidade

Controlar acesso por login + sessão

Diferenciar admin da unidade e admin principal (owner)

🧱 Stack Técnica
Frontend

Next.js (App Router)

React + TypeScript

Tailwind CSS

Fetch direto para APIs internas (/api/*)

Backend

Next.js API Routes

Node.js 22 (ESM)

SQLite com better-sqlite3

Sessão baseada em cookie (sem JWT, sem OAuth)

Banco de Dados

SQLite (db/database.db)

Conexão síncrona e local

Ideal para ambiente interno

📁 Estrutura Atual do Projeto
/
├─ app/
│  ├─ ramais/
│  │  └─ nova-andradina.tsx     # Tela de consulta de ramais
│  └─ api/
│     └─ ramais.ts              # API de listagem e busca
│
├─ db/
│  ├─ database.db               # Banco SQLite
│  ├─ connection.js             # Conexão com o banco (ESM)
│  └─ criarowner.js             # Script para criar usuário owner
│
├─ components/
│  └─ Layout.tsx
│
├─ next.config.js
└─ README.md

🔌 Conexão com o Banco

Arquivo: db/connection.js

Usa better-sqlite3

Modelo ESM puro

Conexão única reutilizada por todas as APIs

import Database from "better-sqlite3";

const db = new Database("db/database.db");
export default db;

🔎 API de Ramais (/api/ramais)
Endpoint
GET /api/ramais

Parâmetros

unidade (obrigatório)

busca (opcional)

O que faz

Lista ramais por unidade

Executa busca direto no banco

Retorna JSON padronizado

Exemplo de resposta
{
  "success": true,
  "data": [
    {
      "id": 1,
      "numero": "1234",
      "setor": "TI",
      "responsavel": "João"
    }
  ]
}


A busca não é feita no frontend. Cada caractere digitado dispara nova consulta.

🖥️ Tela de Consulta de Ramais

Arquivo:

app/ramais/nova-andradina.tsx


Funcionalidades:

Busca em tempo real

Consulta baseada em unidade fixa

Nenhum filtro em memória (backend decide tudo)

Interface responsiva

Sem perda de foco no input (problema resolvido)

🔐 Autenticação (Estado Atual)

Sistema baseado em usuários locais

Senhas armazenadas com bcrypt

Controle por role

Roles existentes

owner → acesso total

admin → acesso à própria unidade

(usuário comum será adicionado depois)

👑 Criação do Usuário Owner

Script manual para bootstrap do sistema.

Arquivo:

db/criarowner.js


Executar:

node db/criarowner.js


O script:

Cria o usuário principal (owner)

Gera hash da senha com bcrypt

Insere direto no banco

⚠️ Esse script é executado uma única vez.

⚠️ Decisões Importantes (Conscientes)

❌ Firebase descartado

❌ Autenticação externa descartada

❌ JWT descartado (sessão é suficiente em rede interna)

✅ Backend simples e controlável

✅ Banco local e audível

✅ Código explícito, sem abstrações mágicas

🚧 Próximos Passos Planejados

Middleware de autenticação (requireAuth)

Login visual (tela de login)

CRUD administrativo de ramais

Controle de permissão por unidade

Importação/exportação de ramais via JSON

Log de ações administrativas (opcional)

🧠 Nota Final

Este projeto não é um produto genérico, é uma ferramenta interna.
As escolhas feitas priorizam clareza, previsibilidade e controle, não hype tecnológico.

Se algo aqui parece “simples demais”, é porque foi feito de propósito.