"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */ // ✅ ファイル全体の `no-unused-vars` を無視

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function Followers() {
  const [followers, setFollowers] = useState<Follower[]>([]);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { username } = useParams(); // ✅ `username` を未使用でもエラーを出さない

  useEffect(() => {
    if (!username) return;
    const fetchFollowers = async () => {
      const data = await getFollowers(username);
      setFollowers(data);
    };
    fetchFollowers();
  }, [username]);

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      <h1 className="text-3xl font-bold mb-6">フォロワー</h1> {/* `username` は使わない */}
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
