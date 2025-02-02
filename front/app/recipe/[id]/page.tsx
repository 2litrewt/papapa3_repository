"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Bookmark, Clock, DollarSign, Apple } from "lucide-react";

export default function RecipeDetail({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchRecipe();
  }, [params.id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/recipes/${params.id}`);
      setRecipe(response.data);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  };

  if (!recipe) return <div className="text-center text-gray-500">読み込み中...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent>
          <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} className="w-full h-[400px] object-cover mb-6" />
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          <div className="flex flex-wrap items-center gap-4 my-6">
            <div className="flex items-center">
              <Heart className="w-6 h-6 mr-2" />
              <span>{recipe.likes || 0} いいね</span>
            </div>
            <div className="flex items-center">
              <Bookmark className="w-6 h-6 mr-2" />
              <span>{recipe.favorites || 0} お気に入り</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-6 h-6 mr-2" />
              <span>時間: {recipe.cooking_time} 分</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-6 h-6 mr-2" />
              <span>価格: {recipe.price} 円</span>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-4">材料</h2>
          <ul className="list-disc list-inside mb-6">
            {recipe.ingredients.map((ingredient: string, index: number) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <h2 className="text-2xl font-semibold mb-4">調理手順</h2>
          <ol className="list-decimal list-inside">
            {recipe.steps.map((step: { step_number: number, instruction: string }, index: number) => (
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
