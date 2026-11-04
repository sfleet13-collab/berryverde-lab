"use server";

import { refresh } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createItem, deleteItem, setItemDone } from "@/lib/data";

export type AddItemState = { ok: boolean; savedAt?: number; error?: "empty" | "failed" };

/** Neue Idee für die angemeldete Person speichern. */
export async function addItem(_prev: AddItemState, form: FormData): Promise<AddItemState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "failed" };
  const title = String(form.get("title") ?? "");
  if (!title.trim()) return { ok: false, error: "empty" };
  try {
    await createItem(user, title, String(form.get("note") ?? ""));
  } catch (e) {
    console.error("[items] speichern:", e);
    return { ok: false, error: "failed" };
  }
  refresh();
  return { ok: true, savedAt: Date.now() };
}

/** Erledigt / wieder offen. */
export async function toggleItem(form: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  await setItemDone(user, Number(form.get("id")), form.get("done") === "1");
  refresh();
}

export async function removeItem(form: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  await deleteItem(user, Number(form.get("id")));
  refresh();
}
