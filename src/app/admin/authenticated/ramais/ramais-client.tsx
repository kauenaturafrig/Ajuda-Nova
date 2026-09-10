// src/app/admin/authenticated/ramais/ramais-client.tsx
"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { LoadingOverlay } from "../../../../components/ui/loading-overlay";
import { useToast } from "../../../../components/ui/use-toast";
import UploadRamaisImport from "./_components/UploadRamaisImport";
import {
  ArrowLeft,
  Download,
  Plus,
  Search,
  Trash2,
  Edit2,
  PhoneCall,
  SlidersHorizontal,
} from "lucide-react";

import type { AppUserRole } from "@/src/types/user";

type Ramal = {
  id: number;
  numero: string;
  nome: string | null;
  setor: string;
  unidadeId: number;
  unidade?: { nome: string };
};

type CurrentUser = {
  role: "OWNER" | "EXTENSION";
  unidadeId: number | null;
  unidadeNome?: string | null;
};

type Props = {
  userRoles: AppUserRole[];
  userUnidadeId: number | null;
  userUnidadeNome?: string | null;
};

export default function RamaisClient({
  userRoles,
  userUnidadeId,
  userUnidadeNome,
}: Props) {
  const router = useRouter();
  const { showToast } = useToast();

  const [ramais, setRamais] = useState<Ramal[]>(
    [],
  );

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<
    number | null
  >(null);

  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null);

  const [unidades, setUnidades] = useState<
    { id: number; nome: string }[]
  >([]);

  const [editingId, setEditingId] = useState<
    number | null
  >(null);

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
    (async () => {
      const res = await fetch("/admin/api/ramais");
      const data = await res.json();
      setRamais(data);

      if (userRoles.includes("OWNER")) {
        const uRes = await fetch(
          "/admin/api/unidades",
        );
        const uData = await uRes.json();
        setUnidades(uData);
      }

      setCurrentUser({
        role: userRoles.includes("OWNER")
          ? "OWNER"
          : "EXTENSION",
        unidadeId: userUnidadeId,
        unidadeNome: userUnidadeNome,
      });

      setLoading(false);
    })();
  }, [
    userRoles,
    userUnidadeId,
    userUnidadeNome,
  ]);

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
      setFormRamal((prev) => ({
        ...prev,
        nome: "Geral",
      }));

      errors.nome =
        "Nome estava vazio, será usado 'Geral'.";
    }

    if (!formRamal.setor.trim()) {
      errors.setor = "Informe o setor.";
    }

    if (
      currentUser?.role === "OWNER" &&
      !formRamal.unidadeId
    ) {
      errors.unidadeId = "Selecione a unidade.";
    }

    if (
      errors.numero ||
      errors.nome ||
      errors.setor ||
      errors.unidadeId
    ) {
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
        const res = await fetch(
          "/admin/api/ramais",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        if (!res.ok) {
          console.error("Erro ao salvar ramal");
          return;
        }

        const updated: Ramal =
          await res.json();

        setRamais((prev) =>
          prev.map((r) =>
            r.id === updated.id ? updated : r,
          ),
        );

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
        const res = await fetch(
          "/admin/api/ramais",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        if (!res.ok) {
          console.error("Erro ao criar ramal");
          return;
        }

        const created: Ramal =
          await res.json();

        setRamais((prev) => [
          ...prev,
          created,
        ]);

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
    const ok = window.confirm(
      "Tem certeza que deseja excluir este ramal?",
    );

    if (!ok) {
      return;
    }

    const prev = ramais;

    setRamais((r) =>
      r.filter((ramal) => ramal.id !== id),
    );

    const res = await fetch("/admin/api/ramais", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
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
      const texto = `${r.numero} ${
        r.nome ?? ""
      } ${r.setor} ${
        r.unidade?.nome ?? ""
      }`;

      return normalize(texto).includes(term);
    });
  }, [ramais, search]);

  if (loading || !currentUser) {
    return (
      <LoadingOverlay
        show={true}
        text="Carregando ramais..."
      />
    );
  }

  return (
    <>
      <LoadingOverlay show={loading} />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-100 dark:border-neutral-800/60 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="h-9 w-9 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                  <PhoneCall size={18} />
                </span>

                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Edição de Ramais
                </h1>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 pl-12">
              Pesquise, crie ou edite ramais corporativos de forma centralizada.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pl-12 md:pl-0">
            <Button
              variant="outline"
              onClick={async () => {
                const res = await fetch(
                  "/admin/api/ramais/export",
                );

                const csv = await res.text();

                const blob = new Blob(
                  ["\uFEFF" + csv],
                  {
                    type: "text/csv;charset=utf-8;",
                  },
                );

                const link =
                  document.createElement("a");

                link.href = URL.createObjectURL(
                  blob,
                );

                link.setAttribute(
                  "download",
                  "ramais.csv",
                );

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="gap-2 rounded-xl border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800 shadow-sm text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar CSV
            </Button>

            <UploadRamaisImport
              onImportSuccess={refreshRamais}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <section
            className="bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 p-6 shadow-sm"
            ref={formRef}
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-800/60 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />

                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    {editingId
                      ? "Editar Ramal Selecionado"
                      : "Adicionar Novo Ramal"}
                  </h2>

                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Preencha os campos obrigatórios identificados abaixo.
                  </p>
                </div>
              </div>

              {editingId && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={cancelEdit}
                  disabled={!!savingId}
                  className="rounded-xl text-xs font-semibold"
                >
                  Cancelar Edição
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-start">
              <div className="lg:col-span-2">
                <Input
                  placeholder="Número"
                  value={formRamal.numero}
                  onChange={(e) => {
                    const onlyDigits =
                      e.target.value.replace(
                        /\D/g,
                        "",
                      );

                    setFormRamal((prev) => ({
                      ...prev,
                      numero: onlyDigits,
                    }));
                  }}
                  className={`rounded-xl h-10 border-gray-200 dark:border-neutral-800 text-xs ${
                    formErrors.numero
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                />

                {formErrors.numero && (
                  <p className="text-red-500 font-medium text-[11px] mt-1 ml-1">
                    {formErrors.numero}
                  </p>
                )}
              </div>

              <div className="lg:col-span-3">
                <Input
                  placeholder="Nome (Ex: Recepção, João...)"
                  value={formRamal.nome}
                  onChange={(e) =>
                    setFormRamal((prev) => ({
                      ...prev,
                      nome: e.target.value,
                    }))
                  }
                  className={`rounded-xl h-10 border-gray-200 dark:border-neutral-800 text-xs ${
                    formErrors.nome
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                />

                {formErrors.nome && (
                  <p className="text-red-500 font-medium text-[11px] mt-1 ml-1">
                    {formErrors.nome}
                  </p>
                )}
              </div>

              <div className="lg:col-span-3">
                <Input
                  placeholder="Setor"
                  value={formRamal.setor}
                  onChange={(e) =>
                    setFormRamal((prev) => ({
                      ...prev,
                      setor: e.target.value,
                    }))
                  }
                  className={`rounded-xl h-10 border-gray-200 dark:border-neutral-800 text-xs ${
                    formErrors.setor
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                />

                {formErrors.setor && (
                  <p className="text-red-500 font-medium text-[11px] mt-1 ml-1">
                    {formErrors.setor}
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                {currentUser?.role === "OWNER" ? (
                  <>
                    <select
                      className="flex h-10 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formRamal.unidadeId}
                      onChange={(e) =>
                        setFormRamal((prev) => ({
                          ...prev,
                          unidadeId: Number(
                            e.target.value,
                          ),
                        }))
                      }
                    >
                      <option value="">
                        Unidade
                      </option>

                      {unidades.map((u) => (
                        <option
                          key={u.id}
                          value={u.id}
                        >
                          {u.nome}
                        </option>
                      ))}
                    </select>

                    {formErrors.unidadeId && (
                      <p className="text-red-500 font-medium text-[11px] mt-1 ml-1">
                        {formErrors.unidadeId}
                      </p>
                    )}
                  </>
                ) : (
                  <Input
                    disabled
                    value={
                      currentUser?.unidadeNome ??
                      `Unidade #${currentUser?.unidadeId}`
                    }
                    className="rounded-xl h-10 border-gray-200 dark:border-neutral-800 bg-gray-50 text-xs dark:bg-neutral-900/60"
                  />
                )}
              </div>

              <div className="lg:col-span-2">
                <Button
                  onClick={handleSubmitForm}
                  disabled={
                    creating || !!savingId
                  }
                  className="w-full h-10 gap-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/10 dark:shadow-none"
                >
                  {editingId ? (
                    savingId === editingId
                      ? "Salvando..."
                      : "Salvar Alterações"
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      {creating
                        ? "Criando..."
                        : "Criar Ramal"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="space-y-0.5">
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                  Listagem de Ramais
                </h2>

                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Resultados em tempo real filtrados por nome, setor, número ou unidade.
                </p>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 align-middle self-start sm:self-center border border-gray-200 dark:border-neutral-700/50">
                {filteredRamais.length} encontrados
              </span>
            </div>

            <div className="relative max-w-md">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </span>

              <Input
                placeholder="Filtre os dados da tabela aqui..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="rounded-xl h-10 border-gray-200 dark:border-neutral-800 text-xs pl-10 pr-24"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-500 dark:text-amber-400 hover:underline"
                >
                  Limpar busca
                </button>
              )}
            </div>
          </section>
        </div>

        <div className="rounded-2xl border border-gray-100 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/20 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400">
              <thead className="text-[11px] uppercase bg-gray-50/70 dark:bg-neutral-900 text-gray-700 dark:text-gray-300 font-bold border-b border-gray-100 dark:border-neutral-800/60">
                <tr>
                  <th className="px-6 py-3.5">
                    Número
                  </th>

                  <th className="px-6 py-3.5">
                    Nome
                  </th>

                  <th className="px-6 py-3.5">
                    Setor
                  </th>

                  <th className="px-6 py-3.5">
                    Unidade
                  </th>

                  <th className="px-6 py-3.5 text-right">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-neutral-800/60 text-gray-900 dark:text-gray-100">
                {filteredRamais.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 font-medium"
                    >
                      Nenhum ramal corresponde aos critérios de pesquisa informados.
                    </td>
                  </tr>
                ) : (
                  filteredRamais.map((ramal) => (
                    <tr
                      key={ramal.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-neutral-900/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                        {ramal.numero}
                      </td>

                      <td className="px-6 py-4 font-semibold max-w-[200px] truncate">
                        {ramal.nome ?? "-"}
                      </td>

                      <td className="px-6 py-4 max-w-[200px] truncate text-gray-600 dark:text-gray-400">
                        {ramal.setor}
                      </td>

                      <td className="px-6 py-4 text-gray-400 dark:text-gray-500 font-medium">
                        {ramal.unidade?.nome ??
                          `Unidade #${ramal.unidadeId}`}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              startEdit(ramal)
                            }
                            className="h-8 rounded-xl text-[11px] font-bold border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 transition-all gap-1 shadow-sm"
                          >
                            <Edit2 className="w-3 h-3" />
                            Editar
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleDelete(ramal.id)
                            }
                            className="h-8 rounded-xl text-[11px] font-bold border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all gap-1 shadow-sm"
                          >
                            <Trash2 className="w-3 h-3" />
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}