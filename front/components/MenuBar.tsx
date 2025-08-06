"use client";

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

export function MenuBar() {
  const { user: currentUser, logout } = useAuth()

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-4 shadow-md border-b-2 border-black dark:border-gray-700">
      <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="logo block">
          <Image
            src="/logo.webp"
            alt="PaPaPa ロゴ"
            width={220}
            height={40}
          />
        </Link>
        <nav className="flex items-center gap-4">
          {currentUser ? (
            <>
              <span className="text-gray-700 dark:text-gray-200">
                ユーザー：{currentUser.name}
              </span>
              <Link href="/new-recipe">
                <Button variant="outline">新規投稿</Button>
              </Link>
              <Link href="/wanna-make">
                <Button variant="outline">これやる！リスト</Button>
              </Link>
              <Button onClick={logout} variant="destructive">ログアウト</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="default">ログイン</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">新規登録</Button>
              </Link>

            </>
          )}
        </nav>
      </div>
    </nav>
  )
}

