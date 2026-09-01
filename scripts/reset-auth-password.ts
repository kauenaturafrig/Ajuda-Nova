// scripts/reset-auth-password.ts
import "dotenv/config";
import { hashPassword } from "better-auth/crypto";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.RESET_AUTH_EMAIL
    ?.trim()
    .toLowerCase();

  const newPassword = process.env.RESET_AUTH_PASSWORD;

  if (!email || !newPassword) {
    throw new Error(
      "Defina RESET_AUTH_EMAIL e RESET_AUTH_PASSWORD no .env",
    );
  }

  if (newPassword.length < 8) {
    throw new Error(
      "RESET_AUTH_PASSWORD deve ter pelo menos 8 caracteres.",
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error(`Usuário não encontrado: ${email}`);
  }

  const password = await hashPassword(newPassword);

  const result = await prisma.account.updateMany({
    where: {
      userId: user.id,
      accountId: user.id,
      providerId: "credential",
    },
    data: {
      password,
    },
  });

  if (result.count !== 1) {
    throw new Error(
      `Conta credential não atualizada. Registros encontrados: ${result.count}`,
    );
  }

  console.log({
    email: user.email,
    updatedAccounts: result.count,
    message: "Senha redefinida com sucesso.",
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });