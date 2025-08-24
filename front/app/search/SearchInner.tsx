"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { useSearchParams } from "next/navigation";
import apiClient from "@/lib/axios";
import { WannaMakeButton } from "@/components/ui/WannaMakeButton";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface Recipe {
  id: number;
  title: string;
  price: number;
  cooking_time: number;
  ingredients: { protein: number; carbohydrate: number; fat: number }[];
  image_url?: string;
}

interface Favorite {
  id: number;
  recipe_id: number;
}

export default function SearchInner() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const { user: currentUser } = useAuth();

  const keyword = useSearchParams().get("query") || "";

  // ───────── データ取得 ─────────
  const fetchRecipes = async () => {
    setLoading(true);
    try {
    const res = await apiClient.get<Recipe[]>("/api/recipes", { params: { keyword } });
    setRecipes(res.data);
  } finally {
    setLoading(false);
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
      // --- 401（未認証）は想定内：空配列にして終了 ---
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setFavorites([]);
        return;
      }
      // --- それ以外は上層で検知できるよう再throw（開発時のため） ---
      throw err;
    }
  };

  useEffect(() => {
    void fetchRecipes();
    void fetchFavorites();
  }, [keyword, currentUser]);

  // ───────── 追加／削除トグル ─────────
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {recipes.map((r) => {
        const fav = favorites.find((f) => f.recipe_id === r.id) ?? null;
        const totalP = r.ingredients.reduce((s, i) => s + i.protein, 0);
        const totalC = r.ingredients.reduce((s, i) => s + i.carbohydrate, 0);
        const totalF = r.ingredients.reduce((s, i) => s + i.fat, 0);

        return (
          <Link href={`/recipe/${r.id}`} key={r.id} className="cursor-pointer">
            <Card>
              <CardContent className="relative p-0">
                <div className="relative w-full h-40">
                  <img
                    src={r.image_url || "/DALL.webp"}
                    alt={r.title}
                    className="w-full h-full object-cover rounded-t"
                  />
                  <WannaMakeButton
                    recipeId={r.id}
                    isFavorite={!!fav}
                    favoriteId={fav?.id ?? null}
                    onToggleFavorite={toggleFavorite}
                    className="absolute bottom-2 right-2"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{r.title}</h3>
                  <div className="flex justify-between text-sm mb-2">
                    <span>¥{r.price}</span>
                    <span>
                      <Clock className="inline w-4 h-4" />
                      {r.cooking_time}分
                    </span>
                  </div>
                  <div className="text-xs mb-2">
                    P:{totalP}g C:{totalC}g F:{totalF}g
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
