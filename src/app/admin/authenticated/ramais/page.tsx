// src/app/admin/authenticated/ramais/page.tsx
"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useSession } from "../../../../lib/auth-client";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import Layout from "../../../../components/Layout";
import { headers } from 'next/headers';
import { auth } from '../../../../lib/auth';
import { LoadingOverlay } from "../../../../components/ui/loading-overlay";

type Ramal = {
  id: number;
  numero: string;
  nome: string | null;
  setor: string;
  unidadeId: number;
  unidade?: { nome: string };
};

type CurrentUser = {
  role: "OWNER" | "ADMIN";
  unidadeId: number | null;
  unidadeNome?: string | null;
};

export default function RamaisPage() {
  const { data: session, isPending, error } = useSession();
  const [ramais, setRamais] = useState<Ramal[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [unidades, setUnidades] = useState<{ id: number; nome: string }[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [formRamal, setFormRamal] = useState({
    id: null as number | null,
    numero: "",
    nome: "",
    setor: "",
    unidadeId: "" as string | number,
  });

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      window.location.href = "/admin";
      return;
    }

    (async () => {
      // pega ramais
      const res = await fetch("/admin/api/ramais");
      const data = await res.json();
      setRamais(data);

      // pega usuário + unidades (pode ser uma rota /admin/api/me, aqui simplificado)
      const meRes = await fetch("/admin/api/usuarios/me");
      const me = await meRes.json();
      setCurrentUser(me);

      if (me.role === "OWNER") {
        const uRes = await fetch("/admin/api/unidades");
        const uData = await uRes.json();
        setUnidades(uData);
      }

      setLoading(false);
    })();
  }, [isPending, session]);

  const handleChange = (id: number, field: keyof Ramal, value: string) => {
    setRamais((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSave = async (ramal: Ramal) => {
    setSavingId(ramal.id);
    try {
      const res = await fetch("/admin/api/ramais", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ramal),
      });
      if (!res.ok) {
        console.error("Erro ao salvar ramal");
      }
    } finally {
      setSavingId(null);
    }
  };

  const handleSubmitForm = async () => {
    if (!formRamal.numero || !formRamal.setor) return;

    const payload: any = {
      numero: formRamal.numero,
      nome: formRamal.nome,
      setor: formRamal.setor,
    };

    if (currentUser?.role === "OWNER") {
      payload.unidadeId = formRamal.unidadeId;
    }

    if (editingId) {
      // EDITAR
      payload.id = editingId;
      setSavingId(editingId);
      try {
        const res = await fetch("/admin/api/ramais", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          console.error("Erro ao salvar ramal");
          return;
        }
        const updated: Ramal = await res.json();
        setRamais((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r)),
        );
        cancelEdit();
      } finally {
        setSavingId(null);
      }
    } else {
      // CRIAR
      setCreating(true);
      try {
        const res = await fetch("/admin/api/ramais", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          console.error("Erro ao criar ramal");
          return;
        }
        const created: Ramal = await res.json();
        setRamais((prev) => [...prev, created]);
        cancelEdit();
      } finally {
        setCreating(false);
      }
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Tem certeza que deseja excluir este ramal?");
    if (!ok) return;

    const prev = ramais;
    setRamais((r) => r.filter((ramal) => ramal.id !== id));

    const res = await fetch("/admin/api/ramais", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      console.error("Erro ao excluir ramal");
      // rollback em caso de erro
      setRamais(prev);
    }
  };

  const startEdit = (ramal: Ramal) => {
    setEditingId(ramal.id);
    setFormRamal({
      id: ramal.id,
      numero: ramal.numero,
      nome: ramal.nome ?? "",
      setor: ramal.setor,
      unidadeId: ramal.unidadeId,
    });

    // depois de setar o estado, rola até o formulário
    // pequeno timeout garante que o React aplique o novo título "Editar email"
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 0);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormRamal({
      id: null,
      numero: "",
      nome: "",
      setor: "",
      unidadeId: "",
    });
  };

  function normalize(str: string) {
    return str
      .normalize("NFD") // separa acentos
      .replace(/[\u0300-\u036f]/g, "") // remove marcas de acento
      .toLowerCase();
  }

  const filteredRamais = useMemo(
    () => {
      const term = normalize(search);

      return ramais.filter((r) => {
        const texto = `${r.numero} ${r.nome ?? ""} ${r.setor} ${r.unidade?.nome ?? ""
          }`;
        return normalize(texto).includes(term);
      });
    },
    [ramais, search]
  );

  if (isPending || loading || !currentUser) {
    return (
      <Layout>
        <LoadingOverlay show={true} text="Carregando ramais..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <p>Erro ao carregar sessão</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <LoadingOverlay show={loading} />
      <div className="w-[90%] mx-auto">
        {/*  className="space-y-4" */}
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">Edição de Ramais</h1>
          <div>
            <h3 className="font-bold">Usuário logado: {session?.user.name}</h3>
            <h4>Perfil: {currentUser?.role === "OWNER" ? "Owner" : "Admin"}</h4>
          </div>
        </div>

        {/* Barra de busca */}
        <div className="flex gap-2 items-center my-10">
          <Input
            placeholder="Buscar por número, nome, setor ou unidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-[3px] rounded border-blue-500"
          />
        </div>

        {/* Formulário de novo ramal */}
        <h2 className="font-medium text-lg mt-4 mb-2">
          {editingId ? "Editar ramal" : "Novo ramal"}
        </h2>
        <div
          className="grid grid-cols-5 gap-2 items-center mb-10"
          ref={formRef}>
          <Input
            placeholder="Número"
            value={formRamal.numero}
            onChange={(e) =>
              setFormRamal((prev) => ({ ...prev, numero: e.target.value }))
            }
            className="border-[3px] rounded border-blue-500"
          />
          <Input
            placeholder="Nome"
            value={formRamal.nome}
            onChange={(e) =>
              setFormRamal((prev) => ({ ...prev, nome: e.target.value }))
            }
            className="border-[3px] rounded border-blue-500"
          />
          <Input
            placeholder="Setor"
            value={formRamal.setor}
            onChange={(e) =>
              setFormRamal((prev) => ({ ...prev, setor: e.target.value }))
            }
            className="border-[3px] rounded border-blue-500"
          />

          {currentUser?.role === "OWNER" ? (
            <select
              className="border rounded px-2 py-1 text-sm"
              value={formRamal.unidadeId}
              onChange={(e) =>
                setFormRamal((prev) => ({
                  ...prev,
                  unidadeId: Number(e.target.value),
                }))
              }
            >
              <option value="">Selecione a unidade</option>
              {unidades.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
            </select>
          ) : (
            <Input
              disabled
              value={
                currentUser?.unidadeNome ?? `Unidade #${currentUser?.unidadeId}`
              }
            />
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleSubmitForm}
              disabled={creating || !!savingId}
              className="bg-green-500"
            >
              {editingId
                ? savingId === editingId
                  ? "Salvando..."
                  : "Salvar"
                : creating
                  ? "Criando..."
                  : "Criar ramal"}
            </Button>
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
                disabled={!!savingId}
                className="bg-red-500 text-white"
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>

        {/* Lista de ramais (somente leitura) */}
        <div className="space-y-1 border-[3px] rounded border-blue-500 p-2">
          {filteredRamais.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum ramal encontrado para “{search}”.
            </p>
          ) : (
            filteredRamais.map((ramal) => (
              <div
                key={ramal.id}
                className="
                  grid gap-3 border p-3 rounded
                  grid-cols-1
                  md:grid-cols-[1fr_2fr_2fr_1fr_auto]                    
                "
              >
                <span className="break-all"><strong>{ramal.numero}</strong></span>
                <span className="break-words">{ramal.nome ?? "-"}</span>
                <span className="break-words">{ramal.setor}</span>
                <span className="text-sm text-muted-foreground break-words">
                  {ramal.unidade?.nome ?? `Unidade #${ramal.unidadeId}`}
                </span>
                <div className="flex flex-wrap gap-2 justify-end mt-2 md:mt-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(ramal)}
                    className="bg-yellow-500"
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(ramal.id)}
                    className="bg-red-500"
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
