/*
  Warnings:

  - A unique constraint covering the columns `[unidadeId,email]` on the table `emails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[unidadeId,numero]` on the table `ramais` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "emails_unidadeId_email_key" ON "emails"("unidadeId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "ramais_unidadeId_numero_key" ON "ramais"("unidadeId", "numero");
