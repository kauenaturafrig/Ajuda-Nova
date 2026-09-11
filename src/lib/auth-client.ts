// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  basePath: "/admin/api/auth",
});

export const useSession = authClient.useSession;