-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'MESSAGEONLY';
ALTER TYPE "UserRole" ADD VALUE 'NEWSONLY';
ALTER TYPE "UserRole" ADD VALUE 'MESSAGENEWS';

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

-- CreateIndex
CREATE INDEX "recados_unidades_recadoId_idx" ON "recados_unidades"("recadoId");

-- CreateIndex
CREATE INDEX "recados_unidades_unidadeId_idx" ON "recados_unidades"("unidadeId");

-- CreateIndex
CREATE UNIQUE INDEX "recados_unidades_recadoId_unidadeId_key" ON "recados_unidades"("recadoId", "unidadeId");

-- AddForeignKey
ALTER TABLE "recados" ADD CONSTRAINT "recados_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recados_unidades" ADD CONSTRAINT "recados_unidades_recadoId_fkey" FOREIGN KEY ("recadoId") REFERENCES "recados"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recados_unidades" ADD CONSTRAINT "recados_unidades_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;
