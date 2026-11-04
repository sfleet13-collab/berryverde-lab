import "server-only";

/**
 * E-Mail-Versand über Resend (resend.com).
 * Ohne RESEND_API_KEY wird nichts verschickt, sondern nur im Server-Log ausgegeben
 * – praktisch beim Entwickeln.
 */
export async function sendMail({
  subject,
  text,
  replyTo,
  to = process.env.CONTACT_TO_EMAIL,
}: {
  subject: string;
  text: string;
  replyTo?: string;
  to?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM ?? "App <onboarding@resend.dev>";

  if (!key || !to) {
    console.info("[mail] Kein RESEND_API_KEY/CONTACT_TO_EMAIL gesetzt – E-Mail nur geloggt:\n", subject, "\n", text);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text, reply_to: replyTo }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
