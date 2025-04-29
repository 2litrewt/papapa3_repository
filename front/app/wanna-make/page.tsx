"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"

interface Favorite {
  id: number
  recipe_id: number
  recipe_title: string
  recipe_image_url: string
}

export default function WannaMakePage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
        const headers = {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token") || "",
            "client": localStorage.getItem("client") || "",
            "uid": localStorage.getItem("uid") || "",
          }

          console.log("📦 headers:", headers)

          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites`, {
              headers: headers
        })
        setFavorites(response.data)
      } catch (error) {
        console.error("❌ 作りたいリスト取得失敗:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  if (loading) return <p className="text-center mt-10 text-gray-500">読み込み中...</p>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">作りたいリスト</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-500">まだ作りたいレシピがありません。</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <li key={item.id} className="border p-4 rounded shadow">
              <Link href={`/recipe/${item.recipe_id}`}>
                <img src={item.recipe_image_url} alt={item.recipe_title} className="w-full h-40 object-cover rounded mb-2" />
                <h3 className="text-lg font-semibold">{item.recipe_title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
