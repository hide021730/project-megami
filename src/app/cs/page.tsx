import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>2026年 クライマックスシリーズ<br />勝利の女神をさがせ！</h1>
        <p>
          応援に行った試合が、勝つ。あなたにも、そんなジンクスはありませんか?
        </p>
        <p>
          CS期間中、球場に応援に行った試合をここに記録してください。あなたの応援チームの勝ち数が、そのまま「勝利の女神」度になります。
        </p>
      </section>

      <div className="navRow">
        <Link href="/cs/checkin">応援した試合を記録する</Link>
        <Link href="/cs/ranking">ランキングを見る</Link>
      </div>

      <section className="panel">
        <h2>これは何?</h2>
        <p className="notice">
          個人のファンが趣味で作った、需要調査のための試作サイトです。NPB・各球団・各リーグの公式のものではありません。
          <br />
          賞品はありません。入力していただいたニックネームは、ランキングの表示にのみ使います。
          <br />
          セ・パ両リーグのクライマックスシリーズが対象です。
        </p>
      </section>
    </>
  );
}
