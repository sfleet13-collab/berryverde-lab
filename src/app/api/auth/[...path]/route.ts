import { getAuth } from "@/lib/neon-auth";

/** Leitet alle Login-Anfragen an Neon Auth weiter (/api/auth/...). */
const auth = getAuth();
const notConfigured = () =>
  new Response("Login nicht eingerichtet", { status: 404 });

export const GET = auth ? auth.handler().GET : notConfigured;
export const POST = auth ? auth.handler().POST : notConfigured;
