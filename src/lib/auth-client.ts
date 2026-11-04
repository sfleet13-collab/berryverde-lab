"use client";

import { createAuthClient } from "@neondatabase/auth/next";

/** Login im Browser (nur für Google-Anmeldung nötig, der Rest läuft über Server Actions). */
export const authClient = createAuthClient();
