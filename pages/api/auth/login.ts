// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import bcrypt from "bcryptjs";
import db from "@/db/connection";
import { sessionOptions, SessionUser } from "@/lib/session";

export default async function login(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { username, password } = req.body;

  const user = db.prepare(`
    SELECT id, username, password_hash, role, unidade_id
    FROM usuarios
    WHERE username = ?
  `).get(username);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const session = await getIronSession<{
    user?: SessionUser;
  }>(req, res, sessionOptions);

  session.user = {
    id: user.id,
    username: user.username,
    role: user.role,
    unidade_id: user.unidade_id,
  };

  await session.save();

  res.json({ success: true });
}

