import type { AppUserRole } from "@/src/types/user";

export const PAGE_ROLES = {
  recados: [
    "OWNER",
    "MESSAGEONLY",
    "MESSAGENEWS",
  ],

  noticias: [
    "OWNER",
    "NEWSONLY",
    "MESSAGENEWS",
  ],

  agenda: [
    "OWNER",
    "EVENTS",
  ],

  agendaLogs: [
    "OWNER",
  ],

  ramais: [
    "OWNER",
    "EXTENSION",
  ],

  emails: [
    "OWNER",
    "EMAIL",
  ],

  usuarios: [
    "OWNER",
  ],

  auditoriaRecados: [
    "OWNER",
  ],

  noticiasAuditoria: [
    "OWNER",
  ],
} satisfies Record<
  string,
  readonly AppUserRole[]
>;

export const GLOBAL_ROLES: Record<
  string,
  readonly AppUserRole[]
> = {
  recados: [
    "OWNER",
    "MESSAGENEWS",
  ],

  noticias: [
    "OWNER",
    "MESSAGENEWS",
  ],
};