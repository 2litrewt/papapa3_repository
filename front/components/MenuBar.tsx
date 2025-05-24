"use client";

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

export function MenuBar() {
  const { user: currentUser, logout } = useAuth()

  return (
    <nav className="bg-white text-black p-4 shadow-md border-b border-black rounded-t-xl">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="logo">
          PaPaPa
        </Link>
        <nav className="flex items-center gap-4">
        {currentUser ? (
          <>
            <span className="px-4 py-2 rounded-md border text-sm">
              ログイン中：{currentUser.name}さん
            </span>
            <Link href="/new-recipe">
              <Button variant="outline">新規投稿</Button>
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

