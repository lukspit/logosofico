create extension if not exists pgcrypto;

create type public.app_role as enum ('student', 'teacher', 'family', 'editor', 'director', 'admin');
create type public.audience_type as enum ('all', 'student', 'teacher', 'family', 'staff');
create type public.publication_status as enum ('draft', 'review', 'published', 'archived');
create type public.resource_type as enum ('document', 'video', 'link', 'audio', 'image', 'printable', 'activity');
create type public.progress_status as enum ('not_started', 'in_progress', 'completed');
create type public.note_visibility as enum ('staff', 'all_members');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  timezone text not null default 'America/Sao_Paulo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  preferred_name text,
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id, role)
);

create table public.grade_levels (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  code text not null,
  position smallint not null,
  created_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table public.school_classes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  grade_level_id uuid not null references public.grade_levels(id) on delete restrict,
  name text not null,
  academic_year smallint not null check (academic_year between 2020 and 2100),
  shift text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, academic_year, name)
);

create table public.class_members (
  class_id uuid not null references public.school_classes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null check (role in ('student', 'teacher')),
  joined_at timestamptz not null default now(),
  primary key (class_id, user_id, role)
);

create table public.guardian_students (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  guardian_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  relationship text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (guardian_id, student_id)
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  color text not null default '#17767a',
  created_at timestamptz not null default now(),
  unique (organization_id, name)
);

create table public.curricula (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  grade_level_id uuid not null references public.grade_levels(id) on delete restrict,
  title text not null,
  academic_year smallint not null,
  description text,
  status public.publication_status not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, grade_level_id, academic_year)
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  curriculum_id uuid not null references public.curricula(id) on delete cascade,
  number smallint not null check (number > 0),
  slug text not null,
  title text not null,
  summary text,
  essential_question text,
  teacher_overview text,
  student_overview text,
  estimated_minutes integer check (estimated_minutes is null or estimated_minutes > 0),
  status public.publication_status not null default 'draft',
  cover_color text not null default '#08366f',
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (curriculum_id, number),
  unique (organization_id, slug)
);

create table public.lesson_subjects (
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  position smallint not null default 0,
  primary key (lesson_id, subject_id)
);

create table public.lesson_sections (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  body jsonb not null default '{}'::jsonb,
  audience public.audience_type not null default 'all',
  section_type text not null default 'content',
  position integer not null default 0,
  status public.publication_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  title text not null,
  description text,
  resource_type public.resource_type not null,
  audience public.audience_type not null default 'all',
  external_url text,
  storage_path text,
  mime_type text,
  page_count integer check (page_count is null or page_count > 0),
  source_name text,
  copyright_notes text,
  status public.publication_status not null default 'review',
  position integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (external_url is not null or storage_path is not null)
);

create table public.lesson_progress (
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.progress_status not null default 'not_started',
  progress_percent smallint not null default 0 check (progress_percent between 0 and 100),
  last_section_id uuid references public.lesson_sections(id) on delete set null,
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (lesson_id, user_id)
);

create table public.pedagogical_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  visibility public.note_visibility not null default 'staff',
  is_highlighted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  body text not null,
  audience public.audience_type not null default 'all',
  published_at timestamptz,
  expires_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.school_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  class_id uuid references public.school_classes(id) on delete cascade,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  audience public.audience_type not null default 'all',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at >= starts_at)
);

create index memberships_user_org_idx on public.memberships (user_id, organization_id) where is_active;
create index class_members_user_idx on public.class_members (user_id, class_id);
create index guardian_students_student_idx on public.guardian_students (student_id, guardian_id);
create index lessons_curriculum_position_idx on public.lessons (curriculum_id, number) where status <> 'archived';
create index lessons_org_status_idx on public.lessons (organization_id, status);
create index lesson_sections_lesson_position_idx on public.lesson_sections (lesson_id, position);
create index resources_lesson_position_idx on public.resources (lesson_id, position) where status <> 'archived';
create index resources_org_type_idx on public.resources (organization_id, resource_type);
create index lesson_progress_user_idx on public.lesson_progress (user_id, updated_at desc);
create index pedagogical_notes_lesson_idx on public.pedagogical_notes (lesson_id, created_at desc);
create index announcements_org_published_idx on public.announcements (organization_id, published_at desc);
create index school_events_org_starts_idx on public.school_events (organization_id, starts_at);

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_org_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.memberships m
    where m.organization_id = target_organization_id
      and m.user_id = (select auth.uid())
      and m.is_active
  );
$$;

create or replace function private.has_org_role(target_organization_id uuid, allowed_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.memberships m
    where m.organization_id = target_organization_id
      and m.user_id = (select auth.uid())
      and m.role = any(allowed_roles)
      and m.is_active
  );
$$;

create or replace function private.shares_org(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships mine
    join public.memberships theirs on theirs.organization_id = mine.organization_id
    where mine.user_id = (select auth.uid())
      and theirs.user_id = target_user_id
      and mine.is_active and theirs.is_active
  );
$$;

revoke all on function private.is_org_member(uuid) from public;
revoke all on function private.has_org_role(uuid, public.app_role[]) from public;
revoke all on function private.shares_org(uuid) from public;
grant execute on function private.is_org_member(uuid) to authenticated;
grant execute on function private.has_org_role(uuid, public.app_role[]) to authenticated;
grant execute on function private.shares_org(uuid) to authenticated;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, preferred_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'preferred_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

revoke all on function private.handle_new_user() from public;

create trigger on_auth_user_created after insert on auth.users
for each row execute function private.handle_new_user();

create trigger organizations_updated_at before update on public.organizations for each row execute function private.set_updated_at();
create trigger profiles_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger curricula_updated_at before update on public.curricula for each row execute function private.set_updated_at();
create trigger lessons_updated_at before update on public.lessons for each row execute function private.set_updated_at();
create trigger lesson_sections_updated_at before update on public.lesson_sections for each row execute function private.set_updated_at();
create trigger resources_updated_at before update on public.resources for each row execute function private.set_updated_at();
create trigger lesson_progress_updated_at before update on public.lesson_progress for each row execute function private.set_updated_at();
create trigger pedagogical_notes_updated_at before update on public.pedagogical_notes for each row execute function private.set_updated_at();

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.grade_levels enable row level security;
alter table public.school_classes enable row level security;
alter table public.class_members enable row level security;
alter table public.guardian_students enable row level security;
alter table public.subjects enable row level security;
alter table public.curricula enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_subjects enable row level security;
alter table public.lesson_sections enable row level security;
alter table public.resources enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.pedagogical_notes enable row level security;
alter table public.announcements enable row level security;
alter table public.school_events enable row level security;

create policy organizations_select on public.organizations for select to authenticated using (private.is_org_member(id));
create policy organizations_manage on public.organizations for update to authenticated using (private.has_org_role(id, array['director','admin']::public.app_role[])) with check (private.has_org_role(id, array['director','admin']::public.app_role[]));

create policy profiles_select on public.profiles for select to authenticated using ((select auth.uid()) = id or private.shares_org(id));
create policy profiles_insert_own on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
create policy profiles_update_own on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy memberships_select on public.memberships for select to authenticated using (private.is_org_member(organization_id));
create policy memberships_manage on public.memberships for all to authenticated using (private.has_org_role(organization_id, array['director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['director','admin']::public.app_role[]));

create policy grade_levels_select on public.grade_levels for select to authenticated using (private.is_org_member(organization_id));
create policy grade_levels_manage on public.grade_levels for all to authenticated using (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[]));

create policy school_classes_select on public.school_classes for select to authenticated using (private.is_org_member(organization_id));
create policy school_classes_manage on public.school_classes for all to authenticated using (private.has_org_role(organization_id, array['teacher','director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['teacher','director','admin']::public.app_role[]));

create policy class_members_select on public.class_members for select to authenticated using (exists (select 1 from public.school_classes c where c.id = class_id and private.is_org_member(c.organization_id)));
create policy class_members_manage on public.class_members for all to authenticated using (exists (select 1 from public.school_classes c where c.id = class_id and private.has_org_role(c.organization_id, array['teacher','director','admin']::public.app_role[]))) with check (exists (select 1 from public.school_classes c where c.id = class_id and private.has_org_role(c.organization_id, array['teacher','director','admin']::public.app_role[])));

create policy guardian_students_select on public.guardian_students for select to authenticated using ((select auth.uid()) in (guardian_id, student_id) or private.has_org_role(organization_id, array['teacher','director','admin']::public.app_role[]));
create policy guardian_students_manage on public.guardian_students for all to authenticated using (private.has_org_role(organization_id, array['director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['director','admin']::public.app_role[]));

create policy subjects_select on public.subjects for select to authenticated using (private.is_org_member(organization_id));
create policy subjects_manage on public.subjects for all to authenticated using (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[]));

create policy curricula_select on public.curricula for select to authenticated using (private.is_org_member(organization_id) and (status = 'published' or private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[])));
create policy curricula_manage on public.curricula for all to authenticated using (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[]));

create policy lessons_select on public.lessons for select to authenticated using (private.is_org_member(organization_id) and (status = 'published' or private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[])));
create policy lessons_manage on public.lessons for all to authenticated using (private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[]));

create policy lesson_subjects_select on public.lesson_subjects for select to authenticated using (exists (select 1 from public.lessons l where l.id = lesson_id and private.is_org_member(l.organization_id)));
create policy lesson_subjects_manage on public.lesson_subjects for all to authenticated using (exists (select 1 from public.lessons l where l.id = lesson_id and private.has_org_role(l.organization_id, array['teacher','editor','director','admin']::public.app_role[]))) with check (exists (select 1 from public.lessons l where l.id = lesson_id and private.has_org_role(l.organization_id, array['teacher','editor','director','admin']::public.app_role[])));

create policy lesson_sections_select on public.lesson_sections for select to authenticated using (exists (select 1 from public.lessons l where l.id = lesson_id and private.is_org_member(l.organization_id) and (audience in ('all','student') or private.has_org_role(l.organization_id, array['teacher','editor','director','admin']::public.app_role[]))));
create policy lesson_sections_manage on public.lesson_sections for all to authenticated using (exists (select 1 from public.lessons l where l.id = lesson_id and private.has_org_role(l.organization_id, array['teacher','editor','director','admin']::public.app_role[]))) with check (exists (select 1 from public.lessons l where l.id = lesson_id and private.has_org_role(l.organization_id, array['teacher','editor','director','admin']::public.app_role[])));

create policy resources_select on public.resources for select to authenticated using (private.is_org_member(organization_id) and status = 'published' and (audience = 'all' or (audience = 'student' and private.has_org_role(organization_id, array['student','teacher','editor','director','admin']::public.app_role[])) or (audience = 'family' and private.has_org_role(organization_id, array['family','teacher','director','admin']::public.app_role[])) or (audience in ('teacher','staff') and private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[]))));
create policy resources_manage on public.resources for all to authenticated using (private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[]));

create policy lesson_progress_select on public.lesson_progress for select to authenticated using ((select auth.uid()) = user_id or exists (select 1 from public.lessons l where l.id = lesson_id and (private.has_org_role(l.organization_id, array['teacher','director','admin']::public.app_role[]) or exists (select 1 from public.guardian_students gs where gs.organization_id = l.organization_id and gs.guardian_id = (select auth.uid()) and gs.student_id = user_id))));
create policy lesson_progress_insert on public.lesson_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy lesson_progress_update on public.lesson_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy pedagogical_notes_select on public.pedagogical_notes for select to authenticated using (private.is_org_member(organization_id) and (visibility = 'all_members' or private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[])));
create policy pedagogical_notes_insert on public.pedagogical_notes for insert to authenticated with check ((select auth.uid()) = author_id and private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[]));
create policy pedagogical_notes_update on public.pedagogical_notes for update to authenticated using ((select auth.uid()) = author_id or private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[])) with check ((select auth.uid()) = author_id or private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[]));
create policy pedagogical_notes_delete on public.pedagogical_notes for delete to authenticated using ((select auth.uid()) = author_id or private.has_org_role(organization_id, array['director','admin']::public.app_role[]));

create policy announcements_select on public.announcements for select to authenticated using (private.is_org_member(organization_id) and published_at is not null and (expires_at is null or expires_at > now()) and (audience = 'all' or (audience = 'student' and private.has_org_role(organization_id, array['student']::public.app_role[])) or (audience = 'family' and private.has_org_role(organization_id, array['family']::public.app_role[])) or (audience in ('teacher','staff') and private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[]))));
create policy announcements_manage on public.announcements for all to authenticated using (private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[]));

create policy school_events_select on public.school_events for select to authenticated using (private.is_org_member(organization_id));
create policy school_events_manage on public.school_events for all to authenticated using (private.has_org_role(organization_id, array['teacher','director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['teacher','director','admin']::public.app_role[]));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('lesson-materials', 'lesson-materials', false, 52428800, array['application/pdf','image/jpeg','image/png','image/webp','video/mp4','audio/mpeg']),
  ('avatars', 'avatars', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy lesson_materials_read on storage.objects for select to authenticated using (bucket_id = 'lesson-materials' and exists (select 1 from public.memberships m where m.user_id = (select auth.uid()) and m.organization_id::text = (storage.foldername(name))[1] and m.is_active));
create policy lesson_materials_insert on storage.objects for insert to authenticated with check (bucket_id = 'lesson-materials' and exists (select 1 from public.memberships m where m.user_id = (select auth.uid()) and m.organization_id::text = (storage.foldername(name))[1] and m.role in ('teacher','editor','director','admin') and m.is_active));
create policy lesson_materials_update on storage.objects for update to authenticated using (bucket_id = 'lesson-materials' and exists (select 1 from public.memberships m where m.user_id = (select auth.uid()) and m.organization_id::text = (storage.foldername(name))[1] and m.role in ('teacher','editor','director','admin') and m.is_active)) with check (bucket_id = 'lesson-materials' and exists (select 1 from public.memberships m where m.user_id = (select auth.uid()) and m.organization_id::text = (storage.foldername(name))[1] and m.role in ('teacher','editor','director','admin') and m.is_active));
create policy lesson_materials_delete on storage.objects for delete to authenticated using (bucket_id = 'lesson-materials' and exists (select 1 from public.memberships m where m.user_id = (select auth.uid()) and m.organization_id::text = (storage.foldername(name))[1] and m.role in ('editor','director','admin') and m.is_active));

create policy avatars_read on storage.objects for select to public using (bucket_id = 'avatars');
create policy avatars_insert on storage.objects for insert to authenticated with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy avatars_update on storage.objects for update to authenticated using (bucket_id = 'avatars' and owner_id = (select auth.uid())::text) with check (bucket_id = 'avatars' and owner_id = (select auth.uid())::text);
create policy avatars_delete on storage.objects for delete to authenticated using (bucket_id = 'avatars' and owner_id = (select auth.uid())::text);

grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
