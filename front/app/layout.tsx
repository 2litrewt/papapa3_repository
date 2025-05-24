import { MenuBar } from "@/components/MenuBar"
import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/context/AuthContext" // ✅ 追加

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "レシピ検索サイト",
  description: "美味しいレシピを探そう",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-orange-600 dark:bg-gray-900`}>
        <div className="px-4">
        <div
          className="
          max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg
          mx-auto my-6
            rounded-xl
            bg-white dark:bg-gray-950  
            border border-black
          "
        >
          <AuthProvider>
              <MenuBar />
              <main className="min-h-screen">
                {children}
              </main>
          </AuthProvider>
        </div>
        </div>
      </body>
    </html>
  );
}