"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

type MaybeNamed = string | { name: string };
function toName(v?: MaybeNamed): string {
  if (!v) return "";
  return typeof v === "string" ? v : v.name ?? "";
}

function toNameArray(v: any): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map((i) => (typeof i === "string" ? i : i.name ?? "")).filter(Boolean);
  if (typeof v === "string") return [v];
  if (typeof v === "object" && v.name) return [v.name];
  return [];
}

export interface RecipeCardProps {
  id: number | string;
  title: string;
  imageUrl?: string | null;
  price?: number | null;
  cookingTime?: number | null;

  // どちらかがあれば表示（カテゴリ優先・なければジャンル）
  category?: MaybeNamed;
  genre?: MaybeNamed;

  // タグは string または {name:string} の配列を想定
  tags?: MaybeNamed[];

  /** 右上に差し込むボタン等（例：WannaMakeButton） */
  rightTopSlot?: React.ReactNode;

  /** 下部に差し込む領域（例：栄養PFCの表示など） */
  footerSlot?: React.ReactNode;

  /** 画像クリックで詳細へ行かせたくない場合などの制御用（必要なら） */
  onImageClickCapture?: (e: React.MouseEvent) => void;
}

export default function RecipeCard({
  id,
  title,
  imageUrl,
  price,
  cookingTime,
  category,
  genre,
  tags = [],
  rightTopSlot,
  footerSlot,
  onImageClickCapture,
}: RecipeCardProps) {
  const categoryName = toName(category);
const genreNames = toNameArray(genre);
const tagNames = toNameArray(tags);
  const mainLabel = categoryName || genreNames[0];

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
            unoptimized
            onClickCapture={onImageClickCapture}
          />

          {/* 右上スロット（例：お気に入りボタン） */}
          {rightTopSlot && (
            <div
              className="absolute top-2 right-2"
              // 親のLinkのクリックを拾わせないため
              onClick={(e) => e.stopPropagation()}
            >
              {rightTopSlot}
            </div>
          )}
        </div>

        <div className="p-4">
          {/* タイトル */}
          <h3 className="font-semibold text-lg mb-2">{title}</h3>

          <div className="mt-2 space-y-1">
  {genreNames.length > 0 && (
    <div className="flex gap-1 flex-wrap">
      <span className="text-xs text-gray-700 font-semibold">ジャンル:</span>
      {genreNames.map((g) => (
        <span key={g} className="text-xs border rounded-full px-2 py-0.5">{g}</span>
      ))}
    </div>
  )}

  {tagNames.length > 0 && (
    <div className="flex gap-1 flex-wrap">
      <span className="text-xs text-gray-700 font-semibold">タグ:</span>
      {tagNames.map((t) => (
        <span key={t} className="text-xs border rounded-full px-2 py-0.5">{t}</span>
      ))}
    </div>
  )}
</div>


          {/* 価格/時間（存在するものだけ） */}
          {(price != null || cookingTime != null) && (
            <div className="flex justify-between text-sm mb-2">
              <span>{price != null ? `¥${price}` : ""}</span>
              <span>{cookingTime != null ? `${cookingTime}分` : ""}</span>
            </div>
          )}

          {/* カテゴリorジャンル／タグ → /search への導線 */}
          <div className="flex flex-wrap gap-2 text-xs">
            {mainLabel && (
              <Link
                href={
                  categoryName
                    ? `/search?category=${encodeURIComponent(categoryName)}`
                    : `/search?genre=${encodeURIComponent(genreName)}`
                }
                onClick={(e) => e.stopPropagation()}
                className="px-2 py-1 border border-black rounded hover:bg-gray-100"
              >
                {mainLabel}
              </Link>
            )}

            {tags.map((t, i) => {
              const tagName = toName(t);
              if (!tagName) return null;
              return (
                <Link
                  key={`${tagName}-${i}`}
                  href={`/search?tag=${encodeURIComponent(tagName)}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-2 py-1 border border-black rounded hover:bg-gray-100"
                >
                  {tagName}
                </Link>
              );
            })}
          </div>

          {/* 任意の下部スロット（例：PFC表示など） */}
          {footerSlot && <div className="mt-3">{footerSlot}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
