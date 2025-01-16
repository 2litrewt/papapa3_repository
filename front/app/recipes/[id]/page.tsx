import React from "react";
import { notFound } from "next/navigation";
import axios from "axios";

interface RecipeDetailProps {
  params: { id: string };
}

const RecipeDetail = async ({ params }: RecipeDetailProps) => {
  const id = await Promise.resolve(params.id); // 非同期で解決

  try {
    const response = await axios.get(`http://back:3000/api/recipes/${id}`); // 修正点2
    const recipe = response.data;

    return (
      <div>
        <h1>{recipe.title}</h1>
        <img src={recipe.image_url} alt={recipe.title} />
        <p>カテゴリ: {recipe.category_name}</p>
        <p>調理時間: {recipe.cooking_time} 分</p>
        <p>費用: ¥{recipe.price}</p>
        <p>{recipe.description}</p>

        <h2>材料</h2>
        <ul>
          {recipe.ingredients.map((ingredient: string, index: number) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>

        <h2>作り方</h2>
        <ol>
          {recipe.steps.map((step: any) => (
            <li key={step.step_number}>
              {step.step_number}. {step.instruction}
            </li>
          ))}
        </ol>

        <h2>タグ</h2>
        <p>{recipe.tags.join(", ")}</p>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch recipe:", error);
    notFound();
  }
};

export default RecipeDetail;
