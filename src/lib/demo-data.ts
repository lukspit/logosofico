export type Lesson = {
  number: number;
  title: string;
  short: string;
  summary: string;
  areas: string[];
  status: "Publicado" | "Em revisão" | "Em andamento";
};

export const lessons: Lesson[] = [
  { number: 1, title: "Nosso mundo político", short: "Migrações, cultura, organização política e as relações entre sociedade e ambiente.", summary: "Uma leitura integrada sobre como pessoas, culturas e decisões políticas transformam os lugares onde vivemos.", areas: ["História", "Geografia", "Português", "Matemática", "Ciências", "Artes"], status: "Publicado" },
  { number: 2, title: "Cidadania", short: "Direitos, deveres, acessibilidade e as transformações sociais construídas coletivamente.", summary: "Direitos, deveres e participação ganham significado por meio de histórias, problemas e experiências próximas da turma.", areas: ["História", "Português", "Ciências", "Matemática", "Espanhol", "Artes"], status: "Publicado" },
  { number: 3, title: "Desenvolvimento da vida: biológica e social", short: "Corpo humano, ciclos de vida, educação e mudanças no trabalho e na sociedade.", summary: "Uma investigação sobre o desenvolvimento humano em suas dimensões biológica, histórica e social.", areas: ["Ciências", "História", "Geografia", "Português", "Matemática", "Artes"], status: "Publicado" },
  { number: 4, title: "Fenômenos urbanos: causas e consequências", short: "Cidades, alimentação, consumo consciente, natureza e os impactos das escolhas humanas.", summary: "A aula conecta o crescimento das cidades aos hábitos cotidianos, à produção de alimentos e ao cuidado com os ambientes.", areas: ["Geografia", "Ciências", "História", "Matemática", "Português", "Artes"], status: "Em andamento" },
  { number: 5, title: "Sociedade e tecnologia", short: "Civilizações, arte digital, astronomia e tecnologias que mudaram nossa leitura do mundo.", summary: "Das tecnologias maias às imagens de satélite, a turma percebe como instrumentos ampliam o conhecimento humano.", areas: ["História", "Ciências", "Geografia", "Artes", "Matemática", "Espanhol"], status: "Em revisão" },
  { number: 6, title: "Mundo da tecnologia: integrações e exclusões", short: "Redes, paleontologia, transformações ambientais e os limites de acesso à tecnologia.", summary: "Tecnologia aproxima pessoas e revela o passado, mas também produz novas distâncias que precisam ser compreendidas.", areas: ["Ciências", "Geografia", "História", "Português", "Matemática", "Artes"], status: "Em revisão" },
];
