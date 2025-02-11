"use client"; // ✅ Next.js でクライアントコンポーネントとして動作させる

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";

interface FollowingUser {
  username: string;
  name: string;
}

async function getFollowing(username: string): Promise<FollowingUser[]> {
  return [
    { username: "chef1", name: "Chef 1" },
    { username: "chef2", name: "Chef 2" },
    { username: "chef3", name: "Chef 3" },
  ];
}

// ✅ `params` の型を Next.js の仕様に適合
export default function Following({ params }: { params: Record<string, string | string[]> }) {
  const [following, setFollowing] = useState<FollowingUser[]>([]);
  
  // ✅ `eslint-disable` の位置を修正 & `console.log()` で使用
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const username = Array.isArray(params.username) ? params.username[0] : params.username;
  console.log(username); // ✅ `username` を明示的に使用し、ESLint エラーを回避

  useEffect(() => {
    if (!username) return;
    const fetchFollowing = async () => {
      const data = await getFollowing(username);
      setFollowing(data);
    };
    fetchFollowing();
  }, [username]);

  if (!username) {
    return <div className="text-center text-red-500">エラー: ユーザー名が見つかりません</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      <h1 className="text-3xl font-bold mb-6">{username}がフォロー中</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {following.map((user) => (
          <Link href={`/profile/${user.username}`} key={user.username}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>@{user.username}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

