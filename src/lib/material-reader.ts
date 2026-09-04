import { lessonDetails } from "@/lib/lesson-details";

export type MaterialAudience = "aluno" | "professor";

export type MaterialSection = {
  id: string;
  title: string;
  description: string;
  startPage: number;
  endPage: number;
};

export type MaterialManifest = {
  filename: string;
  lessonSlug: string;
  lessonNumber: number;
  lessonTitle: string;
  audience: MaterialAudience;
  pageCount: number;
  sections: MaterialSection[];
};

const startsByLesson = {
  1: { aluno: [6, 11, 19, 26, 45, 54, 59], professor: [17, 22, 30, 37, 56, 65, 70] },
  2: { aluno: [6, 32, 41, 51, 64, 72, 83, 85, 89], professor: [19, 45, 54, 64, 77, 85, 96, 98, 102] },
  3: { aluno: [6, 14, 40, 52, 57, 68, 74], professor: [19, 27, 40, 65, 70, 81, 87] },
  4: { aluno: [7, 25, 54, 59, 68], professor: [19, 37, 66, 71, 80] },
  5: { aluno: [5, 32, 48, 74, 78], professor: [15, 42, 58, 84, 88] },
  6: { aluno: [6, 17, 44, 55, 60], professor: [17, 28, 55, 66, 71] },
} satisfies Record<number, Record<MaterialAudience, number[]>>;

function createSections(audience: MaterialAudience, starts: number[], pageCount: number): MaterialSection[] {
  const firstActivityPage = starts[0];
  const introductorySections: MaterialSection[] = [{
    id: "visao-geral",
    title: "Visão geral e referências",
    description: "Objetivos, áreas integradas e fontes para aprofundamento.",
    startPage: 1,
    endPage: Math.min(5, firstActivityPage - 1),
  }];

  if (audience === "professor" && firstActivityPage > 6) {
    introductorySections.push({
      id: "orientacoes",
      title: "Orientações didáticas",
      description: "Encaminhamentos, mediações e sugestões para os encontros.",
      startPage: 6,
      endPage: firstActivityPage - 1,
    });
  } else if (firstActivityPage > 6) {
    introductorySections.push({
      id: "preparacao",
      title: "Preparação do percurso",
      description: "Contexto inicial antes das atividades numeradas.",
      startPage: 6,
      endPage: firstActivityPage - 1,
    });
  }

  return [
    ...introductorySections.filter((section) => section.endPage >= section.startPage),
    ...starts.map((startPage, index) => ({
      id: `bloco-${index + 1}`,
      title: `Bloco ${index + 1}`,
      description: `Atividades ${index + 1}A em diante · páginas ${startPage}–${starts[index + 1] ? starts[index + 1] - 1 : pageCount}`,
      startPage,
      endPage: starts[index + 1] ? starts[index + 1] - 1 : pageCount,
    })),
  ];
}

const manifests = lessonDetails.flatMap((lesson) => {
  const lessonNumber = lesson.number as keyof typeof startsByLesson;
  return (["aluno", "professor"] as const).map((audience) => {
    const pageCount = audience === "aluno" ? lesson.studentPages : lesson.teacherPages;
    const filename = `aula-${String(lesson.number).padStart(2, "0")}-${audience}.pdf`;
    return {
      filename,
      lessonSlug: lesson.slug,
      lessonNumber: lesson.number,
      lessonTitle: lesson.title,
      audience,
      pageCount,
      sections: createSections(audience, startsByLesson[lessonNumber][audience], pageCount),
    } satisfies MaterialManifest;
  });
});

const manifestByFilename = new Map(manifests.map((manifest) => [manifest.filename, manifest]));

export function getMaterialManifest(filename: string) {
  return manifestByFilename.get(filename) ?? null;
}

export function getReaderHref(pdfHref: string) {
  return pdfHref.replace("/materiais/", "/leitor/");
}
