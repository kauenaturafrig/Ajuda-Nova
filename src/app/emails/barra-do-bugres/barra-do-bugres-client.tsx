// src/app/emails/barra-do-bugres/barra-do-bugres-client.tsx
"use client";

import { EmailsList } from "../_components/emails-list";

type EmailData = {
  nome: string | null;
  setor: string;
  email: string;
};

interface BarraDoBugresClientProps {
  titulo: string;
  imagem: string;
  emails: EmailData[];
}

export function BarraDoBugresClient({
  titulo,
  imagem,
  emails,
}: BarraDoBugresClientProps) {
  return (
    <EmailsList
      titulo={titulo}
      imagem={imagem}
      emails={emails}
    />
  );
}