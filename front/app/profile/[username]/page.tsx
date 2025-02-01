import Link from "'next/link'"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Bookmark, Clock, DollarSign, Apple } from "'lucide-react'"

async function getUserProfile(username: string) {
  // This is a mock function. In a real application, you would call an API here.
  return {
    username,
    followers: 1234,
    following: 567,
    recipes: [
      { 
        id: 1, 
        title: "'カレーライス'", 
        image: "'/placeholder.svg?height=200&width=300'", 
        likes: 150, 
        favorites: 80,
        price: 800,
        time: 40,
        nutrition: "'食物繊維豊富'",
      },
      { 
        id: 2, 
        title: "'冷やし中華'", 
        image: "'/placeholder.svg?height=200&width=300'", 
        likes: 120, 
        favorites: 60,
        price: 600,
        time: 20,
        nutrition: "'ビタミン豊富'",
      },
    ]
  }
}

export default async function Profile({ params }: { params: { username: string } }) {
  const profile = await getUserProfile(params.username)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{profile.username}のプロフィール</h1>
      <div className="flex justify-between mb-8">
        <div>フォロワー: {profile.followers}</div>
        <div>フォロー中: {profile.following}</div>
      </div>
      <h2 className="text-2xl font-semibold mb-4">投稿したレシピ</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profile.recipes.map((recipe) => (
          <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-0">
                <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
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
  )
}

