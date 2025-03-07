"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation"; // ✅ `useParams` を使用

interface Profile {
  username: string;
  followers: number;
  following: number;
}

// ✅ `useParams()` で `username` を取得
export default function MyPage() {
  const params = useParams(); // ✅ `params` を `useParams()` から取得
  const username = Array.isArray(params.username) ? params.username[0] : params.username;
  
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!username) return;
    const fetchProfile = async () => {
      const data: Profile = {
        username,
        followers: 1234,
        following: 567,
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
        <Link href={`/mypage/${profile?.username}/followers`} className="text-blue-600 hover:underline">
          フォロワー: {profile?.followers}
        </Link>
        <Link href={`/mypage/${profile?.username}/following`} className="text-blue-600 hover:underline">
          フォロー中: {profile?.following}
        </Link>
      </div>
    </div>
  );
}
