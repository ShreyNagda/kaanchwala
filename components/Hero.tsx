"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-linear-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span className="text-gold font-display text-6xl md:text-8xl font-bold block mb-2">
            K&S
          </span>
          <p className="text-white/60 text-sm md:text-base uppercase tracking-[0.3em]">
            Kaanchwala & Sons
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-8 leading-tight"
        >
          Timeless Vision.
          <br />
          <span className="text-gold">Crafted with Care.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Premium eyewear & expert eye care in Gopal Nagar, Bhiwandi
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#contact"
            className="flex-1 bg-gold hover:bg-gold-soft text-black font-semibold px-10 py-4 rounded-sm transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            Visit Our Store
          </a>
          <a
            href="tel:+919876543210"
            className="flex-1 border-2 border-gold text-gold hover:bg-gold hover:text-black font-semibold px-10 py-4 rounded-sm transition-all duration-300 w-full sm:w-auto"
          >
            Call Now
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-start justify-center p-2 text-gold-soft"
        >
          <ChevronDown />
        </motion.div>
      </motion.div>
    </section>
  );
}
