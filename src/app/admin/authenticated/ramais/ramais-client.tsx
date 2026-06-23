// src/app/admin/authenticated/ramais/ramais-client.tsx
"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useSession } from "../../../../lib/auth-client";
import { useRouter } from "next/navigation";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import Layout from "../../../../components/Layout";
import { LoadingOverlay } from "../../../../components/ui/loading-overlay";
import { useToast } from "../../../../components/ui/use-toast";
import UploadRamaisImport from "./_components/UploadRamaisImport";

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

export default function RamaisClientPage() {
  const router = useRouter();
  const { showToast } = useToast();
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
  const [formErrors, setFormErrors] = useState({
    numero: "",
    nome: "",
    setor: "",
    unidadeId: "",
  });

  const [formRamal, setFormRamal] = useState({
    id: null as number | null,
    numero: "",
    nome: "",
    setor: "",
    unidadeId: "" as string | number,
  });

  const refreshRamais = useCallback(async () => {
    const res = await fetch("/admin/api/ramais");
    const data = await res.json();
    setRamais(data);
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      window.location.href = "/admin";
      return;
    }

    (async () => {
      const res = await fetch("/admin/api/ramais");
      const data = await res.json();
      setRamais(data);

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
    setRamais((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleSave = async (ramal: Ramal) => {
    setSavingId(ramal.id);
    try {
      const res = await fetch("/admin/api/ramais", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ramal),
      });
      if (!res.ok) console.error("Erro ao salvar ramal");
    } finally {
      setSavingId(null);
    }
  };

  const handleSubmitForm = async () => {
    const errors = {
      numero: "",
      nome: "",
      setor: "",
      unidadeId: "",
    };

    if (!formRamal.numero.trim()) {
      errors.numero = "Informe o número do ramal.";
    }

    if (!formRamal.nome.trim()) {
      setFormRamal((prev) => ({ ...prev, nome: "Geral" }));
      errors.nome = "Nome estava vazio, será usado 'Geral'.";
    }

    if (!formRamal.setor.trim()) {
      errors.setor = "Informe o setor.";
    }

    if (currentUser?.role === "OWNER" && !formRamal.unidadeId) {
      errors.unidadeId = "Selecione a unidade.";
    }

    if (errors.numero || errors.nome || errors.setor || errors.unidadeId) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({
      numero: "",
      nome: "",
      setor: "",
      unidadeId: "",
    });

    const payload: any = {
      numero: formRamal.numero,
      nome: formRamal.nome || "Geral",
      setor: formRamal.setor,
    };

    if (currentUser?.role === "OWNER") {
      payload.unidadeId = formRamal.unidadeId;
    }

    if (editingId) {
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
        setRamais((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        cancelEdit();

        showToast({
          title: "Ramal atualizado",
          message: `Ramal ${updated.numero} salvo com sucesso.`,
        });

        router.refresh();
      } finally {
        setSavingId(null);
      }
    } else {
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

        showToast({
          title: "Ramal criado",
          message: `Ramal ${created.numero} criado com sucesso.`,
        });

        router.refresh();
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
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  const filteredRamais = useMemo(() => {
    const term = normalize(search);

    return ramais.filter((r) => {
      const texto = `${r.numero} ${r.nome ?? ""} ${r.setor} ${r.unidade?.nome ?? ""}`;
      return normalize(texto).includes(term);
    });
  }, [ramais, search]);

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
    <>
      <LoadingOverlay show={loading} />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="bg-gray-500 text-white"
            >
              ← Voltar
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold dark:text-white">
                Edição de Ramais
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                Pesquise, crie ou edite ramais com mais organização.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={async () => {
                  const res = await fetch("/admin/api/ramais/export");
                  const csv = await res.text();
                  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.setAttribute("download", "ramais.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="bg-blue-500 border-none text-white"
              >
                Exportar CSV
              </Button>

              <UploadRamaisImport onImportSuccess={refreshRamais} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <section className="xl:col-span-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold dark:text-white">Buscar ramais</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Filtre por qualquer campo.</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200">
                {filteredRamais.length} itens
              </span>
            </div>

            <Input
              placeholder="Buscar por número, nome, setor ou unidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-[3px] rounded border-blue-500 dark:text-white"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-3 text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                Limpar busca
              </button>
            )}
          </section>

          <section className="xl:col-span-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold dark:text-white">
                  {editingId ? "Editar ramal" : "Criar novo ramal"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Preencha os campos para salvar um novo registro.
                </p>
              </div>

              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEdit}
                  disabled={!!savingId}
                  className="bg-red-500 text-white"
                >
                  Cancelar edição
                </Button>
              )}
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3"
              ref={formRef}
            >
              <div>
                <Input
                  placeholder="Número"
                  value={formRamal.numero}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/\D/g, "");
                    setFormRamal((prev) => ({ ...prev, numero: onlyDigits }));
                  }}
                  className="border-[3px] rounded border-blue-500 dark:text-white"
                />
                {formErrors.numero && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.numero}</p>
                )}
              </div>

              <div>
                <Input
                  placeholder="Nome"
                  value={formRamal.nome}
                  onChange={(e) =>
                    setFormRamal((prev) => ({ ...prev, nome: e.target.value }))
                  }
                  className="border-[3px] rounded border-blue-500 dark:text-white"
                />
                {formErrors.nome && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.nome}</p>
                )}
              </div>

              <div>
                <Input
                  placeholder="Setor"
                  value={formRamal.setor}
                  onChange={(e) =>
                    setFormRamal((prev) => ({ ...prev, setor: e.target.value }))
                  }
                  className="border-[3px] rounded border-blue-500 dark:text-white"
                />
                {formErrors.setor && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.setor}</p>
                )}
              </div>

              {currentUser?.role === "OWNER" ? (
                <div>
                  <select
                    className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-900 dark:text-white"
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
                  {formErrors.unidadeId && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.unidadeId}</p>
                  )}
                </div>
              ) : (
                <Input
                  disabled
                  value={
                    currentUser?.unidadeNome ?? `Unidade #${currentUser?.unidadeId}`
                  }
                  className="dark:text-white"
                />
              )}

              <div className="flex flex-wrap gap-2">
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
              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Dica: use a busca para encontrar ramais rapidamente.
          </span>
        </div>

        <div className="space-y-2">
          {filteredRamais.length === 0 ? (
            <p className="text-sm text-muted-foreground dark:text-white">
              Nenhum ramal encontrado para “{search}”.
            </p>
          ) : (
            filteredRamais.map((ramal) => (
              <div
                key={ramal.id}
                className="grid gap-3 border p-3 rounded-xl bg-white/70 dark:bg-gray-900/70 border-black dark:border-white align-middle items-center dark:text-white md:grid-cols-[1fr_2fr_2fr_1fr_auto]"
              >
                <span className="break-all font-semibold">{ramal.numero}</span>
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
    </>
  );
}