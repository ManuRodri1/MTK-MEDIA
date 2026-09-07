create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to authenticated;

create or replace function private.is_mtk_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('admin', 'editor')
  );
$$;

revoke all on function private.is_mtk_staff() from public;
revoke all on function private.is_mtk_staff() from anon;
grant execute on function private.is_mtk_staff() to authenticated;

-- Profiles may be read by their owner, but staff roles are not self-editable.
drop policy if exists profiles_update_own on public.profiles;

-- Clients
drop policy if exists clients_public_read on public.clients;
create policy clients_public_read
on public.clients for select to anon
using (is_active = true);

drop policy if exists clients_staff_read on public.clients;
drop policy if exists clients_staff_insert on public.clients;
drop policy if exists clients_staff_update on public.clients;
drop policy if exists clients_staff_delete on public.clients;

create policy clients_staff_read
on public.clients for select to authenticated
using ((select private.is_mtk_staff()));

create policy clients_staff_insert
on public.clients for insert to authenticated
with check ((select private.is_mtk_staff()));

create policy clients_staff_update
on public.clients for update to authenticated
using ((select private.is_mtk_staff()))
with check ((select private.is_mtk_staff()));

create policy clients_staff_delete
on public.clients for delete to authenticated
using ((select private.is_mtk_staff()));

-- Services
drop policy if exists services_public_read on public.services;
create policy services_public_read
on public.services for select to anon
using (is_active = true);

drop policy if exists services_staff_read on public.services;
drop policy if exists services_staff_insert on public.services;
drop policy if exists services_staff_update on public.services;
drop policy if exists services_staff_delete on public.services;

create policy services_staff_read
on public.services for select to authenticated
using ((select private.is_mtk_staff()));

create policy services_staff_insert
on public.services for insert to authenticated
with check ((select private.is_mtk_staff()));

create policy services_staff_update
on public.services for update to authenticated
using ((select private.is_mtk_staff()))
with check ((select private.is_mtk_staff()));

create policy services_staff_delete
on public.services for delete to authenticated
using ((select private.is_mtk_staff()));

-- Projects
drop policy if exists projects_staff_read on public.projects;
drop policy if exists projects_staff_insert on public.projects;
drop policy if exists projects_staff_update on public.projects;
drop policy if exists projects_staff_delete on public.projects;

create policy projects_staff_read
on public.projects for select to authenticated
using ((select private.is_mtk_staff()));

create policy projects_staff_insert
on public.projects for insert to authenticated
with check ((select private.is_mtk_staff()));

create policy projects_staff_update
on public.projects for update to authenticated
using ((select private.is_mtk_staff()))
with check ((select private.is_mtk_staff()));

create policy projects_staff_delete
on public.projects for delete to authenticated
using ((select private.is_mtk_staff()));

-- Project/service relationships are replaced through delete + insert.
drop policy if exists project_services_staff_read on public.project_services;
drop policy if exists project_services_staff_insert on public.project_services;
drop policy if exists project_services_staff_delete on public.project_services;

create policy project_services_staff_read
on public.project_services for select to authenticated
using ((select private.is_mtk_staff()));

create policy project_services_staff_insert
on public.project_services for insert to authenticated
with check ((select private.is_mtk_staff()));

create policy project_services_staff_delete
on public.project_services for delete to authenticated
using ((select private.is_mtk_staff()));

-- Gate 0 and the future media manager use the same staff authorization boundary.
drop policy if exists project_media_staff_read on public.project_media;
drop policy if exists project_media_staff_insert on public.project_media;
drop policy if exists project_media_staff_update on public.project_media;
drop policy if exists project_media_staff_delete on public.project_media;

create policy project_media_staff_read
on public.project_media for select to authenticated
using ((select private.is_mtk_staff()));

create policy project_media_staff_insert
on public.project_media for insert to authenticated
with check ((select private.is_mtk_staff()));

create policy project_media_staff_update
on public.project_media for update to authenticated
using ((select private.is_mtk_staff()))
with check ((select private.is_mtk_staff()));

create policy project_media_staff_delete
on public.project_media for delete to authenticated
using ((select private.is_mtk_staff()));
