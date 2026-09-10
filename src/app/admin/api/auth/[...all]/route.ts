// src/app/admin/api/auth/[...all]/route.ts

import { auth } from "@/src/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const dynamic = "force-dynamic";

const handler = toNextJsHandler(auth);

export const GET = handler.GET;
export const POST = handler.POST;