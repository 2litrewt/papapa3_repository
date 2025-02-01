import Link from "'next/link'"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Bookmark, Clock, DollarSign, Apple } from "'lucide-react'"

async function searchRecipes(params: { 
  query?: string, 
  category?: string, 
  tag?: string,
  time?: string,
  price?: string,
  nutrition?: string
}) {
  // This is a mock function. In a real application, you would call an API here.
  const recipes = [
    { 
      id: 1, 
      title: "'カレーライス'", 
      image: "'/placeholder.svg?height=200&width=300'", 
      likes: 150, 
      favorites: 80,
      price: 800,
      time: 40,
      nutrition: "'食物繊維が豊富で腸内環境を整える'",
      creator: "'chef_yamada'",
      category: "'ご飯'",
      tags: ["'温かい'", "'しょっぱい'", "'こってり'"]
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
      creator: "'cooking_tanaka'",
      category: "'麺'",
      tags: ["'冷たい'", "'さっぱり'", "'夏'"]
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
      creator: "'home_cook'",
      category: "'煮物'",
      tags: ["'温かい'", "'しょっぱい'", "'和風'"]
    },
  ]

  // Filter recipes based on search parameters
  return recipes.filter(recipe => {
    if (params.query && !recipe.title.includes(params.query)) return false
    if (params.category && recipe.category !== params.category) return false
    if (params.tag && !recipe.tags.includes(params.tag)) return false
    if (params.time) {
      if (params.time === "'short'" && recipe.time > 30) return false
      if (params.time === "'medium'" && (recipe.time <= 30 || recipe.time > 60)) return false
      if (params.time === "'long'" && recipe.time <= 60) return false
    }
    if (params.price) {
      if (params.price === "'low'" && recipe.price > 500) return false
      if (params.price === "'medium'" && (recipe.price <= 500 || recipe.price > 1000)) return false
      if (params.price === "'high'" && recipe.price <= 1000) return false
    }
    // Add more filters as needed
    return true
  })
}

export default async function SearchResults({ searchParams }: { searchParams: { 
  query?: string, 
  category?: string, 
  tag?: string,
  time?: string,
  price?: string,
  nutrition?: string
} }) {
  const recipes = await searchRecipes(searchParams)

  return (
    <div className="container mx-auto px-4 py-8 pt-8">
      {/* <h1 className="text-3xl font-bold mb-6">検索結果</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
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

