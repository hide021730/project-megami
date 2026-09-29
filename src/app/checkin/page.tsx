"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getOrCreateGuestId, getStoredNickname, storeNickname } from "@/lib/guestId";
import { teamName } from "@/lib/teams";

type Game = {
  id: string;
  league: "central" | "pacific";
  stage: "first" | "final";
  game_number: number;
  home_team_id: number;
  away_team_id: number;
  scheduled_at: string;
  status: "scheduled" | "final" | "cancelled";
};

const STAGE_LABEL: Record<Game["stage"], string> = {
  first: "ファーストステージ",
  final: "ファイナルステージ",
};

const LEAGUE_LABEL: Record<Game["league"], string> = {
  central: "セ・リーグ",
  pacific: "パ・リーグ",
};

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CheckinPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [doneGameIds, setDoneGameIds] = useState<string[]>([]);

  useEffect(() => {
    setNickname(getStoredNickname());
  }, []);

  useEffect(() => {
    let active = true;

    supabase
      .from("cs_games")
      .select("id, league, stage, game_number, home_team_id, away_team_id, scheduled_at, status")
      .neq("status", "cancelled")
      .order("scheduled_at", { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;

        if (error) {
          console.error("試合一覧の取得に失敗しました:", error);
          setLoadError("試合の一覧を読み込めませんでした。時間をおいて再度お試しください。");
          setLoading(false);
          return;
        }

        setGames((data as Game[]) ?? []);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function selectGame(game: Game) {
    setSelectedGameId(game.id);
    setSelectedTeamId(null);
    setErrorMessage("");
  }

  async function submit(gameId: string) {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      setErrorMessage("ニックネームを入力してください。");
      return;
    }

    if (!selectedTeamId) {
      setErrorMessage("応援しているチームを選んでください。");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    storeNickname(trimmedNickname);

    const { error } = await supabase.from("checkins").insert({
      game_id: gameId,
      guest_id: getOrCreateGuestId(),
      nickname: trimmedNickname,
      supported_team_id: selectedTeamId,
    });

    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        setErrorMessage("この試合は、すでに記録済みです。");
      } else {
        console.error("チェックインに失敗しました:", error);
        setErrorMessage("記録できませんでした。時間をおいて再度お試しください。");
      }
      return;
    }

    setDoneGameIds((current) => [...current, gameId]);
    setSelectedGameId(null);
  }

  return (
    <>
      <div className="navRow">
        <Link href="/">トップに戻る</Link>
        <Link href="/ranking">ランキングを見る</Link>
      </div>

      <section className="panel">
        <h2>応援した試合を記録する</h2>
        <p className="notice">
          球場に応援に行った試合を選び、応援しているチームを選んでください。試合終了後、公式の結果と突き合わせて、勝敗を反映します。
        </p>

        <label htmlFor="nickname">ニックネーム</label>
        <input
          id="nickname"
          type="text"
          maxLength={20}
          placeholder="ランキングに表示される名前"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
        />
      </section>

      {loading ? <p className="notice">試合を読み込んでいます...</p> : null}
      {loadError ? <p className="errorText">{loadError}</p> : null}
      {!loading && !loadError && games.length === 0 ? (
        <p className="notice">
          まだ試合の日程が登録されていません。クライマックスシリーズの対戦カードが決まり次第、ここに表示されます。
        </p>
      ) : null}

      {games.map((game) => {
        const isDone = doneGameIds.includes(game.id);
        const isSelected = selectedGameId === game.id;

        return (
          <div key={game.id} className="gameCard">
            <span className="meta">
              {LEAGUE_LABEL[game.league]} {STAGE_LABEL[game.stage]} 第{game.game_number}戦・
              {formatDateTime(game.scheduled_at)}
            </span>
            <span className="matchup">
              {teamName(game.home_team_id)} vs {teamName(game.away_team_id)}
            </span>

            {isDone ? (
              <p className="notice">記録しました。結果が出るまで、お待ちください。</p>
            ) : isSelected ? (
              <>
                <div className="teamPicker">
                  {[game.home_team_id, game.away_team_id].map((teamId) => (
                    <button
                      key={teamId}
                      type="button"
                      className={selectedTeamId === teamId ? "selected" : ""}
                      onClick={() => setSelectedTeamId(teamId)}
                    >
                      {teamName(teamId)}を応援
                    </button>
                  ))}
                </div>
                {errorMessage ? <p className="errorText">{errorMessage}</p> : null}
                <button
                  type="button"
                  className="primaryButton"
                  disabled={submitting}
                  onClick={() => submit(game.id)}
                >
                  {submitting ? "記録中..." : "この試合を記録する"}
                </button>
              </>
            ) : (
              <button type="button" className="primaryButton" onClick={() => selectGame(game)}>
                この試合に応援に行った
              </button>
            )}
          </div>
        );
      })}
    </>
  );
}
