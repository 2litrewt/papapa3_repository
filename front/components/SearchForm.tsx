'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchForm from '@/components/SearchForm';

type Recipe = {
  id: number;
  title: string;
  description: string;
  cooking_time: number;
  price: number;
};

const RecipesPage = () => {
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // エラー状態を追加

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null); // エラーをリセット
        const query = searchParams ? new URLSearchParams(searchParams.toString()) : new URLSearchParams();
        const response = await fetch(`/api/recipes/search?${query.toString()}`);
        
        // ステータスコードを確認
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchParams]);

  return (
    <div>
      <h1>レシピ検索</h1>
      <SearchForm />
      {loading ? (
        <p>検索中...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>エラーが発生しました: {error}</p>
      ) : recipes.length === 0 ? (
        <p>該当するレシピが見つかりませんでした。</p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <h2>{recipe.title}</h2>
              <p>{recipe.description}</p>
              <p>調理時間: {recipe.cooking_time}分</p>
              <p>価格: ¥{recipe.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecipesPage;
