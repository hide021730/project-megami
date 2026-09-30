import Link from "next/link";

export default function SeasonResultsPage() {
  return (
    <>
      <div className="navRow">
        <Link href="/2027/home">ホームに戻る</Link>
      </div>

      <section className="panel" style={{ textAlign: "center", padding: "40px 18px" }}>
        <p style={{ fontSize: 40, margin: "0 0 12px" }}>📅</p>
        <h2>試合結果</h2>
        <p className="notice">
          2027年シーズン開幕までお待ちください。
          <br />
          あなたが観戦した試合の結果が、ここに表示されます。
        </p>
      </section>
    </>
  );
}
