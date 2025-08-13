"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
};

export default function FeatureCard({
  icon,
  title,
  description,
  imageSrc,
  imageAlt = "image",
}: FeatureCardProps) {
  return (
    <motion.div
      className="
        h-screen
        flex flex-col md:flex-row
        md:even:flex-row-reverse
        bg-white dark:bg-gray-800
        font-sans
      "
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* 画像: 6 / テキスト: 4 */}
      <div className="w-full md:w-2/5 flex justify-center items-center p-4 sm:p-6 md:p-10">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-auto max-h-[78vh] object-contain"
        />
      </div>

      {/* テキストカラム */}
      <div className="w-full md:w-3/5 flex flex-col h-full px-6 py-8 md:px-10 md:py-12">
  <div className="flex items-center mt-10 gap-3 md:gap-4">
    <div>{icon}</div>
    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold break-words">{title}</h3>
  </div>

  <div className="mt-32 pb-10 sm:pb-12 md:pb-16">
    <p className="whitespace-pre-line leading-relaxed text-base sm:text-lg mb-4 sm:mb-5 md:mb-6">{description}</p>
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
  </div>
</div>

    </motion.div>
  );
}
