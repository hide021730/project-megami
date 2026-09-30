const DRAFT_KEY = "megami_season_entry_draft_v1";

export type SeasonEntryDraft = {
  teamId: number;
  username: string;
};

// 応援チーム→ユーザー名→確認、と複数ページをまたぐ入力を、一時的に保持する。
// sessionStorageなので、タブを閉じれば消える(下書きが何日も残らないように)。
export function saveDraft(draft: SeasonEntryDraft) {
  try {
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // no-op
  }
}

export function loadDraft(): SeasonEntryDraft | null {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed.teamId !== "number" || typeof parsed.username !== "string") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearDraft() {
  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // no-op
  }
}
