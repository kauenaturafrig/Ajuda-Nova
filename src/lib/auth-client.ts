// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

const apiURL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5050";

export const authClient = createAuthClient({
  baseURL: apiURL,
  basePath: "/admin/api/auth",
});

export const useSession = authClient.useSession;