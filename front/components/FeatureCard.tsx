"use client";
import React from "react";
import { motion } from "framer-motion";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <motion.div className="bg-white dark:bg-gray-800 border-2
     border-black dark:border-gray-600 rounded-lg"
    initial={{ opacity: 0, y: 20 }}             
    whileInView={{ opacity: 1, y: 0 }}           
    viewport={{ once: true }}                   
    transition={{ duration: 0.5 }}               
  >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-center text-sm">{description}</p>
      <button
      aria-label="レシピを見る"
      className="
      px-4 sm:px-6 py-2 sm:py-3 bg-orange-700 text-white rounded-lg 
      hover:bg-orange-800 
      transition-colors transition-transform duration-200 ease-in-out
      hover:scale-105 hover:underline active:scale-95
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
      "
    >
      レシピを見る
    </button>
    </motion.div>
  );
}
