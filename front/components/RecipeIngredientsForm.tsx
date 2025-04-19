"use client";

import { useState } from "react";
import IngredientSelector from "./IngredientSelector";
import { Button } from "@/components/ui/button";

export default function RecipeIngredientsForm() {
  const [ingredientFields, setIngredientFields] = useState<number[]>([0]);

  const addField = () => {
    setIngredientFields([...ingredientFields, Date.now()]);
  };

  const removeField = (id: number) => {
    setIngredientFields(ingredientFields.filter((fid) => fid !== id));
  };

  return (
    <div className="space-y-4">
      {ingredientFields.map((id) => (
        <div key={id} className="flex items-start gap-2">
          <IngredientSelector />
          <Button variant="ghost" onClick={() => removeField(id)}>×</Button>
        </div>
      ))}

      <Button variant="outline" onClick={addField}>
        ＋ 材料を追加
      </Button>
    </div>
  );
}
