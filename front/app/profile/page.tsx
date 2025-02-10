import Link from "next/link"
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// この関数は実際のAPIコールに置き換える必要があります
async function getUserRecipes() {
  // ダミーデータ
  return [
    { id: 1, title: "'カレーライス'", image: "'/placeholder.svg?height=100&width=100'" },
    { id: 2, title: "'肉じゃが'", image: "'/placeholder.svg?height=100&width=100'" },
    { id: 3, title: "'味噌汁'", image: "'/placeholder.svg?height=100&width=100'" },
  ]
}

export default async function Profile() {
  const recipes = await getUserRecipes()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">プロフィール</h1>
      <h2 className="text-2xl font-semibold mb-4">あなたの投稿したレシピ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardHeader>
              <CardTitle>{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent>
            <Image src={recipe.image} alt={recipe.title} width={300} height={200} className="w-full h-48 object-cover mb-4" />

              <Link href={`/recipe/${recipe.id}`} className="text-blue-600 hover:underline">
                詳細を見る
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

