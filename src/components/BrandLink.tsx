"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// topbarのロゴのリンク先。/cs配下(CS版)にいるときは、CS版のトップ(/cs)へ。
// それ以外(2027年参加登録が主役の、サイトのトップ以下)では、/ へ戻す。
export function BrandLink() {
  const pathname = usePathname();
  const isCs = pathname.startsWith("/cs");

  return (
    <Link href={isCs ? "/cs" : "/"} className="brand">
      勝利の女神<span>をさがせ！</span>
    </Link>
  );
}
