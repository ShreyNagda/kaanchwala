"use client";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="w-full md:w-[768px] bg-light-primary text-dark-primary mx-auto py-4 flex items-center justify-center flex-col p-2 md:p-4">
      <motion.h1
        className="text-xl md:text-2xl font-bold mt-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        Visit us at Kaanchwala
      </motion.h1>
      <motion.p
        className="p-1 md:p-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        Welcome to Kaachwala & Sons, previously Arihant Opticians, the premier
        destination for luxury eyewear in Mumbai. We have been a family-run
        business since 1989, working towards providing the best in opticals for
        our customers. We have earned our reputation as the best optical
        boutique in the area, offering a curated selection of exquisite eyewear
        collections.
      </motion.p>
      <motion.p
        className="p-1 md:p-2"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut", delay: 0.1 }}
      >
        At Kaanchwala & Sons, we pride ourselves on delivering exceptional
        quality, style, and service. Our boutique is frequented by discerning
        customers including students, working professionals and businessmen, all
        seeking the perfect eyewear to complement their personal style.
      </motion.p>
    </div>
  );
}
