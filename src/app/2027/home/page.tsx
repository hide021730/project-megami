"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TeamCap } from "@/components/TeamCap";
import { getTeam } from "@/lib/teams";
import { getOrCreateGuestId } from "@/lib/guestId";
import { fetchMyEntry } from "@/lib/seasonEntry";

export default function SeasonHomePage() {
  const router = useRouter();
  const [entry, setEntry] = useState<{ teamId: number; username: string } | null>(null);

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
      <div className="homeHeader">
        {team ? <TeamCap team={team} size={32} /> : null}
        <div>
          <p className="name">{entry.username}さん</p>
          <p className="team">応援球団: {team?.name ?? "?"}</p>
        </div>
      </div>

      <div className="menuList" style={{ marginTop: 14 }}>
        <Link href="/2027/checkin" className="menuItem">
          <p className="menuTitle">📍 チェックインする(体験デモ)</p>
          <p className="menuSub">球場に行って、チェックインを体験してみよう</p>
        </Link>
        <Link href="/2027/results" className="menuItem">
          <p className="menuTitle">📅 試合結果</p>
          <p className="menuSub">2027年シーズン開幕までお待ちください。</p>
        </Link>
        <Link href="/2027/ranking" className="menuItem">
          <p className="menuTitle">👑 ランキング</p>
          <p className="menuSub">2027年シーズン開幕後スタート!</p>
        </Link>
        <Link href="/2027/participants" className="menuItem">
          <p className="menuTitle">👥 球団別 参加者数</p>
          <p className="menuSub">現在の参加者数を見ることができます。</p>
        </Link>
        <Link href="/2027/team" className="menuItem">
          <p className="menuTitle">✏️ 応援球団・ユーザー名を変更する</p>
        </Link>
      </div>
    </section>
  );
}
