import type { NextApiRequest, NextApiResponse } from "next";
import { findRamaisByUnidade } from "@/domain/ramais/ramais.repository";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Método não permitido",
    });
  }

  const { unidade, busca } = req.query;

  if (!unidade || typeof unidade !== "string") {
    return res.status(400).json({
      success: false,
      error: "Unidade inválida",
    });
  }

  const ramais = findRamaisByUnidade(
    unidade,
    busca as string | undefined
  );

  return res.status(200).json({
    success: true,
    data: ramais,
    meta: { total: ramais.length },
  });
}
