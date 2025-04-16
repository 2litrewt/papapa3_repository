"use client";

import { useState,useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

export default function NewRecipe() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState<{ ingredient_id: number; quantity: number }[]>([]);
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState<string[]>([""]);

  const [image, setImage] = useState<File | null>(null);

  const [userId, setUserId] = useState<number>();
  const [categoryId, setCategoryId] = useState<number>(1);
  const [cookingTime, setCookingTime] = useState<number>(30);
  const [price, setPrice] = useState<number>(1000);

  const [message, setMessage] = useState("");

  // 画像ファイルが選択されたときに状態を更新
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files?.[0] || null);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id")
    if (storedUserId) {
      setUserId(Number(storedUserId)) // ← ここでセット
    }
  }, [])
  
  // 材料の入力を処理する関数
  const handleIngredientsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const ingredientsArray = e.target.value
      .split("\n")
      .map((line) => {
        const [id, quantity] = line.split(",").map((item) => item.trim());
        return {
          ingredient_id: id ? Number(id) : 0, // IDはそのまま数値に変換
          quantity: quantity ? Number(quantity) : 1, // 数量も数値に変換
        };
      })
      .filter((ing) => ing.ingredient_id > 0); // IDが0以上のものだけを残す
  
    console.log("処理後の ingredients:", ingredientsArray);
    setIngredients(ingredientsArray);
  };
  

  // フォーム送信時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    const stepsData = instructions.map((instruction, index) => ({
      step_number: index + 1,
      instruction: instruction
    }));
    
    formData.append("recipe[title]", title);
    formData.append("recipe[ingredients]", JSON.stringify(ingredients)); // JSON配列として送る
    formData.append("recipe[description]", description);
    formData.append(
      "recipe[steps_attributes]",
      JSON.stringify(stepsData)
    );
    formData.append("recipe[user_id]", String(userId));
    formData.append("recipe[category_id]", String(categoryId));
    formData.append("recipe[cooking_time]", String(cookingTime));
    formData.append("recipe[price]", String(price));
    if (image) {
      formData.append("image", image);
    }

    console.log("🔍 送信予定のデータ:", formData);

    try {
      console.log("🚀 API リクエストを送信します...");
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/recipes`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("レシピが正常にアップロードされました！");
      console.log("送信できたデータ:", response.data);
    } catch (error: any) {
      console.error("アップロードエラー:", error.response ? error.response.data : error.message);
      setMessage("アップロードに失敗しました。コンソールを確認してください。");
    }

    console.log("送信データ:", Object.fromEntries(formData.entries()));

  };


  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">新規レシピ投稿</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 料理名 */}
            <div>
              <label htmlFor="title" className="block mb-1">料理名</label>
              <Input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            {/* 材料 */}
            <div>
              <label htmlFor="ingredients" className="block mb-1">材料（例: 1, 2）</label>
              <Textarea
                id="ingredients"
                onChange={handleIngredientsChange}
                required
                placeholder="材料ID, 数量 を改行で入力（例: 1, 2）"
              />
            </div>
            {/* 概要（description） */}
            <div>
              <label htmlFor="description" className="block mb-1">概要</label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
         {/* 調理手順（複数対応・削除ボタン付き） */}
<div>
  <label className="block mb-1">調理手順</label>
  {instructions.map((step, index) => (
    <div key={index} className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">手順{index + 1}</span>
        <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => {
          const updated = instructions.filter((_, i) => i !== index);
          setInstructions(updated);
        }}
        className="text-xs px-2 py-0.5"
      >
        ✖
      </Button>
      </div>
        <Textarea
          value={step}
          onChange={(e) => {
            const newInstructions = [...instructions];
            newInstructions[index] = e.target.value;
            setInstructions(newInstructions);
          }}
          required
        />
      </div>
  ))}
  <Button
    type="button"
    onClick={() => setInstructions([...instructions, ""])}
    className="mt-2"
  >
    手順を追加
  </Button>
</div>

            {/* 画像 */}
            <div>
              <label htmlFor="image" className="block mb-1">料理画像</label>
              <Input type="file" id="image" accept="image/*" onChange={handleImageChange}  />
            </div>
            <Button type="submit" className="w-full">投稿する</Button>
          </form>
          {message && <p className="mt-4 text-center">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
