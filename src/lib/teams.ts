export type Team = {
  id: number;
  name: string;
  shortName: string;
  league: "central" | "pacific";
  color: string;
  homeStadium: string;
  // 表示順(リーグ内)。idはSupabaseのteamsテーブルの主キーと一致させる必要があるため、
  // 並び順を変えたいときは、idではなく、この値で調整する。
  order: number;
};

// sql/001_create_schema.sqlのINSERT文と、常に一致させること。
// colorは球団の一般的なチームカラー(公式ロゴは使わない。帽子の絵文字を、この色で表示する)。
export const TEAMS: Team[] = [
  { id: 1, name: "読売ジャイアンツ", shortName: "巨人", league: "central", color: "#f97709", homeStadium: "東京ドーム", order: 2 },
  { id: 2, name: "阪神タイガース", shortName: "阪神", league: "central", color: "#ffe201", homeStadium: "阪神甲子園球場", order: 1 },
  { id: 3, name: "広島東洋カープ", shortName: "広島", league: "central", color: "#e6002d", homeStadium: "MAZDA Zoom-Zoomスタジアム広島", order: 5 },
  { id: 4, name: "横浜DeNAベイスターズ", shortName: "DeNA", league: "central", color: "#0055a6", homeStadium: "横浜スタジアム", order: 3 },
  { id: 5, name: "東京ヤクルトスワローズ", shortName: "ヤクルト", league: "central", color: "#4a9b3d", homeStadium: "明治神宮野球場", order: 4 },
  { id: 6, name: "中日ドラゴンズ", shortName: "中日", league: "central", color: "#003da5", homeStadium: "バンテリンドーム ナゴヤ", order: 6 },
  { id: 7, name: "福岡ソフトバンクホークス", shortName: "ソフトバンク", league: "pacific", color: "#fce300", homeStadium: "みずほPayPayドーム福岡", order: 1 },
  { id: 8, name: "北海道日本ハムファイターズ", shortName: "日本ハム", league: "pacific", color: "#4ba0d9", homeStadium: "エスコンフィールドHOKKAIDO", order: 3 },
  { id: 9, name: "オリックス・バファローズ", shortName: "オリックス", league: "pacific", color: "#0d2b53", homeStadium: "京セラドーム大阪", order: 4 },
  { id: 10, name: "千葉ロッテマリーンズ", shortName: "ロッテ", league: "pacific", color: "#000000", homeStadium: "ZOZOマリンスタジアム", order: 5 },
  { id: 11, name: "埼玉西武ライオンズ", shortName: "西武", league: "pacific", color: "#00468c", homeStadium: "ベルーナドーム", order: 2 },
  { id: 12, name: "東北楽天ゴールデンイーグルス", shortName: "楽天", league: "pacific", color: "#7b0d29", homeStadium: "楽天モバイルパーク宮城", order: 6 },
];

export function teamName(id: number | null | undefined): string {
  return TEAMS.find((t) => t.id === id)?.name ?? "?";
}

export function getTeam(id: number | null | undefined): Team | undefined {
  return TEAMS.find((t) => t.id === id);
}
