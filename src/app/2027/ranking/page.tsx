import Link from "next/link";

export default function SeasonRankingPage() {
  return (
    <>
      <div className="navRow">
        <Link href="/2027/home">ホームに戻る</Link>
      </div>

      <section className="panel" style={{ textAlign: "center", padding: "40px 18px" }}>
        <p style={{ fontSize: 40, margin: "0 0 12px" }}>👑</p>
        <h2>勝利の女神ランキング</h2>
        <p className="notice">
          2027年シーズン開幕後スタート!
          <br />
          「俺が観に行くと勝つ」は本当なのか? 2027年の143試合で証明します。
        </p>
      </section>
    </>
  );
}
