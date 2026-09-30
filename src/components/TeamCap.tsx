import type { Team } from "@/lib/teams";

// 公式ロゴは使わず、汎用の帽子写真(色違い)を、球団ごとに割り当てて使う。
export function TeamCap({ team, size = 22 }: { team: Team; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/2027/caps/team-${team.id}.webp`}
      alt=""
      aria-hidden="true"
      className="teamCapImage"
      style={{ width: size * 1.8, height: "auto" }}
    />
  );
}
