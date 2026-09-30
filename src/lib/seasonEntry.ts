import { supabase } from "@/lib/supabase";

export const USERNAME_MAX_LENGTH = 20;

const SUBMIT_ERROR_MESSAGES: Record<string, string> = {
  reserved: "その名前は使用できません。別の名前をお試しください。",
  invalid_length: `ユーザー名は1〜${USERNAME_MAX_LENGTH}文字で入力してください。`,
  invalid_chars: "ユーザー名に使用できない文字が含まれています。",
  invalid_team: "応援チームを選び直してください。",
};

const GENERIC_ERROR_MESSAGE = "登録できませんでした。時間をおいて再度お試しください。";

export type SubmitEntryResult = { ok: true } | { ok: false; message: string };

export async function submitSeasonEntry(
  guestId: string,
  teamId: number,
  username: string
): Promise<SubmitEntryResult> {
  const { data, error } = await supabase.rpc("submit_season_entry", {
    p_guest_id: guestId,
    p_team_id: teamId,
    p_username: username.trim(),
  });

  if (error) {
    console.error("参加登録に失敗しました:", error);
    return { ok: false, message: GENERIC_ERROR_MESSAGE };
  }

  if (data !== "ok") {
    return {
      ok: false,
      message: SUBMIT_ERROR_MESSAGES[String(data)] ?? GENERIC_ERROR_MESSAGE,
    };
  }

  return { ok: true };
}

export type MyEntry = {
  teamId: number;
  username: string;
};

export async function fetchMyEntry(guestId: string): Promise<MyEntry | null> {
  const { data, error } = await supabase.rpc("get_my_season_entry", {
    p_guest_id: guestId,
  });

  if (error) {
    console.error("参加登録の取得に失敗しました:", error);
    return null;
  }

  const rows = data as { team_id: number; username: string }[] | null;
  const row = rows?.[0];

  if (!row) return null;

  return { teamId: row.team_id, username: row.username };
}

export async function fetchEntryCounts(): Promise<Record<number, number>> {
  const { data, error } = await supabase.rpc("get_season_entry_counts");

  if (error) {
    console.error("参加者数の取得に失敗しました:", error);
    return {};
  }

  const rows = data as { team_id: number; entry_count: number }[] | null;
  const counts: Record<number, number> = {};

  for (const row of rows ?? []) {
    counts[row.team_id] = row.entry_count;
  }

  return counts;
}

export async function fetchEntryTotal(): Promise<number> {
  const { data, error } = await supabase.rpc("get_season_entry_total");

  if (error) {
    console.error("参加者数(全体)の取得に失敗しました:", error);
    return 0;
  }

  return typeof data === "number" ? data : Number(data ?? 0);
}
