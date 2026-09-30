"use client";

import { useEffect, type ReactNode } from "react";

// 「2027年シーズン参加登録」だけ、白基調のテーマにする。
// CS版(/、/checkin、/ranking)は、既存の暗いテーマのまま変えない。
// topbar・footerは共通レイアウト側にあるため、bodyにクラスを付けて、
// globals.cssの`body.theme2027`側のルールで、まとめて上書きする。
export default function Season2027Layout({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.classList.add("theme2027");
    return () => {
      document.body.classList.remove("theme2027");
    };
  }, []);

  return <>{children}</>;
}
