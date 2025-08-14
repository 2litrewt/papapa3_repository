"use client";
import React from "react";
import Image from "next/image"
import Link from "next/link";

export default function Hero() {
  return (
  <section className="h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900  py-12 sm:py-16 lg:py-20 px-4 ">
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
    <Link
  href="/"
  aria-label="トップページへ移動"
  className="
    inline-flex w-auto items-center justify-center
    rounded-lg px-4 sm:px-6 py-2 sm:py-3
    bg-orange-700 text-white
    transition-colors transition-transform duration-200 ease-in-out
    hover:bg-orange-800 hover:scale-105 hover:underline active:scale-95
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
  ">レシピを見る</Link>
  </section>
  );
}
