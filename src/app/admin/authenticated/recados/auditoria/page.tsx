//src/app/admin/authenticated/recados/auditoria/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation"; // ✅ ADD: import redirect
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import Layout from "@/src/components/Layout";

export default async function AuditoriaRecadosPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) redirect("/admin");

    const audits = await prisma.recadoAudit.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: {
            recado: { select: { titulo: true } }
        }
    });

    return (
        <Layout>
            <div className="container mx-auto py-12">
                <h1 className="text-4xl font-bold mb-8 dark:text-white">📋 Auditoria de Recados</h1>
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="p-4 text-left">Data</th>
                                <th className="p-4 text-left">Usuário</th>
                                <th className="p-4 text-left">Recado</th>
                                <th className="p-4 text-left">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {audits.map(audit => (
                                <tr key={audit.id} className="border-t dark:border-gray-700">
                                    <td className="p-4">{new Date(audit.createdAt).toLocaleString('pt-BR')}</td>
                                    <td className="p-4">{audit.userNome}</td>
                                    <td className="p-4">{audit.recado?.titulo || 'Excluído'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            audit.acao === 'CREATE' ? 'bg-green-100 text-green-800' :
                                            audit.acao === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {audit.acao}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}