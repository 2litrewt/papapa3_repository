"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

export default function NewRecipe() {
  // 既存の入力項目の状態管理
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  // 新たに「概要（description）」を追加
  const [description, setDescription] = useState("");
  // 調理手順は「instructions」として入力、後で steps_attributes に変換
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // 追加する入力項目の状態管理
  const [userId, setUserId] = useState<number | string>(1);         // ユーザーID（例: 1）
  const [categoryId, setCategoryId] = useState<number | string>(1);     // カテゴリID（例: 1）
  const [cookingTime, setCookingTime] = useState<number | string>(30);  // 調理時間（分）
  const [price, setPrice] = useState<number | string>(1000);            // 価格（例: 1000円）
  
  const [message, setMessage] = useState("");

  // 画像ファイルが選択されたときに状態を更新
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files?.[0] || null);
  };

  // フォーム送信時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // FormData を作成し、全入力項目を追加
    const formData = new FormData();
    formData.append("recipe[title]", title);
    formData.append("recipe[ingredients]", ingredients);
    formData.append("recipe[description]", description);
    // 調理手順は、steps_attributes という JSON 配列として送信
    formData.append(
      "recipe[steps_attributes]",
      JSON.stringify([{ step_number: 1, instruction: instructions }])
    );
    formData.append("recipe[user_id]", String(userId));
    formData.append("recipe[category_id]", String(categoryId));
    formData.append("recipe[cooking_time]", String(cookingTime));
    formData.append("recipe[price]", String(price));
    if (image) {
      formData.append("recipe[image]", image);
    }

    try {
      // Rails API に対して POST リクエストを送信
      const response = await axios.post("http://localhost:3000/recipes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("レシピが正常にアップロードされました！");
      console.log("アップロード成功:", response.data);
    } catch (error: any) {
      console.error("アップロードエラー:", error.response ? error.response.data : error.message);
      setMessage("アップロードに失敗しました。コンソールを確認してください。");
    }
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
              <Input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            {/* 材料 */}
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
            {/* 概要（description） */}
            <div>
              <label htmlFor="description" className="block mb-1">概要</label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="レシピの概要を入力してください"
              />
            </div>
            {/* 調理手順（instructionsとして入力、後でstepsに変換） */}
            <div>
              <label htmlFor="instructions" className="block mb-1">調理手順</label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                placeholder="調理手順を入力してください"
              />
            </div>
            {/* ユーザーID */}
            <div>
              <label htmlFor="userId" className="block mb-1">ユーザーID</label>
              <Input
                type="number"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
            {/* カテゴリID */}
            <div>
              <label htmlFor="categoryId" className="block mb-1">カテゴリID</label>
              <Input
                type="number"
                id="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              />
            </div>
            {/* 調理時間 */}
            <div>
              <label htmlFor="cookingTime" className="block mb-1">調理時間（分）</label>
              <Input
                type="number"
                id="cookingTime"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                required
              />
            </div>
            {/* 価格 */}
            <div>
              <label htmlFor="price" className="block mb-1">価格</label>
              <Input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            {/* 料理画像 */}
            <div>
              <label htmlFor="image" className="block mb-1">料理画像</label>
              <Input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>
            <Button type="submit" className="w-full">投稿する</Button>
          </form>
          {message && <p className="mt-4 text-center">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
