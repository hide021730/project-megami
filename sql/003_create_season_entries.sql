begin;

-- 「2027年シーズン参加登録」用。中日をはじめ、負けているチームのファンに向けた
-- 事前登録(現時点ではデモ)。CS版のcheckins/cs_gamesとは別の、独立したテーブル。
-- ログインは不要で、ブラウザごとのguest_id(src/lib/guestId.tsと同じ仕組み、
-- CS版とも共通のIDを使う)で1人1件に絞る。

create table if not exists public.season_entries (
  guest_id text primary key,
  team_id smallint not null references public.teams(id),
  username text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.season_entries enable row level security;
revoke all on table public.season_entries from anon, authenticated;

-- 参加者一覧に名前が出ることは、登録画面で本人に明示済み。
-- 読み書きは、下のsubmit_season_entry()経由に統一する(ユーザー名の検証をそこで行うため)。

-- ユーザー名を検証しつつ、参加登録(新規・変更とも)を行う。
-- 結果: ok / reserved(不適切な名前) / invalid_length(1〜20文字でない) /
--       invalid_chars(制御文字を含む) / invalid_team(存在しないチームID)
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

  -- つくる。本体のusernames設計と同じ考え方(完全一致は固有名詞のみ禁止、
  -- なりすまし・運営詐称につながる語は部分一致でも禁止)。
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

-- 自分の登録内容を取得する(ホーム画面用)。
create or replace function public.get_my_season_entry(p_guest_id text)
returns table (
  team_id smallint,
  username text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select team_id, username, created_at
  from public.season_entries
  where guest_id = p_guest_id;
$$;

-- 球団別の参加者数(公開情報として、誰でも見られる)。
create or replace function public.get_season_entry_counts()
returns table (
  team_id smallint,
  entry_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select team_id, count(*) as entry_count
  from public.season_entries
  group by team_id;
$$;

-- 全体の参加者数(参加完了画面用)。
create or replace function public.get_season_entry_total()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select count(*) from public.season_entries;
$$;

revoke all on function public.submit_season_entry(text, smallint, text) from public;
revoke all on function public.get_my_season_entry(text) from public;
revoke all on function public.get_season_entry_counts() from public;
revoke all on function public.get_season_entry_total() from public;
grant execute on function public.submit_season_entry(text, smallint, text) to anon, authenticated;
grant execute on function public.get_my_season_entry(text) to anon, authenticated;
grant execute on function public.get_season_entry_counts() to anon, authenticated;
grant execute on function public.get_season_entry_total() to anon, authenticated;

commit;
