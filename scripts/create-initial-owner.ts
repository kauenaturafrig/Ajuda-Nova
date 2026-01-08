// scripts/create-initial-owner.ts
import "dotenv/config";
import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";

async function main() {
    const email = process.env.INIT_OWNER_EMAIL;
    const password = process.env.INIT_OWNER_PASSWORD;
    const name = process.env.INIT_OWNER_NAME ?? "Owner inicial";

    if (!email || !password) {
        console.error("Defina INIT_OWNER_EMAIL e INIT_OWNER_PASSWORD no .env");
        process.exit(1);
    }

    console.log("Criando usuário owner inicial...");

    // cria o usuário via Better Auth
    await auth.api.signUpEmail({
        body: {
        email,
        password,
        name,
        },
    });

    // garante que já foi persistido pelo adapter
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error("Usuário não encontrado após signUpEmail");
        process.exit(1);
    }

    // marca como OWNER + unidade
    await prisma.user.update({
        where: { id: user.id },
        data: {
        role: "OWNER",
        unidadeId: 1, // ajuste para o ID da unidade desejada
        },
    });

    console.log("Usuário owner atualizado com sucesso:", email);
}

main()
    .catch((err) => {
        console.error(err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
