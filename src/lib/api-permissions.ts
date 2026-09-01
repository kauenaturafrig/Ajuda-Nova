// src/lib/api-permissions.ts
import { NextRequest } from "next/server";
import { auth } from "./auth";
import { prisma } from "./prisma";
import type { AppUserRole } from "@/src/types/user";

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  unidadeId: number | null;
  roles: AppUserRole[];
};

export async function getApiUser(
  req: NextRequest,
): Promise<ApiUser | null> {
  const session = await auth.api.getSession({
    headers: req.headers,
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

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    unidadeId: user.unidadeId,
    roles: user.userRoles.map(
      (assignment) =>
        assignment.role.name as AppUserRole,
    ),
  };
}

export function hasAnyApiRole(
  user: ApiUser,
  allowedRoles: readonly AppUserRole[],
) {
  return user.roles.some((role) =>
    allowedRoles.includes(role),
  );
}

export function hasApiRole(
  user: ApiUser,
  role: AppUserRole,
) {
  return user.roles.includes(role);
}