"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// サイトの基本(白基調、和紙のテーマ)は、2027年参加登録が主役。
// /cs配下(CS版)のときだけ、既存の暗いテーマに戻す。
export function ThemeController() {
  const pathname = usePathname();
  const isCs = pathname.startsWith("/cs");

  useEffect(() => {
    if (isCs) {
      document.body.classList.remove("theme2027");
    } else {
      document.body.classList.add("theme2027");
    }
  }, [isCs]);

  return null;
}
