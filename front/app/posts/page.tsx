'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  profile_image: string;
}

interface Category {
  id: number;
  name: string;
}

interface Ingredient {
  id: number;
  name: string;
  protein: number;
  carbohydrate: number;
  fat: number;
}

interface Tag {
  id: number;
  name: string;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  cooking_time: number;
  price: number;
  image?: string;
  created_at: string;
  updated_at: string;
  user: User;
  category: Category;
  ingredients: Ingredient[];
  tags: Tag[];
}

const PostsPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL); // デバッグ用
    axios.get<Recipe[]>(process.env.NEXT_PUBLIC_API_URL || '')
      .then(response => {
        setRecipes(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message || 'Error fetching data');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">投稿一覧</h1>
      <ul className="space-y-4">
        {recipes.map(recipe => (
          <li key={recipe.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{recipe.title}</h2>
            <p className="text-gray-700">{recipe.description}</p>
            <p>調理時間: {recipe.cooking_time}分</p>
            <p>価格: {recipe.price}円</p>
            <p>カテゴリー: {recipe.category.name}</p>
            <p>作成者: {recipe.user.name}</p>
            {recipe.image && <img src={recipe.image} alt={recipe.title} className="w-64 h-auto mt-2" />}
            <div className="mt-2">
              <h3 className="font-semibold">材料:</h3>
              <ul className="list-disc list-inside">
                {recipe.ingredients.map(ing => (
                  <li key={ing.id}>{ing.name} - タンパク質: {ing.protein}g, 炭水化物: {ing.carbohydrate}g, 脂質: {ing.fat}g</li>
                ))}
              </ul>
            </div>
            <div className="mt-2">
              <h3 className="font-semibold">タグ:</h3>
              <ul className="flex space-x-2">
                {recipe.tags.map(tag => (
                  <li key={tag.id} className="bg-blue-200 text-blue-800 px-2 py-1 rounded">{tag.name}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsPage;
