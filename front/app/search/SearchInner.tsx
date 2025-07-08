"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

type Recipe = {
  id: number;
  title: string;
  imageUrl: string;
};

// 本機能
export default function SearchInner() {
  const params = useSearchParams();
  const query = params.get('q') || '';

  const [results, setResults] = useState<Recipe[]>([]);    // 検索結果
  const [loading, setLoading] = useState(false);           // 読み込み中フラグ
  const [error, setError] = useState<string | null>(null); // エラーメッセージ

  useEffect(() => {
    // query が空なら何もしない
    if (!query) {
      setResults([]);
      return;
    }

    fetch(`/api/recipes?search=${encodeURIComponent(query)}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data: Recipe[]) => {
      setResults(data);
    })
    .catch(err => {
      setError(err.message);
    })
    .finally(() => {
      setLoading(false);
    });
}, [query]);

  // ここで query を使った検索ロジックやレンダリングを行う
  return <div>検索キーワード: {query}</div>;
}

