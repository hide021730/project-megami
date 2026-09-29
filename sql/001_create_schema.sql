begin;

-- 「勝利の女神をさがせ！」CS(クライマックスシリーズ)版・最小構成。
-- 賞品なし・ログインなし(ブラウザごとのguest_idのみ)の需要検証テストのため、
-- ユーザーアカウントは持たず、チェックインは自己申告(GPS・チケット照合なし)。
-- 試合の勝敗はヒデが公式結果を見て手動でcs_games.winner_team_idに入れる想定。

create table if not exists public.teams (
  id smallint primary key,
  name text not null,
  league text not null check (league in ('central', 'pacific'))
);

-- 12球団を最初から入れておく(CSの実際の対戦カードは、レギュラーシーズン終了後に確定するため
-- cs_gamesは later に別途投入する)。
insert into public.teams (id, name, league) values
  (1, '読売ジャイアンツ', 'central'),
  (2, '阪神タイガース', 'central'),
  (3, '広島東洋カープ', 'central'),
  (4, '横浜DeNAベイスターズ', 'central'),
  (5, '東京ヤクルトスワローズ', 'central'),
  (6, '中日ドラゴンズ', 'central'),
  (7, '福岡ソフトバンクホークス', 'pacific'),
  (8, '北海道日本ハムファイターズ', 'pacific'),
  (9, 'オリックス・バファローズ', 'pacific'),
  (10, '千葉ロッテマリーンズ', 'pacific'),
  (11, '埼玉西武ライオンズ', 'pacific'),
  (12, '東北楽天ゴールデンイーグルス', 'pacific')
on conflict (id) do nothing;

create table if not exists public.cs_games (
  id uuid primary key default gen_random_uuid(),
  league text not null check (league in ('central', 'pacific')),
  stage text not null check (stage in ('first', 'final')),
  game_number smallint not null,
  home_team_id smallint not null references public.teams(id),
  away_team_id smallint not null references public.teams(id),
  scheduled_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'final', 'cancelled')),
  winner_team_id smallint references public.teams(id),
  created_at timestamptz not null default now()
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.cs_games(id) on delete cascade,
  guest_id text not null,
  nickname text not null,
  supported_team_id smallint not null references public.teams(id),
  created_at timestamptz not null default now(),
  -- 同じ端末(guest_id)から同じ試合への重複チェックインを防ぐ。
  -- localStorageを消せば回避できるが、賞品なしの検証段階では割り切る。
  constraint checkins_game_guest_key unique (game_id, guest_id)
);

create index if not exists checkins_guest_idx on public.checkins (guest_id);

alter table public.teams enable row level security;
alter table public.cs_games enable row level security;
alter table public.checkins enable row level security;

-- teams・cs_gamesは誰でも閲覧可能。書き込みはSQL Editorからヒデが直接行うので
-- ポリシーは用意しない(=anon/authenticatedからの書き込みは拒否される)。
drop policy if exists "teams_select_all" on public.teams;
create policy "teams_select_all" on public.teams for select to anon, authenticated using (true);

drop policy if exists "cs_games_select_all" on public.cs_games;
create policy "cs_games_select_all" on public.cs_games for select to anon, authenticated using (true);

-- チェックインは誰でも読み書き可能(ログイン不要の検証版のため)。
drop policy if exists "checkins_select_all" on public.checkins;
create policy "checkins_select_all" on public.checkins for select to anon, authenticated using (true);

drop policy if exists "checkins_insert_all" on public.checkins;
create policy "checkins_insert_all" on public.checkins for insert to anon, authenticated with check (true);

commit;
