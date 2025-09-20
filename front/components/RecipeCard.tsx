"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type MaybeNamed = string | { name: string };

// toName（名前取り出し：string か {name} を文字列に）
function toName(v?: MaybeNamed): string {
  if (!v) return "";
  return typeof v === "string" ? v : v.name ?? "";
}

// toNameArray（配列正規化：文字列/オブジェクト/配列 → 文字列配列）
function toNameArray(v: any): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map((i) => (typeof i === "string" ? i : i.name ?? "")).filter(Boolean);
  if (typeof v === "string") return [v];
  if (typeof v === "object" && v.name) return [v.name];
  return [];
}

export type RightSlotPlacement = "image" | "title" | "body-bottom";

export interface RecipeCardProps {
  id: number | string;
  title: string;
  imageUrl?: string | null;
  price?: number | null;
  cookingTime?: number | null;
  category?: MaybeNamed;        // カテゴリ（大分類）
  tags?: MaybeNamed[];          // タグ（細かな特徴：複数）

  rightTopSlot?: React.ReactNode;             // 差し込みボタン（例：WannaMakeButton）
  rightTopSlotPlacement?: RightSlotPlacement; // 画像 / タイトル行 / 本文右下 から選択（デフォルト: 画像）
  footerSlot?: React.ReactNode;               // 下部の追加領域
  onImageClickCapture?: (e: React.MouseEvent) => void;
}

export default function RecipeCard({
  id,
  title,
  imageUrl,
  price,
  cookingTime,
  category,
  tags = [],
  rightTopSlot,
  rightTopSlotPlacement = "image",
  footerSlot,
  onImageClickCapture,
}: RecipeCardProps) {
  const router = useRouter();
  const categoryName = toName(category);
  const tagNames = toNameArray(tags);

  return (
    <Card className="overflow-hidden">
      <CardContent className="relative p-0">
        {/* 画像 */}
        <div className="relative w-full h-40">
          <Image
            src={imageUrl || "/DALL.webp"}
            alt={title}
            width={800}
            height={450}
            className="w-full h-full object-cover rounded-t"
            // priority // 上部で使うカードなら有効化（LCP対策）
            unoptimized
            onClickCapture={onImageClickCapture}
          />

          {/* 配置: 画像右上 */}
          {rightTopSlot && rightTopSlotPlacement === "image" && (
            <div
              className="absolute bottom-2 right-2"
              onClick={(e) => e.stopPropagation()}
            >
              {rightTopSlot}
            </div>
          )}
        </div>

        {/* 本文エリア */}
        <div className="p-4">
          {/* タイトル行（右側にボタンを置ける） */}
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg">{title}</h3>

            {/* 配置: タイトル行右側 */}
            {rightTopSlot && rightTopSlotPlacement === "title" && (
              <div onClick={(e) => e.stopPropagation()}>{rightTopSlot}</div>
            )}
          </div>

          {/* カテゴリ（button + router.push で遷移） */}
          {categoryName && (
            <div className="mt-1">
              <button
                type="button"
                aria-label={`カテゴリ ${categoryName} で検索`}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/search?category=${encodeURIComponent(categoryName)}`);
                }}
                className="px-2 py-1 border border-black rounded text-xs hover:bg-gray-100"
              >
                {categoryName}
              </button>
            </div>
          )}

          {/* タグ（button + router.push で遷移） */}
          {tagNames.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-2">
              <span className="text-xs text-gray-700 font-semibold">タグ:</span>
              {tagNames.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-label={`タグ ${t} で検索`}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/search?tag=${encodeURIComponent(t)}`);
                  }}
                  className="text-xs border rounded-full px-2 py-0.5 hover:bg-gray-100"
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* 価格/時間（存在するものだけ） */}
          {(price != null || cookingTime != null) && (
            <div className="flex justify-between text-sm mt-3">
              <span>{price != null ? `¥${price}` : ""}</span>
              <span>{cookingTime != null ? `${cookingTime}分` : ""}</span>
            </div>
          )}

          {/* 配置: 本文右下 */}
          {rightTopSlot && rightTopSlotPlacement === "body-bottom" && (
            <div className="mt-3 flex justify-end" onClick={(e) => e.stopPropagation()}>
              {rightTopSlot}
            </div>
          )}

          {/* 下部スロット */}
          {footerSlot && <div className="mt-3">{footerSlot}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
