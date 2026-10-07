// src/app/ramais/barra-do-bugres/barra-do-bugres-client.tsx
"use client";

import { RamaisList } from "../_components/ramais-list";

type RamalData = {
  nome: string | null;
  setor: string;
  ramal: string;
};

interface BarraDoBugresClientProps {
  titulo: string;
  imagem: string;
  ramais: RamalData[];
}


export function BarraDoBugresClient({
  titulo,
  imagem,
  ramais,
}: BarraDoBugresClientProps) {
  return (
    <RamaisList
      titulo={titulo}
      imagem={imagem}
      ramais={ramais}
    />
  );
}