// lib/session.ts
import { SessionOptions } from "iron-session";

export type SessionUser = {
  id: number;
  username: string;
  role: "owner" | "admin";
  unidade_id: number | null;
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "ramais-interno-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
};

declare module "iron-session" {
  interface IronSessionData {
    user?: SessionUser;
  }
}
