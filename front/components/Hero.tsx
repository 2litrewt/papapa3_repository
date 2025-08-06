"use client";
import React from "react";
import Image from "next/image"

export default function Hero() {
  return (
  <section className="bg-gray-100 dark:bg-gray-900 flex flex-col items-center py-12 sm:py-16 lg:py-20 px-4">
    <div className="mb-8">
    <Image
          src="/logo.webp"
          alt="PaPaPa ロゴ"
          width={450}           
          height={80}           
          className="object-contain"
          priority
          />
    </div>
    <p className="text-base sm:text-lg lg:text-xl mb-6">
    すぐでき✅、コスパ良👌、栄養満点💯、レシピいろいろ
    </p>
    <button
      aria-label="レシピを見る"
      className="
      px-4 sm:px-6 py-2 sm:py-3 bg-orange-700 text-white rounded-lg 
      hover:bg-orange-800 transition-colors transition-transform duration-200 ease-in-out
      hover:scale-105 hover:underline active:scale-95
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
      "
    >
      レシピを見る
    </button>
  </section>
  );
}
