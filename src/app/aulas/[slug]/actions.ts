"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

export type NoteActionState = {
  ok: boolean;
  message: string;
};

const noteSchema = z.object({
  slug: z.string().min(2).max(120),
  title: z.string().trim().min(4).max(120),
  body: z.string().trim().min(12).max(2400),
});

export async function addPedagogicalNote(
  _state: NoteActionState,
  formData: FormData,
): Promise<NoteActionState> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Configure o Supabase no .env.local para salvar contribuições." };
  }

  const parsed = noteSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { ok: false, message: "Revise o título e descreva melhor a contribuição." };
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) return { ok: false, message: "Sua sessão expirou. Entre novamente." };

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, organization_id")
    .eq("slug", parsed.data.slug)
    .single();
  if (!lesson) return { ok: false, message: "Aula não encontrada ou acesso insuficiente." };

  const { error } = await supabase.from("pedagogical_notes").insert({
    organization_id: lesson.organization_id,
    lesson_id: lesson.id,
    author_id: userId,
    title: parsed.data.title,
    body: parsed.data.body,
    visibility: "staff",
  });
  if (error) return { ok: false, message: "Não foi possível salvar. Confirme seu papel de professor." };

  revalidatePath(`/aulas/${parsed.data.slug}`);
  return { ok: true, message: "Contribuição adicionada à memória pedagógica." };
}
