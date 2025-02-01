import Link from "'next/link'"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// この関数は実際のAPIコールに置き換える必要があります
async function getFollowers(username: string) {
  // ダミーデータ
  return [
    { username: "'user1'", name: "'User 1'" },
    { username: "'user2'", name: "'User 2'" },
    { username: "'user3'", name: "'User 3'" },
  ]
}

export default async function Followers({ params }: { params: { username: string } }) {
  const followers = await getFollowers(params.username)

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      <h1 className="text-3xl font-bold mb-6">{params.username}のフォロワー</h1>
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
  )
}

