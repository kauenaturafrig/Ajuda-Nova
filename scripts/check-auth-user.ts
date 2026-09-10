// scripts/check-auth-user.ts
import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.CHECK_AUTH_EMAIL
    ?.trim()
    .toLowerCase();

  if (!email) {
    throw new Error("Defina CHECK_AUTH_EMAIL no .env");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      accounts: {
        select: {
          id: true,
          userId: true,
          accountId: true,
          providerId: true,
          password: true,
        },
      },
    },
  });

  if (!user) {
    console.log("Usuário não encontrado:", email);
    return;
  }

  console.dir(
    {
      user: {
        id: user.id,
        email: user.email,
      },
      accounts: user.accounts.map((account) => ({
        id: account.id,
        userId: account.userId,
        accountId: account.accountId,
        providerId: account.providerId,
        hasPassword: Boolean(account.password),
        accountIdMatchesUserId:
          account.accountId === user.id,
        userIdMatchesUserId:
          account.userId === user.id,
      })),
    },
    { depth: null },
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });