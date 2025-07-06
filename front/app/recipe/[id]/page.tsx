"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, Apple } from "lucide-react";
import { WannaMakeButton } from "@/components/ui/WannaMakeButton";

interface Ingredient { name: string; quantity: number }
interface Recipe {
  id: number;
  title: string;
  description: string;
  cooking_time: number;
  price: number;
  user_name: string;
  total_nutrition: { protein: number; carbohydrate: number; fat: number };
  ingredients: Ingredient[];
  steps: { step_number: number; instruction: string }[];
  image_url?: string;
  is_favorite: boolean;
  favorite_id: number | null;
}

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  /** レシピ取得 */
  const fetchRecipe = async () => {
    const res = await apiClient.get<Recipe>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/recipes/${id}`
    );
    console.log("🔍 fetchRecipe のレスポンス:", res.data);
    setRecipe(res.data);
  };

  /** マウント時 & ID 変更時に呼び出し */
  useEffect(() => {
    void fetchRecipe();
  }, [id]);

  /** 追加／削除トグル */
  const toggleFavorite = async (recipeId: number, favoriteId: number | null) => {
    if (favoriteId) {
      await apiClient.delete(`/api/favorites/${favoriteId}`);
      console.log("→ delete called");

    } else {
      await apiClient.post("/api/favorites", { favorite: { recipe_id: recipeId } });
      console.log("→ post called");
    }
    // ← ここで「詳細を再取得」して is_favorite/favorite_id を更新
    await fetchRecipe();

  console.log("★ toggleFavorite end, new recipe:", recipe);
  };

  if (!recipe) return <p className="text-center py-8">読み込み中…</p>;
  const { total_nutrition: n } = recipe;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="-mx-4 relative">
        <img
          src={recipe.image_url ?? "/DALL.webp"}
          className="w-screen h-[300px] object-cover"
        />
        <WannaMakeButton
          recipeId={recipe.id}
          isFavorite={recipe.is_favorite}
          favoriteId={recipe.favorite_id}
          onToggleFavorite={toggleFavorite}
          className="absolute bottom-4 right-4"
        />
      </div>

      <Card>
        <CardContent>
          <h1 className="text-3xl font-bold mt-6 mb-2">{recipe.title}</h1>
          <p className="mb-4">{recipe.description}</p>

          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {recipe.cooking_time}分
            </span>
            <span className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              ¥{recipe.price}
            </span>
          </div>

          <div className="flex items-center mb-6 text-sm">
            <Apple className="w-4 h-4 mr-2" />
            P:{n.protein}g / C:{n.carbohydrate}g / F:{n.fat}g
          </div>

            {/* 材料部分 */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">材料</h2>
              <ul className="list-none p-0 mb-6">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between border-b border-dotted border-gray-300 pb-1 mb-2">
                    <span>{ingredient.name}</span>
                    <span className="font-medium">{ingredient.quantity}g</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 調理手順部分 */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">調理手順</h2>
              <ol className="list-decimal list-inside">
                {recipe.steps ? (
                  recipe.steps.map((step, index) => (
                    <li key={index} className="mb-4">
                      <p className="ml-1 inline-block">{step.instruction}</p>
                    </li>
                  ))
                ) : (
                  <p>調理手順がありません</p>
                )}
                  </ol>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
