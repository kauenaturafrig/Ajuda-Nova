// app/api/auth/usuarios/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { AppSession } from "../../../../src/types/session";

export async function POST(req: Request) {
    const session = (await auth.api.getSession({
        headers: req.headers,
    })) as AppSession;

    if (!session)
        return NextResponse.json({ error: "Não logado" }, { status: 401 });

    if (session.user.role !== "owner")
        return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

    const { email, password, role, unidadeId } = await req.json();

    if (!["owner", "admin"].includes(role)) {
        return NextResponse.json({ error: "Role inválida" }, { status: 400 });
    }

    // 1️⃣ cria usuário no Better Auth (HTTP, como ele espera)
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/sign-up`,
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        }
    );

    if (!res.ok) {
        const err = await res.text();
        return NextResponse.json(
        { error: "Erro ao criar usuário", detail: err },
        { status: 400 }
        );
    }

    // 2️⃣ atualiza role/unidade no banco
    await db
        .update(users)
        .set({
        role,
        unidadeId: role === "owner" ? null : unidadeId,
        })
        .where(eq(users.email, email));

    return NextResponse.json({ ok: true });
}
