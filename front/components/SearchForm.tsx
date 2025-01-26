'use client';

import React, { useState } from 'react';

type SearchFormProps = {
  onSearch?: (query: {
    keyword: string;
    sortBy: string;
    order: string;
    cooking_time?: string;
    price_range?: string;
    nutrition_type?: string;
  }) => void;
};

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState(''); // ソート項目
  const [order, setOrder] = useState('asc'); // 昇降順
  const [cookingTime, setCookingTime] = useState(''); // 調理時間
  const [priceRange, setPriceRange] = useState(''); // 価格帯
  const [nutritionType, setNutritionType] = useState(''); // 栄養タイプ

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = {
      keyword,
      sortBy,
      order,
      cooking_time: cookingTime,
      price_range: priceRange,
      nutrition_type: nutritionType,
    };

    console.log('送信されるクエリ:', query); // デバッグ用

    try {
      const queryString = new URLSearchParams(query).toString();
      console.log('生成されたクエリパラメータ:', queryString); // デバッグ用
      if (onSearch) {
        onSearch(query); // クエリパラメータを渡す
      }
    } catch (error) {
      console.error('クエリパラメータ生成中にエラー:', error);
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

      {/* 調理時間 */}
      <select
        value={cookingTime}
        onChange={(e) => setCookingTime(e.target.value)}
        style={{ padding: '8px', fontSize: '16px', width: '100%' }}
      >
        <option value="">調理時間を選択</option>
        <option value="short">30分以内</option>
        <option value="medium">30分〜1時間</option>
        <option value="long">1時間以上</option>
      </select>

      {/* 価格帯 */}
      <select
        value={priceRange}
        onChange={(e) => setPriceRange(e.target.value)}
        style={{ padding: '8px', fontSize: '16px', width: '100%' }}
      >
        <option value="">価格帯を選択</option>
        <option value="low">~500円</option>
        <option value="medium">500円~1000円</option>
        <option value="high">1000円~</option>
      </select>

      {/* 栄養タイプ */}
      <select
        value={nutritionType}
        onChange={(e) => setNutritionType(e.target.value)}
        style={{ padding: '8px', fontSize: '16px', width: '100%' }}
      >
        <option value="">栄養タイプを選択</option>
        <option value="low_calorie">低カロリー</option>
        <option value="high_protein">高タンパク</option>
        <option value="low_carb">低糖質</option>
        <option value="low_fat">低脂質</option>
      </select>

      {/* 検索ボタン */}
      <button type="submit" style={{ padding: '10px', fontSize: '16px' }}>
        検索
      </button>
    </form>
  );
};

export default SearchForm;
