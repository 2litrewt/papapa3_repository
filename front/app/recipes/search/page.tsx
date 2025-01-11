'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SearchForm from '@/components/SearchForm';

const SearchPage = () => {
  const router = useRouter();

  const handleSearch = (query: string) => {
    // 検索結果ページに遷移
    router.push(`/posts?keyword=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      <h1>レシピ検索</h1>
      <SearchForm onSearch={handleSearch} />
    </div>
  );
};

export default SearchPage;
