// scripts/create-initial-owner.ts
import "dotenv/config";

import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.INIT_OWNER_EMAIL?.trim().toLowerCase();
  const password = process.env.INIT_OWNER_PASSWORD;
  const name = process.env.INIT_OWNER_NAME?.trim() || "Owner inicial";
  const unidadeId = Number(process.env.INIT_OWNER_UNIDADE_ID ?? 2);

  if (!email || !password) {
    throw new Error(
      "Defina INIT_OWNER_EMAIL e INIT_OWNER_PASSWORD no arquivo .env",
    );
  }

  if (!Number.isInteger(unidadeId) || unidadeId <= 0) {
    throw new Error("INIT_OWNER_UNIDADE_ID deve ser um número inteiro válido.");
  }

  const unidade = await prisma.unidade.findUnique({
    where: { id: unidadeId },
    select: { id: true, nome: true },
  });

  if (!unidade) {
    throw new Error(`A unidade ${unidadeId} não existe.`);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });

  let userId: string;

  if (existingUser) {
    console.log(`Usuário ${email} já existe. Reutilizando usuário.`);
    userId = existingUser.id;
  } else {
    console.log("Criando usuário owner inicial via Better Auth...");

    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!result?.user?.id) {
      throw new Error("O Better Auth não retornou o usuário criado.");
    }

    userId = result.user.id;
  }

  const ownerRole = await prisma.role.upsert({
    where: { name: "OWNER" },
    update: {},
    create: {
      name: "OWNER",
      description: "Acesso completo ao sistema",
    },
  });

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      unidadeId: unidade.id,
      userRoles: {
        connectOrCreate: {
          where: {
            userId_roleId: {
              userId,
              roleId: ownerRole.id,
            },
          },
          create: {
            roleId: ownerRole.id,
          },
        },
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

  console.log("Usuário owner pronto:");
  console.log({
    id: user.id,
    email: user.email,
    unidade: user.unidade?.nome,
    roles: user.userRoles.map((assignment) => assignment.role.name),
  });
}

main()
  .catch((error) => {
    console.error("Erro ao criar owner inicial:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });