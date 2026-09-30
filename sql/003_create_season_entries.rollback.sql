begin;

drop function if exists public.get_season_entry_total();
drop function if exists public.get_season_entry_counts();
drop function if exists public.get_my_season_entry(text);
drop function if exists public.submit_season_entry(text, smallint, text);
drop table if exists public.season_entries;

commit;
