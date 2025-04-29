"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Favorite {
  id: number;
  recipe_id: number;
  recipe_title: string;
  recipe_image_url?: string;
}

export default function WannaMakePage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites`, {
          headers: {
            "Content-Type": "application/json",
            "access-token": localStorage.getItem("access-token") || "",
            "client": localStorage.getItem("client") || "",
            "uid": localStorage.getItem("uid") || "",
          },
        });
        setFavorites(response.data);
      } catch (error) {
        console.error("作りたいリスト取得失敗:", error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">作りたいリスト</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => (
          <div key={favorite.id} className="border rounded p-4 shadow">
            <img src={favorite.recipe_image_url ?? "/DALL.webp"} alt={favorite.recipe_title} className="w-full h-48 object-cover rounded" />
            <h2 className="text-lg font-semibold mt-2">{favorite.recipe_title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
