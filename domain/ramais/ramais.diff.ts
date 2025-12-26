//domain/ramais/ramais.diff.ts

export type RamalBase = {
  numero: string;
  setor: string;
  responsavel: string | null;
};

export type DiffCampo<T = any> = {
  antes: T | null;
  depois: T | null;
};

export type DiffRamal =
  | {
      tipo: "NOVO";
      numero: string;
      depois: RamalBase;
    }
  | {
      tipo: "ALTERADO";
      numero: string;
      diff: Record<string, DiffCampo>;
    }
  | {
      tipo: "IGNORADO";
      numero: string;
    };

export function calcularDiffRamal(
  atual: RamalBase | null,
  novo: RamalBase
): DiffRamal {
  // novo ramal
  if (!atual) {
    return {
      tipo: "NOVO",
      numero: novo.numero,
      depois: novo,
    };
  }

  const diff: Record<string, DiffCampo> = {};

  if (atual.setor !== novo.setor) {
    diff.setor = {
      antes: atual.setor,
      depois: novo.setor,
    };
  }

  if (atual.responsavel !== novo.responsavel) {
    diff.responsavel = {
      antes: atual.responsavel,
      depois: novo.responsavel,
    };
  }

  if (Object.keys(diff).length === 0) {
    return {
      tipo: "IGNORADO",
      numero: novo.numero,
    };
  }

  return {
    tipo: "ALTERADO",
    numero: novo.numero,
    diff,
  };
}
