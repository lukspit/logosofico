import "server-only";

import { createClient } from "@/lib/supabase/server";

const STAFF_ROLES = new Set(["teacher", "editor", "director", "admin"]);

export type PreparationAttachment = {
  id: string;
  fileName: string;
  mimeType: string | null;
  sizeBytes: number;
  url: string | null;
};

export type PreparationWorkspaceData = {
  id: string;
  title: string;
  body: string;
  updatedAt: string;
  authorId: string;
  lessonId: string;
  organizationId: string;
  attachments: PreparationAttachment[];
  persistence: "supabase" | "local";
};

export type PreparationAccess =
  | { status: "unauthenticated" }
  | { status: "forbidden" }
  | { status: "lesson-not-found" }
  | { status: "ready"; workspace: PreparationWorkspaceData };

export async function getPreparationWorkspace(
  lessonSlug: string,
): Promise<PreparationAccess> {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) return { status: "unauthenticated" };

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, organization_id, title")
    .eq("slug", lessonSlug)
    .single();
  if (!lesson) return { status: "lesson-not-found" };

  const { data: membership } = await supabase
    .from("memberships")
    .select("role")
    .eq("organization_id", lesson.organization_id)
    .eq("user_id", userId)
    .eq("is_active", true)
    .in("role", ["teacher", "editor", "director", "admin"])
    .limit(1)
    .maybeSingle();

  if (!membership || !STAFF_ROLES.has(membership.role)) {
    return { status: "forbidden" };
  }

  const { data: existing, error: readError } = await supabase
    .from("lesson_preparations")
    .select("id, title, body, updated_at, author_id, lesson_id, organization_id")
    .eq("lesson_id", lesson.id)
    .eq("author_id", userId)
    .maybeSingle();

  if (readError) {
    return {
      status: "ready",
      workspace: localWorkspace(lesson, userId),
    };
  }

  let preparation = existing;
  if (!preparation) {
    const { data: created, error: createError } = await supabase
      .from("lesson_preparations")
      .insert({
        organization_id: lesson.organization_id,
        lesson_id: lesson.id,
        author_id: userId,
        title: `Preparação · ${lesson.title}`,
      })
      .select("id, title, body, updated_at, author_id, lesson_id, organization_id")
      .single();

    if (createError || !created) {
      return {
        status: "ready",
        workspace: localWorkspace(lesson, userId),
      };
    }
    preparation = created;
  }

  const { data: attachmentRows } = await supabase
    .from("preparation_attachments")
    .select("id, file_name, mime_type, size_bytes, storage_path")
    .eq("preparation_id", preparation.id)
    .eq("author_id", userId)
    .order("created_at");

  const attachments = await Promise.all(
    (attachmentRows || []).map(async (attachment) => {
      const { data } = await supabase.storage
        .from("preparation-files")
        .createSignedUrl(attachment.storage_path, 60 * 60);
      return {
        id: attachment.id,
        fileName: attachment.file_name,
        mimeType: attachment.mime_type,
        sizeBytes: attachment.size_bytes,
        url: data?.signedUrl || null,
      };
    }),
  );

  return {
    status: "ready",
    workspace: {
      id: preparation.id,
      title: preparation.title,
      body: preparation.body,
      updatedAt: preparation.updated_at,
      authorId: preparation.author_id,
      lessonId: preparation.lesson_id,
      organizationId: preparation.organization_id,
      attachments,
      persistence: "supabase",
    },
  };
}

function localWorkspace(
  lesson: { id: string; organization_id: string; title: string },
  userId: string,
): PreparationWorkspaceData {
  return {
    id: `local-${lesson.id}`,
    title: `Preparação · ${lesson.title}`,
    body: "",
    updatedAt: new Date().toISOString(),
    authorId: userId,
    lessonId: lesson.id,
    organizationId: lesson.organization_id,
    attachments: [],
    persistence: "local",
  };
}
