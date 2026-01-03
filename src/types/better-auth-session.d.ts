// src/types/better-auth-session.d.ts
import "better-auth";

declare module "better-auth" {
    interface Session {
        user: {
        id: string;
        email: string;
        name: string;
        image?: string | null;
        emailVerified: boolean;

        role: "owner" | "admin";
        unidadeId: number | null;
        };
    }
}
