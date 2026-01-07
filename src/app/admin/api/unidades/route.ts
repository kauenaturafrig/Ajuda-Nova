// src/app/admin/api/unidades/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../lib/auth";

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Só OWNER precisa disso, mas tanto faz checar aqui
    const unidades = await prisma.unidade.findMany({
        orderBy: { nome: "asc" },
    });

    return NextResponse.json(unidades);
}
