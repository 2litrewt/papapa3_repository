"'use client'"

import { useState } from "'react'"
import Link from "'next/link'"
import { useRouter } from "'next/navigation'"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Bookmark, Clock, DollarSign, Apple } from "'lucide-react'"

async function getRecipe(id: string) {
  // This is a mock function. In a real application, you would call an API here.
  return {
    id,
    title: "'カレーライス'",
    image: "'/placeholder.svg?height=400&width=800'",
    ingredients: ["'米'", "'肉'", "'じゃがいも'", "'にんじん'", "'カレールー'"],
    instructions: [
      { step: "'野菜を切る'", image: "'/placeholder.svg?height=200&width=200'" },
      { step: "'肉を炒める'", image: "'/placeholder.svg?height=200&width=200'" },
      { step: "'野菜を加えて煮込む'", image: "'/placeholder.svg?height=200&width=200'" },
      { step: "'カレールーを加える'", image: "'/placeholder.svg?height=200&width=200'" },
      { step: "'米を炊く'", image: "'/placeholder.svg?height=200&width=200'" },
    ],
    likes: 150,
    favorites: 80,
    price: 800,
    time: 40,
    nutrition: "'食物繊維が豊富で腸内環境を整える'",
    creator: "'chef_yamada'",
    category: "'ご飯'",
    tags: ["'温かい'", "'しょっぱい'", "'こってり'"],
    comments: [
      { id: 1, username: "'user1'", content: "'とても美味しそうです！'" },
      { id: 2, username: "'user2'", content: "'作ってみたいと思います！'" },
    ]
  }
}

export default function RecipeDetail({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<any>(null)
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [comment, setComment] = useState("''")
  const router = useRouter()

  useState(() => {
    getRecipe(params.id).then(setRecipe)
  }, [params.id])

  if (!recipe) return <div>Loading...</div>

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the comment to your backend
    console.log("'Submitting comment:'", comment)
    setComment("''")
    setShowCommentForm(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent>
          <img src={recipe.image} alt={recipe.title} className="w-full h-[400px] object-cover mb-6" />
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          <Link href={`/profile/${recipe.creator}`} className="text-blue-600 hover:underline">
            作成者: {recipe.creator}
          </Link>
          <div className="flex flex-wrap items-center gap-4 my-6">
            <div className="flex items-center">
              <Heart className="w-6 h-6 mr-2" />
              <span>{recipe.likes} いいね</span>
            </div>
            <div className="flex items-center">
              <Bookmark className="w-6 h-6 mr-2" />
              <span>{recipe.favorites} お気に入り</span>
            </div>
            <Link href={`/search?category=${recipe.category}`} className="hover:underline">
              カテゴリ: {recipe.category}
            </Link>
            <div>
              タグ: {recipe.tags.map((tag: string, index: number) => (
                <Link key={index} href={`/search?tag=${tag}`} className="hover:underline mr-2">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center">
              <DollarSign className="w-6 h-6 mr-2" />
              <span>金額：{recipe.price}円</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-6 h-6 mr-2" />
              <span>時間：{recipe.time}分</span>
            </div>
            <div className="flex items-center">
              <Apple className="w-6 h-6 mr-2" />
              <span>栄養：{recipe.nutrition}</span>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-4">材料</h2>
          <ul className="list-disc list-inside mb-6">
            {recipe.ingredients.map((ingredient: string, index: number) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <h2 className="text-2xl font-semibold mb-4">調理手順</h2>
          <ol className="list-decimal list-inside">
            {recipe.instructions.map((instruction: { step: string, image: string }, index: number) => (
              <li key={index} className="mb-4">
                <p className="mb-2">{instruction.step}</p>
                <img src={instruction.image} alt={`Step ${index + 1}`} className="w-full max-w-md h-48 object-cover" />
              </li>
            ))}
          </ol>
          <h2 className="text-2xl font-semibold my-6">コメント</h2>
          <div className="space-y-4">
            {recipe.comments.map((comment: { id: number, username: string, content: string }) => (
              <div key={comment.id} className="border-t pt-4">
                <Link href={`/profile/${comment.username}`} className="font-bold text-blue-600 hover:underline">
                  {comment.username}
                </Link>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
          {!showCommentForm && (
            <Button onClick={() => setShowCommentForm(true)} className="mt-4">
              コメントを投稿
            </Button>
          )}
          {showCommentForm && (
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="コメントを入力してください"
                className="mb-2"
              />
              <Button type="submit">投稿</Button>
              <Button type="button" variant="outline" onClick={() => setShowCommentForm(false)} className="ml-2">
                キャンセル
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

