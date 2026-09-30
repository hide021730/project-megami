"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TeamCap } from "@/components/TeamCap";
import { TEAMS } from "@/lib/teams";
import { loadDraft, saveDraft } from "@/lib/seasonDraft";
import { getOrCreateGuestId } from "@/lib/guestId";
import { fetchMyEntry } from "@/lib/seasonEntry";

const CENTRAL = TEAMS.filter((t) => t.league === "central");
const PACIFIC = TEAMS.filter((t) => t.league === "pacific");

export default function SeasonTeamPage() {
  const router = useRouter();
  const [teamId, setTeamId] = useState<number | null>(null);
  const [existingUsername, setExistingUsername] = useState("");

  useEffect(() => {
    const draftTeamId = loadDraft()?.teamId;

    if (draftTeamId) {
      setTeamId(draftTeamId);
      return;
    }

    // 下書きが無い場合(登録済みの人が「変更する」から来た場合など)は、
    // 既存の登録内容を、選択済みとして表示する。
    fetchMyEntry(getOrCreateGuestId()).then((entry) => {
      if (entry) {
        setTeamId(entry.teamId);
        setExistingUsername(entry.username);
      }
    });
  }, []);

  function next() {
    if (!teamId) return;
    saveDraft({ teamId, username: loadDraft()?.username || existingUsername });
    router.push("/2027/username");
  }

  return (
    <>
      <div className="navRow">
        <Link href="/2027">トップに戻る</Link>
      </div>

      <section className="panel">
        <h2>応援球団の選択</h2>
        <p className="notice">あなたが応援している球団を選んでください。</p>

        <p className="leagueLabel">セ・リーグ</p>
        <div className="teamGrid">
          {CENTRAL.map((team) => (
            <button
              key={team.id}
              type="button"
              className={teamId === team.id ? "selected" : ""}
              onClick={() => setTeamId(team.id)}
            >
              <TeamCap team={team} />
              {team.shortName}
            </button>
          ))}
        </div>

        <p className="leagueLabel">パ・リーグ</p>
        <div className="teamGrid">
          {PACIFIC.map((team) => (
            <button
              key={team.id}
              type="button"
              className={teamId === team.id ? "selected" : ""}
              onClick={() => setTeamId(team.id)}
            >
              <TeamCap team={team} />
              {team.shortName}
            </button>
          ))}
        </div>

        <button type="button" className="primaryButton" disabled={!teamId} onClick={next}>
          次へ
        </button>
      </section>
    </>
  );
}
