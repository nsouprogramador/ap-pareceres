/**
 * app/api/auth/[...nextauth]/route.ts
 * Endpoints do Auth.js (signin/signout/callback/session/csrf).
 */
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
