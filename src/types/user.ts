// src/types/user.ts - Tipos compartilhados
export const APP_USER_ROLES = [
  "OWNER",
  "ADMIN",
  "MESSAGEONLY",
  "NEWSONLY",
  "MESSAGENEWS",
  "EVENTS",
  "EXTENSION",
  "EMAIL",
] as const;

export type AppUserRole =
  (typeof APP_USER_ROLES)[number];

export type Usuario = {
  id: string;
  name: string;
  email: string;
  roles: AppUserRole[];
  unidadeId: number | null;
  unidade: {
    id: number;
    nome: string;
  } | null;
};

export type Unidade = {
  id: number;
  nome: string;
};