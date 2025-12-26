// pages/api/admin/ramais/import/preview.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/auth/requireAuth";
import { calcularDiffRamal } from "@/domain/ramais/ramais.diff";
import db from "@/db/connection";

type LinhaErro = {
  index: number;
  erros: string[];
  valor: any;
};

type RamalDB = {
  id: number;
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
  bloqueado: boolean;
};

type CamposBloqueados = {
  setor: boolean;
  responsavel: boolean;
};

type DiffRamal = Record<string, DiffCampo>;

export default withAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const user = (req as any).user;
  const json = req.body;

  // 1️⃣ valida estrutura base
  if (!json?.meta?.unidade?.id || typeof json.meta.unidade.id !== "number") {
    return res.status(400).json({
      error: "meta.unidade.id obrigatório",
    });
  }

  const unidadeId = json.meta.unidade.id;

  if (!Array.isArray(json.ramais)) {
    return res.status(400).json({
      error: "Campo ramais ausente ou inválido",
    });
  }

  // 2️⃣ segurança: admin só da própria unidade
  if (user.role === "admin" && user.unidade_id !== unidadeId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  // 3️⃣ validação linha a linha
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
      validos.push({
        numero: r.numero,
        setor: r.setor,
        responsavel: r.responsavel ?? null,
      });
    }
  });

  const atuais = db
    .prepare(`
    SELECT id, numero, setor, responsavel
    FROM ramais
    WHERE unidade_id = ? AND deleted_at IS NULL
  `)
    .all(unidadeId) as RamalDB[];

  const auditorias = db.prepare(`
    SELECT entidade_id, payload
    FROM auditoria
    WHERE entidade = 'ramal'
      AND acao = 'UPDATE'
  `).all();

  const mapaAtual = new Map<string, RamalDB>(
    atuais.map((r: RamalDB) => [r.numero, r])
  );

  const mapaCamposBloqueados = new Map<number, CamposBloqueados>();

  for (const a of auditorias) {
    const payload = JSON.parse(a.payload || "{}");

    const bloqueios: CamposBloqueados = {
      setor: false,
      responsavel: false,
    };

    if (payload.setor) bloqueios.setor = true;
    if (payload.responsavel) bloqueios.responsavel = true;

    mapaCamposBloqueados.set(a.entidade_id, bloqueios);
  }

  const diffs = validos
    .map((r) => {
      const atual = mapaAtual.get(r.numero);
      if (!atual) return null;

      const bloqueios =
        mapaCamposBloqueados.get(atual.id) ?? {
          setor: false,
          responsavel: false,
        };

      const diff: DiffRamal = {};

      if (atual.setor !== r.setor) {
        diff.setor = {
          antes: atual.setor,
          depois: r.setor,
          bloqueado: bloqueios.setor,
        };
      }

      if (atual.responsavel !== (r.responsavel ?? null)) {
        diff.responsavel = {
          antes: atual.responsavel,
          depois: r.responsavel ?? null,
          bloqueado: bloqueios.responsavel,
        };
      }

      if (Object.keys(diff).length === 0) return null;

      return {
        tipo: "ALTERADO" as const,
        numero: r.numero,
        diff,
      };
    })
    .filter(
      (d): d is { tipo: "ALTERADO"; numero: string; diff: DiffRamal } =>
        d !== null
    );

  res.json({
    total: json.ramais.length,
    validos: validos.length,
    invalidos: erros.length,
    erros,
    diff: diffs,
  });

}, { roles: ["owner", "admin"] });
