create unique index if not exists project_media_one_hero_per_project
  on public.project_media (project_id)
  where media_role = 'hero';

create or replace function public.reorder_project_media(
  p_project_id uuid,
  p_media_ids uuid[]
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  expected_count integer;
begin
  if not private.is_mtk_staff() then
    raise exception 'MTK staff access required' using errcode = '42501';
  end if;

  if cardinality(p_media_ids) is distinct from (
    select count(distinct media_id)
    from unnest(p_media_ids) as media_id
  ) then
    raise exception 'Media order contains duplicate IDs' using errcode = '22023';
  end if;

  select count(*) into expected_count
  from public.project_media
  where project_id = p_project_id;

  if expected_count <> cardinality(p_media_ids)
    or exists (
      select 1
      from unnest(p_media_ids) as requested(media_id)
      left join public.project_media pm
        on pm.id = requested.media_id and pm.project_id = p_project_id
      where pm.id is null
    ) then
    raise exception 'Media order must contain every project asset exactly once' using errcode = '22023';
  end if;

  update public.project_media pm
  set sort_order = ordered.position - 1,
      updated_at = now()
  from unnest(p_media_ids) with ordinality as ordered(media_id, position)
  where pm.id = ordered.media_id
    and pm.project_id = p_project_id;
end;
$$;

create or replace function public.set_project_media_cover(
  p_project_id uuid,
  p_media_id uuid
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not private.is_mtk_staff() then
    raise exception 'MTK staff access required' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.project_media
    where id = p_media_id
      and project_id = p_project_id
      and processing_status = 'ready'
  ) then
    raise exception 'Ready media asset not found in project' using errcode = 'P0002';
  end if;

  update public.project_media
  set is_cover = (id = p_media_id),
      updated_at = now()
  where project_id = p_project_id
    and is_cover is distinct from (id = p_media_id);
end;
$$;

create or replace function public.set_project_media_hero(
  p_project_id uuid,
  p_media_id uuid
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not private.is_mtk_staff() then
    raise exception 'MTK staff access required' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.project_media
    where id = p_media_id
      and project_id = p_project_id
      and processing_status = 'ready'
  ) then
    raise exception 'Ready media asset not found in project' using errcode = 'P0002';
  end if;

  update public.project_media
  set media_role = case
        when id = p_media_id then 'hero'
        when media_role = 'hero' then 'gallery'
        else media_role
      end,
      updated_at = now()
  where project_id = p_project_id
    and (id = p_media_id or media_role = 'hero');
end;
$$;

revoke all on function public.reorder_project_media(uuid, uuid[]) from public, anon;
revoke all on function public.set_project_media_cover(uuid, uuid) from public, anon;
revoke all on function public.set_project_media_hero(uuid, uuid) from public, anon;

grant execute on function public.reorder_project_media(uuid, uuid[]) to authenticated;
grant execute on function public.set_project_media_cover(uuid, uuid) to authenticated;
grant execute on function public.set_project_media_hero(uuid, uuid) to authenticated;
