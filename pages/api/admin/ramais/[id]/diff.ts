// pages/api/admin/ramais/[id]/diff.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/auth/requireAuth";
import { findRamalById } from "@/domain/ramais/ramais.repository";
import { gerarDiff } from "@/lib/audit/diff";

export default withAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const ramalId = Number(req.query.id);

  if (!ramalId) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const atual = findRamalById(ramalId);

  if (!atual) {
    return res.status(404).json({ error: "Ramal não encontrado" });
  }

  const diff = gerarDiff(atual, req.body);

  res.json({
    success: true,
    diff,
  });
}, { roles: ["owner", "admin"] });