import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const appUrl = process.env.BETTER_AUTH_URL!;

export const auth = betterAuth({
  basePath: "/admin/api/auth",
  baseURL: appUrl,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
  },

  trustedOrigins: [
    appUrl,
  ],
});