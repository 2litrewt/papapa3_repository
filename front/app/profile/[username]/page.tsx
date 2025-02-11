"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation"; // ✅ `useParams` を使用

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Bookmark, Clock, DollarSign, Apple } from "lucide-react";
import Image from "next/image";

interface Profile {
  username: string;
  followers: number;
  following: number;
  recipes: {
    id: number;
    title: string;
    image: string;
    likes: number;
    favorites: number;
    price: number;
    time: number;
    nutrition: string;
  }[];
}

// ✅ `useParams()` で `username` を取得
export default function Profile() {
  const params = useParams(); // ✅ `useParams()` を使用
  const username = Array.isArray(params.username) ? params.username[0] : params.username;

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!username) return;
    const fetchProfile = async () => {
      const data: Profile = {
        username,
        followers: 1234,
        following: 567,
        recipes: [
          {
            id: 1,
            title: "カレーライス",
            image: "/placeholder.svg?height=200&width=300",
            likes: 150,
            favorites: 80,
            price: 800,
            time: 40,
            nutrition: "食物繊維豊富",
          },
          {
            id: 2,
            title: "冷やし中華",
            image: "/placeholder.svg?height=200&width=300",
            likes: 120,
            favorites: 60,
            price: 600,
            time: 20,
            nutrition: "ビタミン豊富",
          },
        ],
      };
      setProfile(data);
    };
    fetchProfile();
  }, [username]);

  if (!username) {
    return <div className="text-center text-red-500">エラー: ユーザー名が見つかりません</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      <h1 className="text-3xl font-bold mb-6">{profile?.username}のプロフィール</h1>
      <div className="flex justify-between mb-8">
        <div>フォロワー: {profile?.followers}</div>
        <div>フォロー中: {profile?.following}</div>
      </div>
      <h2 className="text-2xl font-semibold mb-4">投稿したレシピ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profile?.recipes.map((recipe) => (
          <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-0">
                <Image src={recipe.image} alt={recipe.title} width={300} height={200} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5" />
                      <span>{recipe.likes}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bookmark className="w-5 h-5" />
                      <span>{recipe.favorites}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>{recipe.price}円</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{recipe.time}分</span>
                    </div>
                    <div className="flex items-center">
                      <Apple className="w-4 h-4 mr-1" />
                      <span>{recipe.nutrition}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
