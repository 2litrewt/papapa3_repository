"use client";

import { useState } from "react";

interface WannaMakeButtonProps {
  recipeId: number;
  isFavorite: boolean;
  favoriteId: number | null;
  onToggleFavorite: (recipeId: number, favoriteId: number | null) => Promise<void>;
  className?: string;
}

/**
 * UI ボタンのみを担当し、
 * 追加・削除の処理は親コンポーネントの onToggleFavorite に任せる
 */
export function WannaMakeButton({
  recipeId,
  isFavorite,
  favoriteId,
  onToggleFavorite,
  className = ""
}: WannaMakeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onToggleFavorite(recipeId, favoriteId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${className} px-4 py-2 rounded-full shadow transition ${
        isFavorite ? "bg-orange-400 text-white" : "bg-white text-gray-700"
      }`}
    >
      {isFavorite ? "作りたい！" : "作りたい！"}
    </button>
  );
}
