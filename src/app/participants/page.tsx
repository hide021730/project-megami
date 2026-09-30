"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TeamCap } from "@/components/TeamCap";
import { TEAMS } from "@/lib/teams";
import { fetchEntryCounts } from "@/lib/seasonEntry";

export default function SeasonParticipantsPage() {
  const [counts, setCounts] = useState<Record<number, number> | null>(null);

  useEffect(() => {
    fetchEntryCounts().then(setCounts);
  }, []);

  const sortedTeams = [...TEAMS].sort(
    (a, b) => (counts?.[b.id] ?? 0) - (counts?.[a.id] ?? 0)
  );

  return (
    <>
      <div className="navRow">
        <Link href="/home">ホームに戻る</Link>
      </div>

      <section className="panel">
        <h2>球団別 参加者数</h2>
        <p className="notice">2027年シーズンへの、現在の参加登録者数です(球団ごと)。</p>

        {counts === null ? (
          <p className="notice">読み込んでいます...</p>
        ) : (
          sortedTeams.map((team) => (
            <div key={team.id} className="countRow">
              <span>
                <TeamCap team={team} />
                <span style={{ marginLeft: 8 }}>{team.name}</span>
              </span>
              <span className="count">{counts[team.id] ?? 0}人</span>
            </div>
          ))
        )}
      </section>
    </>
  );
}
