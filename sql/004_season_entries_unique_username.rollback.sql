begin;

-- 重複チェック無しの元の関数に戻す
create or replace function public.submit_season_entry(
  p_guest_id text,
  p_team_id smallint,
  p_username text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_key text;
begin
  if p_guest_id is null or length(trim(p_guest_id)) = 0 then
    return 'invalid_chars';
  end if;

  if not exists (select 1 from public.teams where id = p_team_id) then
    return 'invalid_team';
  end if;

  v_name := btrim(coalesce(p_username, ''), E' \t　');

  if v_name ~ '[[:cntrl:]]' then
    return 'invalid_chars';
  end if;

  if char_length(v_name) < 1 or char_length(v_name) > 20 then
    return 'invalid_length';
  end if;

  v_key := lower(btrim(normalize(v_name, NFKC)));

  if v_key in ('運営', '公式', 'メシピタ', 'つくる', 'ゲスト', '名無しさん', 'ユーザー')
     or v_key like '%運営%'
     or v_key like '%公式%'
     or v_key like '%管理者%'
     or v_key like '%管理人%'
     or v_key like '%admin%'
     or v_key like '%official%'
     or v_key like '%moderator%' then
    return 'reserved';
  end if;

  insert into public.season_entries (guest_id, team_id, username)
  values (p_guest_id, p_team_id, v_name)
  on conflict (guest_id) do update
    set team_id = excluded.team_id,
        username = excluded.username,
        updated_at = now();

  return 'ok';
end;
$$;

alter table public.season_entries
  drop constraint if exists season_entries_username_key_key;

alter table public.season_entries
  drop column if exists username_key;

commit;
