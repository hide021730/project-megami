begin;

-- テスト登録による重複を、一括整理する(一度きりのメンテナンス用SQL)。
-- 同じ名前(正規化して比較)の中で、一番古い登録(created_at最小)だけを残し、
-- それ以外を削除する。削除は元に戻せないため、rollbackファイルは用意していない。

with ranked as (
  select
    guest_id,
    row_number() over (
      partition by lower(btrim(normalize(username, NFKC)))
      order by created_at asc
    ) as rn
  from public.season_entries
)
delete from public.season_entries
where guest_id in (select guest_id from ranked where rn > 1);

commit;
