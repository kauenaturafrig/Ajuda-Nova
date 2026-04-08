// src/types/user.ts - Tipos compartilhados
export type AppUserRole = "OWNER" | "ADMIN" | "MESSAGEONLY" | "NEWSONLY" | "MESSAGENEWS";

export interface Recado {
  id: number;
  titulo: string;
  conteudo: string;
  imagem?: string;
  unidadeId: number;
  unidade: { nome: string };
  createdAt: Date;
}

export interface Unidade {
  id: number;
  nome: string;
}