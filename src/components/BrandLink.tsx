"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// topbarのロゴのリンク先。/2027配下にいるときは、CS版のトップ(/)ではなく、
// 2027年参加登録のトップ(/2027)に戻す。
export function BrandLink() {
  const pathname = usePathname();
  const isSeason2027 = pathname.startsWith("/2027");

  return (
    <Link href={isSeason2027 ? "/2027" : "/"} className="brand">
      勝利の女神<span>をさがせ！</span>
    </Link>
  );
}
