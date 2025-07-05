"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import apiClient from "@/lib/axios"
import { Factory } from "lucide-react"
import { WannaMakeButton } from "@/components/ui/WannaMakeButton";


interface Favorite {
  id: number
  recipe_id: number
  recipe_title: string
  recipe_image_url: string
}

export default function WannaMakePage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const handleDeleteFavorite = async (favoriteId: number) => {
    await apiClient.delete(`/api/favorites/${favoriteId}`);
    await fetchFavorites();
  };
  const handleAddFavorite = async (recipeId: number) => {
    await apiClient.post(
      `${API_BASE_URL}/api/favorites`,
      { favorite: { recipe_id: recipeId } }
    );
    await fetchFavorites();
    };


  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await apiClient.get("/api/favorites")
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
          {favorites.map((favorite) => (
            <li key={favorite.id} className="border p-4 rounded shadow">
              <Link href={`/recipe/${favorite.recipe_id}`}>
                <img src={favorite.recipe_image_url} alt={favorite.recipe_title} className="w-full h-40 object-cover rounded mb-2" />
                <h3 className="text-lg font-semibold">{favorite.recipe_title}</h3>
              </Link>
              <WannaMakeButton
                recipeId={favorite.recipe_id}
                recipeTitle={favorite.recipe_title}
                imageUrl={favorite.recipe_image_url}
                isFavorite={true}
                favoriteId={favorite.id} // お気に入り自体のid
                onAddFavorite={handleAddFavorite}
                onDeleteFavorite={handleDeleteFavorite}
                
              />

            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
