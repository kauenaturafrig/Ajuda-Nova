// pages/admin/ramais/index.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

interface Ramal {
  id: number;
  numero: string;
  nome: string;
  setor: string | null;
  unidadeId: number;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  unidadeId: number | null;
}

export default function RamaisPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [ramais, setRamais] = useState<Ramal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    numero: '',
    nome: '',
    setor: '',
    unidadeId: 1,
  });

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session) {
      fetchRamais();
    }
  }, [session]);

  const fetchRamais = async () => {
    try {
      const res = await fetch('/api/ramais');
      if (res.ok) {
        const data = await res.json();
        setRamais(data);
      }
    } catch (error) {
      console.error('Erro ao buscar ramais:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = '/api/ramais';
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { ...formData, id: editingId } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await fetchRamais();
        resetForm();
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao salvar ramal');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao salvar ramal');
    }
  };

  const handleEdit = (ramal: Ramal) => {
    setEditingId(ramal.id);
    setFormData({
      id: ramal.id,
      numero: ramal.numero,
      nome: ramal.nome,
      setor: ramal.setor || '',
      unidadeId: ramal.unidadeId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este ramal?')) return;

    try {
      const res = await fetch(`/api/ramais?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchRamais();
      } else {
        const error = await res.json();
        alert(error.error || 'Erro ao deletar ramal');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao deletar ramal');
    }
  };

  const resetForm = () => {
    setFormData({ id: 0, numero: '', nome: '', setor: '', unidadeId: 1 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Gerenciar Ramais</h1>
              <p className="text-gray-600">
                Usuário: {session?.user?.name} ({session?.user?.email})
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancelar' : '+ Novo Ramal'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Número</label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Setor</label>
                <input
                  type="text"
                  value={formData.setor}
                  onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Unidade</label>
                <select
                  value={formData.unidadeId}
                  onChange={(e) => setFormData({ ...formData, unidadeId: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  required
                >
                  <option value={1}>Unidade 1</option>
                  <option value={2}>Unidade 2</option>
                  <option value={3}>Unidade 3</option>
                  <option value={4}>Unidade 4</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                  {editingId ? 'Atualizar' : 'Criar'} Ramal
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="ml-2 bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Setor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ramais.map((ramal) => (
                <tr key={ramal.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{ramal.numero}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ramal.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ramal.setor || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Unidade {ramal.unidadeId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(ramal)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(ramal.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}