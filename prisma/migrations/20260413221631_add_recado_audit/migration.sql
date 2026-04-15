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

-- CreateIndex
CREATE INDEX "recados_audits_recadoId_idx" ON "recados_audits"("recadoId");

-- CreateIndex
CREATE INDEX "recados_audits_userId_idx" ON "recados_audits"("userId");

-- CreateIndex
CREATE INDEX "recados_audits_createdAt_idx" ON "recados_audits"("createdAt");
