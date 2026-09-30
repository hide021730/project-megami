"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TeamCap } from "@/components/TeamCap";
import { getTeam } from "@/lib/teams";
import { getOrCreateGuestId } from "@/lib/guestId";
import { fetchEntryTotal, fetchMyEntry } from "@/lib/seasonEntry";

export default function SeasonCompletePage() {
  const router = useRouter();
  const [entry, setEntry] = useState<{ teamId: number; username: string } | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    fetchMyEntry(getOrCreateGuestId()).then((result) => {
      if (!active) return;

      if (!result) {
        router.replace("/2027");
        return;
      }

      setEntry(result);
    });

    fetchEntryTotal().then((count) => {
      if (active) setTotal(count);
    });

    return () => {
      active = false;
    };
  }, [router]);

  if (!entry) {
    return (
      <section className="panel">
        <p className="notice">読み込んでいます...</p>
      </section>
    );
  }

  const team = getTeam(entry.teamId);

  return (
    <section className="panel">
      <div className="completeCard">
        <span className="confetti">🎉</span>
        <h1>エントリー完了!</h1>
      </div>

      <div className="confirmCard">
        {team ? <TeamCap team={team} size={44} /> : null}
        <p className="label">あなたの応援球団</p>
        <p className="value">{team?.name ?? "?"}</p>
        <p className="label">ユーザー名</p>
        <p className="value">{entry.username}</p>
        <p className="label">現在の参加者数</p>
        <p className="value">{total === null ? "…" : `${total}人`}</p>
      </div>

      <p className="notice">
        2027年、勝利の女神候補としてエントリーしました!
        <br />
        実際のチェックイン・試合結果・ランキングは、2027年シーズン開幕後に、順次スタートします。
      </p>

      <Link href="/2027/home" className="primaryButton">
        ホームへ
      </Link>
    </section>
  );
}
