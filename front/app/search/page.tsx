"use client";

import { Suspense, useEffect } from "react";
import { useState, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Bookmark, Clock, DollarSign, Apple } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

// ✅ Recipe 型を定義
interface Recipe {
  id: number;
  title: string;
  image: string;
  likes: number;
  favorites: number;
  price: number;
  cooking_time: number;
  ingredients: { name: string; protein: number; carbohydrate: number; fat: number }[];
}

const SearchResultsContent = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const keyword = searchParams.get("query") || "";
  const time = searchParams.get("time");
  const price = searchParams.get("price");

  // ✅ 環境変数から API のベースURLを取得
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // ✅ `useEffect` を使用して環境変数の確認
  useEffect(() => {
    console.log("🌍 [環境変数確認] NEXT_PUBLIC_API_BASE_URL:", API_BASE_URL || "🚨 環境変数が未定義 🚨");
  }, []);

  // ✅ API の URL を作成
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = `${API_BASE_URL}/api/recipes`;

      // ✅ API リクエスト前にログ出力
      console.log("📡 [APIリクエスト] Fetching from:", apiUrl);

      const response = await axios.get(apiUrl, {
        params: { keyword, cooking_time: time, price_range: price },
      });

      // ✅ API レスポンス確認
      console.log("✅ [APIレスポンス] 取得データ:", response.data);

      setRecipes(response.data);
    } catch (error) {
      console.error("❌ [エラー] API の取得に失敗しました:", error);
    }
    setLoading(false);
  }, [keyword, time, price, API_BASE_URL]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return (
    <div className="container mx-auto px-4 py-8 pt-8">
      {loading ? (
        <p className="text-center text-gray-500 text-lg">検索中...</p>
      ) : recipes.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">該当するレシピがありません</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-0">
                  <Image src={recipe.image || "/placeholder.svg"} alt={recipe.title} width={300} height={200} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// ✅ Suspense で `useSearchParams()` をラップする
export default function SearchResults() {
  return (
    <Suspense fallback={<p className="text-center text-gray-500">読み込み中...</p>}>
      <SearchResultsContent />
    </Suspense>
  );
}
