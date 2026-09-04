insert into public.organizations (id, name, slug, logo_url)
values ('10000000-0000-4000-8000-000000000001', 'Colégio Logosófico González Pecotche', 'colegio-logosofico-chapeco', '/brand/colegio-logosofico.png');

insert into public.grade_levels (id, organization_id, name, code, position)
values ('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000001', '5º ano', 'ano-05', 5);

insert into public.subjects (id, organization_id, name, color) values
  ('50000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Língua Portuguesa', '#315f9e'),
  ('50000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Matemática', '#db8f44'),
  ('50000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'Ciências', '#4d966b'),
  ('50000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', 'História', '#a96c52'),
  ('50000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000001', 'Geografia', '#3e9094'),
  ('50000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000001', 'Artes Visuais', '#9a6fa9'),
  ('50000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000001', 'Música', '#d1697b'),
  ('50000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000001', 'Língua Espanhola', '#d2a733');

insert into public.curricula (id, organization_id, grade_level_id, title, academic_year, description, status)
values (
  '30000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000005',
  'Percurso Kinesis — 5º ano',
  2026,
  'Aulas integradas do 5º ano, conectando áreas do conhecimento a situações significativas para a vida da criança.',
  'published'
);

insert into public.lessons (id, organization_id, curriculum_id, number, slug, title, summary, essential_question, teacher_overview, student_overview, estimated_minutes, status, cover_color, published_at) values
  ('40000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 1, 'nosso-mundo-politico', 'Nosso mundo político', 'Migrações, cultura, organização política e as relações entre sociedade e ambiente.', 'Como nossas escolhas e formas de organização transformam o mundo em que vivemos?', 'Conduza a turma pelas relações entre migração, identidade, ambiente e organização política, preservando as conexões entre as áreas.', 'Você vai investigar como pessoas, culturas e decisões políticas transformam os lugares onde vivemos.', 600, 'published', '#164d87', now()),
  ('40000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 2, 'cidadania', 'Cidadania', 'Direitos, deveres, acessibilidade e as transformações sociais construídas coletivamente.', 'O que significa participar da construção de uma sociedade justa?', 'Explore cidadania por meio de situações concretas, migrações, acessibilidade, ambiente e participação coletiva.', 'Você vai descobrir como direitos e deveres aparecem nas escolhas que fazemos todos os dias.', 660, 'published', '#337f83', now()),
  ('40000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 3, 'desenvolvimento-da-vida', 'Desenvolvimento da vida: biológica e social', 'Corpo humano, ciclos de vida, educação e mudanças no trabalho e na sociedade.', 'Como a vida se desenvolve dentro de nós e nas sociedades?', 'Relacione os sistemas do corpo, ciclos naturais, história da educação e transformações sociais.', 'Você vai observar como o corpo, a natureza e a sociedade mudam e se desenvolvem.', 720, 'published', '#4c7959', now()),
  ('40000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 4, 'fenomenos-urbanos', 'Fenômenos urbanos: causas e consequências', 'Cidades, alimentação, consumo consciente, natureza e os impactos das escolhas humanas.', 'Como o crescimento das cidades transforma nossa vida e o ambiente?', 'Conecte urbanização, alimentação, consumo, sistemas sensoriais e sustentabilidade a partir da realidade dos estudantes.', 'Você vai investigar o que muda quando as cidades crescem e como nossas escolhas participam dessas mudanças.', 720, 'published', '#176f78', now()),
  ('40000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 5, 'sociedade-e-tecnologia', 'Sociedade e tecnologia', 'Civilizações, arte digital, astronomia e tecnologias que mudaram nossa leitura do mundo.', 'Como a tecnologia amplia aquilo que somos capazes de perceber e criar?', 'Parta das tecnologias de diferentes civilizações para investigar arte, astronomia, cartografia e produção de conhecimento.', 'Você vai viajar entre calendários maias, mapas celestes, imagens de satélite e arte digital.', 660, 'published', '#504c88', now()),
  ('40000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 6, 'mundo-da-tecnologia', 'Mundo da tecnologia: integrações e exclusões', 'Redes, paleontologia, transformações ambientais e os limites de acesso à tecnologia.', 'A tecnologia aproxima todas as pessoas da mesma maneira?', 'Explore contribuições tecnológicas ao conhecimento científico e problematize as integrações e exclusões produzidas pelas redes.', 'Você vai descobrir como a tecnologia revela o passado, aproxima pessoas e também pode criar novas distâncias.', 660, 'published', '#68466e', now());

insert into public.lesson_subjects (lesson_id, subject_id, position)
select l.id, s.id, row_number() over (partition by l.id order by s.name)::smallint
from public.lessons l
cross join public.subjects s
where l.curriculum_id = '30000000-0000-4000-8000-000000000001';

insert into public.lesson_sections (lesson_id, title, body, audience, section_type, position) values
  ('40000000-0000-4000-8000-000000000001', 'Comece por aqui', '{"text":"Observe com a turma como as migrações carregam culturas, histórias e novas formas de habitar o mundo."}', 'all', 'opening', 1),
  ('40000000-0000-4000-8000-000000000001', 'Preparação do professor', '{"items":["Revisar o percurso integrado da aula","Selecionar referências de migração e arte","Separar materiais para a atividade de gravura"]}', 'teacher', 'checklist', 2),
  ('40000000-0000-4000-8000-000000000002', 'Comece por aqui', '{"text":"Parta de situações próximas para reconhecer direitos, deveres e barreiras de acessibilidade."}', 'all', 'opening', 1),
  ('40000000-0000-4000-8000-000000000002', 'Preparação do professor', '{"items":["Mapear exemplos locais de cidadania","Revisar os conceitos de acessibilidade","Preparar a atividade no plano cartesiano"]}', 'teacher', 'checklist', 2),
  ('40000000-0000-4000-8000-000000000003', 'Comece por aqui', '{"text":"Investigue mudanças e permanências no corpo, nos ambientes e nas formas de viver em sociedade."}', 'all', 'opening', 1),
  ('40000000-0000-4000-8000-000000000003', 'Preparação do professor', '{"items":["Revisar os sistemas do corpo humano","Separar modelos e instrumentos ópticos","Organizar a leitura de gráficos e tabelas"]}', 'teacher', 'checklist', 2),
  ('40000000-0000-4000-8000-000000000004', 'Comece por aqui', '{"text":"Observe a cidade como um organismo vivo: ela cresce, consome, produz e transforma o ambiente."}', 'all', 'opening', 1),
  ('40000000-0000-4000-8000-000000000004', 'Preparação do professor', '{"items":["Selecionar imagens de transformações urbanas","Preparar a investigação sobre alimentação","Planejar a atividade de consumo consciente"]}', 'teacher', 'checklist', 2),
  ('40000000-0000-4000-8000-000000000005', 'Comece por aqui', '{"text":"Compare tecnologias criadas em tempos diferentes e o modo como cada uma amplia nossa visão do mundo."}', 'all', 'opening', 1),
  ('40000000-0000-4000-8000-000000000005', 'Preparação do professor', '{"items":["Revisar calendários maias","Selecionar mapas celestes","Organizar imagens de satélite e referências de arte digital"]}', 'teacher', 'checklist', 2),
  ('40000000-0000-4000-8000-000000000006', 'Comece por aqui', '{"text":"Descubra tecnologias que nos ajudam a reconstruir o passado e discuta quem consegue acessá-las no presente."}', 'all', 'opening', 1),
  ('40000000-0000-4000-8000-000000000006', 'Preparação do professor', '{"items":["Organizar a linha do tempo geológica","Selecionar exemplos de ilustração paleontológica","Preparar a conversa sobre integração e exclusão digital"]}', 'teacher', 'checklist', 2);

insert into public.resources (id, organization_id, lesson_id, title, description, resource_type, audience, external_url, mime_type, page_count, source_name, copyright_notes, status, position) values
  ('60000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', 'Caderno do aluno — Aula 1', 'Material integral para acompanhamento e atividades do estudante.', 'document', 'student', '/materials/aula-01-aluno.pdf', 'application/pdf', 63, 'Kinesis', 'Uso pedagógico interno', 'published', 1),
  ('60000000-0000-4000-8000-000000000012', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', 'Guia do professor — Aula 1', 'Versão ampliada com encaminhamentos e referências para o professor.', 'document', 'teacher', '/materials/aula-01-professor.pdf', 'application/pdf', 74, 'Kinesis', 'Uso pedagógico interno', 'published', 2),
  ('60000000-0000-4000-8000-000000000021', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000002', 'Caderno do aluno — Aula 2', 'Material integral para acompanhamento e atividades do estudante.', 'document', 'student', '/materials/aula-02-aluno.pdf', 'application/pdf', 89, 'Kinesis', 'Uso pedagógico interno', 'published', 1),
  ('60000000-0000-4000-8000-000000000022', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000002', 'Guia do professor — Aula 2', 'Versão ampliada com encaminhamentos e referências para o professor.', 'document', 'teacher', '/materials/aula-02-professor.pdf', 'application/pdf', 102, 'Kinesis', 'Uso pedagógico interno', 'published', 2),
  ('60000000-0000-4000-8000-000000000031', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000003', 'Caderno do aluno — Aula 3', 'Material integral para acompanhamento e atividades do estudante.', 'document', 'student', '/materials/aula-03-aluno.pdf', 'application/pdf', 81, 'Kinesis', 'Uso pedagógico interno', 'published', 1),
  ('60000000-0000-4000-8000-000000000032', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000003', 'Guia do professor — Aula 3', 'Versão ampliada com encaminhamentos e referências para o professor.', 'document', 'teacher', '/materials/aula-03-professor.pdf', 'application/pdf', 94, 'Kinesis', 'Uso pedagógico interno', 'published', 2),
  ('60000000-0000-4000-8000-000000000041', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000004', 'Caderno do aluno — Aula 4', 'Material integral para acompanhamento e atividades do estudante.', 'document', 'student', '/materials/aula-04-aluno.pdf', 'application/pdf', 93, 'Kinesis', 'Uso pedagógico interno', 'published', 1),
  ('60000000-0000-4000-8000-000000000042', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000004', 'Guia do professor — Aula 4', 'Versão ampliada com encaminhamentos e referências para o professor.', 'document', 'teacher', '/materials/aula-04-professor.pdf', 'application/pdf', 105, 'Kinesis', 'Uso pedagógico interno', 'published', 2),
  ('60000000-0000-4000-8000-000000000051', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000005', 'Caderno do aluno — Aula 5', 'Material integral para acompanhamento e atividades do estudante.', 'document', 'student', '/materials/aula-05-aluno.pdf', 'application/pdf', 84, 'Kinesis', 'Uso pedagógico interno', 'published', 1),
  ('60000000-0000-4000-8000-000000000052', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000005', 'Guia do professor — Aula 5', 'Versão ampliada com encaminhamentos e referências para o professor.', 'document', 'teacher', '/materials/aula-05-professor.pdf', 'application/pdf', 94, 'Kinesis', 'Uso pedagógico interno', 'published', 2),
  ('60000000-0000-4000-8000-000000000061', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000006', 'Caderno do aluno — Aula 6', 'Material integral para acompanhamento e atividades do estudante.', 'document', 'student', '/materials/aula-06-aluno.pdf', 'application/pdf', 77, 'Kinesis', 'Uso pedagógico interno', 'published', 1),
  ('60000000-0000-4000-8000-000000000062', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000006', 'Guia do professor — Aula 6', 'Versão ampliada com encaminhamentos e referências para o professor.', 'document', 'teacher', '/materials/aula-06-professor.pdf', 'application/pdf', 88, 'Kinesis', 'Uso pedagógico interno', 'published', 2);
