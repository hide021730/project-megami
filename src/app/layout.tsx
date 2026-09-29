import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "勝利の女神をさがせ！",
  description:
    "2026年プロ野球クライマックスシリーズ、応援に行った試合の勝敗を記録する、個人のファン企画です。",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <div className="appShell">
          <header className="topbar">
            <a href="/" className="brand">
              勝利の女神<span>をさがせ！</span>
            </a>
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
