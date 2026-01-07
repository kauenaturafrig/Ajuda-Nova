// src/app/admin/authenticated/ramais/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "../../../../lib/auth-client";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import Layout from "../../../../components/Layout";

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

  // estado do novo ramal
  const [newRamal, setNewRamal] = useState({
    numero: "",
    nome: "",
    setor: "",
    unidadeId: "" as string | number,
  });

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      window.location.href = "/admin/signin";
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

  const handleCreate = async () => {
    if (!newRamal.numero || !newRamal.setor) return;

    const payload: any = {
      numero: newRamal.numero,
      nome: newRamal.nome,
      setor: newRamal.setor,
    };

    if (currentUser?.role === "OWNER") {
      payload.unidadeId = newRamal.unidadeId;
    }

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
      setNewRamal({ numero: "", nome: "", setor: "", unidadeId: "" });
    } finally {
      setCreating(false);
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

  const filteredRamais = useMemo(
    () =>
      ramais.filter((r) =>
        `${r.numero} ${r.nome ?? ""} ${r.setor} ${r.unidade?.nome ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [ramais, search]
  );

  if (isPending || loading) return <p>Carregando ramais...</p>;
  if (error) return <p>Erro ao carregar sessão</p>;

  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Ramais</h1>

        {/* Barra de busca */}
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Buscar por número, nome, setor ou unidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Formulário de novo ramal */}
        <div className="border rounded p-3 space-y-2">
          <h2 className="font-medium text-lg">Novo ramal</h2>
          <div className="grid grid-cols-5 gap-2 items-center">
            <Input
              placeholder="Número"
              value={newRamal.numero}
              onChange={(e) =>
                setNewRamal((prev) => ({ ...prev, numero: e.target.value }))
              }
            />
            <Input
              placeholder="Nome"
              value={newRamal.nome}
              onChange={(e) =>
                setNewRamal((prev) => ({ ...prev, nome: e.target.value }))
              }
            />
            <Input
              placeholder="Setor"
              value={newRamal.setor}
              onChange={(e) =>
                setNewRamal((prev) => ({ ...prev, setor: e.target.value }))
              }
            />

            {/* Campo de unidade */}
            {currentUser?.role === "OWNER" ? (
              <select
                className="border rounded px-2 py-1 text-sm"
                value={newRamal.unidadeId}
                onChange={(e) =>
                  setNewRamal((prev) => ({
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
                value={currentUser?.unidadeNome ?? `Unidade #${currentUser?.unidadeId}`}
              />
            )}

            <Button onClick={handleCreate} disabled={creating}>
              {creating ? "Criando..." : "Criar ramal"}
            </Button>
          </div>
        </div>

        {/* Lista editável */}
        <div className="space-y-2">
          {filteredRamais.map((ramal) => (
            <div
              key={ramal.id}
              className="grid grid-cols-5 gap-2 items-center border p-2 rounded"
            >
              <Input
                value={ramal.numero}
                onChange={(e) =>
                  handleChange(ramal.id, "numero", e.target.value)
                }
              />
              <Input
                value={ramal.nome ?? ""}
                onChange={(e) => handleChange(ramal.id, "nome", e.target.value)}
              />
              <Input
                value={ramal.setor}
                onChange={(e) =>
                  handleChange(ramal.id, "setor", e.target.value)
                }
              />
              <div className="text-sm text-muted-foreground">
                {ramal.unidade?.nome ?? `Unidade #${ramal.unidadeId}`}
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSave(ramal)}
                  disabled={savingId === ramal.id}
                >
                  {savingId === ramal.id ? "Salvando..." : "Salvar"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(ramal.id)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
