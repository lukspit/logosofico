import { NextResponse } from "next/server";
import { z } from "zod";

import type { Database } from "@/types/database";
import { createClient } from "@/lib/supabase/server";

const STAFF_ROLES = ["teacher", "editor", "director", "admin"] as const;

const contributionSchema = z.object({
  description: z.string().trim().max(1000).default(""),
  kind: z.enum(["Atividade", "Para imprimir", "Site", "Vídeo"]),
  lessonSlug: z.string().trim().max(120).default(""),
  title: z.string().trim().min(3).max(160),
  url: z.url().refine((value) => value.startsWith("http://") || value.startsWith("https://")),
});

const resourceTypeByKind: Record<
  z.infer<typeof contributionSchema>["kind"],
  Database["public"]["Enums"]["resource_type"]
> = {
  Atividade: "activity",
  "Para imprimir": "printable",
  Site: "link",
  Vídeo: "video",
};

export async function POST(request: Request) {
  const parsed = contributionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Revise os dados do material." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) {
    return NextResponse.json({ error: "Sua sessão expirou. Entre novamente para sugerir um material." }, { status: 401 });
  }

  let lesson: { id: string; organization_id: string; slug: string } | null = null;
  if (parsed.data.lessonSlug) {
    const { data } = await supabase
      .from("lessons")
      .select("id, organization_id, slug")
      .eq("slug", parsed.data.lessonSlug)
      .single();
    lesson = data;
    if (!lesson) {
      return NextResponse.json({ error: "A aula selecionada não está disponível." }, { status: 404 });
    }
  }

  let membershipQuery = supabase
    .from("memberships")
    .select("organization_id, role")
    .eq("user_id", userId)
    .eq("is_active", true)
    .in("role", [...STAFF_ROLES]);
  if (lesson) membershipQuery = membershipQuery.eq("organization_id", lesson.organization_id);

  const { data: memberships } = await membershipQuery.order("created_at").limit(1);
  const membership = memberships?.[0];
  if (!membership) {
    return NextResponse.json({ error: "Seu perfil não tem permissão para contribuir nesta biblioteca." }, { status: 403 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .single();

  const { data: resource, error } = await supabase
    .from("resources")
    .insert({
      audience: "teacher",
      created_by: userId,
      description: parsed.data.description || null,
      external_url: parsed.data.url,
      lesson_id: lesson?.id || null,
      organization_id: membership.organization_id,
      resource_type: resourceTypeByKind[parsed.data.kind],
      source_name: "Contribuição do professor",
      status: "review",
      title: parsed.data.title,
    })
    .select("id, created_at")
    .single();

  if (error || !resource) {
    return NextResponse.json(
      { error: "Não foi possível salvar o material no acervo." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    contribution: {
      authorName: profile?.full_name || "Professor(a)",
      createdAt: resource.created_at,
      description: parsed.data.description,
      id: resource.id,
      kind: parsed.data.kind,
      lessonSlug: lesson?.slug || "",
      title: parsed.data.title,
      url: parsed.data.url,
    },
  });
}
