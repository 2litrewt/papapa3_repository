"use client"

import { useState } from "react"
import axios from "axios"
import apiClient from "@/lib/axios";

interface WannaMakeButtonProps {
  recipeId: number;
  recipeTitle: string;
  imageUrl: string;
  isFavorite: boolean;
  className?: string;
  favoriteId: number | null;
  onAddFavorite: (recipeId: number) => Promise<void>;
  onDeleteFavorite: (favoriteId: number) => Promise<void>;
}

// function updateAuthTokenFromResponse(response: any) {
//   const newAccessToken = response.headers["access-token"];
//   const newClient = response.headers["client"];
//   const newUid = response.headers["uid"];
//   if (newAccessToken && newClient && newUid) {
//     localStorage.setItem("access-token", newAccessToken);
//     localStorage.setItem("client", newClient);
//     localStorage.setItem("uid", newUid);
//   } else {

//   console.warn("⚠️ トークンの更新情報が含まれていませんでした");
//   }
// }

// お気に入りの追加削除
export function WannaMakeButton({ 
  recipeId, 
  recipeTitle, 
  imageUrl, 
  isFavorite: isFavoriteProp,
  favoriteId,
  onDeleteFavorite,
  onAddFavorite,
  className = ""
}: WannaMakeButtonProps) {

  const [isFavorite, setIsFavorite] = useState(isFavoriteProp);

  // クリックイベント
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // tokenの確認
    console.log("📦 現在のトークン", {
      "access-token": localStorage.getItem("access-token"),
      "client": localStorage.getItem("client"),
      "uid": localStorage.getItem("uid")
    });

    try {
      // isfaboriteがある時
      if (!isFavorite) {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites`, {
          favorite: {
            recipe_id: recipeId,
            recipe_title: recipeTitle,
            recipe_image_url: imageUrl,
          }
        }, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "access-token": localStorage.getItem("access-token") || "",
            "client": localStorage.getItem("client") || "",
            "uid": localStorage.getItem("uid") || "",
          }
        })

        console.log("⭐️ POST後トークン", {
          "access-token": response.headers["access-token"],
          "client": response.headers["client"],
          "uid": response.headers["uid"],
        });        

        // updateAuthTokenFromResponse(response);
        await onAddFavorite(recipeId);
        setIsFavorite(true);

      } else {

        console.log("🟡 削除前の favoriteId:", favoriteId);

        if (!favoriteId) {
          console.error("favoriteId が無効のため削除リクエストを中止");
          return;
        }

        // お気に入り消去
        const response = await apiClient.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites/${favoriteId}`)

        console.log("🌙 POST後トークン", {
          "access-token": response.headers["access-token"],
          "client": response.headers["client"],
          "uid": response.headers["uid"],
        }); 

        // updateAuthTokenFromResponse(response);

        console.log("🌟 消去したfavoriteId:", favoriteId);
        await onDeleteFavorite(favoriteId);
        setIsFavorite(false);
        
      }
    } catch (error) {
      console.error("❌ エラー:", error);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`absolute bottom-4 right-4 px-4 py-2 rounded-full shadow transition ${
        isFavorite ? "bg-orange-400 text-white" : "bg-white text-gray-700"
      } ${className}`}
    >
      {isFavorite ? "作りたい！" : "作りたい！"}
    </button>
  )
}

