"use client";
import React from "react";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import { Clock, DollarSign, Heart } from "lucide-react";


export default function RootLayout(
  
) {
  return (
    <>
      <Hero />
      <div className="w-full px-4 grid grid-cols-1 gap-8 ">
        <FeatureCard
          icon={<Clock size={48} className="text-orange-500" />}
          title="見てる動画のシークバーで作れるカンタンごはん。"
          description={`好きな動画を見ながら作れるごはんがたくさんあります。 
          ごはんが出来たら2本目の動画も見ちゃいましょう!`}
    imageSrc="/time_image.webp"
    imageAlt="時間イメージ"
        />
        <FeatureCard
          icon={<DollarSign size={48} className="text-yellow-500" />}
          title="これ、娯楽に対してお金って足りなくなりません？"
          description={`楽しいものがたくさんあるけどサイフの中身が心配。
          PaPaPaならそのピンチを手助けできるかも。`}
    imageSrc="/cost_image.webp"
    imageAlt="コストイメージ"
        />
        <FeatureCard
          icon={<Heart size={48} className="text-green-500" />}
          title="ビタミン○○が豊富って何がいい？要約して"
          description={`PaPaPaはあなたのカラダに何が良いかがすぐわかる。
    肌をキレイに、筋肉をつけたい、疲れをとりたい。
    そんな要望にも応えられます。`}
    imageSrc="/vitamin_image.webp"
    imageAlt="栄養イメージ"
        />
      </div>
      <Footer />
    </>
  );
}
