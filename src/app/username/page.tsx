"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { USERNAME_MAX_LENGTH } from "@/lib/seasonEntry";
import { loadDraft, saveDraft } from "@/lib/seasonDraft";

export default function SeasonUsernamePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const draft = loadDraft();

    if (!draft) {
      router.replace("/team");
      return;
    }

    setUsername(draft.username);
  }, [router]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = username.trim();

    if (!trimmed) {
      setErrorMessage("ユーザー名を入力してください。");
      return;
    }

    const draft = loadDraft();
    if (!draft) {
      router.replace("/team");
      return;
    }

    saveDraft({ teamId: draft.teamId, username: trimmed });
    router.push("/confirm");
  }

  return (
    <>
      <div className="navRow">
        <Link href="/team">戻る</Link>
      </div>

      <section className="panel">
        <h2>ユーザー名の設定</h2>
        <p className="notice">
          このサイトで表示するあなたのユーザー名を決めてください。
          <br />
          ※本名でなくてOKです。
        </p>

        <form onSubmit={submit}>
          <input
            type="text"
            maxLength={USERNAME_MAX_LENGTH}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="ユーザー名"
          />
          <p className="notice">
            ※あとから変更できます。
            <br />
            <br />
            <strong>ユーザー名の表示について</strong>
            <br />
            ・参加者一覧などで表示される場合があります。
            <br />
            ・公序良俗に反する名前は使用できません。
          </p>

          {errorMessage ? <p className="errorText">{errorMessage}</p> : null}

          <button type="submit" className="primaryButton">
            参加内容の確認へ
          </button>
        </form>
      </section>
    </>
  );
}
