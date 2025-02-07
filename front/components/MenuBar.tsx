import Link from "next/link"
import { Button } from "@/components/ui/button"

export function MenuBar() {
  return (
    <nav className="bg-gray-100 text-black p-4 shadow-md border-b-2 border-black">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="logo">
          PaPaPa
        </Link>
        <ul className="flex space-x-4">
          <li><Button variant="outline" asChild><Link href="/login">ログイン</Link></Button></li>
          <li><Button variant="outline" asChild><Link href="/notifications">お知らせ</Link></Button></li>
          <li><Button variant="outline" asChild><Link href="/mypage">マイページ</Link></Button></li>
          <li><Button variant="outline" asChild><Link href="/ranking">ランキング</Link></Button></li>
          <li><Button variant="outline" asChild><Link href="/new-recipe">新規投稿</Link></Button></li>
        </ul>
      </div>
    </nav>
  )
}

