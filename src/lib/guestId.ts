const GUEST_ID_KEY = "megami_guest_id_v1";
const NICKNAME_KEY = "megami_nickname_v1";

// ログインなし・端末ごとのID。「つくる。」プロジェクトと同じ考え方(localStorage)。
// 賞品なしの検証段階なので、消せば作り直せる程度の緩さで割り切る。
export function getOrCreateGuestId(): string {
  try {
    const existing = window.localStorage.getItem(GUEST_ID_KEY);
    if (existing) return existing;

    const created = crypto.randomUUID();
    window.localStorage.setItem(GUEST_ID_KEY, created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
}

export function getStoredNickname(): string {
  try {
    return window.localStorage.getItem(NICKNAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function storeNickname(nickname: string) {
  try {
    window.localStorage.setItem(NICKNAME_KEY, nickname);
  } catch {
    // no-op
  }
}
