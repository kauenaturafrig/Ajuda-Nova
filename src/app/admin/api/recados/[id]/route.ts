// app/admin/api/recados/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "../../../../../lib/auth";
import { rm } from "fs/promises";  // ✅ rm
import { existsSync } from "fs";
import path from "path";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const recado = await prisma.recado.findUnique({ where: { id: Number(id) } });
    
    if (recado?.imagem) {
      const caminho = path.join(process.cwd(), "public", "uploads", "recados", recado.imagem);
      if (existsSync(caminho)) await rm(caminho);  // ✅ rm
    }

    await prisma.recado.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("💥 DELETE Recados Error:", e.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}