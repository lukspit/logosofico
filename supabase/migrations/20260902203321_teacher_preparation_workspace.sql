create table public.lesson_preparations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Minha preparação' check (char_length(title) between 1 and 160),
  body text not null default '' check (char_length(body) <= 200000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id, author_id)
);

create table public.preparation_attachments (
  id uuid primary key default gen_random_uuid(),
  preparation_id uuid not null references public.lesson_preparations(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  file_name text not null check (char_length(file_name) between 1 and 240),
  storage_path text not null unique,
  mime_type text,
  size_bytes bigint not null check (size_bytes between 1 and 20971520),
  created_at timestamptz not null default now()
);

create index lesson_preparations_author_updated_idx
  on public.lesson_preparations (author_id, updated_at desc);
create index lesson_preparations_lesson_idx
  on public.lesson_preparations (lesson_id);
create index preparation_attachments_preparation_idx
  on public.preparation_attachments (preparation_id, created_at);
create index preparation_attachments_author_idx
  on public.preparation_attachments (author_id);

create trigger lesson_preparations_updated_at
before update on public.lesson_preparations
for each row execute function private.set_updated_at();

alter table public.lesson_preparations enable row level security;
alter table public.preparation_attachments enable row level security;

revoke all on table public.lesson_preparations from anon, authenticated;
revoke all on table public.preparation_attachments from anon, authenticated;
grant select, insert, update, delete on table public.lesson_preparations to authenticated;
grant select, insert, delete on table public.preparation_attachments to authenticated;

create policy lesson_preparations_select_own
on public.lesson_preparations for select
to authenticated
using (
  (select auth.uid()) = author_id
  and private.has_org_role(
    organization_id,
    array['teacher','editor','director','admin']::public.app_role[]
  )
);

create policy lesson_preparations_insert_own
on public.lesson_preparations for insert
to authenticated
with check (
  (select auth.uid()) = author_id
  and private.has_org_role(
    organization_id,
    array['teacher','editor','director','admin']::public.app_role[]
  )
);

create policy lesson_preparations_update_own
on public.lesson_preparations for update
to authenticated
using (
  (select auth.uid()) = author_id
  and private.has_org_role(
    organization_id,
    array['teacher','editor','director','admin']::public.app_role[]
  )
)
with check (
  (select auth.uid()) = author_id
  and private.has_org_role(
    organization_id,
    array['teacher','editor','director','admin']::public.app_role[]
  )
);

create policy lesson_preparations_delete_own
on public.lesson_preparations for delete
to authenticated
using (
  (select auth.uid()) = author_id
  and private.has_org_role(
    organization_id,
    array['teacher','editor','director','admin']::public.app_role[]
  )
);

create policy preparation_attachments_select_own
on public.preparation_attachments for select
to authenticated
using (
  (select auth.uid()) = author_id
  and exists (
    select 1 from public.lesson_preparations preparation
    where preparation.id = preparation_id
      and preparation.author_id = (select auth.uid())
  )
);

create policy preparation_attachments_insert_own
on public.preparation_attachments for insert
to authenticated
with check (
  (select auth.uid()) = author_id
  and exists (
    select 1 from public.lesson_preparations preparation
    where preparation.id = preparation_id
      and preparation.author_id = (select auth.uid())
  )
);

create policy preparation_attachments_delete_own
on public.preparation_attachments for delete
to authenticated
using (
  (select auth.uid()) = author_id
  and exists (
    select 1 from public.lesson_preparations preparation
    where preparation.id = preparation_id
      and preparation.author_id = (select auth.uid())
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'preparation-files',
  'preparation-files',
  false,
  20971520,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy preparation_files_select_own
on storage.objects for select
to authenticated
using (
  bucket_id = 'preparation-files'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy preparation_files_insert_own
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'preparation-files'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.lesson_preparations preparation
    where preparation.id::text = (storage.foldername(name))[2]
      and preparation.author_id = (select auth.uid())
  )
);

create policy preparation_files_delete_own
on storage.objects for delete
to authenticated
using (
  bucket_id = 'preparation-files'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
