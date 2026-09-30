import type { Team } from "@/lib/teams";

// 公式ロゴは使わず、球団カラーだけを使った、帽子の絵文字での表現。
export function TeamCap({ team, size = 22 }: { team: Team; size?: number }) {
  return (
    <span
      className="cap"
      style={{ color: team.color, fontSize: size, filter: "drop-shadow(0 0 1px rgba(0,0,0,.4))" }}
      aria-hidden="true"
    >
      🧢
    </span>
  );
}
