/*
  Warnings:

  - Added the required column `eventoTitulo` to the `agenda_eventos_audits` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidadeId` to the `agenda_eventos_audits` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "agenda_eventos_audits" DROP CONSTRAINT "agenda_eventos_audits_eventoId_fkey";

-- AlterTable
ALTER TABLE "agenda_eventos_audits" ADD COLUMN     "eventoTitulo" TEXT NOT NULL,
ADD COLUMN     "unidadeId" INTEGER NOT NULL,
ADD COLUMN     "unidadeNome" TEXT;
