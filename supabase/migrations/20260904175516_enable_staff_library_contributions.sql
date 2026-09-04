revoke all on table public.resources from anon, authenticated;
grant select, insert, update, delete on table public.resources to authenticated;

drop policy if exists resources_select on public.resources;
create policy resources_select
on public.resources for select
to authenticated
using (
  private.is_org_member(organization_id)
  and (
    (
      status = 'published'
      and (
        audience = 'all'
        or (
          audience = 'student'
          and private.has_org_role(
            organization_id,
            array['student','teacher','editor','director','admin']::public.app_role[]
          )
        )
        or (
          audience = 'family'
          and private.has_org_role(
            organization_id,
            array['family','teacher','director','admin']::public.app_role[]
          )
        )
        or (
          audience in ('teacher', 'staff')
          and private.has_org_role(
            organization_id,
            array['teacher','editor','director','admin']::public.app_role[]
          )
        )
      )
    )
    or (
      status in ('draft', 'review')
      and private.has_org_role(
        organization_id,
        array['teacher','editor','director','admin']::public.app_role[]
      )
    )
  )
);

drop policy if exists resources_insert on public.resources;
create policy resources_insert
on public.resources for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and private.has_org_role(
    organization_id,
    array['teacher','editor','director','admin']::public.app_role[]
  )
);

drop policy if exists resources_update on public.resources;
create policy resources_update
on public.resources for update
to authenticated
using (
  created_by = (select auth.uid())
  or private.has_org_role(
    organization_id,
    array['editor','director','admin']::public.app_role[]
  )
)
with check (
  created_by = (select auth.uid())
  or private.has_org_role(
    organization_id,
    array['editor','director','admin']::public.app_role[]
  )
);

drop policy if exists resources_delete on public.resources;
create policy resources_delete
on public.resources for delete
to authenticated
using (
  created_by = (select auth.uid())
  or private.has_org_role(
    organization_id,
    array['editor','director','admin']::public.app_role[]
  )
);
