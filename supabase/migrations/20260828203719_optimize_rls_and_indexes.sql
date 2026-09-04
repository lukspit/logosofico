create index announcements_created_by_idx on public.announcements (created_by) where created_by is not null;
create index curricula_created_by_idx on public.curricula (created_by) where created_by is not null;
create index curricula_grade_level_idx on public.curricula (grade_level_id);
create index guardian_students_org_idx on public.guardian_students (organization_id);
create index lesson_progress_last_section_idx on public.lesson_progress (last_section_id) where last_section_id is not null;
create index lesson_subjects_subject_idx on public.lesson_subjects (subject_id);
create index lessons_created_by_idx on public.lessons (created_by) where created_by is not null;
create index lessons_updated_by_idx on public.lessons (updated_by) where updated_by is not null;
create index pedagogical_notes_author_idx on public.pedagogical_notes (author_id);
create index pedagogical_notes_org_idx on public.pedagogical_notes (organization_id);
create index resources_created_by_idx on public.resources (created_by) where created_by is not null;
create index resources_reviewed_by_idx on public.resources (reviewed_by) where reviewed_by is not null;
create index school_classes_grade_level_idx on public.school_classes (grade_level_id);
create index school_events_class_idx on public.school_events (class_id) where class_id is not null;
create index school_events_created_by_idx on public.school_events (created_by) where created_by is not null;

drop policy memberships_manage on public.memberships;
create policy memberships_insert on public.memberships for insert to authenticated with check (private.has_org_role(organization_id, array['director','admin']::public.app_role[]));
create policy memberships_update on public.memberships for update to authenticated using (private.has_org_role(organization_id, array['director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['director','admin']::public.app_role[]));
create policy memberships_delete on public.memberships for delete to authenticated using (private.has_org_role(organization_id, array['director','admin']::public.app_role[]));

drop policy grade_levels_manage on public.grade_levels;
create policy grade_levels_insert on public.grade_levels for insert to authenticated with check (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[]));
create policy grade_levels_update on public.grade_levels for update to authenticated using (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[]));
create policy grade_levels_delete on public.grade_levels for delete to authenticated using (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[]));

drop policy school_classes_manage on public.school_classes;
create policy school_classes_insert on public.school_classes for insert to authenticated with check (private.has_org_role(organization_id, array['teacher','director','admin']::public.app_role[]));
create policy school_classes_update on public.school_classes for update to authenticated using (private.has_org_role(organization_id, array['teacher','director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['teacher','director','admin']::public.app_role[]));
create policy school_classes_delete on public.school_classes for delete to authenticated using (private.has_org_role(organization_id, array['director','admin']::public.app_role[]));

drop policy class_members_manage on public.class_members;
create policy class_members_insert on public.class_members for insert to authenticated with check (exists (select 1 from public.school_classes c where c.id = class_id and private.has_org_role(c.organization_id, array['teacher','director','admin']::public.app_role[])));
create policy class_members_update on public.class_members for update to authenticated using (exists (select 1 from public.school_classes c where c.id = class_id and private.has_org_role(c.organization_id, array['teacher','director','admin']::public.app_role[]))) with check (exists (select 1 from public.school_classes c where c.id = class_id and private.has_org_role(c.organization_id, array['teacher','director','admin']::public.app_role[])));
create policy class_members_delete on public.class_members for delete to authenticated using (exists (select 1 from public.school_classes c where c.id = class_id and private.has_org_role(c.organization_id, array['teacher','director','admin']::public.app_role[])));

drop policy guardian_students_manage on public.guardian_students;
create policy guardian_students_insert on public.guardian_students for insert to authenticated with check (private.has_org_role(organization_id, array['director','admin']::public.app_role[]));
create policy guardian_students_update on public.guardian_students for update to authenticated using (private.has_org_role(organization_id, array['director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['director','admin']::public.app_role[]));
create policy guardian_students_delete on public.guardian_students for delete to authenticated using (private.has_org_role(organization_id, array['director','admin']::public.app_role[]));

drop policy subjects_manage on public.subjects;
create policy subjects_insert on public.subjects for insert to authenticated with check (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[]));
create policy subjects_update on public.subjects for update to authenticated using (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[]));
create policy subjects_delete on public.subjects for delete to authenticated using (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[]));

drop policy curricula_manage on public.curricula;
create policy curricula_insert on public.curricula for insert to authenticated with check (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[]));
create policy curricula_update on public.curricula for update to authenticated using (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[]));
create policy curricula_delete on public.curricula for delete to authenticated using (private.has_org_role(organization_id, array['director','admin']::public.app_role[]));

drop policy lessons_manage on public.lessons;
create policy lessons_insert on public.lessons for insert to authenticated with check (private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[]));
create policy lessons_update on public.lessons for update to authenticated using (private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[]));
create policy lessons_delete on public.lessons for delete to authenticated using (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[]));

drop policy lesson_subjects_manage on public.lesson_subjects;
create policy lesson_subjects_insert on public.lesson_subjects for insert to authenticated with check (exists (select 1 from public.lessons l where l.id = lesson_id and private.has_org_role(l.organization_id, array['teacher','editor','director','admin']::public.app_role[])));
create policy lesson_subjects_update on public.lesson_subjects for update to authenticated using (exists (select 1 from public.lessons l where l.id = lesson_id and private.has_org_role(l.organization_id, array['teacher','editor','director','admin']::public.app_role[]))) with check (exists (select 1 from public.lessons l where l.id = lesson_id and private.has_org_role(l.organization_id, array['teacher','editor','director','admin']::public.app_role[])));
create policy lesson_subjects_delete on public.lesson_subjects for delete to authenticated using (exists (select 1 from public.lessons l where l.id = lesson_id and private.has_org_role(l.organization_id, array['teacher','editor','director','admin']::public.app_role[])));

drop policy lesson_sections_manage on public.lesson_sections;
create policy lesson_sections_insert on public.lesson_sections for insert to authenticated with check (exists (select 1 from public.lessons l where l.id = lesson_id and private.has_org_role(l.organization_id, array['teacher','editor','director','admin']::public.app_role[])));
create policy lesson_sections_update on public.lesson_sections for update to authenticated using (exists (select 1 from public.lessons l where l.id = lesson_id and private.has_org_role(l.organization_id, array['teacher','editor','director','admin']::public.app_role[]))) with check (exists (select 1 from public.lessons l where l.id = lesson_id and private.has_org_role(l.organization_id, array['teacher','editor','director','admin']::public.app_role[])));
create policy lesson_sections_delete on public.lesson_sections for delete to authenticated using (exists (select 1 from public.lessons l where l.id = lesson_id and private.has_org_role(l.organization_id, array['editor','director','admin']::public.app_role[])));

drop policy resources_manage on public.resources;
create policy resources_insert on public.resources for insert to authenticated with check (private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[]));
create policy resources_update on public.resources for update to authenticated using (private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[]));
create policy resources_delete on public.resources for delete to authenticated using (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[]));

drop policy announcements_manage on public.announcements;
create policy announcements_insert on public.announcements for insert to authenticated with check (private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[]));
create policy announcements_update on public.announcements for update to authenticated using (private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['teacher','editor','director','admin']::public.app_role[]));
create policy announcements_delete on public.announcements for delete to authenticated using (private.has_org_role(organization_id, array['editor','director','admin']::public.app_role[]));

drop policy school_events_manage on public.school_events;
create policy school_events_insert on public.school_events for insert to authenticated with check (private.has_org_role(organization_id, array['teacher','director','admin']::public.app_role[]));
create policy school_events_update on public.school_events for update to authenticated using (private.has_org_role(organization_id, array['teacher','director','admin']::public.app_role[])) with check (private.has_org_role(organization_id, array['teacher','director','admin']::public.app_role[]));
create policy school_events_delete on public.school_events for delete to authenticated using (private.has_org_role(organization_id, array['director','admin']::public.app_role[]));
