import React from "react";
import { notFound } from "next/navigation";
import axios from "axios";

interface RecipeDetailProps {
  params: { id: string };
}

const RecipeDetail = async ({ params }: RecipeDetailProps) => {
  const id = await Promise.resolve(params.id); // 非同期で解決

  try {
    const response = await axios.get(`http://back:3000/api/recipes/${id}`);
    const recipe = response.data;

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">{recipe.title}</h1>
        <img src={recipe.image_url} alt={recipe.title} className="my-4 w-full max-w-lg" />
        <p>カテゴリ: {recipe.category_name}</p>
        <p>調理時間: {recipe.cooking_time} 分</p>
        <p>費用: ¥{recipe.price}</p>
        <p className="my-4">{recipe.description}</p>

        <h2 className="text-xl font-semibold mt-4">栄養素</h2>
        {recipe.total_nutrition ? (
          <ul className="list-disc pl-5">
            <li>タンパク質: {recipe.total_nutrition.protein}g</li>
            <li>炭水化物: {recipe.total_nutrition.carbohydrate}g</li>
            <li>脂質: {recipe.total_nutrition.fat}g</li>
          </ul>
        ) : (
          <p>栄養素データがありません。</p>
        )}

        <h2 className="text-xl font-semibold mt-4">材料</h2>
        <ul className="list-disc pl-5">
          {recipe.ingredients.map((ingredient: string, index: number) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-4">作り方</h2>
        <ol className="list-decimal pl-5">
          {recipe.steps.map((step: any) => (
            <li key={step.step_number}>
              {step.step_number}. {step.instruction}
            </li>
          ))}
        </ol>

        <h2 className="text-xl font-semibold mt-4">タグ</h2>
        <p>{recipe.tags ? recipe.tags.join(", ") : "タグがありません。"}</p>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch recipe:", error);
    notFound();
  }
};

export default RecipeDetail;
