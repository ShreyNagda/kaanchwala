"use client";

import { noto_serif_display } from "@/lib/fonts";
import { AnimatePresence, motion } from "framer-motion";

export default function Hero() {
  return (
    <AnimatePresence>
      <div
        className={
          "flex flex-col items-center pt-32 text-white h-[calc(100vh-80px)] " +
          noto_serif_display.className
        }
      >
        <motion.div
          className="text-amber-400 tracking-wide text-lg md:text-xl"
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: "0%" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          Kaanchwala & Sons
        </motion.div>
        <motion.div
          className="text-4xl text-center tracking-wider md:text-5xl max-w-sm mx-auto"
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: "0" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut", delay: 0.6 }}
        >
          Where Vision Meets Style
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
