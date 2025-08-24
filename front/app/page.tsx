"use client"

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = [
  "ご飯", "麺", "煮物", "焼き物", "揚げ物", "サラダ", "スープ", "デザート"
];

const tags = [
  "#冷たい", "#温かい", "#しょっぱい", "#甘い", "#辛い", "#さっぱり", "#こってり", "#ヘルシー",
  "#ボリューミー", "#簡単", "#時短", "#おもてなし", "#お弁当", "#朝食", "#昼食", "#夕食",
  "#おつまみ", "#パーティー", "#おやつ", "#ダイエット", "#筋トレ", "#ベジタリアン", "#ヴィーガン", "#グルテンフリー",
  "#低糖質", "#高タンパク", "#低カロリー", "#高カロリー", "#洋風", "#和風", "#中華風", "#エスニック"
  
];

// 人気キーワード: seeds.rb の recipes_data から先頭 8 件を抽出して表示する
// 画像はバックエンド側 (localhost:3000/images/**) に用意されているものを利用する
const popularKeywords = [
  { title: "たこ焼き", image: "http://localhost:3000/images/takoyaki.jpg" },
  { title: "オムライス", image: "http://localhost:3000/images/omurice.jpg" },
  { title: "カツカレー", image: "http://localhost:3000/images/katsu_curry.jpg" },
  { title: "茶碗蒸し", image: "http://localhost:3000/images/chawanmushi.jpg" },
  { title: "寿司", image: "http://localhost:3000/images/sushi.jpg" },
  { title: "餃子", image: "http://localhost:3000/images/gyoza.jpg" },
  { title: "そば", image: "http://localhost:3000/images/soba.jpg" },
  { title: "卵焼き", image: "http://localhost:3000/images/tamagoyaki.jpg" },
];

// カテゴリごとの代表画像を定義します。各カテゴリ名をローマ字表記したファイル名にマッピングしています。
const categoryImages = [
  { name: "ご飯", image: "http://localhost:3000/images/omurice.jpg" },
  { name: "麺", image: "http://localhost:3000/images/soba.jpg" },
  { name: "煮物", image: "http://localhost:3000/images/chawanmushi.jpg" },
  { name: "焼き物", image: "http://localhost:3000/images/takoyaki.jpg" },
  { name: "揚げ物", image: "http://localhost:3000/images/tempura.jpg" },
  { name: "サラダ", image: "http://localhost:3000/images/salad.jpg" },
  { name: "スープ", image: "http://localhost:3000/images/miso_soup.jpg" },
  { name: "デザート", image: "http://localhost:3000/images/matcha_parfait.jpg" },
];


export default function Home() {
  useEffect(() => {
    console.log("🔥 (useEffect) 環境変数チェック: API_BASE_URL は →", process.env.NEXT_PUBLIC_API_URL || "🚨 未適用 🚨");
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      <h1 className="text-6xl font-bold text-center mb-8">
        <span className="logo">PaPaPa</span>
      </h1>
      <div className="mb-8">
        <form className="space-y-4" action="/search">
          <div className="flex gap-2">
            <Input type="text" name="query" placeholder="料理名や材料を入力" className="flex-grow border-2 border-black" />
            <Button type="submit" className="border border-black">検索</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select name="time">
              {/* 調理時間のプルダウン枠をオレンジ色に変更 */}
              <SelectTrigger className="border-2 border-[#FF5722]">
                <SelectValue placeholder="調理時間" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">30分以内</SelectItem>
                <SelectItem value="medium">30分〜1時間</SelectItem>
                <SelectItem value="long">1時間以上</SelectItem>
              </SelectContent>
            </Select>
            <Select name="price">
              {/* 価格帯のプルダウン枠を黄色に変更 */}
              <SelectTrigger className="border-2 border-[#FFC107]">
                <SelectValue placeholder="価格帯" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">~500円</SelectItem>
                <SelectItem value="medium">500円~1000円</SelectItem>
                <SelectItem value="high">1000円~</SelectItem>
              </SelectContent>
            </Select>
            <Select name="nutrition">
              {/* 栄養のプルダウン枠をグリーンに変更 */}
              <SelectTrigger className="border-2 border-[#4CAF50]">
                <SelectValue placeholder="栄養" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low_calorie">低カロリー</SelectItem>
                <SelectItem value="high_protein">高タンパク</SelectItem>
                <SelectItem value="low_carb">低糖質</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </div>
      {/* 人気キーワードセクション */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">人気キーワード</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularKeywords.map(({ title, image }) => (
            <Link
              href={`/search?query=${encodeURIComponent(title)}&time=&price=&nutrition=`}
              key={title}
              className="block"
            >
              <div className="relative border border-black rounded-lg overflow-hidden hover:opacity-90 transition-all">
                {/* 画像は Next.js の Image コンポーネントで表示 */}
                <Image
                  src={image}
                  alt={title}
                  width={400}
                  height={250}
                  className="object-cover w-full h-40"
                  unoptimized
                />
                <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white text-center text-sm py-1">
                  {title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* カテゴリセクション */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">料理カテゴリ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categoryImages.map(({ name, image }) => (
            <Link
              href={`/search?category=${encodeURIComponent(name)}`}
              key={name}
              className="block"
            >
              <div className="relative border border-black rounded-lg overflow-hidden hover:opacity-90 transition-all">
                <Image
                  src={image}
                  alt={name}
                  width={400}
                  height={250}
                  className="object-cover w-full h-40"
                  unoptimized
                />
                <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 text-white text-center text-sm py-1">
                  {name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* タグセクション */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">タグ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {tags.map((tag) => (
            <Link href={`/search?tag=${encodeURIComponent(tag)}`} key={tag}>
              <div className="bg-white border border-black p-2 rounded text-center text-sm hover:bg-gray-100 transition-colors">
                {tag}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}