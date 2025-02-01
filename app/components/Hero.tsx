"use client";
import { noto_serif_display } from "@/lib/fonts";
import { motion } from "framer-motion";
// import Image from "next/image";

export default function Hero() {
  return (
    <div className="w-full md:w-[768px] bg-primary mx-auto min-h-[calc(100vh-80px)] flex items-center justify-center">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ ease: "easeInOut", duration: 0.3, delay: 0.2 }}
      >
        <h1
          className={
            "text-xl md:text-2xl font-bold text-amber-400 text-center " +
            noto_serif_display.className
          }
        >
          Kaanchwala & Sons
        </h1>
        <div className="w-4/5 md:w-full mx-auto text-3xl md:text-5xl mt-2 md:mt-3 text-center font-bold">
          Where Vision Meets Style
        </div>
      </motion.div>
    </div>
  );
}
