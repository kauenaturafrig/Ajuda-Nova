"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const prisma_1 = require("./prisma");
const prisma_2 = require("better-auth/adapters/prisma");
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, prisma_2.prismaAdapter)(prisma_1.prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    }
});
