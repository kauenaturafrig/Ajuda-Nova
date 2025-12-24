import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../db/connection";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ramais = db
    .prepare("SELECT id, email, setor, responsavel, unidade_id FROM emails")
    .all();

  res.status(200).json(ramais);
}
