import { notFound, redirect } from "next/navigation";

import { PreparationWorkspace } from "@/components/preparation-workspace";
import { getLessonDetail } from "@/lib/data/lessons";
import { getPreparationWorkspace } from "@/lib/data/preparations";
import { getMaterialManifest } from "@/lib/material-reader";

type PreparationPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function PreparationPage({ params }: PreparationPageProps) {
  const { slug } = await params;
  const [lesson, access] = await Promise.all([
    getLessonDetail(slug),
    getPreparationWorkspace(slug),
  ]);

  if (access.status === "unauthenticated") redirect(`/entrar?next=/aulas/${slug}/preparacao`);
  if (!lesson || access.status === "lesson-not-found") notFound();
  if (access.status === "forbidden") notFound();

  const teacherMaterial = getMaterialManifest(lesson.teacherPdf.split("/").at(-1) || "");
  const studentMaterial = getMaterialManifest(lesson.studentPdf.split("/").at(-1) || "");
  if (!teacherMaterial || !studentMaterial) notFound();

  return (
    <PreparationWorkspace
      preparationId={access.workspace.id}
      initialTitle={access.workspace.title}
      initialBody={access.workspace.body}
      initialAttachments={access.workspace.attachments}
      initialUpdatedAt={access.workspace.updatedAt}
      persistence={access.workspace.persistence}
      lesson={{
        slug: lesson.slug,
        number: lesson.number,
        title: lesson.title,
        summary: lesson.summary,
        essentialQuestion: lesson.essentialQuestion,
      }}
      teacherMaterial={teacherMaterial}
      studentMaterial={studentMaterial}
    />
  );
}
