-- AddForeignKey
ALTER TABLE "noticias_audits" ADD CONSTRAINT "noticias_audits_noticiaId_fkey" FOREIGN KEY ("noticiaId") REFERENCES "noticias"("id") ON DELETE CASCADE ON UPDATE CASCADE;
