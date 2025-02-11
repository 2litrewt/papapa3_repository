"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Profile {
  username: string;
  followers: number;
  following: number;
}

async function getUserProfile(username: string): Promise<Profile> {
  return {
    username,
    followers: 1234,
    following: 567,
  };
}

// ✅ `params` の型を `Record<string, string | string[]>` に修正
export default function MyPage({ params }: { params: Record<string, string | string[]> }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  // `params.username` を `string` に確定
  const username = Array.isArray(params.username) ? params.username[0] : params.username;

  useEffect(() => {
    if (!username) return;
    const fetchProfile = async () => {
      const data = await getUserProfile(username);
      setProfile(data);
    };
    fetchProfile();
  }, [username]);

  if (!username) {
    return <div className="text-center text-red-500">エラー: ユーザー名が見つかりません</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      <h1 className="text-3xl font-bold mb-6">{username}のプロフィール</h1>
      <div className="flex justify-between mb-8">
        <Link href={`/mypage/${username}/followers`} className="text-blue-600 hover:underline">
          フォロワー: {profile?.followers}
        </Link>
        <Link href={`/mypage/${username}/following`} className="text-blue-600 hover:underline">
          フォロー中: {profile?.following}
        </Link>
      </div>
    </div>
  );
}
