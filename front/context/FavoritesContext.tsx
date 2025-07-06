"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Favorite {
  id: number;
  title: string;
  imageUrl?: string;
}

interface FavoritesContextType {
  favorites: Favorite[];
  addFavorite: (item: Favorite) => void;
  removeFavorite: (id: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const addFavorite = (item: Favorite) => {
    setFavorites((prev) => [...prev, item]);
  };

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
