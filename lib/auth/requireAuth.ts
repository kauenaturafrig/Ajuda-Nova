// lib/auth/requireAuth.ts
import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

type Role = "owner" | "admin";

type Options = {
  roles?: Role[];
};

export function withAuth(
  handler: NextApiHandler,
  options?: Options
): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const user = (req as any).session?.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Não autenticado",
      });
    }

    if (options?.roles && !options.roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: "Permissão insuficiente",
      });
    }

    (req as any).user = user;
    return handler(req, res);
  };
}
