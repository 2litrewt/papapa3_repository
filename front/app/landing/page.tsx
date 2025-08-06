"use client";
import React from "react";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import { Clock, DollarSign, Heart } from "lucide-react";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Hero />
      <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 my-12">
        <FeatureCard
          icon={<Clock size={48} className="text-orange-500" />}
          title="見てる動画のシークバーで作れるカンタンごはん。"
          description="好きな動画を見ながら作れるごはんがたくさんあります。
    ごはんが出来たら2本目の動画も見ちゃいましょう。！"
        />
        <FeatureCard
          icon={<DollarSign size={48} className="text-yellow-500" />}
          title="これ、娯楽に対してお金って足りなくなりません？"
          description="楽しいものがたくさんあるけどサイフの中身が心配。
    PaPaPaならそのピンチを手助けできるかも。"
        />
        <FeatureCard
          icon={<Heart size={48} className="text-green-500" />}
          title="ビタミン○○が豊富って何がいい？要約して"
          description="PaPaPaはあなたのカラダに何が良いかがすぐわかる。
    肌をキレイにしたい、筋肉をつけたい、疲れをとりたい...。
    そんな要望にも応えられます。"
        />
      </div>
      <Footer />
    </>
  );
}
