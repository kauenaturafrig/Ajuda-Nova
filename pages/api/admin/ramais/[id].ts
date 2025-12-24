// pages/api/admin/ramais/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/auth/requireAuth";
import { atualizarRamal } from "@/domain/ramais/ramais.service";

export default withAuth(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "PUT") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const id = Number(req.query.id);
    const { numero, setor, responsavel, motivo } = req.body;
    const user = (req as any).user;

    try {
      const resultado = atualizarRamal(
        id,
        { numero, setor, responsavel },
        user.id,
        motivo
      );

      res.json({
        success: true,
        ...resultado,
      });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  },
  { roles: ["owner", "admin"] }
);
