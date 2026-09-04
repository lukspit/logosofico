import "server-only";

import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

export type LibraryContributionKind = "Atividade" | "Para imprimir" | "Site" | "Vídeo";

export type LibraryContribution = {
  authorName: string;
  createdAt: string;
  description: string;
  id: string;
  kind: LibraryContributionKind;
  lessonSlug: string;
  title: string;
  url: string;
};

export type LibraryContributionsData = {
  contributions: LibraryContribution[];
  persistence: "local" | "supabase";
};

const kindByResourceType: Record<string, LibraryContributionKind> = {
  activity: "Atividade",
  link: "Site",
  printable: "Para imprimir",
  video: "Vídeo",
};

export async function getLibraryContributions(): Promise<LibraryContributionsData> {
  if (!hasSupabaseEnv()) return { contributions: [], persistence: "local" };

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) return { contributions: [], persistence: "local" };

  const { data, error } = await supabase
    .from("resources")
    .select("id, title, description, resource_type, external_url, created_at, profiles!resources_created_by_fkey(full_name), lessons(slug)")
    .eq("source_name", "Contribuição do professor")
    .in("status", ["draft", "review"])
    .order("created_at", { ascending: false });

  if (error) return { contributions: [], persistence: "local" };

  const contributions = data.flatMap((resource) => {
    const kind = kindByResourceType[resource.resource_type];
    if (!kind || !resource.external_url) return [];
    return [{
      authorName: resource.profiles?.full_name || "Professor(a)",
      createdAt: resource.created_at,
      description: resource.description || "",
      id: resource.id,
      kind,
      lessonSlug: resource.lessons?.slug || "",
      title: resource.title,
      url: resource.external_url,
    }];
  });

  return { contributions, persistence: "supabase" };
}
