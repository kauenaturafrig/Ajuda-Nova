// src/app/emails/nova-andradina/nova-andradina-client.tsx
"use client";

import { EmailsList } from "../_components/emails-list";

type EmailData = {
  nome: string | null;
  setor: string;
  email: string;
};

interface NovaAndradinaClientProps {
  titulo: string;
  imagem: string;
  emails: EmailData[];
}

export function NovaAndradinaClient({
  titulo,
  imagem,
  emails,
}: NovaAndradinaClientProps) {
  return (
    <EmailsList
      titulo={titulo}
      imagem={imagem}
      emails={emails}
    />
  );
}