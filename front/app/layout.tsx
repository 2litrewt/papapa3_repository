import { MenuBar } from "@/components/MenuBar";
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext"; 
import { Poppins } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "レシピ検索サイト",
  description: "美味しいレシピを探そう",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={poppins.className}>
      <body className={inter.className}>
        <AuthProvider> 
          <FavoritesProvider> 
            <MenuBar />
            <main className="min-h-screen bg-white dark:bg-gray-950">
              {children}
            </main>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
