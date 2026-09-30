"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TeamCap } from "@/components/TeamCap";
import { getTeam } from "@/lib/teams";
import { getOrCreateGuestId } from "@/lib/guestId";
import { submitSeasonEntry } from "@/lib/seasonEntry";
import { clearDraft, loadDraft, type SeasonEntryDraft } from "@/lib/seasonDraft";

export default function SeasonConfirmPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<SeasonEntryDraft | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loaded = loadDraft();

    if (!loaded) {
      router.replace("/2027/team");
      return;
    }

    setDraft(loaded);
  }, [router]);

  async function submit() {
    if (!draft) return;

    setSubmitting(true);
    setErrorMessage("");

    const result = await submitSeasonEntry(getOrCreateGuestId(), draft.teamId, draft.username);

    if (!result.ok) {
      setErrorMessage(result.message);
      setSubmitting(false);
      return;
    }

    clearDraft();
    router.push("/2027/complete");
  }

  if (!draft) {
    return (
      <section className="panel">
        <p className="notice">読み込んでいます...</p>
      </section>
    );
  }

  const team = getTeam(draft.teamId);

  return (
    <>
      <div className="navRow">
        <Link href="/2027/username">修正する</Link>
      </div>

      <section className="panel">
        <h2>参加内容の確認</h2>

        <div className="confirmCard">
          {team ? <TeamCap team={team} size={44} /> : null}
          <p className="label">あなたの応援球団</p>
          <p className="value">{team?.name ?? "?"}</p>
          <p className="label">ユーザー名</p>
          <p className="value">{draft.username}</p>
        </div>

        <p className="notice">
          この内容で参加しますか?
          <br />
          ※あとから応援球団・ユーザー名は変更できます。
        </p>

        {errorMessage ? <p className="errorText">{errorMessage}</p> : null}

        <button type="button" className="primaryButton" disabled={submitting} onClick={submit}>
          {submitting ? "参加登録中..." : "参加する！"}
        </button>
        <Link href="/2027/username" className="authTextButton" style={{ display: "block", marginTop: 10 }}>
          修正する
        </Link>
      </section>
    </>
  );
}
