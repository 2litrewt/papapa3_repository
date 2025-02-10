"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewRecipe() {
  const [title, setTitle] = useState("''")
  const [ingredients, setIngredients] = useState("''")
  const [instructions, setInstructions] = useState("''")
  const [image, setImage] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ここで新規レシピの投稿処理を実装します
    console.log("'New recipe submission'", { title, ingredients, instructions, image })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">新規レシピ投稿</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block mb-1">料理名</label>
              <Input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="ingredients" className="block mb-1">材料</label>
              <Textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                required
                placeholder="材料を改行で区切って入力してください"
              />
            </div>
            <div>
              <label htmlFor="instructions" className="block mb-1">調理手順</label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                placeholder="調理手順を番号付きで入力してください"
              />
            </div>
            <div>
              <label htmlFor="image" className="block mb-1">料理画像</label>
              <Input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                required
              />
            </div>
            <Button type="submit" className="w-full">投稿する</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

