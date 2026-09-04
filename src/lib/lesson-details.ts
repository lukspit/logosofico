import { lessons } from "@/lib/demo-data";

const slugs = [
  "nosso-mundo-politico",
  "cidadania",
  "desenvolvimento-da-vida",
  "fenomenos-urbanos",
  "sociedade-e-tecnologia",
  "mundo-da-tecnologia",
];

const essentialQuestions = [
  "Como nossas escolhas e formas de organização transformam o mundo em que vivemos?",
  "O que significa participar da construção de uma sociedade justa?",
  "Como a vida se desenvolve dentro de nós e nas sociedades?",
  "Como o crescimento das cidades transforma nossa vida e o ambiente?",
  "Como a tecnologia amplia aquilo que somos capazes de perceber e criar?",
  "A tecnologia aproxima todas as pessoas da mesma maneira?",
];

const pageCounts = [
  [63, 74],
  [89, 102],
  [81, 94],
  [93, 105],
  [84, 94],
  [77, 88],
];

const preparations = [
  ["Revisar o percurso integrado da aula", "Selecionar referências de migração e arte", "Separar materiais para a atividade de gravura"],
  ["Mapear exemplos locais de cidadania", "Revisar os conceitos de acessibilidade", "Preparar a atividade no plano cartesiano"],
  ["Revisar os sistemas do corpo humano", "Separar modelos e instrumentos ópticos", "Organizar a leitura de gráficos e tabelas"],
  ["Selecionar imagens de transformações urbanas", "Preparar a investigação sobre alimentação", "Planejar a atividade de consumo consciente"],
  ["Revisar calendários maias", "Selecionar mapas celestes", "Organizar imagens de satélite e arte digital"],
  ["Organizar a linha do tempo geológica", "Selecionar exemplos de ilustração paleontológica", "Preparar a conversa sobre exclusão digital"],
];

export const lessonDetails = lessons.map((lesson, index) => ({
  ...lesson,
  slug: slugs[index],
  essentialQuestion: essentialQuestions[index],
  preparation: preparations[index],
  studentPages: pageCounts[index][0],
  teacherPages: pageCounts[index][1],
  studentPdf: `/materiais/aula-${String(lesson.number).padStart(2, "0")}-aluno.pdf`,
  teacherPdf: `/materiais/aula-${String(lesson.number).padStart(2, "0")}-professor.pdf`,
}));

export function findLesson(slug: string) {
  return lessonDetails.find((lesson) => lesson.slug === slug);
}
