// pages/admin/ramais/[id].tsx
"use client";

import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ModalConfirmacaoDiff from "@/components/ModalConfirmacaoDiff";

type RamalForm = {
  numero: string;
  setor: string;
  responsavel: string;
};

type Diff = {
  [campo: string]: {
    antes: any;
    depois: any;
  };
};

export default function EditarRamalPage() {
  const router = useRouter();
  const { id } = router.query;

  const [original, setOriginal] = useState<RamalForm | null>(null);
  const [form, setForm] = useState<RamalForm>({
    numero: "",
    setor: "",
    responsavel: "",
  });

  const [diff, setDiff] = useState<Diff>({});
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/ramais/${id}`)
      .then(r => r.json())
      .then(data => {
        const ramal = {
          numero: data.numero,
          setor: data.setor,
          responsavel: data.responsavel ?? "",
        };

        setOriginal(ramal);
        setForm(ramal);
      });
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function gerarDiff(): Diff {
    if (!original) return {};

    const d: Diff = {};

    (Object.keys(form) as (keyof RamalForm)[]).forEach(campo => {
      if (form[campo] !== original[campo]) {
        d[campo] = {
          antes: original[campo],
          depois: form[campo],
        };
      }
    });

    return d;
  }

  function handleSalvar() {
    const d = gerarDiff();

    if (Object.keys(d).length === 0) {
      alert("Nenhuma alteração detectada");
      return;
    }

    setDiff(d);
    setModalOpen(true);
  }


  async function confirmarSalvar() {
    await fetch(`/api/admin/ramais/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/admin/ramais");
  }

  return (
    <Layout>
      <div className="p-6 max-w-xl">
        <h1 className="text-xl font-bold mb-4">
          Editar Ramal #{id}
        </h1>
        <div className="space-y-3">
          <input
            name="numero"
            value={form.numero}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Número"
          />
          <input
            name="setor"
            value={form.setor}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Setor"
          />
          <input
            name="responsavel"
            value={form.responsavel}
            onChange={handleChange}
            className="border p-2 w-full"
            placeholder="Responsável"
          />
        </div>
        <button
          onClick={handleSalvar}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Salvar
        </button>
        <ModalConfirmacaoDiff
          open={modalOpen}
          diff={diff}
          onCancel={() => setModalOpen(false)}
          onConfirm={confirmarSalvar}
        />
      </div>
    </Layout>
  );
}
