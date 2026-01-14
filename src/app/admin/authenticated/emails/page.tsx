// src/app/admin/authenticated/emails/page.tsx
"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useSession } from "../../../../lib/auth-client";
import { useRouter } from "next/navigation";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import Layout from "../../../../components/Layout";
import { headers } from 'next/headers';
import { auth } from '../../../../lib/auth';
import { LoadingOverlay } from "../../../../components/ui/loading-overlay";
import { useToast } from "../../../../components/ui/use-toast";

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

export default function EmailsPage() {
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

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      window.location.href = "/admin";
      return;
    }

    (async () => {
      // pega emails
      const res = await fetch("/admin/api/emails");
      const data = await res.json();
      setEmails(data);

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

  const handleChange = (id: number, field: keyof Email, value: string) => {
    setEmails((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSave = async (email: Email) => {
    setSavingId(email.id);
    try {
      const res = await fetch("/admin/api/emails", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email),
      });
      if (!res.ok) {
        console.error("Erro ao salvar email");
      }
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

    // valida email
    if (!formEmail.email.trim()) {
      errors.email = "Informe o email.";
    }

    // valida nome
    if (!formEmail.nome.trim()) {
      errors.nome = "Informe o nome.";
    }

    // valida setor
    if (!formEmail.setor.trim()) {
      errors.setor = "Informe o setor.";
    }

    // valida unidade quando for OWNER
    if (currentUser?.role === "OWNER" && !formEmail.unidadeId) {
      errors.unidadeId = "Selecione a unidade.";
    }

    // se tiver qualquer erro, não envia
    if (
      errors.email ||
      errors.nome ||
      errors.setor ||
      errors.unidadeId
    ) {
      setFormErrors(errors);
      return;
    }

    // se passou, limpa erros
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
      // EDITAR
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
        setEmails((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r)),
        );
        cancelEdit();

        showToast({
          title: "Email atualizado",
          message: `Email ${updated.email} salvo com sucesso.`,
        });

        // força a rota atual a buscar dados de novo no servidor
        router.refresh();
      } finally {
        setSavingId(null);
      }
    } else {
      // CRIAR
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

        // recarrega a rota e força nova busca de dados
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
      // rollback em caso de erro
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
      .normalize("NFD") // separa acentos
      .replace(/[\u0300-\u036f]/g, "") // remove marcas de acento
      .toLowerCase();
  }

  const filteredEmails = useMemo(
    () => {
      const term = normalize(search);

      return emails.filter((e) => {
        const texto = `${e.email} ${e.nome ?? ""} ${e.setor} ${e.unidade?.nome ?? ""
          }`;
        return normalize(texto).includes(term);
      });
    },
    [emails, search]
  );

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
    <Layout>
      <LoadingOverlay show={loading} />
      {/* Botão Voltar */}
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        className="bg-gray-500 text-white mb-5 ml-14"
      >
        ← Voltar
      </Button>
      <div className="w-[90%] mx-auto">
        {/*  className="space-y-4" */}
        <div className="flex justify-between">
          <h1 className="text-4xl font-semibold dark:text-white">Edição de Emails</h1>
          <div>
            <h3 className="font-bold dark:text-white">Usuário logado: {session?.user.name}</h3>
            <h4 className="dark:text-white">Perfil: {currentUser?.role === "OWNER" ? "Owner" : "Admin"}</h4>
          </div>
        </div>

        {/* Barra de busca */}
        <div className="flex gap-2 items-center my-10">
          <Input
            placeholder="Buscar por email, nome, setor ou unidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-[3px] rounded border-blue-500 dark:text-white"
          />
        </div>

        {/* Formulário de novo email */}
        <h2 className="font-medium text-lg mt-4 mb-2 dark:text-white">
          {editingId ? "Editar email" : "Novo email"}
        </h2>
        <div
          className="grid grid-cols-5 gap-2 items-center mb-10"
          ref={formRef}>
          {/* Número */}
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

          {/* Nome */}
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

          {/* Setor */}
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

          {/* Unidade (OWNER) */}
          {currentUser?.role === "OWNER" ? (
            <div>
              <select
                className="border rounded px-2 py-1 text-sm"
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
              value={
                currentUser?.unidadeNome ?? `Unidade #${currentUser?.unidadeId}`
              }
              className="dark:text-white"
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
                  : "Criar email"}
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

        {/* Lista de emails (somente leitura) */}
        <div className="space-y-1 rounded p-2">
          {filteredEmails.length === 0 ? (
            <p className="text-sm text-muted-foreground dark:text-white">
              Nenhum email encontrado para “{search}”.
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
                    className="bg-yellow-500"
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(email.id)}
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
