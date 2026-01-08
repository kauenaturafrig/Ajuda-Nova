import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL:
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/admin/api/auth", // "http://172.16.21.61:3000/admin/api/auth",
});

export const useSession = authClient.useSession;