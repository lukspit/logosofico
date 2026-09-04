# Plataforma Kinesis · Colégio Logosófico

Primeira versão SLC do ambiente pedagógico do Colégio Logosófico González Pecotche. A plataforma organiza as aulas Kinesis, oferece experiências específicas para cada público e preserva a memória pedagógica construída pela escola.

## O que já está incluído

- Dashboard do professor e percurso completo das seis aulas do 5º ano.
- Página de aula com visão do professor, experiência do aluno, materiais e contribuições pedagógicas persistidas no Supabase.
- Mesa de Preparação livre por professor e aula, com autosave, links, anexos privados, materiais oficiais e assistente contextual no mesmo espaço.
- Biblioteca centralizada com os 12 PDFs reais enviados pelo colégio.
- Leitor Kinesis interno com navegação por blocos, página direta, zoom, busca integral, referências clicáveis e carregamento progressivo.
- Visões próprias para turma, família, agenda e diretoria.
- Autenticação Supabase SSR com cookies e proteção no Proxy do Next.js.
- Papéis `student`, `teacher`, `family`, `editor`, `director` e `admin`.
- RLS em todas as tabelas públicas e políticas de Storage por organização/papel.
- Assistente pedagógico opcional via OpenRouter, limitado ao contexto aprovado.
- Apresentação comercial navegável em `/apresentacao`, com atalho para a demonstração.
- Modo demonstração local quando as variáveis do Supabase ainda não foram configuradas.

## Stack

- Next.js 16.3.3, React 19.2.8 e TypeScript 5.9.
- Tailwind CSS 4 e componentes shadcn/ui sobre Radix.
- Supabase Postgres, Auth e Storage.
- OpenRouter SDK para a camada opcional de IA.

## Rodar localmente

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

Copie `.env.example` para `.env.local` e preencha:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` para o primeiro administrador e fluxos administrativos no servidor
- `OPENROUTER_API_KEY` para habilitar o assistente
- `OPENROUTER_MODEL` para escolher o modelo do assistente
- `NEXT_PUBLIC_SITE_URL` com a URL pública da aplicação

Nunca use uma secret key em variáveis `NEXT_PUBLIC_*`.

## Publicar na Vercel

1. Importe este repositório como um projeto Next.js.
2. Cadastre as variáveis de `.env.example` em **Settings → Environment Variables**.
3. Aplique as migrations de `supabase/migrations` no projeto Supabase, na ordem dos arquivos.
4. Em **Supabase → Authentication → URL Configuration**, configure a URL do site com o domínio da Vercel e adicione o mesmo domínio à lista de redirects.
5. Faça o primeiro deploy e abra `/configurar` uma única vez para criar o administrador inicial, se o projeto Auth ainda não tiver usuários.
6. A apresentação fica disponível publicamente em `/apresentacao`; o restante da plataforma exige login quando o Supabase está configurado.

Os 12 PDFs usados pela aplicação ficam em `content/materials` com nomes canônicos `aula-*.pdf`. Cópias locais com os nomes originais não são versionadas para evitar duplicar o pacote do deploy.

## Banco de dados

O repositório inclui as migrations em `supabase/migrations`:

1. Schema, funções auxiliares, RLS e buckets.
2. Currículo inicial do 5º ano com seis aulas e 12 recursos.
3. Otimizações de políticas e índices.
4. Rotas privadas dos materiais locais.

A migration `20260902203321_teacher_preparation_workspace.sql` adiciona a Mesa de Preparação, seus anexos privados, índices e políticas RLS. Ela deve ser aplicada ao projeto remoto antes de validar o autosave no Supabase.

O banco não contém usuários de demonstração. Depois de criar o primeiro usuário em Supabase Auth, vincule-o à organização em `memberships` com o papel `director` ou `admin` para iniciar a gestão real de acessos.

## Segurança dos materiais

Os PDFs não ficam em `public/`. Em desenvolvimento são entregues pela rota autenticada `/materiais/[filename]`, que verifica o vínculo e impede alunos/famílias de abrir o guia do professor. O bucket privado `lesson-materials` já está preparado para a migração dos arquivos no ambiente publicado.

## Verificação

```bash
pnpm lint
pnpm build
```

O endpoint `/api/health` pode ser usado pela Vercel para uma checagem simples de disponibilidade.
