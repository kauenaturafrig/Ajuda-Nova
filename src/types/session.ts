import { auth } from "@/lib/auth";

export type AppSession =
    | (typeof auth.$Infer.Session & {
        user: (typeof auth.$Infer.Session)["user"] & {
            role: "owner" | "admin";
            unidadeId: number | null;
        };
        })
    | null;
