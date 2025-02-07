import Link from "'next/link'"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// この関数は実際のAPIコールに置き換える必要があります
async function getFollowing(username: string) {
  // ダミーデータ
  return [
    { username: "'chef1'", name: "'Chef 1'" },
    { username: "'chef2'", name: "'Chef 2'" },
    { username: "'chef3'", name: "'Chef 3'" },
  ]
}

export default async function Following({ params }: { params: { username: string } }) {
  const following = await getFollowing(params.username)

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      <h1 className="text-3xl font-bold mb-6">{params.username}がフォロー中</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {following.map((follow) => (
          <Link href={`/profile/${follow.username}`} key={follow.username}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle>{follow.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>@{follow.username}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

