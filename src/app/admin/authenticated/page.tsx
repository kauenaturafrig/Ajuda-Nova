// src/app/admin/authenticated/page.tsx
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { ButtonSignOut } from "./_components/button-signout";
import Layout from "@/src/components/Layout";
import { 
  ShieldCheck, 
  User,
  Phone,
  Mail,
  Signature,
  Newspaper,
  Megaphone,
  Calendar,
  UserPlus,
  Users,
  Key 
} from "lucide-react";

export default async function Authenticated() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin");
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      unidadeId: true,
      userRoles: {
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!dbUser) {
    redirect("/admin");
  }

  const roles = dbUser.userRoles.map(
    (assignment) => assignment.role.name,
  );

  const isOwner = roles.includes("OWNER");
  const isAdmin = roles.includes("ADMIN");
  const isNewsOnly = roles.includes("NEWSONLY");
  const isMessageOnly = roles.includes("MESSAGEONLY");
  const isMessageNews = roles.includes("MESSAGENEWS");
  const isEvents = roles.includes("EVENTS");
  const isExtension = roles.includes("EXTENSION");
  const isEmail = roles.includes("EMAIL");

  const roleLabel = roles.join(", ");

  return (
    <Layout>
      <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Header Superior Administrativo */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 pb-6 border-b border-gray-100 dark:border-neutral-800/60">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
                  <ShieldCheck size={20} />
                </span>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Painel de Controle
                </h1>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                Gerencie módulos, permissões e comunicados institucionais.
              </p>
            </div>

            {/* Card com Detalhes do Usuário Conectado */}
            <div className="flex items-center gap-4 bg-zinc-50 dark:bg-neutral-900/60 backdrop-blur-md border border-gray-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm w-full md:w-auto">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-200 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 shrink-0">
                <User size={18} />
              </div>
              <div className="flex-1 min-w-0 leading-tight">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                  {session.user.email}
                </p>
                <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 px-1.5 py-0.5 rounded mt-1">
                  Nível: {roleLabel || "Sem função"}
                </span>
              </div>
              <div className="border-l border-gray-200 dark:border-neutral-800 pl-4 h-9 flex items-center">
                <ButtonSignOut />
              </div>
            </div>
          </div>

          {/* Grid de Ferramentas Administrativas */}
          <nav className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

            {/* RAMAIS */}
            {(isOwner || isExtension) && (
              <Link
                href="/admin/authenticated/ramais"
                className="group relative flex flex-col items-center justify-center text-center h-56 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 shadow-sm p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-amber-500/50 hover:shadow-amber-500/5"
              >
                <div className="relative w-20 h-20 bg-amber-500 border border-amber-500/20 rounded-2xl p-3.5 flex items-center justify-center overflow-hidden mb-3 transition-colors duration-300 group-hover:bg-amber-600">
                  <span className="text-white">
                    <Phone size={50} />
                  </span>
                </div>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Ramais</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[200px]">Ver e editar ramais da sua unidade.</p>
              </Link>
            )}

            {/* EMAILS */}
            {(isOwner || isEmail) && (
              <Link
                href="/admin/authenticated/emails"
                className="group relative flex flex-col items-center justify-center text-center h-56 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 shadow-sm p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-purple-500/50 hover:shadow-purple-500/5"
              >
                <div className="relative w-20 h-20 bg-purple-500 border border-purple-500/20 rounded-2xl p-3.5 flex items-center justify-center overflow-hidden mb-3 transition-colors duration-300 group-hover:bg-purple-600">
                  <span className="text-white">
                    <Mail size={50} />
                  </span>
                </div>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">E-mails</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[200px]">Gerenciar lista de e-mails corporativos.</p>
              </Link>
            )}

            {/* CRIAR ASSINATURA */}
            {(isOwner || isAdmin) && (
              <Link
                href="https://assinatura.naturafrig.com.br/"
                className="group relative flex flex-col items-center justify-center text-center h-56 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 shadow-sm p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-blue-500/50 hover:shadow-blue-500/5"
              >
                <div className="relative w-20 h-20 bg-blue-500 border border-blue-500/20 rounded-2xl p-3.5 flex items-center justify-center overflow-hidden mb-3 transition-colors duration-300 group-hover:bg-blue-600">
                  {/* Removido o 'invert' fixo e deixado uniforme */}
                  <span className="text-white">
                    <Signature size={50} />
                  </span>
                </div>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Criar Assinatura</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[200px]">Criar assinatura padrão de e-mail.</p>
              </Link>
            )}

            {/* NOTÍCIAS */}
            {(isOwner || isNewsOnly || isMessageNews) && (
              <Link
                href="/admin/authenticated/noticias"
                className="group relative flex flex-col items-center justify-center text-center h-56 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 shadow-sm p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-blue-600/50 hover:shadow-blue-600/5"
              >
                <div className="relative w-20 h-20 bg-blue-600 border border-blue-600/20 rounded-2xl p-3.5 flex items-center justify-center overflow-hidden mb-3 transition-colors duration-300 group-hover:bg-blue-700">
                  <span className="text-white">
                    <Newspaper size={50} />
                  </span>
                </div>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">Notícias</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[200px]">Gerenciar notícias em nível global.</p>
              </Link>
            )}

            {/* LOG DE NOTÍCIAS (AUDITORIA) */}
            {isOwner && (
              <Link
                href="/admin/authenticated/noticias/auditoria"
                className="group relative flex flex-col items-center justify-center text-center h-56 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 shadow-sm p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-indigo-500/50 hover:shadow-indigo-500/5"
              >
                <div className="relative w-20 h-20 bg-indigo-500 border border-indigo-500/20 rounded-2xl p-3.5 flex items-center justify-center overflow-hidden mb-3 transition-colors duration-300 group-hover:bg-indigo-600">
                  <span className="text-white">
                    <Newspaper size={50} />
                  </span>
                </div>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Log de Notícias</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[200px]">Auditoria e histórico de publicações.</p>
              </Link>
            )}

            {/* RECADOS */}
            {(isOwner || isMessageOnly || isMessageNews) && (
              <Link
                href="/admin/authenticated/recados"
                className="group relative flex flex-col items-center justify-center text-center h-56 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 shadow-sm p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-orange-500/50 hover:shadow-orange-500/5"
              >
                <div className="relative w-20 h-20 bg-orange-500 border border-orange-500/20 rounded-2xl p-3.5 flex items-center justify-center overflow-hidden mb-3 transition-colors duration-300 group-hover:bg-orange-600">
                  <span className="text-white">
                    <Megaphone size={50} />
                  </span>
                </div>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Recados</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[200px]">{isOwner ? 'Painel de todas as unidades' : 'Restrito à minha unidade'}</p>
              </Link>
            )}

            {/* LOG DE RECADOS (AUDITORIA) */}
            {isOwner && (
              <Link
                href="/admin/authenticated/recados/auditoria"
                className="group relative flex flex-col items-center justify-center text-center h-56 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 shadow-sm p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-red-500/50 hover:shadow-red-500/5"
              >
                <div className="relative w-20 h-20 bg-red-500 border border-red-500/20 rounded-2xl p-3.5 flex items-center justify-center overflow-hidden mb-3 transition-colors duration-300 group-hover:bg-red-600">
                  <span className="text-white">
                    <Megaphone size={50} />
                  </span>
                </div>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Log de Recados</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[200px]">Auditoria e histórico de recados.</p>
              </Link>
            )}

            {/* Agenda */}
            {(isOwner || isEvents) && (
              <Link
                href="/admin/authenticated/agenda"
                className="group relative flex flex-col items-center justify-center text-center h-56 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 shadow-sm p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-green-500/50 hover:shadow-green-500/5"
              >
                <div className="relative w-20 h-20 bg-green-500 border border-green-500/20 rounded-2xl p-3.5 flex items-center justify-center overflow-hidden mb-3 transition-colors duration-300 group-hover:bg-green-600">
                  <span className="text-white">
                    <Calendar size={50} />
                  </span>
                </div>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Agenda
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[200px]">
                  Gerenciamento de eventos e atividades.
                </p>
              </Link>
            )}

            {/* LOG DA AGENDA (AUDITORIA) */}
            {isOwner && (
              <Link
                href="/admin/authenticated/agenda/logs"
                className="group relative flex flex-col items-center justify-center text-center h-56 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 shadow-sm p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-emerald-500/50 hover:shadow-emerald-500/5"
              >
                <div className="relative w-20 h-20 bg-emerald-500 border border-emerald-500/20 rounded-2xl p-3.5 flex items-center justify-center overflow-hidden mb-3 transition-colors duration-300 group-hover:bg-emerald-600">
                  <span className="text-white">
                    <Calendar size={50} />
                  </span>
                </div>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Log da Agenda
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[200px]">
                  Auditoria de eventos e atividades.
                </p>
              </Link>
            )}

            {/* CRIAR USUÁRIO */}
            {isOwner && (
              <Link
                href="/admin/authenticated/criar-user"
                className="group relative flex flex-col items-center justify-center text-center h-56 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 shadow-sm p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-cyan-500/50 hover:shadow-cyan-500/5"
              >
                <div className="relative w-20 h-20 bg-cyan-500 border border-cyan-500/20 rounded-2xl p-3.5 flex items-center justify-center overflow-hidden mb-3 transition-colors duration-300 group-hover:bg-cyan-600">
                  <span className="text-white">
                    <UserPlus size={50} />
                  </span>
                </div>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Criar Usuário</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[200px]">Cadastrar novas contas e definir permissões.</p>
              </Link>
            )}

            {/* GERENCIAR USUÁRIOS */}
            {isOwner && (
              <Link
                href="/admin/authenticated/usuarios"
                className="group relative flex flex-col items-center justify-center text-center h-56 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 shadow-sm p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-rose-600/50 hover:shadow-rose-600/5"
              >
                <div className="relative w-20 h-20 bg-rose-600 border border-rose-600/20 rounded-2xl p-3.5 flex items-center justify-center overflow-hidden mb-3 transition-colors duration-300 group-hover:bg-rose-700">
                  <span className="text-white">
                    <Users size={50} />
                  </span>
                </div>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Gerenciar Usuários</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[200px]">Modificar acessos e perfis das contas ativas.</p>
              </Link>
            )}

            {/* MINHA SENHA */}
            <Link
              href="/admin/authenticated/minha-senha"
              className="group relative flex flex-col items-center justify-center text-center h-56 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 shadow-sm p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-zinc-500/50 hover:shadow-zinc-500/5"
            >
              <div className="relative w-20 h-20 bg-zinc-500 border border-zinc-500/20 rounded-2xl p-3.5 flex items-center justify-center overflow-hidden mb-3 transition-colors duration-300 group-hover:bg-zinc-600">
                <span className="text-white">
                  <Key size={50} />
                </span>
              </div>
              <h2 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">Minha Senha</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-[200px]">Alterar as credenciais de segurança da sua conta.</p>
            </Link>

          </nav>
        </div>
      </div>
    </Layout>
  );
}