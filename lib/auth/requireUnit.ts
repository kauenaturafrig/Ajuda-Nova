// lib/auth/requireUnit.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/db/connection";

export function requireUnitAccess() {
  return function (
    req: NextApiRequest,
    res: NextApiResponse,
    next: () => void
  ) {
    const user = (req as any).session?.user;
    const { unidade } = req.query;

    if (!unidade || typeof unidade !== "string") {
      return res.status(400).json({
        success: false,
        error: "Unidade obrigatória",
      });
    }

    // Owner ignora tudo
    if (user.role === "owner") {
      return next();
    }

    // Admin precisa pertencer à unidade
    const permitido = db
      .prepare(
        `
        SELECT 1
        FROM admins_unidades
        WHERE user_id = ? AND unidade_nome = ?
      `
      )
      .get(user.id, unidade);

    if (!permitido) {
      return res.status(403).json({
        success: false,
        error: "Sem permissão para esta unidade",
      });
    }

    next();
  };
}
