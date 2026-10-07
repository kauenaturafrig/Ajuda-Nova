// src/app/ramais/rochedo/rochedo-client.tsx
"use client";

import { RamaisList } from "../_components/ramais-list";

type RamalData = {
  nome: string | null;
  setor: string;
  ramal: string;
};

interface RochedoClientProps {
  titulo: string;
  imagem: string;
  ramais: RamalData[];
}


export function RochedoClient({
  titulo,
  imagem,
  ramais,
}: RochedoClientProps) {
  return (
    <RamaisList
      titulo={titulo}
      imagem={imagem}
      ramais={ramais}
    />
  );
}