"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import { authClient } from "../../../../lib/auth-client";

export function ButtonSignOut() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        console.error("Erro ao sair:", error);
        alert("Não foi possível encerrar a sessão.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={signOut}
      disabled={loading}
      className="bg-red-500 text-white"
    >
      {loading ? "Saindo..." : "Sair da conta"}
    </Button>
  );
}