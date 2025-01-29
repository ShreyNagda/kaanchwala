"use client";

import { inter } from "@/lib/fonts";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      className={
        "flex flex-col items-center justify-center bg-light-primary text-black min-h-[95vh] gap-2 text-2xl max-w-4xl mx-auto py-2 " +
        inter.className
      }
    >
      <motion.div
        className="text-2xl font-bold py-1 md:py-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        Visit Kaanchwala & Sons
      </motion.div>
      <p className="text-lg p-3 md:p-5">
        Welcome to Kaachwala & Sons, previously Arihant Opticians, the premier
        destination for luxury eyewear in Mumbai. We have been a family-run
        business since 2003, working towards providing the best in opticals for
        our customers. We have earned our reputation as the best optical
        boutique in the area, offering a curated selection of exquisite eyewear
        collections.
      </p>
      <p className="text-lg p-3 md:p-5 hidden md:block">
        At Kaanchwala & Sons, we pride ourselves on delivering exceptional
        quality, style, and service. Our boutique is frequented by discerning
        customers including celebrities, influencers, and fashion aficionados,
        all seeking the perfect eyewear to complement their personal style.
      </p>
    </section>
  );
}
