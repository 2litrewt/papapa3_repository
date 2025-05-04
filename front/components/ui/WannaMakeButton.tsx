"use client"

import { useState } from "react"
import axios from "axios"

interface WannaMakeButtonProps {
  recipeId: number;
  recipeTitle: string;
  imageUrl: string;
  isFavorite: boolean;
  className?: string;
}

function updateAuthTokenFromResponse(response: any) {
  const newAccessToken = response.headers["access-token"];
  const newClient = response.headers["client"];
  const newUid = response.headers["uid"];
  if (newAccessToken && newClient && newUid) {
    localStorage.setItem("access-token", newAccessToken);
    localStorage.setItem("client", newClient);
    localStorage.setItem("uid", newUid);
  } else {

  console.warn("⚠️ トークンの更新情報が含まれていませんでした");
  }
}



export function WannaMakeButton({ 
  recipeId, 
  recipeTitle, 
  imageUrl, 
  isFavorite: isFavoriteProp,
  className = ""
}: WannaMakeButtonProps) {

  const [isFavorite, setIsFavorite] = useState(isFavoriteProp);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    console.log("📦 現在のトークン", {
      "access-token": localStorage.getItem("access-token"),
      "client": localStorage.getItem("client"),
      "uid": localStorage.getItem("uid")

    });
    try {
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

        updateAuthTokenFromResponse(response);

        setIsFavorite(true);

      } else {
        const response =await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites/${recipeId}`, {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "access-token": localStorage.getItem("access-token") || "",
            "client": localStorage.getItem("client") || "",
            "uid": localStorage.getItem("uid") || "",
          }
        })

        console.log("🌙 POST後トークン", {
          "access-token": response.headers["access-token"],
          "client": response.headers["client"],
          "uid": response.headers["uid"],
        }); 

        updateAuthTokenFromResponse(response);

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
