"use client";

import { useEffect, useState } from "react";
import IngredientSelector from "./IngredientSelector";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";

interface IngredientInput {
  id: string;
  ingredientId: number | null;
  quantity: number | null;
}

interface Props {
  ingredientFields: IngredientInput[];
  setIngredientFields: React.Dispatch<React.SetStateAction<IngredientInput[]>>;
}


export default function RecipeIngredientsForm({ ingredientFields, setIngredientFields}: Props) {
  // 初期値はクライアント側で useEffect によって追加（SSRとのズレ回避）
  useEffect(() => {
    setIngredientFields([
      { id: nanoid(), ingredientId: null, quantity: null },
    ]);
  }, []);

  const addField = () => {
    setIngredientFields((prev) => [
      ...prev,
      { id: nanoid(), ingredientId: null, quantity: null },
    ]);
  };

  const removeField = (id: string) => {
    setIngredientFields((prev) => prev.filter((field) => field.id !== id));
  };

  const handleChange = (
    id: string,
    value: { ingredientId: number | null; quantity: number | null }
  ) => {
    setIngredientFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, ...value } : field
      )
    );
  };




  return (
    <div className="space-y-4">
      {ingredientFields.map((field) => (
        <div key={field.id} className="flex items-start gap-2">
          <IngredientSelector
            fieldId={field.id}
            onChange={(value) => handleChange(field.id, value)}
          />
          <Button variant="ghost" onClick={() => removeField(field.id)}>
            ×
          </Button>
        </div>
      ))}

      <Button type="button" onClick={addField}>
        ＋ 材料を追加
      </Button>

    </div>
  );
}
