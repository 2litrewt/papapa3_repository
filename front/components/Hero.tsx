"use client";
import React from "react";
import Image from "next/image"

export default function Hero() {
  return (
    <section className="bg-gray-100 flex flex-col items-center py-16 px-4">
    <div className="mb-8">
    <Image
          src="/logo.png"
          alt="PaPaPa ロゴ"
          width={450}           
          height={80}           
          className="object-contain"
          priority
          />
    </div>
    <p className="text-lg mb-6">
    すぐでき✅、コスパ良👌、栄養満点💯、レシピいろいろ
    </p>
    <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
      レシピを見る
    </button>
  </section>
  );
}
