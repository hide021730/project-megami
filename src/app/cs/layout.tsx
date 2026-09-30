import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "2026年クライマックスシリーズ | 勝利の女神をさがせ！",
  description:
    "2026年プロ野球クライマックスシリーズ、応援に行った試合の勝敗を記録する、個人のファン企画です。",
};

export default function CsLayout({ children }: { children: ReactNode }) {
  return children;
}
