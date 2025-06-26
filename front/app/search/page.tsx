"use client";

import { Suspense, useEffect } from "react";
import { useState, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Bookmark, Clock, DollarSign, Apple } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { User } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext"; // ✅ 追加
import { WannaMakeButton } from "@/components/ui/WannaMakeButton";

// ✅ Recipe 型を定義
interface Recipe {
  id: number;
  title: string;
  image?: string; // ❗ `image` が `undefined` にならないようにオプショナルに変更
  likes: number;
  favorites: number;
  price: number;
  cooking_time: number;
  ingredients: { name: string; protein: number; carbohydrate: number; fat: number }[];
  image_url?: string;
}

const SearchResultsContent = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const searchParams = useSearchParams();
  const keyword = searchParams.get("query") || "";
  const time = searchParams.get("time");
  const price = searchParams.get("price");



  // ✅ 環境変数から API のベースURLを取得
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const { addFavorite } = useFavorites();

  // ✅ API の URL を作成
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = `${API_BASE_URL}/api/recipes`;
      console.log("🔍 [APIリクエスト] Fetching from:", apiUrl);

      const response = await axios.get(apiUrl, {
        params: { keyword, cooking_time: time, price_range: price },
      });

      console.log("✅ [APIレスポンス] 取得したレシピ:", response.data); // ✅ ここでレスポンスを確認
      setRecipes(response.data);
    } catch (error) {
      console.error("❌ [エラー] API の取得に失敗しました:", error);
    }
    setLoading(false);
  }, [keyword, time, price, API_BASE_URL]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites`, {

          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token") || "",
            "client": localStorage.getItem("client") || "",
            "uid": localStorage.getItem("uid") || "",
          }
        });

        const ids = response.data.map((fav: { recipe_id: number }) => fav.recipe_id);
        setFavoriteIds(ids);
      } catch (err) {
        console.error("作りたいリスト取得失敗", err);
      }
    };

    fetchFavorites();
  }, []);


  return (
    <div className="container mx-auto px-4 py-8 pt-8">
      {loading ? (
        <p className="text-center text-gray-500 text-lg">検索中...</p>
      ) : recipes.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">該当するレシピがありません</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => {
            console.log("Recipe Image:", recipe.image); // 画像URLの確認

            const totalProtein = recipe.ingredients.reduce((sum, ing) => sum + (ing.protein || 0), 0);
            const totalCarbohydrate = recipe.ingredients.reduce((sum, ing) => sum + (ing.carbohydrate || 0), 0);
            const totalFat = recipe.ingredients.reduce((sum, ing) => sum + (ing.fat || 0), 0);
            const imageUrl = recipe.image_url ?? "/DALL.webp";

            return (
              <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-0 relative">
                    <img src={recipe.image_url ?? "/DALL.webp"} alt={recipe.title} className="w-full h-[200px] object-cover rounded" />

                    <WannaMakeButton
                      recipeId={favorite.recipe_id}
                      recipeTitle={favorite.recipe_title}
                      imageUrl={favorite.recipe_image_url}
                      isFavorite={true}
                      favoriteId={favorite.id} // お気に入り自体のid
                      onDeleteFavorite={handleDeleteFavorite}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-4 mt-4">{recipe.title}</h3>
                      <div className="flex justify-between items-center mb-2">
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-4 ml-3">
                        <div className="flex items-center">
                          <span className="mr-1">¥</span>
                          <span>{recipe.price}円</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{recipe.cooking_time}分</span>
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>P: {totalProtein.toFixed(1)}g C: {totalCarbohydrate.toFixed(1)}g F: {totalFat.toFixed(1)}g</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
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
