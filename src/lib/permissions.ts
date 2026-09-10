// src/lib/permissions.ts
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { prisma } from "./prisma";
import {
  APP_USER_ROLES,
  type AppUserRole,
} from "@/src/types/user";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  unidadeId: number | null;
  roles: AppUserRole[];
};

function isAppUserRole(
  value: string,
): value is AppUserRole {
  return APP_USER_ROLES.includes(
    value as AppUserRole,
  );
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      unidadeId: true,
      userRoles: {
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  const roles = user.userRoles
    .map((assignment) => assignment.role.name)
    .filter(isAppUserRole);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    unidadeId: user.unidadeId,
    roles,
  };
}

export function hasAnyRole(
  user: AuthenticatedUser,
  allowedRoles: readonly AppUserRole[],
) {
  return user.roles.some((role) =>
    allowedRoles.includes(role),
  );
}

export function hasAllRoles(
  user: AuthenticatedUser,
  requiredRoles: readonly AppUserRole[],
) {
  return requiredRoles.every((role) =>
    user.roles.includes(role),
  );
}

export async function requirePageUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin");
  }

  return user;
}

export async function requirePageRoles(
  allowedRoles: readonly AppUserRole[],
) {
  const user = await requirePageUser();

  if (!hasAnyRole(user, allowedRoles)) {
    redirect("/admin/authenticated");
  }

  return user;
}