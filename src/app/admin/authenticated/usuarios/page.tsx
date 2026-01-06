// app/admin/usuarios/page.tsx

"use client";

import { useState } from "react";

export default function CriarUsuarioPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("ti");
    const [unidadeId, setUnidadeId] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch("/api/admin/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role, unidadeId }),
        });

        if (!res.ok) {
        alert("Erro ao criar usuário");
        return;
        }

        alert("Usuário criado");
    }

    return (
        <form onSubmit={handleSubmit}>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input
            placeholder="Senha"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
        />

        <select onChange={(e) => setRole(e.target.value)}>
            <option value="ti">TI</option>
            <option value="viewer">Visualizador</option>
        </select>

        <input
            placeholder="Unidade ID"
            onChange={(e) => setUnidadeId(e.target.value)}
        />

        <button>Criar</button>
        </form>
    );
}
