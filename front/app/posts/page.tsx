'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

interface Recipe {
  id: number;
  title: string;
  description: string;
  cooking_time: number;
  price: number;
}

const PostsPage = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const sortBy = searchParams.get('sortBy') || 'created_at'; // ソート項目のデフォルト
  const order = searchParams.get('order') || 'asc'; // ソート順のデフォルト

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);

        // API リクエストを送信
        const response = await axios.get('/api/recipes', {
          params: { keyword, sortBy, order },
        });
        setRecipes(response.data); // 結果をステートに保存
      } catch (err: any) {
        setError(err.message || 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [keyword, sortBy, order]); // 検索条件が変わるたびに再リクエスト

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>投稿一覧</h1>
      {recipes.length > 0 ? (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
              <h2>{recipe.title}</h2>
              <p>{recipe.description}</p>
              <p>調理時間: {recipe.cooking_time} 分</p>
              <p>価格: {recipe.price} 円</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>該当するレシピがありません。</p>
      )}
    </div>
  );
};

export default PostsPage;
