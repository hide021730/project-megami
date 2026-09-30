import Link from "next/link";

// 体験デモの実装は、src/app/2027/_archive/checkin-demo.tsx.txt に残してある。
// CSモードを作る際、ここを実際のチェックイン機能に差し替える。
export default function SeasonCheckinPage() {
  return (
    <>
      <div className="navRow">
        <Link href="/2027/home">ホームに戻る</Link>
      </div>

      <section className="panel" style={{ textAlign: "center", padding: "40px 18px" }}>
        <p style={{ fontSize: 40, margin: "0 0 12px" }}>📍</p>
        <h2>チェックインする</h2>
        <p className="notice">
          2027年シーズン開幕までお待ちください。
        </p>
      </section>
    </>
  );
}
