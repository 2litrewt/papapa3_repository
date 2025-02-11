"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

// ✅ Recipe 型を定義
interface Recipe {
  id: number;
  title: string;
  description: string;
  cooking_time: number;
  price: number;
}

const PostsPageContent = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams(); // URLからクエリパラメータを取得

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const queryString = searchParams.toString();
        const response = await axios.get(`/api/recipes${queryString ? `?${queryString}` : ""}`);
        setRecipes(response.data);
      } catch {
        setError("エラーが発生しました"); // ✅ `err` を削除し、単純にエラーメッセージをセット
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchParams]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">投稿一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <Link href={`/recipes/${recipe.id}`}>
              <h2 className="text-lg font-semibold text-blue-600 hover:underline">{recipe.title}</h2>
            </Link>
            <p className="text-gray-700">{recipe.description}</p>
            <p className="text-sm text-gray-500">調理時間: {recipe.cooking_time} 分</p>
            <p className="text-sm text-gray-500">価格: {recipe.price} 円</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ✅ Suspense で `useSearchParams()` をラップする
export default function PostsPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-500">読み込み中...</p>}>
      <PostsPageContent />
    </Suspense>
  );
}
