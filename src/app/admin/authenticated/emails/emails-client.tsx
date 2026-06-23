// src/app/admin/authenticated/emails/emails-client.tsx
"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useSession } from "../../../../lib/auth-client";
import { useRouter } from "next/navigation";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import Layout from "../../../../components/Layout";
import { LoadingOverlay } from "../../../../components/ui/loading-overlay";
import { useToast } from "../../../../components/ui/use-toast";
import UploadEmailsImport from "./_components/UploadEmailsImport";

type Email = {
  id: number;
  email: string;
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

export default function EmailsClientPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { data: session, isPending, error } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [unidades, setUnidades] = useState<{ id: number; nome: string }[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const [formErrors, setFormErrors] = useState({
    email: "",
    nome: "",
    setor: "",
    unidadeId: "",
  });

  const [formEmail, setFormEmail] = useState({
    id: null as number | null,
    email: "",
    nome: "",
    setor: "",
    unidadeId: "" as string | number,
  });

  const refreshEmails = useCallback(async () => {
    const res = await fetch("/admin/api/emails");
    const data = await res.json();
    setEmails(data);
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      window.location.href = "/admin";
      return;
    }

    (async () => {
      const res = await fetch("/admin/api/emails");
      const data = await res.json();
      setEmails(data);

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

  const handleChange = (id: number, field: keyof Email, value: string) => {
    setEmails((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const handleSave = async (email: Email) => {
    setSavingId(email.id);
    try {
      const res = await fetch("/admin/api/emails", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email),
      });
      if (!res.ok) console.error("Erro ao salvar email");
    } finally {
      setSavingId(null);
    }
  };

  const handleSubmitForm = async () => {
    const errors = {
      email: "",
      nome: "",
      setor: "",
      unidadeId: "",
    };

    if (!formEmail.email.trim()) errors.email = "Informe o email.";
    if (!formEmail.nome.trim()) errors.nome = "Informe o nome.";
    if (!formEmail.setor.trim()) errors.setor = "Informe o setor.";
    if (currentUser?.role === "OWNER" && !formEmail.unidadeId) {
      errors.unidadeId = "Selecione a unidade.";
    }

    if (errors.email || errors.nome || errors.setor || errors.unidadeId) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({
      email: "",
      nome: "",
      setor: "",
      unidadeId: "",
    });

    if (!formEmail.email || !formEmail.setor) return;

    const payload: any = {
      email: formEmail.email,
      nome: formEmail.nome || "Geral",
      setor: formEmail.setor,
    };

    if (currentUser?.role === "OWNER") {
      payload.unidadeId = formEmail.unidadeId;
    }

    if (editingId) {
      payload.id = editingId;
      setSavingId(editingId);
      try {
        const res = await fetch("/admin/api/emails", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          console.error("Erro ao salvar email");
          return;
        }
        const updated: Email = await res.json();
        setEmails((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        cancelEdit();

        showToast({
          title: "Email atualizado",
          message: `Email ${updated.email} salvo com sucesso.`,
        });

        router.refresh();
      } finally {
        setSavingId(null);
      }
    } else {
      setCreating(true);
      try {
        const res = await fetch("/admin/api/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          console.error("Erro ao criar email");
          return;
        }
        const created: Email = await res.json();
        setEmails((prev) => [...prev, created]);
        cancelEdit();

        showToast({
          title: "Email criado",
          message: `Email ${created.email} criado com sucesso.`,
        });

        router.refresh();
      } finally {
        setCreating(false);
      }
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Tem certeza que deseja excluir este email?");
    if (!ok) return;

    const prev = emails;
    setEmails((r) => r.filter((email) => email.id !== id));
    const res = await fetch("/admin/api/emails", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      console.error("Erro ao excluir email");
      setEmails(prev);
    }
  };

  const startEdit = (email: Email) => {
    setEditingId(email.id);
    setFormEmail({
      id: email.id,
      email: email.email,
      nome: email.nome ?? "",
      setor: email.setor,
      unidadeId: email.unidadeId,
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
    setFormEmail({
      id: null,
      email: "",
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

  const filteredEmails = useMemo(() => {
    const term = normalize(search);

    return emails.filter((e) => {
      const texto = `${e.email} ${e.nome ?? ""} ${e.setor} ${e.unidade?.nome ?? ""}`;
      return normalize(texto).includes(term);
    });
  }, [emails, search]);

  if (isPending || loading || !currentUser) {
    return (
      <Layout>
        <LoadingOverlay show={true} text="Carregando emails..." />
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
        <div className="flex justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="bg-gray-500 text-white mb-2 px-4 py-2 rounded-xl inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            ← Voltar
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold dark:text-white">
              Edição de Emails
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
              Pesquise, crie ou edite emails com mais organização.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                const res = await fetch("/admin/api/emails/export");
                const csv = await res.text();
                const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.setAttribute("download", "emails.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="bg-blue-500 border-none text-white"
            >
              Exportar CSV
            </Button>

            <UploadEmailsImport onImportSuccess={refreshEmails} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <section className="xl:col-span-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold dark:text-white">Buscar emails</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Filtre por qualquer campo.</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200">
                {filteredEmails.length} itens
              </span>
            </div>

            <Input
              placeholder="Buscar por email, nome, setor ou unidade..."
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
                  {editingId ? "Editar email" : "Criar novo email"}
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
                  placeholder="Email"
                  value={formEmail.email}
                  onChange={(e) =>
                    setFormEmail((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="border-[3px] rounded border-blue-500 dark:text-white"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <Input
                  placeholder="Nome"
                  value={formEmail.nome}
                  onChange={(e) =>
                    setFormEmail((prev) => ({ ...prev, nome: e.target.value }))
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
                  value={formEmail.setor}
                  onChange={(e) =>
                    setFormEmail((prev) => ({ ...prev, setor: e.target.value }))
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
                    value={formEmail.unidadeId}
                    onChange={(e) =>
                      setFormEmail((prev) => ({
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
                  value={currentUser?.unidadeNome ?? `Unidade #${currentUser?.unidadeId}`}
                  className="dark:text-white"
                />
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleSubmitForm}
                  disabled={creating || !!savingId}
                  className="bg-green-500 px-4 py-2 rounded-xl"
                >
                  {editingId
                    ? savingId === editingId
                      ? "Salvando..."
                      : "Salvar"
                    : creating
                      ? "Criando..."
                      : "Criar email"}
                </Button>

                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEdit}
                    disabled={!!savingId}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Dica: use a busca para encontrar emails rapidamente.
          </span>
        </div>

        <div className="space-y-1 rounded p-2">
          {filteredEmails.length === 0 ? (
            <p className="text-sm text-muted-foreground dark:text-white">
              Nenhum email encontrado para "{search}".
            </p>
          ) : (
            filteredEmails.map((email) => (
              <div
                key={email.id}
                className="
                  grid gap-3 border p-3 rounded
                  grid-cols-1
                  md:grid-cols-[2fr_2fr_1fr_1fr_auto]
                  border-black align-middle items-center dark:text-white dark:border-white
                "
              >
                <span className="break-all font-semibold">{email.email}</span>
                <span className="break-words">{email.nome ?? "-"}</span>
                <span className="break-words">{email.setor}</span>
                <span className="text-sm text-muted-foreground break-words">
                  {email.unidade?.nome ?? `Unidade #${email.unidadeId}`}
                </span>
                <div className="flex flex-wrap gap-2 justify-end mt-2 md:mt-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(email)}
                    className="bg-yellow-500 px-3 py-1 rounded-lg"
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(email.id)}
                    className="bg-red-500 px-3 py-1 rounded-lg"
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