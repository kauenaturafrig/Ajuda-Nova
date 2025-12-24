// pages/api/admin/ramais/import/preview.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/auth/requireAuth";
import db from "@/db/connection";

type LinhaErro = {
  index: number;
  erros: string[];
  valor: any;
};

type RamalDB = {
  numero: string;
  setor: string;
  responsavel: string | null;
};

type RamalImport = {
  numero: string;
  setor: string;
  responsavel?: string | null;
};

type DiffCampo = {
  antes: string | null;
  depois: string | null;
};

type DiffRamal = Record<string, DiffCampo>;

export default withAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const json = req.body;
  const user = (req as any).user;

  // 🔒 Validação de meta.unidade.id
  const unidadeId = json?.meta?.unidade?.id;

  if (!unidadeId || typeof unidadeId !== "number") {
    return res.status(400).json({
      error: "meta.unidade.id obrigatório",
    });
  }

  // 🔐 Segurança
  if (user.role === "admin" && user.unidade_id !== unidadeId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  if (!Array.isArray(json.ramais)) {
    return res.status(400).json({
      error: "Formato inválido: ramais ausente ou inválido",
    });
  }

  const erros: LinhaErro[] = [];
  const validos: RamalImport[] = [];

  json.ramais.forEach((r: any, index: number) => {
    const linhaErros: string[] = [];

    if (!r.numero || typeof r.numero !== "string") {
      linhaErros.push("Campo 'numero' obrigatório e string");
    }

    if (!r.setor || typeof r.setor !== "string") {
      linhaErros.push("Campo 'setor' obrigatório e string");
    }

    if (
      r.responsavel !== undefined &&
      r.responsavel !== null &&
      typeof r.responsavel !== "string"
    ) {
      linhaErros.push("Campo 'responsavel' deve ser string ou null");
    }

    if (linhaErros.length > 0) {
      erros.push({ index, erros: linhaErros, valor: r });
    } else {
      validos.push(r);
    }
  });

  // 🔎 Busca SOMENTE ramais da unidade
  const atuais = db.prepare(`
    SELECT numero, setor, responsavel
    FROM ramais
    WHERE unidade_id = ?
      AND deleted_at IS NULL
  `).all(unidadeId) as RamalDB[];

  const mapaAtual = new Map<string, RamalDB>(
    atuais.map(r => [r.numero, r])
  );

  const diff = validos.map((novo) => {
    const atual = mapaAtual.get(novo.numero);

    if (!atual) {
      return {
        numero: novo.numero,
        tipo: "NOVO",
        depois: novo,
      };
    }

    const alteracoes: DiffRamal = {};

    (["setor", "responsavel"] as const).forEach((campo) => {
      const antes = atual[campo];
      const depois = novo[campo] ?? null;

      if (antes !== depois) {
        alteracoes[campo] = { antes, depois };
      }
    });

    if (Object.keys(alteracoes).length === 0) {
      return null;
    }

    return {
      numero: novo.numero,
      tipo: "ALTERADO",
      diff: alteracoes,
    };
  }).filter(Boolean);

  res.status(200).json({
    unidade_id: unidadeId,
    total: json.ramais.length,
    validos: validos.length,
    invalidos: erros.length,
    erros,
    diff,
  });
}, { roles: ["owner", "admin"] });
