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
import RecipeCard from "@/components/RecipeCard";

interface Recipe {
  id: number;
  title: string;
  price: number;
  cooking_time: number;
  ingredients: { protein: number; carbohydrate: number; fat: number }[];
  image_url?: string;
  // カテゴリ名あるいはオブジェクト（Rails API の仕様に合わせて）
  category?: { name: string } | string;
  // レシピに紐づくタグの配列。タグオブジェクトまたは文字列の配列を想定。
  tags?: { name: string }[] | string[];
  genre?: { name: string }[] | string[];
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

  // URL クエリからキーワード、カテゴリ、タグを取得
  const searchParams = useSearchParams();
  const keyword = searchParams.get("query") || "";
  const categoryParam = searchParams.get("category") || "";
  const tagParam = searchParams.get("tag") || "";
  const genreParam = searchParams.get("genre") || "";

  type MaybeNamed = string | { name: string };
  const toName = (v?: MaybeNamed) =>
    typeof v === "string" ? v : v?.name ?? "";
  const toNameArray = (v?: MaybeNamed[] | MaybeNamed) =>
    Array.isArray(v) ? v.map(toName) : v ? [toName(v)] : [];

  // ───────── データ取得 ─────────
  const fetchRecipes = async () => {
    console.time("fetchRecipes"); // 処理全体の計測開始
    setLoading(true);
    try {
      console.log("[START] params:", {
        keyword,
        categoryParam,
        tagParam,
        genreParam,
      });
  
      const res = await apiClient.get<Recipe[]>("/api/recipes", {
        params: {
          keyword,
          category: categoryParam || undefined,
          tag: tagParam || undefined,
          genre: genreParam || undefined, // ← 誤字に注意
        },
      });
  
      let list: Recipe[] = res.data;
      console.log("[API] total:", list.length); // 受信件数
  
      if (categoryParam) {
        list = list.filter((r) => toName(r.category) === categoryParam);
        console.log("[FILTER] category ->", list.length);
      }
      if (genreParam) {
        const hasGenre = (r: Recipe) => toNameArray(r.genre).includes(genreParam);
        list = list.filter(hasGenre);
        console.log("[FILTER] genre ->", list.length);
      }
      if (tagParam) {
        const hasTag = (r: Recipe) => toNameArray(r.tags as any).includes(tagParam);
        list = list.filter(hasTag);
        console.log("[FILTER] tag ->", list.length);
      }
  
      setRecipes(list);
      console.log("[DONE] setRecipes:", list.length); // 最終件数
    } finally {
      setLoading(false);
      console.timeEnd("fetchRecipes"); // 処理全体の計測終了
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
  }, [keyword, categoryParam, tagParam, genreParam, currentUser]);

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
    <div className="p-4">
      {(tagParam || categoryParam) && (
        <p className="mb-4 inline-block rounded border border-black px-3 py-1 text-sm">
          {tagParam
            ? `「${tagParam}」で絞り込み中`
            : `「${categoryParam}」で絞り込み中`}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((r) => {
          const fav = favorites.find((f) => f.recipe_id === r.id) ?? null;

          const ings = Array.isArray(r.ingredients) ? r.ingredients : []; // （ガード＝安全装置）
          const totalP = ings.reduce((s, i) => s + (Number(i.protein) ?? 0), 0);
          const totalC = ings.reduce((s, i) => s + (Number(i.carbohydrate) ?? 0), 0);
          const totalF = ings.reduce((s, i) => s + (Number(i.fat) ?? 0), 0);

          return (
            <Link href={`/recipe/${r.id}`} key={r.id} className="cursor-pointer">
              <RecipeCard
                id={r.id}
                title={r.title}
                imageUrl={r.image_url}
                price={r.price}
                cookingTime={r.cooking_time}
                category={r.category}          // 文字列 or {name:string} どちらでもOK
                genre={Array.isArray(r.genre) ? r.genre[0] : r.genre}                // プロジェクトで使っていれば渡す
                tags={r.tags}                  // ["#簡単", {name:"#夕食"}] などOK

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
            </Link>
          );
        })}
      </div>
    </div>
  );
}
