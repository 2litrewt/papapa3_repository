'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

interface Recipe {
  id: number;
  title: string;
  description: string;
}

const PostsPage = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/recipes?keyword=${encodeURIComponent(keyword)}`);
        setResults(response.data);
      } catch (err: any) {
        setError(err.message || 'Error fetching recipes');
      } finally {
        setLoading(false);
      }
    };

    if (keyword) {
      fetchRecipes();
    }
  }, [keyword]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>投稿一覧</h1>
      {results.length > 0 ? (
        <ul>
          {results.map((recipe) => (
            <li key={recipe.id}>
              <h2>{recipe.title}</h2>
              <p>{recipe.description}</p>
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
