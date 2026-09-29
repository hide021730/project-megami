"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getOrCreateGuestId } from "@/lib/guestId";

type RankingRow = {
  guest_id: string;
  nickname: string;
  win_count: number;
  checked_in_count: number;
};

export default function RankingPage() {
  const [rows, setRows] = useState<RankingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [myGuestId, setMyGuestId] = useState("");

  useEffect(() => {
    setMyGuestId(getOrCreateGuestId());

    supabase
      .rpc("get_megami_ranking")
      .then(({ data, error }) => {
        if (error) {
          console.error("ランキングの取得に失敗しました:", error);
          setErrorMessage("ランキングを読み込めませんでした。時間をおいて再度お試しください。");
          setLoading(false);
          return;
        }

        setRows((data as RankingRow[]) ?? []);
        setLoading(false);
      });
  }, []);

  const myRow = rows.find((row) => row.guest_id === myGuestId);
  const shareText = myRow
    ? `私は「勝利の女神をさがせ！」で${myRow.win_count}勝しました!\n#勝利の女神をさがせ`
    : "「勝利の女神をさがせ！」に挑戦中!\n#勝利の女神をさがせ";
  const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <>
      <div className="navRow">
        <Link href="/">トップに戻る</Link>
        <Link href="/checkin">記録する</Link>
      </div>

      <section className="panel">
        <h2>勝利の女神ランキング</h2>
        <p className="notice">
          応援に行った試合で、勝ち数が多い人ほど上位です。並び順には、勝ち数のほかに、表には出ない情報も使っています。
        </p>

        {loading ? <p className="notice">読み込んでいます...</p> : null}
        {errorMessage ? <p className="errorText">{errorMessage}</p> : null}

        {!loading && !errorMessage && rows.length === 0 ? (
          <p className="notice">まだ、結果が確定した試合がありません。</p>
        ) : null}

        {rows.map((row, index) => (
          <div key={row.guest_id} className="rankRow">
            <span className="rank">{index + 1}</span>
            <span className="name">{row.nickname}</span>
            <span className="wins">{row.win_count}勝</span>
          </div>
        ))}
      </section>

      {myRow ? (
        <a href={shareUrl} target="_blank" rel="noreferrer" className="primaryButton">
          この結果をXでシェアする
        </a>
      ) : null}
    </>
  );
}
