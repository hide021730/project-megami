begin;

-- ユーザー名の重複を防ぐ。つくる。本体のusernames設計と同じ考え方
-- (全角/半角・大文字/小文字・前後の空白を同一視した正規化キーに、一意制約)。

alter table public.season_entries
  add column if not exists username_key text;

update public.season_entries
  set username_key = lower(btrim(normalize(username, NFKC)))
  where username_key is null;

alter table public.season_entries
  alter column username_key set not null;

alter table public.season_entries
  add constraint season_entries_username_key_key unique (username_key);

-- submit_season_entryを、重複チェック付きに差し替える。
-- 既存の自分の行(同じguest_id)の名前を、そのまま再送しても、'taken'にはならない。
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

  if v_key = '' then
    return 'invalid_length';
  end if;

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

  if exists (
    select 1 from public.season_entries
    where username_key = v_key and guest_id <> p_guest_id
  ) then
    return 'taken';
  end if;

  insert into public.season_entries (guest_id, team_id, username, username_key)
  values (p_guest_id, p_team_id, v_name, v_key)
  on conflict (guest_id) do update
    set team_id = excluded.team_id,
        username = excluded.username,
        username_key = excluded.username_key,
        updated_at = now();

  return 'ok';
end;
$$;

commit;
