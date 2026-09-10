// src/app/admin/authenticated/minha-senha/_components/change-password-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, Save, ArrowLeft } from "lucide-react";

import { authClient } from "../../../../../lib/auth-client";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../components/ui/form";
import { LoadingOverlay } from "../../../../../components/ui/loading-overlay";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual"),
    newPassword: z.string().min(8, "A nova senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string().min(8, "Confirme a nova senha"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

type FormValues = z.infer<typeof schema>;

export function ChangePasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);

    const { error } = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      setIsLoading(false);
      form.setError("currentPassword", {
        message: error.message ?? "Senha atual incorreta ou erro ao trocar senha",
      });
      return;
    }

    await authClient.signOut();
    setIsLoading(false);
    router.replace("/admin");
  }

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div>
      <LoadingOverlay show={loading} text="Carregando..." />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Senha Atual */}
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Senha Atual</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="••••••••"
                      type={showCurrent ? "text" : "password"}
                      autoComplete="current-password"
                      {...field}
                      disabled={isLoading}
                      className="rounded-xl h-10 border-gray-200 dark:border-neutral-800 text-xs bg-white dark:bg-neutral-900 pr-10 focus-visible:ring-gray-500/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:bg-transparent hover:text-gray-600 dark:hover:text-white"
                      onClick={() => setShowCurrent((v) => !v)}
                      disabled={isLoading}
                    >
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-[11px] font-medium text-red-500" />
              </FormItem>
            )}
          />

          {/* Nova Senha */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Nova Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Mínimo 8 caracteres"
                      type={showNew ? "text" : "password"}
                      autoComplete="new-password"
                      {...field}
                      disabled={isLoading}
                      className="rounded-xl h-10 border-gray-200 dark:border-neutral-800 text-xs bg-white dark:bg-neutral-900 pr-10 focus-visible:ring-gray-500/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:bg-transparent hover:text-gray-600 dark:hover:text-white"
                      onClick={() => setShowNew((v) => !v)}
                      disabled={isLoading}
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-[11px] font-medium text-red-500" />
              </FormItem>
            )}
          />

          {/* Confirmar Nova Senha */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Confirmar Nova Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Repita a nova senha"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      {...field}
                      disabled={isLoading}
                      className="rounded-xl h-10 border-gray-200 dark:border-neutral-800 text-xs bg-white dark:bg-neutral-900 pr-10 focus-visible:ring-gray-500/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:bg-transparent hover:text-gray-600 dark:hover:text-white"
                      onClick={() => setShowConfirm((v) => !v)}
                      disabled={isLoading}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-[11px] font-medium text-red-500" />
              </FormItem>
            )}
          />

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row items-center gap-2 border-t border-gray-100 dark:border-neutral-800/50 pt-4 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              disabled={isLoading}
              className="w-full sm:w-auto h-10 order-2 sm:order-1 gap-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 dark:hover:bg-neutral-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full sm:ml-auto sm:w-auto h-10 order-1 sm:order-2 gap-2 rounded-xl text-xs font-semibold bg-gray-900 dark:bg-neutral-800 hover:bg-gray-800 text-white px-5 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Atualizar Senha
                </>
              )}
            </Button>
          </div>

        </form>
      </Form>
    </div>
  );
}