'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SearchForm from '@/components/SearchForm';

const SearchPage = () => {
  const router = useRouter();

  const handleSearch = (query: {
    keyword?: string;
    sortBy?: string;
    order?: string;
    cooking_time?: string;
    price_range?: string;
    nutrition_type?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (query.keyword) searchParams.append('keyword', query.keyword);
    if (query.sortBy) searchParams.append('sortBy', query.sortBy);
    if (query.order) searchParams.append('order', query.order);
    if (query.cooking_time) searchParams.append('cooking_time', query.cooking_time);
    if (query.price_range) searchParams.append('price_range', query.price_range);
    if (query.nutrition_type) searchParams.append('nutrition_type', query.nutrition_type);

    console.log('生成されたクエリ:', searchParams.toString()); // デバッグ用

    try {
      router.push(`/posts?${searchParams.toString()}`);
    } catch (error) {
      console.error('検索クエリ生成中にエラー:', error);
    }
  };

  return (
    <div>
      <h1>レシピ検索</h1>
      <SearchForm onSearch={handleSearch} />
    </div>
  );
};

export default SearchPage;
