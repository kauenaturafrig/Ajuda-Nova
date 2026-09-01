import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { auth } from "../../../../../lib/auth";

export const dynamic = "force-dynamic";

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

type AllowedRole = (typeof allowedRoles)[number];

function isAllowedRole(value: string): value is AllowedRole {
  return allowedRoles.includes(value as AllowedRole);
}

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

export async function POST(req: NextRequest) {
  try {
    const session = await requireOwner(req);

    if (!session) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    const body = await req.json();

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    const inputRoles: unknown[] = Array.isArray(body.roles)
      ? body.roles
      : [];

    const roleNames: string[] = [
      ...new Set(
        inputRoles.map((value: unknown): string =>
          String(value).trim().toUpperCase(),
        ),
      ),
    ];

    const unidadeId = Number(body.unidadeId);

    if (!email || roleNames.length === 0) {
      return NextResponse.json(
        { error: "Email e roles são obrigatórios" },
        { status: 400 },
      );
    }

    const invalidRole = roleNames.find(
      (roleName) => !isAllowedRole(roleName),
    );

    if (invalidRole) {
      return NextResponse.json(
        { error: `Role inválida: ${invalidRole}` },
        { status: 400 },
      );
    }

    if (!Number.isInteger(unidadeId) || unidadeId <= 0) {
      return NextResponse.json(
        { error: "Unidade inválida" },
        { status: 400 },
      );
    }

    const unidade = await prisma.unidade.findUnique({
      where: {
        id: unidadeId,
      },
      select: {
        id: true,
      },
    });

    if (!unidade) {
      return NextResponse.json(
        { error: "Unidade não encontrada" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const roles = await Promise.all(
        roleNames.map((name) =>
          tx.role.upsert({
            where: {
              name,
            },
            update: {},
            create: {
              name,
            },
          }),
        ),
      );

      return tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          unidadeId,

          userRoles: {
            connectOrCreate: roles.map((role) => ({
              where: {
                userId_roleId: {
                  userId: user.id,
                  roleId: role.id,
                },
              },
              create: {
                roleId: role.id,
              },
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
    });

    return NextResponse.json({
      id: result.id,
      email: result.email,
      unidadeId: result.unidadeId,
      roles: result.userRoles.map(
        (assignment) => assignment.role.name,
      ),
    });
  } catch (error) {
    console.error(
      "Erro no POST /admin/api/usuarios/set-role-unidade:",
      error,
    );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}