// src/types/usuario.ts
import { AppUserRole } from './user';

export interface Usuario {
  id: string;
  name: string;
  email: string;
  role: AppUserRole;  // ✅ UserRole do schema
  unidadeId: number | null;
  unidade?: {
    id: number;
    nome: string;
  } | null;
}