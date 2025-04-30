"use client"

import { useState } from "react"
import axios from "axios"

interface WannaMakeButtonProps {
  recipeId: number;
  recipeTitle: string;
  imageUrl: string;
  isFavorite: boolean;
}

function updateAuthTokenFromResponse(response: any) {
  const newAccessToken = response.headers["access-token"];
  const newClient = response.headers["client"];
  const newUid = response.headers["uid"];
  if (newAccessToken && newClient && newUid) {
    localStorage.setItem("access-token", newAccessToken);
    localStorage.setItem("client", newClient);
    localStorage.setItem("uid", newUid);
  }
}



export function WannaMakeButton({ recipeId, recipeTitle, imageUrl, isFavorite: isFavoriteProp }: WannaMakeButtonProps) {

  const [isFavorite, setIsFavorite] = useState(isFavoriteProp);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

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
      className={`absolute top-2 right-2 px-4 py-2 rounded-full shadow transition ${
        isFavorite ? "bg-orange-400 text-white" : "bg-white text-gray-700"
      }`}
    >
      {isFavorite ? "作りたい！" : "作りたい！"}
    </button>
  )
}
