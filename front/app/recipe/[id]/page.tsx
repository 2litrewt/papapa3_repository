"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Bookmark, Clock, DollarSign, Apple } from "lucide-react";

// ✅ Recipe 型を定義
interface Recipe {
  id: number;
  title: string;
  description: string;
  cooking_time: number;
  price: number;
  category_name: string;
  user_name: string;
  total_nutrition: { protein: number; carbohydrate: number; fat: number };
  ingredients: string[]; // ✅ 文字列の配列になっている
  steps: { step_number: number; instruction: string }[];
}

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const params = useParams();
  const recipeId = params?.id as string;

  // ✅ 環境変数から API のベースURLを取得
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    if (!recipeId) return;
    fetchRecipe();
  }, [recipeId]);

  const fetchRecipe = async () => {
    try {
      const apiUrl = `${API_BASE_URL}/api/recipes/${recipeId}`;
      console.log("🔍 [APIリクエスト] Fetching from:", apiUrl);
      const response = await axios.get(apiUrl);

      console.log("✅ [APIレスポンス] 取得したレシピ:", response.data);
      setRecipe(response.data);
    } catch (error) {
      console.error("❌ [エラー] レシピの取得に失敗しました:", error);
    }
  };

  if (!recipe) return <div className="text-center text-gray-500">読み込み中...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent>
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          <p className="text-gray-600 mb-4">{recipe.description}</p>
          <p className="text-sm text-gray-500">カテゴリー: {recipe.category_name}</p>
          <p className="text-sm text-gray-500">作成者: {recipe.user_name}</p>

          <div className="flex flex-wrap items-center gap-4 my-6">
            <div className="flex items-center">
              <Heart className="w-6 h-6 mr-2" />
              <span>いいね機能未実装</span>
            </div>
            <div className="flex items-center">
              <Bookmark className="w-6 h-6 mr-2" />
              <span>お気に入り機能未実装</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-1" />
              <span>時間: {recipe.cooking_time} 分</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-1" />
              <span>価格: {recipe.price} 円</span>
            </div>
          </div>

          <div className="flex items-center mt-3">
            <Apple className="w-5 h-5 mr-2" />
            <span>
              タンパク質: {recipe.total_nutrition.protein}g / 炭水化物: {recipe.total_nutrition.carbohydrate}g / 脂質: {recipe.total_nutrition.fat}g
            </span>
          </div>

          <h2 className="text-2xl font-semibold my-6">材料</h2>
          <ul className="list-disc list-inside mb-6">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li> // ✅ 文字列なのでそのまま表示
            ))}
          </ul>

          <h2 className="text-2xl font-semibold mb-4">調理手順</h2>
          <ol className="list-decimal list-inside">
            {recipe.steps.map((step, index) => (
              <li key={index} className="mb-4">
                <p className="mb-2">{step.instruction}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
