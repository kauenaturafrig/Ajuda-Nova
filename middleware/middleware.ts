// middleware/middleware.ts
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import type { AppSession } from "../src/types/session";

export async function middleware(req: NextRequest) {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as AppSession;

  const path = req.nextUrl.pathname;

  if (!path.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session.user.role !== "owner" && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

