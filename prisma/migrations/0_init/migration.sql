-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'MESSAGEONLY', 'NEWSONLY', 'MESSAGENEWS', 'EVENTS');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "unidadeId" INTEGER,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ramais" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "nome" TEXT,
    "setor" TEXT NOT NULL,
    "unidadeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ramais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emails" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT,
    "setor" TEXT NOT NULL,
    "unidadeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jornais" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "dataLancamento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jornais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "noticias" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "imagem" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "noticias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "noticias_audits" (
    "id" SERIAL NOT NULL,
    "noticiaId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "userNome" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "dadosAntigos" JSONB,
    "dadosNovos" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "noticias_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recados" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "imagem" TEXT,
    "unidadeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recados_unidades" (
    "id" SERIAL NOT NULL,
    "recadoId" INTEGER NOT NULL,
    "unidadeId" INTEGER NOT NULL,

    CONSTRAINT "recados_unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recados_audits" (
    "id" SERIAL NOT NULL,
    "recadoId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "userNome" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "dadosAntigos" JSONB,
    "dadosNovos" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recados_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agenda_eventos" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "data" TIMESTAMP(3) NOT NULL,
    "unidadeId" INTEGER NOT NULL,
    "criadoPorId" TEXT NOT NULL,
    "atualizadoPorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agenda_eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agenda_eventos_audits" (
    "id" SERIAL NOT NULL,
    "eventoId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "userNome" TEXT NOT NULL,
    "acao" TEXT NOT NULL,
    "dadosAntigos" JSONB,
    "dadosNovos" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agenda_eventos_audits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "ramais_unidadeId_numero_key" ON "ramais"("unidadeId", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "emails_unidadeId_email_key" ON "emails"("unidadeId", "email");

-- CreateIndex
CREATE INDEX "noticias_audits_noticiaId_idx" ON "noticias_audits"("noticiaId");

-- CreateIndex
CREATE INDEX "noticias_audits_userId_idx" ON "noticias_audits"("userId");

-- CreateIndex
CREATE INDEX "noticias_audits_createdAt_idx" ON "noticias_audits"("createdAt");

-- CreateIndex
CREATE INDEX "recados_unidades_recadoId_idx" ON "recados_unidades"("recadoId");

-- CreateIndex
CREATE INDEX "recados_unidades_unidadeId_idx" ON "recados_unidades"("unidadeId");

-- CreateIndex
CREATE UNIQUE INDEX "recados_unidades_recadoId_unidadeId_key" ON "recados_unidades"("recadoId", "unidadeId");

-- CreateIndex
CREATE INDEX "recados_audits_recadoId_idx" ON "recados_audits"("recadoId");

-- CreateIndex
CREATE INDEX "recados_audits_userId_idx" ON "recados_audits"("userId");

-- CreateIndex
CREATE INDEX "recados_audits_createdAt_idx" ON "recados_audits"("createdAt");

-- CreateIndex
CREATE INDEX "agenda_eventos_data_idx" ON "agenda_eventos"("data");

-- CreateIndex
CREATE INDEX "agenda_eventos_unidadeId_idx" ON "agenda_eventos"("unidadeId");

-- CreateIndex
CREATE INDEX "agenda_eventos_criadoPorId_idx" ON "agenda_eventos"("criadoPorId");

-- CreateIndex
CREATE INDEX "agenda_eventos_audits_eventoId_idx" ON "agenda_eventos_audits"("eventoId");

-- CreateIndex
CREATE INDEX "agenda_eventos_audits_userId_idx" ON "agenda_eventos_audits"("userId");

-- CreateIndex
CREATE INDEX "agenda_eventos_audits_createdAt_idx" ON "agenda_eventos_audits"("createdAt");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ramais" ADD CONSTRAINT "ramais_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recados" ADD CONSTRAINT "recados_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recados_unidades" ADD CONSTRAINT "recados_unidades_recadoId_fkey" FOREIGN KEY ("recadoId") REFERENCES "recados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recados_unidades" ADD CONSTRAINT "recados_unidades_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agenda_eventos" ADD CONSTRAINT "agenda_eventos_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agenda_eventos" ADD CONSTRAINT "agenda_eventos_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agenda_eventos" ADD CONSTRAINT "agenda_eventos_atualizadoPorId_fkey" FOREIGN KEY ("atualizadoPorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agenda_eventos_audits" ADD CONSTRAINT "agenda_eventos_audits_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "agenda_eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

