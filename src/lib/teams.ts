export type Team = {
  id: number;
  name: string;
  league: "central" | "pacific";
};

// sql/001_create_schema.sqlのINSERT文と、常に一致させること。
export const TEAMS: Team[] = [
  { id: 1, name: "読売ジャイアンツ", league: "central" },
  { id: 2, name: "阪神タイガース", league: "central" },
  { id: 3, name: "広島東洋カープ", league: "central" },
  { id: 4, name: "横浜DeNAベイスターズ", league: "central" },
  { id: 5, name: "東京ヤクルトスワローズ", league: "central" },
  { id: 6, name: "中日ドラゴンズ", league: "central" },
  { id: 7, name: "福岡ソフトバンクホークス", league: "pacific" },
  { id: 8, name: "北海道日本ハムファイターズ", league: "pacific" },
  { id: 9, name: "オリックス・バファローズ", league: "pacific" },
  { id: 10, name: "千葉ロッテマリーンズ", league: "pacific" },
  { id: 11, name: "埼玉西武ライオンズ", league: "pacific" },
  { id: 12, name: "東北楽天ゴールデンイーグルス", league: "pacific" },
];

export function teamName(id: number | null | undefined): string {
  return TEAMS.find((t) => t.id === id)?.name ?? "?";
}
