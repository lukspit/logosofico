import { lessonDetails } from "@/lib/lesson-details";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

export type LessonDetail = (typeof lessonDetails)[number];
export type PedagogicalNote = {
  id: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
};

const fallbackBySlug = new Map(
  lessonDetails.map((lesson) => [lesson.slug, lesson]),
);

function mergeLesson(
  row: {
    slug: string;
    number: number;
    title: string;
    summary: string | null;
    essential_question: string | null;
    status: "draft" | "review" | "published" | "archived";
  },
): LessonDetail | null {
  const fallback = fallbackBySlug.get(row.slug);
  if (!fallback) return null;
  const statusMap = {
    draft: "Em revisão",
    review: "Em revisão",
    published: "Publicado",
    archived: "Em revisão",
  } as const;
  return {
    ...fallback,
    number: row.number,
    title: row.title,
    short: row.summary || fallback.short,
    summary: row.summary || fallback.summary,
    essentialQuestion: row.essential_question || fallback.essentialQuestion,
    status: statusMap[row.status],
  };
}

export async function getLessons(): Promise<LessonDetail[]> {
  if (!hasSupabaseEnv()) return lessonDetails;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("slug, number, title, summary, essential_question, status")
    .order("number");
  if (error) throw new Error(`Não foi possível carregar as aulas: ${error.message}`);
  return data.map(mergeLesson).filter((lesson): lesson is LessonDetail => lesson !== null);
}

export async function getLessonDetail(slug: string): Promise<LessonDetail | null> {
  if (!hasSupabaseEnv()) return fallbackBySlug.get(slug) || null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("slug, number, title, summary, essential_question, status")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return mergeLesson(data);
}

export async function getPedagogicalNotes(
  slug: string,
): Promise<PedagogicalNote[]> {
  if (!hasSupabaseEnv()) {
    return [
      {
        id: "demo-note",
        title: "Começar pela memória da cidade",
        body: "A comparação de fotografias antigas e atuais de Chapecó fez a turma perceber as mudanças urbanas antes de entrarmos nos conceitos. Vale reservar mais tempo para essa conversa.",
        author: "Ana Luiza",
        createdAt: "2026-08-21T12:00:00.000Z",
      },
    ];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pedagogical_notes")
    .select("id, title, body, created_at, profiles!pedagogical_notes_author_id_fkey(full_name), lessons!inner(slug)")
    .eq("lessons.slug", slug)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) return [];
  return data.map((note) => ({
    id: note.id,
    title: note.title,
    body: note.body,
    author: note.profiles?.full_name || "Professor(a)",
    createdAt: note.created_at,
  }));
}
