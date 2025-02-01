import Link from "'next/link'"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Bookmark, Clock, DollarSign, Apple } from "'lucide-react'"

async function getTopRecipes() {
  // This is a mock function. In a real application, you would call an API here.
  return [
    { 
      id: 1, 
      title: "'カレーライス'", 
      image: "'/placeholder.svg?height=200&width=300'", 
      likes: 150, 
      favorites: 80,
      price: 800,
      time: 40,
      nutrition: "'食物繊維が豊富で腸内環境を整える'",
      creator: "'chef_yamada'"
    },
    { 
      id: 2, 
      title: "'冷やし中華'", 
      image: "'/placeholder.svg?height=200&width=300'", 
      likes: 120, 
      favorites: 60,
      price: 600,
      time: 20,
      nutrition: "'ビタミンが豊富で夏バテ予防に効果的'",
      creator: "'cooking_tanaka'"
    },
    { 
      id: 3, 
      title: "'肉じゃが'", 
      image: "'/placeholder.svg?height=200&width=300'", 
      likes: 100, 
      favorites: 50,
      price: 700,
      time: 50,
      nutrition: "'タンパク質とビタミンが豊富でバランスの良い栄養摂取が可能'",
      creator: "'home_cook'"
    },
  ]
}

export default async function Ranking() {
  const recipes = await getTopRecipes()

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      <h1 className="text-3xl font-bold mb-6">人気レシピランキング</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-0">
                <div className="relative">
                  <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover" />
                  <div className="absolute top-0 left-0 bg-gray-900 text-gray-50 px-2 py-1 text-lg font-bold dark:bg-gray-50 dark:text-gray-900">
                    #{index + 1}
                  </div>
                </div>
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
                  <div className="mt-2 text-sm text-gray-500">
                    作成者: {recipe.creator}
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

