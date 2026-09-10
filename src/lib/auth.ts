import { betterAuth } from "better-auth";
import { prisma } from "./prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";

const appUrl =
  process.env.BETTER_AUTH_URL ??
  "http://localhost:5050";

const trustedOrigins = [
  appUrl,
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.NEXT_PUBLIC_API_URL,
  "http://localhost:3000",
  "http://localhost:5050",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5050",
].filter(
  (origin): origin is string => Boolean(origin),
);

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

  trustedOrigins,
});