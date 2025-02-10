"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useParams } from "next/navigation";

interface Follower {
  username: string;
  name: string;
}

async function getFollowers(username: string): Promise<Follower[]> {
  return [
    { username: "user1", name: "User 1" },
    { username: "user2", name: "User 2" },
    { username: "user3", name: "User 3" },
  ];
}

// ✅ `params` の型を `any` に変更し、Next.js の仕様に適合
export default function Followers({ params }: { params: any }) {
  const [followers, setFollowers] = useState<Follower[]>([]);

  // `params.username` を `string` に確定
  const username = Array.isArray(params.username) ? params.username[0] : params.username;

  useEffect(() => {
    if (!username) return;
    const fetchFollowers = async () => {
      const data = await getFollowers(username);
      setFollowers(data);
    };
    fetchFollowers();
  }, [username]);

  if (!username) {
    return <div className="text-center text-red-500">エラー: ユーザー名が見つかりません</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      <h1 className="text-3xl font-bold mb-6">{username}のフォロワー</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {followers.map((follower) => (
          <Link href={`/profile/${follower.username}`} key={follower.username}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle>{follower.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>@{follower.username}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
