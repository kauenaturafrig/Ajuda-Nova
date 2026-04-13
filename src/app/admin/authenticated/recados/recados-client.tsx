// src/app/admin/authenticated/recados/page.tsx
"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import { X, Check } from "lucide-react";
import { LoadingOverlay } from "@/src/components/ui/loading-overlay";
import Layout from "@/src/components/Layout";

export type UserRole = "OWNER" | "ADMIN" | "MESSAGEONLY" | "NEWSONLY" | "MESSAGENEWS";

interface Recado {
    id: number;
    titulo: string;
    conteudo: string;
    imagem?: string;
    unidadeId: number;
    unidadeIds: number[];
    unidade: { id: number; nome: string };
    createdAt: Date;
}

interface Unidade {
    id: number;
    nome: string;
}

interface Props {
    initialRecados: Recado[];
    initialUnidades: Unidade[];
    userRole: UserRole;
    userUnidadeId: number | null;
}

export default function RecadosClient({
    initialRecados,
    initialUnidades,
    userRole,
    userUnidadeId
}: Props) {
    const [loading, setLoading] = useState(true);
    const [recados, setRecados] = useState<Recado[]>(initialRecados);
    const [unidades, setUnidades] = useState<Unidade[]>(initialUnidades);
    const [saving, setSaving] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        titulo: "",
        conteudo: "",
        unidadeIds: (userRole === "MESSAGEONLY" || userRole === "ADMIN") && userUnidadeId ? [userUnidadeId] : [] as number[],
        imagem: null as File | null,
        imagemPreview: "",
        imagemAntiga: ""
    });

    const [imagemRecado, setImagemRecado] = useState<File | null>(null);
    const [selectedUnidades, setSelectedUnidades] = useState<Record<number, boolean>>(
        (userRole === "MESSAGEONLY" || userRole === "ADMIN") && userUnidadeId ? { [userUnidadeId]: true } : {}
    );

    const router = useRouter();

    useEffect(() => {
        setLoading(false);
    }, []);

    // ✅ FIX: handleCheckboxChange corrigido
    const handleCheckboxChange = (unidadeId: number) => {
        setSelectedUnidades(prev => {
            const newState = { ...prev };
            newState[unidadeId] = !newState[unidadeId];
            return newState;
        });

        // ✅ Corrige formData com estado atualizado
        setFormData(prev => ({
            ...prev,
            unidadeIds: Object.keys(selectedUnidades)
                .filter(id => selectedUnidades[Number(id)])
                .map(Number)
        }));
    };

    // ✅ ADD: Função para verificar se pode editar/excluir
    const canManageRecado = useCallback((recado: Recado) => {
        // OWNER e MESSAGENEWS podem tudo
        if (userRole === "OWNER" || userRole === "MESSAGENEWS") {
            return true;
        }

        // ADMIN e MESSAGEONLY só podem gerenciar recados da SUA unidade
        // (que têm apenas 1 unidade e é igual a sua)
        const ehMultiUnidade = recado.unidadeIds.length > 1;
        const ehSuaUnidade = recado.unidadeId === userUnidadeId;

        return !ehMultiUnidade && ehSuaUnidade;
    }, [userRole, userUnidadeId]);

    // ✅ ADD: handleEdit
    const handleEdit = (recado: Recado) => {
        if (!canManageRecado(recado)) {
            alert("⛔ Você só pode editar recados da sua própria unidade!");
            return;
        }

        setEditingId(recado.id);
        const ids = recado.unidadeIds.length > 0 ? recado.unidadeIds : [recado.unidadeId];

        setFormData({
            titulo: recado.titulo,
            conteudo: recado.conteudo,
            unidadeIds: ids,
            imagem: null,
            imagemPreview: recado.imagem ? `/uploads/recados/${recado.imagem}` : "",
            imagemAntiga: recado.imagem || ""
        });

        const selected: Record<number, boolean> = {};
        ids.forEach(id => { selected[id] = true; });
        setSelectedUnidades(selected);
    }

    // ✅ ADD: handleDelete
    const handleDelete = async (id: number) => {
        const recado = recados.find(r => r.id === id);
        if (recado && !canManageRecado(recado)) {
            alert("⛔ Você só pode excluir recados da sua própria unidade!");
            return;
        }

        if (!confirm("Confirmar exclusão?")) return;
        try {
            await fetch(`/admin/api/recados/${id}`, { method: "DELETE" });
            setRecados(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            alert("Erro ao excluir");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const currentUnidadeIds = Object.keys(selectedUnidades)
            .filter(id => selectedUnidades[Number(id)])
            .map(Number);

        if (!formData.titulo?.trim() || !formData.conteudo?.trim() || currentUnidadeIds.length === 0) {
            alert("Título, conteúdo e pelo menos 1 unidade são obrigatórios!");
            setSaving(false);
            return;
        }

        try {
            const fd = new FormData();
            fd.append("titulo", formData.titulo);
            fd.append("conteudo", formData.conteudo);
            currentUnidadeIds.forEach(id => fd.append("unidadeIds[]", id.toString()));
            if (formData.imagem) fd.append("imagem", formData.imagem);
            if (editingId) {
                fd.append("id", editingId.toString());
                fd.append("imagemAntiga", formData.imagemAntiga);
            }

            const method = editingId ? "PUT" : "POST";
            const res = await fetch("/admin/api/recados", { method, body: fd });

            if (!res.ok) {
                const error = await res.json();
                alert(`Erro: ${error.error || "Falha ao salvar"}`);
                return;
            }

            // Reset form
            setFormData({
                titulo: "",
                conteudo: "",
                unidadeIds: [],
                imagem: null,
                imagemPreview: "",
                imagemAntiga: ""
            });
            setEditingId(null);
            setSelectedUnidades({});

            // Refresh lista
            const refreshed = await fetch("/admin/api/recados").then(r => r.json());
            setRecados(Array.isArray(refreshed) ? refreshed.map((r: any) => ({
                ...r,
                imagem: r.imagem || undefined,
                unidade: r.unidade,
                unidadeIds: r.unidadeIds || []
            })) : []);
        } catch (error) {
            alert("Erro de conexão");
        } finally {
            setSaving(false);
        }
    };

    // Drag & Drop handlers (abreviados por brevidade)
    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }, []);

    const handleDragOut = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }, []);

    const handleImageUpload = useCallback((file: File) => {
        const preview = URL.createObjectURL(file);
        setFormData(prev => ({
            ...prev,
            imagem: file,
            imagemPreview: preview,
            imagemAntiga: ""
        }));
        setImagemRecado(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith("image/") && file.size < 5 * 1024 * 1024) {
                handleImageUpload(file);
            }
        }
    }, [handleImageUpload]);

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/") && file.size < 5 * 1024 * 1024) {
            handleImageUpload(file);
            e.target.value = "";
        }
    }, [handleImageUpload]);

    const removeImage = useCallback(() => {
        setImagemRecado(null);
        setFormData(prev => ({
            ...prev,
            imagem: null,
            imagemPreview: editingId ? prev.imagemAntiga : ""
        }));
    }, [editingId]);


    if (loading) return <LoadingOverlay show={true} />;

    return (
        <Layout>
            <div className="container mx-auto py-12 w-[90%]">
                <div className="flex justify-between items-center mb-12">
                    <Image
                        src={"/assets/images/icons/icons8-megaphone-preto.png"}
                        alt="Icon phone"
                        width={50}
                        height={50}
                        className="mr-5 dark:invert"
                    />
                    <h1 className="text-5xl font-bold dark:text-white">Gerenciar Recados</h1>
                    <Button onClick={() => router.back()} className="bg-gray-600 hover:bg-gray-700 text-white">
                        ← Voltar
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white/60 dark:bg-gray-500 backdrop-blur p-8 rounded-2xl mb-12">
                    <div className="grid md:grid-cols-1 gap-6">
                        <input
                            value={formData.titulo}
                            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                            placeholder="Título do recado"
                            className="w-full p-4 border rounded-xl text-lg"
                            required
                        />

                        {/* Checkboxes de unidades */}
                        {(userRole === "MESSAGEONLY" || userRole === "ADMIN") ? (
                            <div className="p-6 border-2 border-green-200 bg-green-50 rounded-2xl text-center">
                                <Check className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                <p className="text-lg font-bold text-green-800">✅ Unidade própria selecionada</p>
                                <p className="text-sm text-green-600">
                                    {unidades.find(u => u.id === userUnidadeId)?.nome}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-200">
                                    Unidades <span className="text-red-500">*</span>
                                </label>
                                <div className="max-h-64 overflow-y-auto border rounded-xl p-4 bg-white/50 backdrop-blur-sm space-y-2">
                                    {unidades.map((unidade) => (
                                        <label key={unidade.id} className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedUnidades[unidade.id] || false}
                                                onChange={() => handleCheckboxChange(unidade.id)}
                                                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mr-3"
                                            />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600">
                                                {unidade.nome}
                                            </span>
                                            {selectedUnidades[unidade.id] && (
                                                <Check className="w-4 h-4 text-blue-600 ml-2" />
                                            )}
                                        </label>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500">
                                    {Object.keys(selectedUnidades).filter(id => selectedUnidades[Number(id)]).length} unidade(s) selecionada(s)
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                        {/* ✅ UPLOAD Drag & Drop */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nova Imagem (opcional)
                            </label>
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 w-full ${dragActive
                                    ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30"
                                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    }`}
                                onDragEnter={handleDragIn}
                                onDragLeave={handleDragOut}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 pointer-events-auto"
                                />

                                <div className="relative z-10 pointer-events-none flex flex-col items-center justify-center h-full">
                                    <svg className="w-10 h-10 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                        {dragActive ? "✅ Solte aqui!" : "Clique ou arraste nova imagem"}
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG (máx. 5MB)</p>
                                </div>

                                {/* ✅ PREVIEW DA IMAGEM ARRASTADA */}
                                {imagemRecado && (
                                    <div className="absolute inset-0 bg-white/95 dark:bg-black/95 flex flex-col items-center justify-center z-30 rounded-xl">
                                        <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800 w-full max-w-md">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 truncate">
                                                    {imagemRecado.name}
                                                </p>
                                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                                    {Math.round(imagemRecado.size / 1024)} KB
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={removeImage}
                                                className="h-9 w-9 p-0 hover:bg-red-500 hover:text-white"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <textarea
                            value={formData.conteudo}
                            onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                            placeholder="Conteúdo do recado"
                            rows={4}
                            className="md:col-span-2 w-full p-4 border rounded-xl text-lg"
                            required
                        />
                    </div>
                    {formData.imagemPreview && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-xl">
                            <img src={formData.imagemPreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                        </div>
                    )}
                    <Button type="submit" disabled={saving} className="mt-6 w-full bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50">
                        {saving ? "Salvando..." : (editingId ? "Atualizar" : "Criar")} Recado
                    </Button>
                </form>

                {/* Lista */}
                <div className="space-y-4">
                    {recados.length === 0 ? (
                        <div className="text-center py-20 col-span-full">
                            <h3 className="text-3xl font-bold mb-4 dark:text-white">Nenhum recado</h3>
                            <p>Crie o primeiro recado acima!</p>
                        </div>
                    ) : (
                        recados.map((recado) => {
                            const podeGerenciar = canManageRecado(recado);
                            const unidadesExibicao = unidades.filter(u =>
                                recado.unidadeIds.length > 0
                                    ? recado.unidadeIds.includes(u.id)
                                    : u.id === recado.unidadeId
                            );

                            return (
                                <div key={recado.id} className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 rounded-2xl border">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1 dark:text-gray-400">
                                            📍 {unidadesExibicao.map(u => u.nome).join(", ")} - {new Date(recado.createdAt).toLocaleDateString('pt-BR')}
                                            {!podeGerenciar && (
                                                <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                                    🔒 Global
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            {podeGerenciar ? (
                                                <>
                                                    <Button onClick={() => handleEdit(recado)} size="sm" className="bg-green-600 text-white">
                                                        Editar
                                                    </Button>
                                                    <Button onClick={() => handleDelete(recado.id)} size="sm" variant="destructive" className="bg-red-600 text-white">
                                                        Excluir
                                                    </Button>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-500 italic">
                                                    🔒 Somente leitura
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {recado.imagem && (
                                        <img src={`/uploads/recados/${recado.imagem}`} alt={recado.titulo} className="w-24 h-24 object-cover rounded-lg mb-4" />
                                    )}
                                    <p className="text-gray-700 dark:text-gray-300 mb-2">{recado.conteudo.slice(0, 200)}...</p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </Layout>
    );
}
