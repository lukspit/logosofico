import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const updateSchema = z.object({
  title: z.string().trim().min(1).max(160),
  body: z.string().max(200000),
});

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/preparacoes/[id]">,
) {
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Preparação inválida." }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Revise o conteúdo da preparação." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) {
    return NextResponse.json({ error: "Sua sessão expirou." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("lesson_preparations")
    .update(parsed.data)
    .eq("id", id)
    .eq("author_id", userId)
    .select("updated_at")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Não foi possível salvar esta preparação." },
      { status: 403 },
    );
  }

  return NextResponse.json({ updatedAt: data.updated_at });
}
