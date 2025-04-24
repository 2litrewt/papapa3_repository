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
  image_url?: string; 
}

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const params = useParams();
  const recipeId = params?.id as string;

  // ✅ 環境変数から API のベースURLを取得
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  

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

  const imageUrl = recipe.image_url ?? "/DALL.webp";
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="-mx-4">
        <img
          src={imageUrl}
          alt={`${recipe.title}の画像`}
          className="w-screen h-[300px] object-cover"
        />
      </div>
      <Card>
        <CardContent>
          <h1 className="text-3xl font-bold mt-6 mb-2">{recipe.title}</h1>
          <p className="text-gray-600 mb-4">{recipe.description}</p>
          <p className="text-sm text-gray-500">作成者: {recipe.user_name}</p>
  
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
  
          <div className="flex items-center mt-3 mb-6">
            <Apple className="w-5 h-5 mr-2" />
            <span>
              タンパク質: {recipe.total_nutrition.protein}g / 炭水化物: {recipe.total_nutrition.carbohydrate}g / 脂質: {recipe.total_nutrition.fat}g
            </span>
          </div>
  
          {/* 材料と調理手順を横に並べる */}
          <div className="grid md:grid-cols-2 gap-6">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}