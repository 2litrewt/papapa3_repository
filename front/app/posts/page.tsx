'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface TotalNutrition {
  protein: number;
  carbohydrate: number;
  fat: number;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  cooking_time: number;
  price: number;
  total_nutrition: TotalNutrition; // 合計栄養素
}

const PostsPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/recipes');
        setRecipes(response.data); // 結果を保存
      } catch (err: any) {
        setError(err.message || 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">投稿一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <Link href={`/recipes/${recipe.id}`}>
              <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                {recipe.title}
              </h2>
            </Link>
            <p className="text-sm text-gray-500">調理時間: {recipe.cooking_time} 分</p>
            <p className="text-sm text-gray-500">価格: {recipe.price} 円</p>
            <h3 className="font-bold mt-4">栄養素</h3>
            <p>タンパク質: {recipe.total_nutrition.protein}g</p>
            <p>炭水化物: {recipe.total_nutrition.carbohydrate}g</p>
            <p>脂質: {recipe.total_nutrition.fat}g</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsPage;
