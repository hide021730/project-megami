"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTeam } from "@/lib/teams";
import { getOrCreateGuestId } from "@/lib/guestId";
import { fetchMyEntry } from "@/lib/seasonEntry";

// 体験デモ(2026-09-30時点の方針)。実際の位置情報は取得せず、記録も行わない。
// 2027年シーズン開幕後、本物のチェックイン機能に置き換える。
export default function SeasonCheckinDemoPage() {
  const [team, setTeam] = useState<ReturnType<typeof getTeam>>(undefined);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [checkedInAt, setCheckedInAt] = useState<Date | null>(null);

  useEffect(() => {
    fetchMyEntry(getOrCreateGuestId()).then((entry) => {
      if (entry) setTeam(getTeam(entry.teamId));
    });
  }, []);

  function simulateCheckin() {
    setStatus("loading");

    window.setTimeout(() => {
      setCheckedInAt(new Date());
      setStatus("done");
    }, 900);
  }

  if (status === "done" && checkedInAt) {
    return (
      <>
        <div className="navRow">
          <Link href="/2027/home">ホームに戻る</Link>
        </div>

        <section className="panel">
          <h2>チェックイン</h2>
          <div className="confirmCard">
            <span className="confetti" style={{ fontSize: 32 }}>✅</span>
            <p className="value">チェックインしました!</p>
          </div>
          <div className="gameCard" style={{ marginTop: 10 }}>
            <span className="meta">球場名</span>
            <span className="matchup">{team?.homeStadium ?? "?"}</span>
            <span className="meta">
              チェックイン日時 {checkedInAt.toLocaleString("ja-JP")}
            </span>
          </div>
          <p className="notice">
            ※これは体験デモです。実際の記録は行われません。2027年シーズン開幕後、本物のチェックイン機能がスタートします。
          </p>
          <Link href="/2027/home" className="primaryButton">
            ホームに戻る
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <div className="navRow">
        <Link href="/2027/home">ホームに戻る</Link>
      </div>

      <section className="panel">
        <h2>チェックイン(体験デモ)</h2>
        <p className="notice">現在地を取得して、球場のチェックインを体験できます。</p>

        <button
          type="button"
          className="primaryButton"
          disabled={status === "loading"}
          onClick={simulateCheckin}
        >
          {status === "loading" ? "現在地を取得中..." : "📍 現在地を取得する"}
        </button>

        <p className="notice">
          <strong>チェックインについて</strong>
          <br />
          ・これは体験デモです。実際の位置情報の取得・記録は行いません。
          <br />
          ・本物のチェックイン機能は、2027年シーズン開幕後にスタートします。
        </p>
      </section>
    </>
  );
}
