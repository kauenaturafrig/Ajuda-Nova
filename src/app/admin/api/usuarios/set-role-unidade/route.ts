import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    const name = String(body.name ?? "").trim();

    const inputRoles: unknown[] = Array.isArray(body.roles)
      ? body.roles
      : [];

    const roleNames = [
      ...new Set(
        inputRoles.map((value) =>
          String(value).trim().toUpperCase(),
        ),
      ),
    ];

    const unidadeId = Number(body.unidadeId);

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "E-mail inválido" },
        { status: 400 },
      );
    }

    if (roleNames.length === 0) {
      return NextResponse.json(
        { error: "Pelo menos uma role é obrigatória" },
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
      where: { id: unidadeId },
      select: { id: true },
    });

    if (!unidade) {
      return NextResponse.json(
        { error: "Unidade não encontrada" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Usuário não encontrado. O cadastro Better Auth precisa ser concluído antes desta etapa.",
        },
        { status: 404 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const roles = await Promise.all(
        roleNames.map((name) =>
          tx.role.upsert({
            where: { name },
            update: {},
            create: { name },
          }),
        ),
      );

      return tx.user.update({
        where: { id: user.id },
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