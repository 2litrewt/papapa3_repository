'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SearchForm from '@/components/SearchForm';

const SearchPage = () => {
  const router = useRouter();

  const handleSearch = (query: { keyword: string; sortBy: string; order: string }) => {
    const { keyword, sortBy, order } = query;

    // クエリパラメータを生成して /posts に遷移
    const searchParams = new URLSearchParams();
    if (keyword) searchParams.append('keyword', keyword);
    if (sortBy) searchParams.append('sortBy', sortBy);
    if (order) searchParams.append('order', order);

    router.push(`/posts?${searchParams.toString()}`);
  };

  return (
    <div>
      <h1>レシピ検索</h1>
      <SearchForm onSearch={handleSearch} />
    </div>
  );
};

export default SearchPage;
