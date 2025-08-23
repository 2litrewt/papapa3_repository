"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/axios";
import axios from "axios"; // ← ① axiosを使うなら必須
import { Card, CardContent } from "@/components/ui/card";
import { Clock, DollarSign, Apple } from "lucide-react";
import { WannaMakeButton } from "@/components/ui/WannaMakeButton";

interface Ingredient { name: string; quantity: number }
interface Recipe {
  id: number;
  title: string;
  description: string;
  cooking_time: number;
  price: number;
  user_name: string;
  total_nutrition: { protein: number; carbohydrate: number; fat: number };
  ingredients: Ingredient[];
  steps: { step_number: number; instruction: string }[];
  image_url?: string;
  is_favorite: boolean;
  favorite_id: number | null;
}

export default function RecipeDetail() {
  // ② useParamsは1回だけ。idの重複定義を解消
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /** レシピ取得：相対パスで apiClient を使用（CORS/認証差分を無くす） */
  const fetchRecipe = async () => {
    if (!id) return; // id未確定ガード
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<Recipe>(`/api/recipes/${id}`);
      setRecipe(res.data);
    } catch (err) {
      // ③ 未ログインで保護されている場合の401はユーザ向けメッセージに
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("このレシピを見るにはログインが必要です。");
      } else {
        setError("レシピの取得に失敗しました。時間をおいて再度お試しください。");
      }
    } finally {
      setLoading(false);
    }
  };

  /** マウント時 & ID 変更時に呼び出し */
  useEffect(() => {
    void fetchRecipe(); // Promise未捕捉ワーニング回避
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /** 追加／削除トグル：完了後に詳細を再取得してUIを同期 */
  const toggleFavorite = async (recipeId: number, favoriteId: number | null) => {
    try {
      if (favoriteId) {
        await apiClient.delete(`/api/favorites/${favoriteId}`);
      } else {
        await apiClient.post("/api/favorites", { favorite: { recipe_id: recipeId } });
      }
      await fetchRecipe(); // ← is_favorite / favorite_id を最新化
    } catch (err) {
      // 401などはここでも握っておくとUXが崩れにくい
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        alert("お気に入り機能を使うにはログインが必要です。");
        return;
      }
      throw err;
    }
  };

  // ④ 描画フェーズの順番：loading → error → data
  if (loading) return <p className="text-center py-8">読み込み中…</p>;
  if (error) return <p className="text-center py-8 text-red-600">{error}</p>;
  if (!recipe) return <p className="text-center py-8">レシピが見つかりませんでした。</p>;

  const { total_nutrition: n } = recipe;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="-mx-4 relative">
        <img
          src={recipe.image_url ?? "/DALL.webp"}
          alt={recipe.title}
          className="w-screen h-[300px] object-cover"
        />
        <WannaMakeButton
          recipeId={recipe.id}
          isFavorite={recipe.is_favorite}
          favoriteId={recipe.favorite_id}
          onToggleFavorite={toggleFavorite}
          className="absolute bottom-4 right-4"
        />
      </div>

      <Card>
        <CardContent>
          <h1 className="text-3xl font-bold mt-6 mb-2">{recipe.title}</h1>
          <p className="mb-4">{recipe.description}</p>

          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {recipe.cooking_time}分
            </span>
            <span className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              ¥{recipe.price}
            </span>
          </div>

          <div className="flex items-center mb-6 text-sm">
            <Apple className="w-4 h-4 mr-2" />
            P:{n.protein}g / C:{n.carbohydrate}g / F:{n.fat}g
          </div>

          {/* 材料部分 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">材料</h2>
            <ul className="list-none p-0 mb-6">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex justify-between border-b border-dotted border-gray-300 pb-1 mb-2"
                >
                  <span>{ingredient.name}</span>
                  <span className="font-medium">{ingredient.quantity}g</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 調理手順部分 */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">調理手順</h2>
            <ol className="list-decimal list-inside">
              {recipe.steps?.length ? (
                recipe.steps.map((step, index) => (
                  <li key={index} className="mb-4">
                    <p className="ml-1 inline-block">{step.instruction}</p>
                  </li>
                ))
              ) : (
                <p>調理手順がありません</p>
              )}
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
