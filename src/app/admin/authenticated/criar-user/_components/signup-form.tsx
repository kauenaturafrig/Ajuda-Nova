// src/app/admin/authenticated/criar-user/_components/signup-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, ArrowLeft, ArrowRight } from "lucide-react";

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
import { authClient } from "../../../../../lib/auth-client";

const roleOptions = [
  {
    value: "ADMIN",
    label: "Admin",
  },
  {
    value: "OWNER",
    label: "Owner (Acesso Total)",
  },
  {
    value: "NEWSONLY",
    label: "Apenas Notícias",
  },
  {
    value: "MESSAGEONLY",
    label: "Recados Unidade",
  },
  {
    value: "MESSAGENEWS",
    label: "Notícias + Recados Multi",
  },
  {
    value: "EVENTS",
    label: "Eventos",
  },
  {
    value: "EXTENSION",
    label: "Ramais",
  },
  {
    value: "EMAIL",
    label: "Emails",
  }
] as const;

const signupSchema = z
  .object({
    name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z
      .string()
      .min(8, { message: "A confirmação deve ter pelo menos 8 caracteres" }),
    roles: z
      .array(
        z.enum([
          "OWNER",
          "ADMIN",
          "NEWSONLY",
          "MESSAGEONLY",
          "MESSAGENEWS",
          "EVENTS",
          "EXTENSION",
          "EMAIL",
        ]),
      )
      .min(1, {
        message: "Selecione pelo menos um perfil",
      }),
    unidadeId: z.string().min(1, { message: "Selecione uma unidade" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;
type Unidade = { id: number; nome: string };
type Props = { unidades: Unidade[] };

export function SignupForm({ unidades }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      roles: ["ADMIN"],
      unidadeId: "",
    },
  });

  const isOwnerSelected = form.watch("roles")?.includes("OWNER");

  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true);

    const { error } = await authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      {
        onRequest: () => setIsLoading(true),
        onResponse: () => setIsLoading(false),
      }
    );

    if (error) {
      console.log("ERRO AO CRIAR USUÁRIO", error);
      setIsLoading(false);
      return;
    }

    const res = await fetch("/admin/api/usuarios/set-role-unidade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: values.email,
        roles: values.roles,
        unidadeId: Number(values.unidadeId),
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Erro ao setar role/unidade", err);
      alert(`Erro ao salvar unidade/role: ${err.error ?? res.status}`);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    router.replace("/admin/authenticated/usuarios");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        {/* Campo Nome */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Nome Completo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: João Silva"
                  {...field}
                  disabled={isLoading}
                  className="rounded-xl h-10 border-gray-200 dark:border-neutral-800 text-xs bg-white dark:bg-neutral-900 focus-visible:ring-green-500/50"
                />
              </FormControl>
              <FormMessage className="text-[11px] font-medium text-red-500" />
            </FormItem>
          )}
        />

        {/* Campo Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Endereço de Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="nome@empresa.com"
                  type="email"
                  {...field}
                  disabled={isLoading}
                  className="rounded-xl h-10 border-gray-200 dark:border-neutral-800 text-xs bg-white dark:bg-neutral-900 focus-visible:ring-green-500/50"
                />
              </FormControl>
              <FormMessage className="text-[11px] font-medium text-red-500" />
            </FormItem>
          )}
        />

        {/* Grid de Senha / Confirmação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Senha */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Senha Provisória</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      disabled={isLoading}
                      className="rounded-xl h-10 border-gray-200 dark:border-neutral-800 text-xs bg-white dark:bg-neutral-900 pr-10 focus-visible:ring-green-500/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:bg-transparent hover:text-gray-600 dark:hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-[11px] font-medium text-red-500" />
              </FormItem>
            )}
          />

          {/* Confirmar Senha */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Confirmar Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="••••••••"
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                      disabled={isLoading}
                      className="rounded-xl h-10 border-gray-200 dark:border-neutral-800 text-xs bg-white dark:bg-neutral-900 pr-10 focus-visible:ring-green-500/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:bg-transparent hover:text-gray-600 dark:hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-[11px] font-medium text-red-500" />
              </FormItem>
            )}
          />
        </div>

        {/* Perfil e Unidade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Role */}
          <FormField
            control={form.control}
            name="roles"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Perfis de Acesso
                </FormLabel>

                <div className="grid grid-cols-1 gap-2 rounded-xl border border-gray-200 dark:border-neutral-800 p-3">
                  {roleOptions.map((option) => {
                    const checked = field.value?.includes(option.value);
                    const isOwnerSelected = field.value?.includes("OWNER");
                    const isDisabled = isOwnerSelected && option.value !== "OWNER";

                    return (
                      <label
                        key={option.value}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs ${isDisabled
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800"
                          } text-gray-700 dark:text-gray-300`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={isLoading || isDisabled}
                          onChange={(event) => {
                            const currentRoles = field.value ?? [];

                            if (event.target.checked) {
                              // Se for OWNER, desmarca todas as outras roles
                              if (option.value === "OWNER") {
                                field.onChange(["OWNER"]);
                              } else {
                                // Se for outra role, adiciona normalmente
                                field.onChange([
                                  ...new Set([
                                    ...currentRoles,
                                    option.value,
                                  ]),
                                ]);
                              }
                            } else {
                              // Desmarcar
                              field.onChange(
                                currentRoles.filter(
                                  (role) => role !== option.value,
                                ),
                              );
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />

                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>

                <FormMessage className="text-[11px] font-medium text-red-500" />
              </FormItem>
            )}
          />

          {/* Unidade */}
          <FormField
            control={form.control}
            name="unidadeId"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Unidade Operacional</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50"
                  >
                    <option value="">Selecione uma unidade...</option>
                    {unidades.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage className="text-[11px] font-medium text-red-500" />
              </FormItem>
            )}
          />
        </div>

        {/* Ações operacionais do Formulário */}
        <div className="flex flex-col sm:flex-row items-center gap-2 border-t border-gray-100 dark:border-neutral-800/50 pt-4 mt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isLoading}
            className="w-full sm:w-auto h-10 order-2 sm:order-1 gap-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 dark:hover:bg-neutral-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Cancelar e Voltar
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:ml-auto sm:w-auto h-10 order-1 sm:order-2 gap-2 rounded-xl text-xs font-semibold bg-gray-900 dark:bg-neutral-800 hover:bg-gray-800 text-white px-6 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Criando Usuário...
              </>
            ) : (
              <>
                Efetivar Cadastro
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

      </form>
    </Form>
  );
}