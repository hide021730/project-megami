import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BrandLink } from "@/components/BrandLink";
import { ThemeController } from "@/components/ThemeController";
import "./globals.css";

const SITE_URL = "https://megami.tsukuru3.jp";
const TITLE = "勝利の女神をさがせ！";
const DESCRIPTION =
  "応援に行った試合が、勝つ。そんなジンクスを検証する、個人のファン企画です。2027年シーズンの事前参加登録を受付中。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: TITLE,
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/2027/og-image.webp",
        width: 941,
        height: 1672,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/2027/og-image.webp"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      {/* 既定は2027年参加登録の白基調テーマ。/cs配下だけ、ThemeControllerが暗いテーマに切り替える。 */}
      <body className="theme2027">
        <ThemeController />
        <div className="appShell">
          <header className="topbar">
            <BrandLink />
          </header>
          <main>{children}</main>
          <footer className="footer">
            <p>
              本サイトは個人のファン企画であり、NPB・各球団の公式のものではありません。
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
