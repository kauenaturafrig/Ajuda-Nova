-- CreateEnum
CREATE TYPE "SolicitacaoTipo" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "SolicitacaoStatus" AS ENUM ('PENDENTE', 'APROVADO', 'RECUSADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "SolicitacaoRecurso" AS ENUM ('RECADO', 'NOTICIA');

-- CreateTable
CREATE TABLE "solicitacoes_gerenciamento" (
    "id" SERIAL NOT NULL,
    "recurso" "SolicitacaoRecurso" NOT NULL,
    "tipo" "SolicitacaoTipo" NOT NULL,
    "status" "SolicitacaoStatus" NOT NULL DEFAULT 'PENDENTE',
    "recadoId" INTEGER,
    "noticiaId" INTEGER,
    "unidadeId" INTEGER,
    "unidadeIds" TEXT,
    "titulo" TEXT,
    "conteudo" TEXT,
    "imagem" TEXT,
    "imagemAntiga" TEXT,
    "motivoRecusa" TEXT,
    "solicitanteId" TEXT NOT NULL,
    "solicitanteNome" TEXT NOT NULL,
    "revisorId" TEXT,
    "revisorNome" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitacoes_gerenciamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "solicitacoes_gerenciamento_status_idx" ON "solicitacoes_gerenciamento"("status");

-- CreateIndex
CREATE INDEX "solicitacoes_gerenciamento_recurso_idx" ON "solicitacoes_gerenciamento"("recurso");

-- CreateIndex
CREATE INDEX "solicitacoes_gerenciamento_solicitanteId_idx" ON "solicitacoes_gerenciamento"("solicitanteId");

-- CreateIndex
CREATE INDEX "solicitacoes_gerenciamento_unidadeId_idx" ON "solicitacoes_gerenciamento"("unidadeId");
