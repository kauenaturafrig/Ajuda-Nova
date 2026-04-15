// src/app/admin/api/user-role/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    return NextResponse.json({ role: user?.role || "ADMIN" });
  } catch (e) {
    console.error("Erro /admin/api/user-role:", e);
    return NextResponse.json({ role: "ADMIN" });
  }
}