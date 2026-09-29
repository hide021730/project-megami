begin;

-- ランキング表示用。勝ち数は表に出し、負け数・勝率そのものは見せず、
-- 並び順だけ「隠れた勝率」で決める(勝率が高い人が上位)。
-- 結果が確定していない試合(status<>'final')は集計に含めない。
create or replace function public.get_megami_ranking()
returns table (
  guest_id text,
  nickname text,
  win_count bigint,
  checked_in_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    c.guest_id,
    -- 同じ端末で途中にニックネームを変えた場合は直近の名前を使う。
    (array_agg(c.nickname order by c.created_at desc))[1] as nickname,
    count(*) filter (where g.winner_team_id = c.supported_team_id) as win_count,
    count(*) as checked_in_count
  from public.checkins c
  join public.cs_games g on g.id = c.game_id
  where g.status = 'final'
  group by c.guest_id
  having count(*) filter (where g.winner_team_id = c.supported_team_id) > 0
  order by
    (count(*) filter (where g.winner_team_id = c.supported_team_id))::float
      / nullif(count(*), 0) desc,
    win_count desc;
$$;

grant execute on function public.get_megami_ranking() to anon, authenticated;

commit;
