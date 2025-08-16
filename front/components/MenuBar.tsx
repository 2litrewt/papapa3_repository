"use client";

import { useEffect, useState } from "react";
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"


export function MenuBar() {
  const { user: currentUser, logout } = useAuth()

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinkClass = `
  px-2 py-1 text-sm md:text-[15px] font-semibold tracking-wide uppercase
  text-gray-700 hover:text-green-600
  border-b-2 border-transparent hover:border-green-600
  transition-colors
`;

  const ctaLinkClass = `
    ${navLinkClass}
    text-gray-800
  `;

  return (
    <nav className={`
  sticky top-0 z-50 border-b
  ${isScrolled
    ? "bg-gray-50/95 backdrop-blur shadow-md border-gray-200"
    : "bg-gray-50/80 backdrop-blur-sm shadow border-gray-100"
  }
  text-black transition-all duration-300
`}>

      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="logo block">
          <Image
            src="/logo.webp"
            alt="PaPaPa ロゴ"
            width={220}
            height={40}
          />
        </Link>
        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              <span className="text-gray-700 dark:text-gray-200">
                ユーザー：{currentUser.name}
              </span>
              <Link href="/new-recipe" className={navLinkClass}>
                新規投稿
              </Link>
              <Link href="/wanna-make" className={navLinkClass}>
                これやる！リスト
              </Link>
              
              <Button onClick={logout} variant="destructive">ログアウト</Button>
            </>
          ) : (
            <>
              <Link href="/login" className={ctaLinkClass}>
                ログイン
              </Link>
              <Link href="/register" className={ctaLinkClass}>
                新規登録
              </Link>

            </>
          )}
        </div>
      </div>
    </nav>
  )
}

