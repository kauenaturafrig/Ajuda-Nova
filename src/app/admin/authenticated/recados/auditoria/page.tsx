// src/app/admin/authenticated/recados/auditoria/page.tsx
export const dynamic = "force-dynamic";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";  // ✅ Server-side Link
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import Layout from "@/src/components/Layout";
import Image from "next/image";

export default async function AuditoriaRecadosPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/admin");

    const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    if (dbUser?.role !== "OWNER") {
        redirect("/admin/authenticated");
    }

    const audits = await prisma.recadoAudit.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        select: {
            id: true,
            recadoId: true,
            userId: true,
            userNome: true,
            acao: true,
            createdAt: true,
            dadosAntigos: true,
            dadosNovos: true
        }
    });

    return (
        <Layout>
            <div className="container mx-auto py-12 w-[95%]">
                <div className="flex justify-between items-center gap-4 mb-12">
                    {/* ✅ LINK ao invés de Button + useRouter */}
                    <Link
                        href="/admin/authenticated"
                        className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        ← Voltar
                    </Link>
                    <div className="flex">
                        <Image
                            src="/assets/images/icons/icons8-megaphone-preto.png"
                            alt="Icon megaphone"
                            width={50}
                            height={50}
                            className="mr-5 dark:invert"
                        />
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent flex-1">
                            Auditoria Recados
                        </h1>
                    </div>
                    <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 text-sm font-bold rounded-full">
                        {audits.length} registros
                    </span>
                </div>

                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-orange-500/20 to-red-500/20 dark:from-orange-500/30 dark:to-red-500/30 border-b border-orange-200 dark:border-orange-800/50">
                                <tr>
                                    <th className="p-6 text-left font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Data/Hora</th>
                                    <th className="p-6 text-left font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Usuário</th>
                                    <th className="p-6 text-left font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Recado ID</th>
                                    <th className="p-6 text-left font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Ação</th>
                                    <th className="p-6 text-left font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Antes</th>
                                    <th className="p-6 text-left font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">Depois</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {audits.map((audit: any) => (
                                    <tr key={audit.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="p-6 font-mono text-sm text-gray-900 dark:text-gray-100">
                                            {new Date(audit.createdAt).toLocaleString('pt-BR')}
                                        </td>
                                        <td className="p-6 font-medium text-gray-900 dark:text-gray-100">
                                            {audit.userNome}
                                        </td>
                                        <td className="p-6">
                                            <span className="font-mono bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-bold">
                                                #{audit.recadoId}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-4 py-2 rounded-full text-xs font-bold ${audit.acao === 'CREATE' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200' :
                                                audit.acao === 'UPDATE' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' :
                                                    'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                                                }`}>
                                                {audit.acao}
                                            </span>
                                        </td>
                                        <td className="p-6 max-w-md">
                                            {audit.dadosAntigos ? (
                                                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-xs overflow-auto max-h-20 font-mono text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600">
                                                    {JSON.stringify(audit.dadosAntigos, null, 2).slice(0, 150)}...
                                                </pre>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400 italic text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="p-6 max-w-md">
                                            {audit.dadosNovos ? (
                                                <pre className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-lg text-xs overflow-auto max-h-20 font-mono text-emerald-900 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800/50">
                                                    {JSON.stringify(audit.dadosNovos, null, 2).slice(0, 150)}...
                                                </pre>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400 italic text-xs">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}