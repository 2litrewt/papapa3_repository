import { MenuBar } from "@/components/MenuBar"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext" // ✅ 追加
import { Noto_Sans_JP } from "next/font/google";

const noto = Noto_Sans_JP({
  subsets: ["latin", ], 
  weight: ["400", "700"],
  display: "swap",
});

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
      <body className={`${noto.className} bg-orange-400 dark:bg-gray-900`}>
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