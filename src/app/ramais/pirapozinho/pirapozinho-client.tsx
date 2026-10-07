// src/app/ramais/pirapozinho/pirapozinho-client.tsx
"use client";

import { RamaisList } from "../_components/ramais-list";

type RamalData = {
  nome: string | null;
  setor: string;
  ramal: string;
};

interface PirapozinhoClientProps {
  titulo: string;
  imagem: string;
  ramais: RamalData[];
}


export function PirapozinhoClient({
  titulo,
  imagem,
  ramais,
}: PirapozinhoClientProps) {
  return (
    <RamaisList
      titulo={titulo}
      imagem={imagem}
      ramais={ramais}
    />
  );
}