// src/app/ramais/nova-andradina/nova-andradina-client.tsx
"use client";

import { RamaisList } from "../_components/ramais-list";

type RamalData = {
  nome: string | null;
  setor: string;
  ramal: string;
};

interface NovaAndradinaClientProps {
  titulo: string;
  imagem: string;
  ramais: RamalData[];
}


export function NovaAndradinaClient({
  titulo,
  imagem,
  ramais,
}: NovaAndradinaClientProps) {
  return (
    <RamaisList
      titulo={titulo}
      imagem={imagem}
      ramais={ramais}
    />
  );
}