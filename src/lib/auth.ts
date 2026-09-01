import { betterAuth } from "better-auth";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  basePath: "/admin/api/auth",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
  },

  trustedOrigins: [
    "http://172.16.20.232:3000",
    "http://localhost:3000",
    "http://172.16.11.246:3000",
  ],
});