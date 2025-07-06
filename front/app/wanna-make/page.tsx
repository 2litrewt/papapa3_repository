// src/app/wanna-make/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { WannaMakeButton } from "@/components/ui/WannaMakeButton";

interface Favorite {
  id: number;
  recipe_id: number;
}

interface RecipeDetail {
  id: number;
  title: string;
  price: number;
  cooking_time: number;
  image_url?: string;
  ingredients: { protein: number; carbohydrate: number; fat: number }[];
}

type FavoriteWithRecipe = Favorite & { recipe: RecipeDetail };

export default function WannaMakePage() {
  const [items, setItems] = useState<FavoriteWithRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  /** 一覧取得 + 各レシピ詳細まとめて取得 */
  const fetchFavorites = async () => {
    setLoading(true);

    // 1) 作りたいリスト取得
    const favRes = await apiClient.get<Favorite[]>("/api/favorites");

    // 2) その recipe_id を使ってレシピ詳細を並列取得
    const recipePromises = favRes.data.map((f) =>
      apiClient.get<RecipeDetail>(`/api/recipes/${f.recipe_id}`)
    );
    const recipeResArray = await Promise.all(recipePromises);

    // 3) 結合
    const merged = favRes.data.map((f, idx) => ({
      ...f,
      recipe: recipeResArray[idx].data,
    }));

    setItems(merged);
    setLoading(false);
  };

  useEffect(() => {
    void fetchFavorites();
  }, []);

  /** トグル（追加・削除）*/
  const toggleFavorite = async (recipeId: number, favoriteId: number | null) => {
    if (favoriteId) {
      await apiClient.delete(`/api/favorites/${favoriteId}`);
    } else {
      await apiClient.post("/api/favorites", { favorite: { recipe_id: recipeId } });
    }
    await fetchFavorites();
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">読み込み中...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">これやる！リスト</h1>

      {items.length === 0 ? (
        <p className="text-gray-500">まだ作りたいレシピがありません。</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ id, recipe }) => {
            const totalP = recipe.ingredients.reduce((s, i) => s + i.protein, 0);
            const totalC = recipe.ingredients.reduce((s, i) => s + i.carbohydrate, 0);
            const totalF = recipe.ingredients.reduce((s, i) => s + i.fat, 0);

            return (
              <li key={id}>
                <Card>
                  <CardContent className="relative p-0">
                    <Link href={`/recipe/${recipe.id}`}>
                    <div className="relative w-full h-40">
                      <img
                        src={recipe.image_url || "/DALL.webp"}
                        alt={recipe.title}
                        className="w-full h-40 object-cover rounded-t"
                      />
                                          <WannaMakeButton
                      recipeId={recipe.id}
                      isFavorite={true}
                      favoriteId={id}
                      onToggleFavorite={toggleFavorite}
                      className="absolute bottom-2 right-2"
                    />
                    </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                        <div className="flex justify-between text-sm mb-2">
                          <span>¥{recipe.price}</span>
                          <span>
                            <Clock className="inline w-4 h-4" />
                            {recipe.cooking_time}分
                          </span>
                        </div>
                        <div className="text-xs">
                          P:{totalP}g C:{totalC}g F:{totalF}g
                        </div>
                      </div>
                    </Link>


                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
