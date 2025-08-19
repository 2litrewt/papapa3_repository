// front/components/Footer.tsx
"use client";
import React from "react";
import Link from "next/link";
import { Twitter, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className=" text-black py-8 ">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center md:justify-between gap-6 px-4 ">
        {/* サイトマップリンク */}
        <div className="flex flex-col sm:flex-row gap-4 text-sm hover:underline active:text-opacity-80 ">
          <Link href="/">ホーム</Link>
          <Link href="/landing">LP</Link>
          <Link href="/recipes">レシピ一覧</Link>
          <Link href="/about">このサイトについて</Link>
        </div>
        {/* SNSアイコン */}
        <div className="flex items-center gap-4 hover:underline active:text-opacity-80 ">
          <a href="https://twitter.com" aria-label="Twitter"><Twitter size={24} /></a>
          <a href="https://instagram.com" aria-label="Instagram"><Instagram size={24} /></a>
          <a href="https://facebook.com" aria-label="Facebook"><Facebook size={24} /></a>
        </div>
        {/* コピーライト */}
        <div className="text-xs text-gray-600">
          © {new Date().getFullYear()} PaPaPa All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
