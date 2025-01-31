"use client";
import { noto_serif_display } from "@/lib/fonts";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="w-full md:w-[768px] bg-primary  mx-auto md:h-[550px] h-[450px] flex items-center justify-center relative">
      {/* <motion.div
        className="absolute top-10  opacity-70"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 0.7 }}
        transition={{ ease: "easeInOut", duration: 0.3 }}
      >
        <Image src="/bg.png" alt="hero" width={400} height={300} />
      </motion.div> */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ ease: "easeInOut", duration: 0.3, delay: 0.2 }}
        className="absolute z-10"
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
