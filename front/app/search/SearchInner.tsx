"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import apiClient from "@/lib/axios";
import { WannaMakeButton } from "@/components/ui/WannaMakeButton";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import RecipeCard from "@/components/RecipeCard";

interface Recipe {
  id: number;
  title: string;
  price: number;
  cooking_time: number;
  ingredients: { protein: number; carbohydrate: number; fat: number }[];
  image_url?: string;
  category?: { name: string } | string; // カテゴリ名 or オブジェクト
  tags?: { name: string }[] | string[]; // タグの配列（文字列 or オブジェクト）
}

interface Favorite {
  id: number;
  recipe_id: number;
}

export default function SearchInner() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { user: currentUser } = useAuth();

  // URLクエリ
  const searchParams = useSearchParams();
  const keyword = searchParams.get("query") || "";
  const categoryParam = searchParams.get("category") || "";
  const tagParam = searchParams.get("tag") || "";

  // ヘルパ（nameを取り出す）
  type MaybeNamed = string | { name: string };
  const toName = (v?: MaybeNamed) => (typeof v === "string" ? v : v?.name ?? "");
  const toNameArray = (v?: MaybeNamed[] | MaybeNamed) =>
    Array.isArray(v) ? v.map(toName) : v ? [toName(v)] : [];

  // ───────── データ取得 ─────────
  const fetchRecipes = async () => {
    console.time("fetchRecipes");
    setLoading(true);
    try {
      console.log("[START] params:", { keyword, categoryParam, tagParam });

      const res = await apiClient.get<Recipe[]>("/api/recipes", {
        params: {
          keyword,
          category: categoryParam || undefined,
          tag: tagParam || undefined,
        },
      });

      let list: Recipe[] = res.data;
      console.log("[API] total:", list.length);

      setRecipes(res.data);

      console.log("[DONE] setRecipes:", list.length);
    } finally {
      setLoading(false);
      console.timeEnd("fetchRecipes");
    }
  };

  const fetchFavorites = async () => {
    if (!currentUser) {
      setFavorites([]);
      return;
    }
    try {
      const res = await apiClient.get<Favorite[]>("/api/favorites");
      setFavorites(res.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setFavorites([]);
        return;
      }
      throw err;
    }
  };

  useEffect(() => {
    void fetchRecipes();
    void fetchFavorites();
  }, [keyword, categoryParam, tagParam, currentUser]);

  // ───────── お気に入り トグル ─────────
  const toggleFavorite = async (recipeId: number, favoriteId: number | null) => {
    if (!currentUser) {
      alert("お気に入り機能を使うにはログインが必要です。");
      return;
    }
    if (favoriteId) {
      await apiClient.delete(`/api/favorites/${favoriteId}`);
    } else {
      await apiClient.post("/api/favorites", { favorite: { recipe_id: recipeId } });
    }
    await fetchFavorites();
  };

  if (loading) return <p className="text-center py-8">読み込み中…</p>;

  return (
    <div className="p-4">
      {(tagParam || categoryParam) && (
        <p className="mb-4 inline-block rounded border border-black px-3 py-1 text-sm">
          {tagParam ? `「${tagParam}」で絞り込み中` : `「${categoryParam}」で絞り込み中`}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((r) => {
          const fav = favorites.find((f) => f.recipe_id === r.id) ?? null;

          // 栄養値（未定義ガード）
          const ings = Array.isArray(r.ingredients) ? r.ingredients : [];
          const totalP = ings.reduce((s, i) => s + (Number(i.protein) ?? 0), 0);
          const totalC = ings.reduce((s, i) => s + (Number(i.carbohydrate) ?? 0), 0);
          const totalF = ings.reduce((s, i) => s + (Number(i.fat) ?? 0), 0);

          return (
            <div
              key={r.id}
              role="link"
              tabIndex={0}
              className="cursor-pointer"
              onClick={() => router.push(`/recipe/${r.id}`)} // カード全体クリックで詳細へ
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(`/recipe/${r.id}`);
                }
              }}
            >
              <RecipeCard
                id={r.id}
                title={r.title}
                imageUrl={r.image_url}
                price={r.price}
                cookingTime={r.cooking_time}
                category={r.category}
                tags={r.tags}
                rightTopSlot={
                  <WannaMakeButton
                    recipeId={r.id}
                    isFavorite={!!fav}
                    favoriteId={fav?.id ?? null}
                    onToggleFavorite={toggleFavorite}
                  />
                }
                footerSlot={
                  <div className="text-xs">
                    P:{totalP}g C:{totalC}g F:{totalF}g
                  </div>
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
