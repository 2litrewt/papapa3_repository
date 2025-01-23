'use client';

import React, { useState } from 'react';

type SearchFormProps = {
  onSearch?: (query: { keyword: string; sortBy: string; order: string }) => void;
};

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState(''); // ソート項目
  const [order, setOrder] = useState('asc'); // 昇降順

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ keyword, sortBy, order });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* 検索窓 */}
      <input
        type="text"
        placeholder="キーワードを入力"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ padding: '8px', fontSize: '16px', width: '100%' }}
      />

      {/* ソート項目 */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        style={{ padding: '8px', fontSize: '16px', width: '100%' }}
      >
        <option value="">ソート項目を選択</option>
        <option value="price">コスト</option>
        <option value="cooking_time">調理時間</option>
        <option value="nutrition_value">栄養価</option>
      </select>

      {/* 昇降順 */}
      <select
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        style={{ padding: '8px', fontSize: '16px', width: '100%' }}
      >
        <option value="asc">昇順</option>
        <option value="desc">降順</option>
      </select>

      {/* 検索ボタン */}
      <button type="submit" style={{ padding: '10px', fontSize: '16px' }}>
        検索
      </button>
    </form>
  );
};

export default SearchForm;
 