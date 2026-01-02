// scripts/create-owner.ts
import { auth } from "../lib/auth";
import { db } from "../db/index";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

async function createOwner() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4];

  if (!email || !password || !name) {
    console.error("Uso: tsx scripts/create-owner.ts <email> <senha> <nome>");
    process.exit(1);
  }

  try {
    // 1️⃣ cria usuário via Better Auth
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!result?.user?.id) {
      throw new Error("Usuário não foi criado pelo Better Auth");
    }

    // 2️⃣ promove para owner (regra de domínio)
    await db
      .update(users)
      .set({
        role: "owner",
        unidadeId: null,
      })
      .where(eq(users.id, result.user.id));

    console.log("✅ Owner criado corretamente");
    console.log("Email:", result.user.email);
    console.log("ID:", result.user.id);

    process.exit(0);
  } catch (err: any) {
    // usuário já existe
    if (err?.body?.code === "USER_ALREADY_EXISTS") {
      console.error("⚠️ Usuário já existe. Promovendo para owner...");

      await db
        .update(users)
        .set({ role: "owner", unidadeId: null })
        .where(eq(users.email, email));

      console.log("✅ Usuário existente promovido para owner");
      process.exit(0);
    }

    console.error("❌ Erro ao criar owner:", err);
    process.exit(1);
  }
}

createOwner();
