import { MenuBar } from "@/components/MenuBar"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "'レシピ検索サイト'",
  description: "'美味しいレシピを探そう'",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <MenuBar />
        <main className="min-h-screen bg-white dark:bg-gray-950">
          {children}
        </main>
      </body>
    </html>
  )
}

