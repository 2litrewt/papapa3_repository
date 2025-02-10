"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; 
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Bookmark, Clock, DollarSign, Apple } from "lucide-react";
import Image from "next/image";

// ✅ Recipe 型を定義
interface Recipe {
  id: number;
  title: string;
  image: string;
  likes: number;
  favorites: number;
  cooking_time: number;
  price: number;
  ingredients: { name: string; protein: number; carbohydrate: number; fat: number }[];
  steps: { step_number: number; instruction: string }[];
}

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();
  const params = useParams(); // 🔹 useParams で id を取得
  const recipeId = params?.id as string; // 🔹 型安全のため `as string` を追加

  useEffect(() => {
    if (!recipeId) return; // 🔹 `id` が未定義の場合は処理しない
    fetchRecipe();
  }, [recipeId]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/recipes/${recipeId}`);
      setRecipe(response.data);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  };

  if (!recipe) return <div className="text-center text-gray-500">読み込み中...</div>;

  // 栄養価の合計を計算
  const totalProtein = recipe.ingredients.reduce((sum, ing) => sum + (ing.protein || 0), 0);
  const totalCarbohydrate = recipe.ingredients.reduce((sum, ing) => sum + (ing.carbohydrate || 0), 0);
  const totalFat = recipe.ingredients.reduce((sum, ing) => sum + (ing.fat || 0), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent>
          <Image src={recipe.image || "/placeholder.svg"} alt={recipe.title} width={400} height={300} className="w-full h-[400px] object-cover mb-6" />
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>

          {/* いいね & お気に入り */}
          <div className="flex flex-wrap items-center gap-4 my-6">
            <div className="flex items-center">
              <Heart className="w-6 h-6 mr-2" />
              <span>{recipe.likes || 0} いいね</span>
            </div>
            <div className="flex items-center">
              <Bookmark className="w-6 h-6 mr-2" />
              <span>{recipe.favorites || 0} お気に入り</span>
            </div>
          </div>

          {/* 時間 & 価格 */}
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

          {/* 栄養価 */}
          <div className="flex items-center mt-3">
            <Apple className="w-5 h-5 mr-2" />
            <span>
              タンパク質: {totalProtein.toFixed(1)}g / 炭水化物: {totalCarbohydrate.toFixed(1)}g / 脂質: {totalFat.toFixed(1)}g
            </span>
          </div>

          {/* 材料 */}
          <h2 className="text-2xl font-semibold my-6">材料</h2>
          <ul className="list-disc list-inside mb-6">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient.name}</li>
            ))}
          </ul>

          {/* 調理手順 */}
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
