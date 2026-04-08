// src/app/admin/api/user-unidade/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { unidadeId: true },
    });

    return NextResponse.json({ unidadeId: user?.unidadeId || null });
  } catch (e) {
    return NextResponse.json({ unidadeId: null });
  }
}