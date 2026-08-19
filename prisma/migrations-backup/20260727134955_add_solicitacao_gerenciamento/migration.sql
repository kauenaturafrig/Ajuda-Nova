-- CreateIndex
CREATE INDEX "solicitacoes_gerenciamento_recadoId_idx" ON "solicitacoes_gerenciamento"("recadoId");

-- CreateIndex
CREATE INDEX "solicitacoes_gerenciamento_noticiaId_idx" ON "solicitacoes_gerenciamento"("noticiaId");

-- AddForeignKey
ALTER TABLE "solicitacoes_gerenciamento" ADD CONSTRAINT "solicitacoes_gerenciamento_recadoId_fkey" FOREIGN KEY ("recadoId") REFERENCES "recados"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes_gerenciamento" ADD CONSTRAINT "solicitacoes_gerenciamento_noticiaId_fkey" FOREIGN KEY ("noticiaId") REFERENCES "noticias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacoes_gerenciamento" ADD CONSTRAINT "solicitacoes_gerenciamento_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;
