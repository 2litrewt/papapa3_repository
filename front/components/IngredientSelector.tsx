// components/IngredientSelector.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Ingredient {
  id: number;
  name: string;
  protein: number;
  carbohydrate: number;
  fat: number;
}

export default function IngredientSelector() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("");


  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/ingredients`);
        const data = await res.json();
        console.log("✅APIレスポンス:", data);
        setIngredients(data);
      } catch (error) {
        console.error("食材取得エラー:", error);
      }
    };

    fetchIngredients();
  }, []);

  return (
    <div className="mb-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {selectedIngredient ? selectedIngredient.name : "材料を選択"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="材料名で検索..." />
            <CommandList>
              {ingredients.map((ingredient) => (
                <CommandItem
                  key={ingredient.id}
                  onSelect={() => {
                    setSelectedIngredient(ingredient);
                    setOpen(false);
                  }}
                >
                  {ingredient.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedIngredient && (
        <div className="mt-2 space-y-2">
          <p>選択中: {selectedIngredient.name}</p>
          <Input
            type="number"
            placeholder="量 (g)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}