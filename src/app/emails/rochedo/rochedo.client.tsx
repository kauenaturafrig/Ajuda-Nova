// src/app/emails/rochedo/rochedo-client.tsx
"use client";

import { EmailsList } from "../_components/emails-list";

type EmailData = {
  nome: string | null;
  setor: string;
  email: string;
};

interface RochedoClientProps {
  titulo: string;
  imagem: string;
  emails: EmailData[];
}

export function RochedoClient({
  titulo,
  imagem,
  emails,
}: RochedoClientProps) {
  return (
    <EmailsList
      titulo={titulo}
      imagem={imagem}
      emails={emails}
    />
  );
}