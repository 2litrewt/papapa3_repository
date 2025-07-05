"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import apiClient from "@/lib/axios";

interface Recipe {
  id: number;
  title: string;
  price: number;
  cooking_time: number;
  ingredients: { protein: number; carbohydrate: number; fat: number }[];
  image_url?: string;
}

interface Favorite {
  id: number;
  recipe_id: number;
}

export default function SearchPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const keyword = searchParams.get("query") || "";

  const fetchData = async () => {
    setLoading(true);
    const [rRes, fRes] = await Promise.all([
      apiClient.get("/api/recipes", { params: { keyword } }),
      apiClient.get("/api/favorites"),
    ]);
    setRecipes(rRes.data);
    setFavorites(fRes.data);
    setLoading(false);
  };

  useEffect(() => {
    void fetchData();
  }, [keyword]);

  const isFav = (id: number) => favorites.some(f => f.recipe_id === id);

  const toggleFavorite = async (recipeId: number, favId: number | null) => {
    if (isFav(recipeId) && favId) {
      await apiClient.delete(`/api/favorites/${favId}`);
    } else {
      await apiClient.post("/api/favorites", { favorite: { recipe_id: recipeId } });
    }
    // 操作後に一覧を再取得
    const fRes = await apiClient.get("/api/favorites");
    setFavorites(fRes.data);
  };

  if (loading) return <p>読み込み中…</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {recipes.map(recipe => {
        const fav = favorites.find(f => f.recipe_id === recipe.id);
        const totalProtein = recipe.ingredients.reduce((s, i) => s + i.protein, 0);
        const totalCarb    = recipe.ingredients.reduce((s, i) => s + i.carbohydrate, 0);
        const totalFat     = recipe.ingredients.reduce((s, i) => s + i.fat, 0);

        return (
          <Card key={recipe.id}>
            <CardContent className="relative">
              <img
                src={recipe.image_url || "/DALL.webp"}
                alt={recipe.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="font-semibold">{recipe.title}</h3>
              <div className="flex justify-between text-sm mb-2">
                <span>¥{recipe.price}</span>
                <span><Clock className="inline w-4 h-4" />{recipe.cooking_time}分</span>
              </div>
              <div className="text-xs mb-2">
                P:{totalProtein}g C:{totalCarb}g F:{totalFat}g
              </div>
              <button
                onClick={() => toggleFavorite(recipe.id, fav?.id || null)}
                className={`mt-2 px-3 py-1 rounded ${
                  isFav(recipe.id) ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
              >
                {isFav(recipe.id) ? "作りたいリストから外す" : "作りたい！追加"}
              </button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
