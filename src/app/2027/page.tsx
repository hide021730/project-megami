"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateGuestId } from "@/lib/guestId";
import { fetchMyEntry } from "@/lib/seasonEntry";

export default function Season2027HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    fetchMyEntry(getOrCreateGuestId()).then((entry) => {
      if (!active) return;
      if (entry) {
        router.replace("/2027/home");
        return;
      }
      setChecking(false);
    });

    return () => {
      active = false;
    };
  }, [router]);

  if (checking) {
    return (
      <section className="panel">
        <p className="notice">読み込んでいます...</p>
      </section>
    );
  }

  return (
    <>
      <div className="heroImageWrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/2027/hero-title.webp"
          alt="勝利の女神を探せ！2027年シーズン マジック143! チームが勝てなくても、私が球場へ行くとチームが勝つ! そんな「勝利の女神」を探せ! 補強よりも「勝利の女神」が必要だ!"
          className="heroImage"
        />
        <Link href="/2027/team" className="heroCtaInside">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/2027/cta-button.webp" alt="2027年シーズン 参加する！" />
        </Link>
      </div>

      <section className="stepsSection">
        <div className="stepsHeader">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/2027/steps-title.webp" alt="勝利の女神への道" className="stepsTitleImage" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/2027/steps-subtitle.webp"
            alt="4つのステップで、あなたも勝利の女神に!"
            className="stepsSubtitleImage"
          />
        </div>

        <div className="stepsGrid">
          <Link href="/2027/team">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/2027/step-card-1.webp" alt="1. 応援球団選択: あなたの応援する球団を登録しよう! 12球団から選べます" className="stepCardImage" />
          </Link>
          <Link href="/2027/checkin">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/2027/step-card-2.webp" alt="2. チェックインする: 球場に着いたらGPSでチェックイン! 開場〜試合開始90分後まで" className="stepCardImage" />
          </Link>
          <Link href="/2027/results">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/2027/step-card-3.webp" alt="3. 試合結果: あなたが観戦した試合の結果を自動で反映! 2027年シーズン開幕後" className="stepCardImage" />
          </Link>
          <Link href="/2027/ranking">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/2027/step-card-4.webp" alt="4. ランキング: 勝利の女神ランキングで全国の仲間と競おう! 2027年シーズン開幕後" className="stepCardImage" />
          </Link>
        </div>
      </section>

      <details className="notice" style={{ marginTop: 16 }}>
        <summary style={{ cursor: "pointer" }}>このサイトについて</summary>
        <p style={{ marginTop: 8, marginBottom: 0 }}>
          個人のファンが趣味で作った、応援ジンクス検証企画です。NPB・各球団の公式のものではありません。
          <br />
          現時点では事前登録の受付のみで、実際のチェックイン・試合結果・ランキングは、2027年シーズン開幕後に順次スタートします。
        </p>
      </details>
    </>
  );
}
