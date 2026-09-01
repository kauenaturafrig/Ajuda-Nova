"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { authClient } from "../../../lib/auth-client";
import { LoadingOverlay } from "../../../components/ui/loading-overlay";

const loginSchema = z.object({
  email: z.string().email({ message: "Insira um e-mail válido" }),
  password: z
    .string()
    .min(8, { message: "A senha deve conter no mínimo 8 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formData: LoginFormValues) {
    setIsLoading(true);

    await authClient.signIn.email(
      {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },

        onSuccess: () => {
          setIsLoading(false);
          router.replace("/admin/authenticated");
          router.refresh();
        },

        onError: (context) => {
          setIsLoading(false);

          if (
            context.error.code ===
            "INVALID_EMAIL_OR_PASSWORD"
          ) {
            alert("E-mail ou senha incorretos.");
          } else {
            console.error(
              "Erro ao entrar:",
              context.error,
            );

            alert(
              context.error.message ??
              "Ocorreu um erro ao tentar acessar o painel.",
            );
          }
        },
      },
    );
  }

  return (
    <div className="relative">
      <LoadingOverlay show={isLoading} text="Autenticando..." />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          {/* Campo Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-semibold text-gray-700 dark:text-neutral-300">
                  E-mail institucional
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="nome.sobrenome@naturafrig.com.br"
                      type="email"
                      {...field}
                      disabled={isLoading}
                      className="pl-9 h-10 rounded-xl bg-gray-50/50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-sm focus-visible:ring-orange-500/30"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />

          {/* Campo Senha */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-xs font-semibold text-gray-700 dark:text-neutral-300">
                  Senha de acesso
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      disabled={isLoading}
                      className="pl-9 pr-10 h-10 rounded-xl bg-gray-50/50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-sm focus-visible:ring-orange-500/30"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span className="sr-only">
                        {showPassword ? "Ocultar senha" : "Exibir senha"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />

          {/* Botão de Envio */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm transition-all shadow-sm shadow-orange-600/10 active:scale-[0.98] mt-2 gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Carregando...
              </>
            ) : (
              "Acessar Painel"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}