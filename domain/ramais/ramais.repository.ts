// domain/ramais/ramais.repository.ts
import db from "../../db/connection";

export type RamalDB = {
    id: number;
    numero: string;
    setor: string;
    responsavel: string | null;
    unidade: string;
};

export function findRamaisByUnidade(
  unidade: string,
  busca?: string
): RamalDB[] {
  // 1. Base da Query
  let sql = `
    SELECT 
      r.id,
      r.numero,
      r.setor,
      r.responsavel,
      u.nome as unidade
    FROM ramais r
    JOIN unidades u ON u.id = r.unidade_id
    WHERE u.nome = ?
  `;

  const params: any[] = [unidade];

  // 2. Lógica de Busca
  if (busca && busca.trim() !== "") {
    const termo = busca.trim();
    
    // Adicionamos o filtro de busca de forma mais simples primeiro para testar
    // Se o banco for pequeno, o SQLite lida bem com LOWER padrão
    sql += `
      AND (
        LOWER(r.setor) LIKE LOWER(?)
        OR LOWER(COALESCE(r.responsavel, '')) LIKE LOWER(?)
        OR r.numero LIKE ?
      )
    `;
    
    const like = `%${termo}%`;
    params.push(like, like, like);
  }

  sql += " ORDER BY r.numero";

  try {
    const stmt = db.prepare(sql);
    const resultados = stmt.all(...params) as RamalDB[];

    // 3. FILTRO DE EMERGÊNCIA (Caso o SQLite falhe com acentos)
    // Se o banco retornou vazio mas o usuário digitou algo, 
    // filtramos via JavaScript para garantir que funcione 100%
    if (busca && busca.trim() !== "" && resultados.length === 0) {
        // Busca todos da unidade e filtra no JS (segunda tentativa)
        const todosDaUnidade = db.prepare(`
            SELECT r.id, r.numero, r.setor, r.responsavel, u.nome as unidade
            FROM ramais r
            JOIN unidades u ON u.id = r.unidade_id
            WHERE u.nome = ?
        `).all(unidade) as RamalDB[];

        const normalizar = (txt: string | null) => 
            (txt || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        const buscaNorm = normalizar(busca);

        return todosDaUnidade.filter(r => 
            normalizar(r.setor).includes(buscaNorm) || 
            normalizar(r.responsavel).includes(buscaNorm) ||
            r.numero.includes(busca.trim())
        );
    }

    return resultados;
  } catch (error) {
    console.error("Erro no Banco:", error);
    return [];
  }
}

export function createRamal(data: {
  numero: string;
  setor: string;
  responsavel?: string | null;
  unidade_id: number;
}) {
  const stmt = db.prepare(`
    INSERT INTO ramais (numero, setor, responsavel, unidade_id)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.numero,
    data.setor,
    data.responsavel ?? null,
    data.unidade_id
  );

  return result.lastInsertRowid;
}

export function updateRamal(
  id: number,
  data: {
    numero: string;
    setor: string;
    responsavel?: string | null;
  },
  user_id: number
) {
  db.prepare(`
    UPDATE ramais
    SET 
      numero = ?,
      setor = ?,
      responsavel = ?,
      updated_at = datetime('now'),
      updated_by = ?
    WHERE id = ? AND deleted_at IS NULL
  `).run(
    data.numero,
    data.setor,
    data.responsavel ?? null,
    user_id,
    id
  );
}

export function softDeleteRamal(id: number, user_id: number) {
  db.prepare(`
    UPDATE ramais
    SET 
      deleted_at = datetime('now'),
      updated_by = ?
    WHERE id = ? AND deleted_at IS NULL
  `).run(user_id, id);
}

export function findRamalById(id: number) {
  return db.prepare(`
    SELECT id, numero, setor, responsavel, unidade_id
    FROM ramais
    WHERE id = ? AND deleted_at IS NULL
  `).get(id);
}
