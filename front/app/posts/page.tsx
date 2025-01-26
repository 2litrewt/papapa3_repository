'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

interface Ingredient {
  id: number;
  name: string;
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
  ingredients: Ingredient[];
  user: { name: string; profile_image: string };
  category: { name: string };
}

const PostsPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams(); // URLからクエリパラメータを取得

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);

        // クエリパラメータを生成
        const queryString = searchParams.toString();
        const response = await axios.get(`/api/recipes${queryString ? `?${queryString}` : ''}`);

        setRecipes(response.data);
      } catch (err: any) {
        setError(err.message || 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchParams]); // クエリパラメータが変わるたびに再実行

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">投稿一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => {
          const totalProtein = recipe.ingredients.reduce((sum, ing) => sum + ing.protein, 0);
          const totalCarbohydrate = recipe.ingredients.reduce((sum, ing) => sum + ing.carbohydrate, 0);
          const totalFat = recipe.ingredients.reduce((sum, ing) => sum + ing.fat, 0);

          return (
            <div
              key={recipe.id}
              className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <Link href={`/recipes/${recipe.id}`}>
                <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                  {recipe.title}
                </h2>
              </Link>
              <p className="text-gray-700">{recipe.description}</p>
              <p className="text-sm text-gray-500">調理時間: {recipe.cooking_time} 分</p>
              <p className="text-sm text-gray-500">価格: {recipe.price} 円</p>
              <h3 className="font-bold mt-4">栄養素</h3>
              <p>タンパク質: {totalProtein.toFixed(1)}g</p>
              <p>炭水化物: {totalCarbohydrate.toFixed(1)}g</p>
              <p>脂質: {totalFat.toFixed(1)}g</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostsPage;
