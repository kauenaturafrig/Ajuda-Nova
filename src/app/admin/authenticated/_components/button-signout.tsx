"use client";

import { Button } from "../../../../components/ui/button";
import { useRouter } from "next/navigation";
import { authClient } from "../../../../lib/auth-client";

export function ButtonSignOut() {
  const router = useRouter();

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/admin");
        },
      },
    });
  }

  return (
    <Button onClick={signOut} className="bg-red-500 text-white">
      Sair da conta
    </Button>
    );
}
