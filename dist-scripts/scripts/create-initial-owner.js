// scripts/create-initial-owner.ts

import "dotenv/config";

import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.INIT_OWNER_EMAIL?.trim().toLowerCase();
  const password = process.env.INIT_OWNER_PASSWORD;
  const name = process.env.INIT_OWNER_NAME?.trim() || "Owner inicial";
  const unidadeId = Number(process.env.INIT_OWNER_UNIDADE_ID ?? 2);
  const roleName = "OWNER";

  if (!email || !password) {
    throw new Error(
      "Defina INIT_OWNER_EMAIL e INIT_OWNER_PASSWORD no arquivo .env",
    );
  }

  if (!Number.isInteger(unidadeId) || unidadeId <= 0) {
    throw new Error(
      "INIT_OWNER_UNIDADE_ID deve ser um número inteiro positivo.",
    );
  }

  console.log(`Criando ou atualizando owner: ${email}`);

  // Verifica se a unidade existe antes de associá-la ao usuário
  const unidade = await prisma.unidade.findUnique({
    where: { id: unidadeId },
  });

  if (!unidade) {
    throw new Error(`A unidade com id ${unidadeId} não existe.`);
  }

  // Cria a role caso ainda não exista
  const role = await prisma.role.upsert({
    where: { name: roleName },
    update: {},
    create: {
      name: roleName,
      description: "Acesso total ao sistema",
    },
  });

  // O Better Auth cria User e Account com a senha corretamente
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log("Usuário não encontrado. Criando via Better Auth...");

    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!result?.user) {
      throw new Error("O Better Auth não retornou o usuário criado.");
    }

    user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error(
        "O usuário foi criado, mas não pôde ser localizado no banco.",
      );
    }
  } else {
    console.log("Usuário já existe. Reutilizando cadastro existente.");
  }

  // Atualiza a unidade e garante a associação com a role OWNER
  user = await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      unidadeId,
      userRoles: {
        connectOrCreate: {
          where: {
            userId_roleId: {
              userId: user.id,
              roleId: role.id,
            },
          },
          create: {
            roleId: role.id,
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
    name: user.name,
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