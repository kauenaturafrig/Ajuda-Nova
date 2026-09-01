// src/app/admin/api/usuarios/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../lib/auth";
import { hashPassword } from "better-auth/crypto"; // <- novo import [web:365]

export const dynamic = "force-dynamic";

// só OWNER pode mexer
async function requireOwner(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      userRoles: {
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const isOwner = user?.userRoles.some(
    (assignment) => assignment.role.name === "OWNER",
  );

  return isOwner ? session : null;
}

// PUT /admin/api/usuarios -> editar nome/role/unidade
export async function PUT(req: NextRequest) {
  try {
    const session = await requireOwner(req);

    if (!session) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    const body = await req.json();

    const id = String(body.id ?? "");
    const name = String(body.name ?? "").trim();

    const roles: string[] = Array.isArray(body.roles)
      ? [
          ...new Set(
            (body.roles as unknown[]).map((value) =>
              String(value).trim().toUpperCase(),
            ),
          ),
        ]
      : [];

    const unidadeId =
      body.unidadeId === null ||
      body.unidadeId === undefined ||
      body.unidadeId === ""
        ? null
        : Number(body.unidadeId);

    const allowedRoles = [
      "OWNER",
      "ADMIN",
      "NEWSONLY",
      "MESSAGEONLY",
      "MESSAGENEWS",
      "EVENTS",
      "EXTENSION",
      "EMAIL",
    ] as const;

    if (!id || !name) {
      return NextResponse.json(
        { error: "ID e nome são obrigatórios" },
        { status: 400 },
      );
    }

    if (roles.length === 0) {
      return NextResponse.json(
        { error: "Selecione pelo menos uma role" },
        { status: 400 },
      );
    }

    const invalidRole = roles.find(
      (role) =>
        !allowedRoles.includes(
          role as (typeof allowedRoles)[number],
        ),
    );

    if (invalidRole) {
      return NextResponse.json(
        { error: `Role inválida: ${invalidRole}` },
        { status: 400 },
      );
    }

    if (
      unidadeId !== null &&
      (!Number.isInteger(unidadeId) || unidadeId <= 0)
    ) {
      return NextResponse.json(
        { error: "Unidade inválida" },
        { status: 400 },
      );
    }

    const updated = await prisma.$transaction(
      async (tx) => {
        const roleRecords = await Promise.all(
          roles.map((roleName) =>
            tx.role.upsert({
              where: {
                name: roleName,
              },
              update: {},
              create: {
                name: roleName,
              },
            }),
          ),
        );

        return tx.user.update({
          where: {
            id,
          },
          data: {
            name,
            unidadeId,

            userRoles: {
              deleteMany: {},
              create: roleRecords.map((role) => ({
                roleId: role.id,
              })),
            },
          },
          include: {
            unidade: true,
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        });
      },
    );

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      unidadeId: updated.unidadeId,
      roles: updated.userRoles.map(
        (assignment) => assignment.role.name,
      ),
    });
  } catch (error) {
    console.error(
      "Erro no PUT /admin/api/usuarios:",
      error,
    );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /admin/api/usuarios -> resetar senha manualmente
export async function POST(req: NextRequest) {
  try {
    const session = await requireOwner(req);
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { action, userId, newPassword } = await req.json();

    if (action !== "reset-senha") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "Senha deve ter pelo menos 8 caracteres" },
        { status: 400 },
      );
    }

    // Usa o mesmo algoritmo/formato que o Better Auth espera
    const hashed = await hashPassword(newPassword); // scrypt em formato suportado [web:365][web:369]

    const result = await prisma.account.updateMany({
      where: {
        userId,
        providerId: "credential", // seu providerId real
      },
      data: {
        password: hashed,
      },
    });

    console.log("reset-senha updateMany result:", result);

    return NextResponse.json({ ok: true, updated: result.count });
  } catch (e) {
    console.error("Erro no POST /admin/api/usuarios (reset-senha):", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /admin/api/usuarios?id=USER_ID -> excluir usuário
export async function DELETE(req: NextRequest) {
  try {
    const session = await requireOwner(req);
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing user id" },
        { status: 400 },
      );
    }

    // apaga contas e sessões ligadas ao user, depois o user
    await prisma.$transaction(async (tx) => {
      await tx.userRoleAssignment.deleteMany({
        where: {
          userId: id,
        },
      });

      await tx.account.deleteMany({
        where: {
          userId: id,
        },
      });

      await tx.session.deleteMany({
        where: {
          userId: id,
        },
      });

      await tx.user.delete({
        where: {
          id,
        },
      });
    }); // [web:400][web:404]

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro no DELETE /admin/api/usuarios:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}