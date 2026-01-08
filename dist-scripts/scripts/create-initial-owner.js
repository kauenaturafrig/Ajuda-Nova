"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/create-initial-owner.ts
require("dotenv/config");
const auth_1 = require("../src/lib/auth");
const prisma_1 = require("../src/lib/prisma");
async function main() {
    const email = process.env.INIT_OWNER_EMAIL;
    const password = process.env.INIT_OWNER_PASSWORD;
    const name = process.env.INIT_OWNER_NAME ?? "Owner inicial";
    if (!email || !password) {
        console.error("Defina INIT_OWNER_EMAIL e INIT_OWNER_PASSWORD no .env");
        process.exit(1);
    }
    console.log("Criando usuário owner inicial via Better Auth...");
    // cria user + account (senha) no Better Auth
    await auth_1.auth.api.signUpEmail({
        body: {
            email,
            password,
            name,
        },
    });
    // garante role/unidade
    const user = await prisma_1.prisma.user.update({
        where: { email },
        data: {
            role: "OWNER",
            unidadeId: 2, // ajuste aqui
        },
    });
    console.log("Usuário owner pronto:", user.email);
}
main()
    .catch((err) => {
    console.error(err);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
