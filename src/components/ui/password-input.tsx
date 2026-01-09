// ex: src/components/ui/password-input.tsx
"use client";

import { useState } from "react";
import { Input } from "./input";
import { cn } from "../../lib/utils";

type PasswordInputProps = React.ComponentProps<typeof Input>;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <Input
        type={visible ? "text" : "password"}
        className="pr-10" // espaço pro ícone
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-muted-foreground"
        tabIndex={-1}
      >
        {visible ? "Ocultar" : "Mostrar"}
        {/* se quiser, troca por ícone de olho fechado/aberto */}
      </button>
    </div>
  );
}
