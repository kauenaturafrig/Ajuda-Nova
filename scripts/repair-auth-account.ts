// scripts/repair-auth-account.ts
import "dotenv/config";
import { hashPassword } from "better-auth/crypto";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.REPAIR_AUTH_EMAIL
    ?.trim()
    .toLowerCase();

  const password = process.env.REPAIR_AUTH_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Defina REPAIR_AUTH_EMAIL e REPAIR_AUTH_PASSWORD no .env",
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

  const hashedPassword = await hashPassword(password);

  const result = await prisma.account.updateMany({
    where: {
      userId: user.id,
      providerId: "credential",
    },
    data: {
      accountId: user.id,
      issuer: "local:credential",
      password: hashedPassword,
    },
  });

  if (result.count !== 1) {
    throw new Error(
      `Conta não atualizada. Registros encontrados: ${result.count}`,
    );
  }

  console.log({
    email: user.email,
    updatedAccounts: result.count,
    issuer: "local:credential",
    message: "Conta reparada.",
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