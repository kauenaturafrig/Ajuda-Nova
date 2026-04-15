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

-- CreateIndex
CREATE INDEX "noticias_audits_noticiaId_idx" ON "noticias_audits"("noticiaId");

-- CreateIndex
CREATE INDEX "noticias_audits_userId_idx" ON "noticias_audits"("userId");

-- CreateIndex
CREATE INDEX "noticias_audits_createdAt_idx" ON "noticias_audits"("createdAt");
