// src/app/emails/pirapozinho/pirapozinho-client.tsx
"use client";

import { EmailsList } from "../_components/emails-list";

type EmailData = {
  nome: string | null;
  setor: string;
  email: string;
};

interface PirapozinhoClientProps {
  titulo: string;
  imagem: string;
  emails: EmailData[];
}

export function PirapozinhoClient({
  titulo,
  imagem,
  emails,
}: PirapozinhoClientProps) {
  return (
    <EmailsList
      titulo={titulo}
      imagem={imagem}
      emails={emails}
    />
  );
}