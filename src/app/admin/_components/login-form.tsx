"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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
import { TwitchLogo } from "@phosphor-icons/react";
import { authClient } from "../../../lib/auth-client";
import Layout from "@/src/components/Layout";
import { LoadingOverlay } from "../../../components/ui/loading-overlay";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
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

    const { error } = await authClient.signIn.email(
      {
        email: formData.email,
        password: formData.password,
        callbackURL: "/admin/authenticated",
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: (ctx) => {
          console.log("LOGADO", ctx);
          setIsLoading(false);
          router.replace("/admin/authenticated");
        },
        onError: (ctx) => {
          console.log("ERRO AO LOGAR");
          if (ctx.error.code === "INVALID_EMAIL_OR_PASSWORD") {
            alert("Email ou senha incorretos");
          }
          setIsLoading(false);
        },
      }
    );
  }

  return (
    <div>
      <LoadingOverlay show={isLoading} text="Entrando..." />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="seu@email.com"
                    type="email"
                    {...field}
                    disabled={isLoading}
                    className="dark:text-white"
                  />
                </FormControl>
                <FormMessage className="!text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-white">Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      disabled={isLoading}
                      className="dark:text-white"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent dark:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground dark:text-white" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground dark:text-white" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Esconder senha" : "Mostrar senha"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="!text-red-500" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full text-white bg-blue-500 rounded hover:scale-110"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin dark:text-white" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
