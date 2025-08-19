import { MenuBar } from "@/components/MenuBar";
import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext"; 
import { Poppins } from "next/font/google";
import Footer from "@/components/Footer";

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
      <body className={`${inter.className} bg-gray-100`}>
        <AuthProvider> 
          <FavoritesProvider> 
          <div className="mx-auto max-w-screen-lg min-h-screen flex flex-col
                            border border-black rounded-xl shadow-sm bg-white">

            <MenuBar />
            <div className=" flex-1 flex flex-col  overflow-hidden">
            <main className="flex-1 rounded-b-xl">
              {children}
            </main>
            </div>
            <Footer />
          </div>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
