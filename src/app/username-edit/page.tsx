"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateGuestId } from "@/lib/guestId";
import { USERNAME_MAX_LENGTH, fetchMyEntry, submitSeasonEntry } from "@/lib/seasonEntry";

// 応援球団は、登録時の一度きりの宣言として固定し、ここではユーザー名だけを変更する。
// (参加者数の集計や、企画の性質上、球団を後から自由に変えられないようにするため)
export default function SeasonUsernameEditPage() {
  const router = useRouter();
  const [teamId, setTeamId] = useState<number | null>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    fetchMyEntry(getOrCreateGuestId()).then((entry) => {
      if (!active) return;

      if (!entry) {
        router.replace("/");
        return;
      }

      setTeamId(entry.teamId);
      setUsername(entry.username);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [router]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!teamId) return;

    const trimmed = username.trim();

    if (!trimmed) {
      setErrorMessage("ユーザー名を入力してください。");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    const result = await submitSeasonEntry(getOrCreateGuestId(), teamId, trimmed);

    if (!result.ok) {
      setErrorMessage(result.message);
      setSubmitting(false);
      return;
    }

    router.push("/home");
  }

  if (loading) {
    return (
      <section className="panel">
        <p className="notice">読み込んでいます...</p>
      </section>
    );
  }

  return (
    <>
      <div className="navRow">
        <Link href="/home">ホームに戻る</Link>
      </div>

      <section className="panel">
        <h2>ユーザー名の変更</h2>
        <p className="notice">
          応援球団は、登録時の宣言として固定しています。変更できるのは、ユーザー名だけです。
        </p>

        <form onSubmit={submit}>
          <input
            type="text"
            maxLength={USERNAME_MAX_LENGTH}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="ユーザー名"
          />

          {errorMessage ? <p className="errorText">{errorMessage}</p> : null}

          <button type="submit" className="primaryButton" disabled={submitting}>
            {submitting ? "変更中..." : "変更する"}
          </button>
        </form>
      </section>
    </>
  );
}
