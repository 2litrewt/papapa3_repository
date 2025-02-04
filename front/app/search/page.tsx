"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Bookmark, Clock, DollarSign, Apple } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function SearchResults() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true); // 🔹 検索中の状態を管理
  const searchParams = useSearchParams();
  const keyword = searchParams.get("query") || "";
  const time = searchParams.get("time");
  const price = searchParams.get("price");
  const nutrition = searchParams.get("nutrition");

  useEffect(() => {
    fetchRecipes();
  }, [keyword, time, price, nutrition]);

  const fetchRecipes = async () => {
    setLoading(true); // 🔹 検索開始時に `loading` を `true` にする
    try {
      const response = await axios.get(`http://localhost:3000/api/recipes`, {
        params: { keyword, cooking_time: time, price_range: price, nutrition_type: nutrition }
      });
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
    setLoading(false); // 🔹 検索完了後に `loading` を `false` にする
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-8">
      {/* 🔹 検索中のメッセージを表示 */}
      {loading ? (
        <p className="text-center text-gray-500 text-lg">検索中...</p>
      ) : recipes.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">該当するレシピがありません</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => {
            const totalProtein = recipe.ingredients.reduce((sum, ing) => sum + (ing.protein || 0), 0);
            const totalCarbohydrate = recipe.ingredients.reduce((sum, ing) => sum + (ing.carbohydrate || 0), 0);
            const totalFat = recipe.ingredients.reduce((sum, ing) => sum + (ing.fat || 0), 0);

            return (
              <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-0">
                    <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-5 h-5" />
                          <span>{recipe.likes || 0}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Bookmark className="w-5 h-5" />
                          <span>{recipe.favorites || 0}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span>{recipe.price}円</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{recipe.cooking_time}分</span>
                        </div>
                        <div className="flex items-center">
                          <Apple className="w-4 h-4 mr-1" />
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
}
