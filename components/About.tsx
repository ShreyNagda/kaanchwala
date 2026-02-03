"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      className="py-32 md:py-40 px-6 md:px-12 lg:px-16 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column - Image */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-4/5 bg-linear-to-br from-gray-100 to-gray-200 rounded-sm relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-gold flex items-center justify-center">
                    <span className="text-gold font-display text-5xl font-bold">
                      <Image
                        src="/logo2.png"
                        alt="Kaanchwala & Sons Logo"
                        width={48}
                        height={48}
                        className="object-contain"
                        priority
                      />
                    </span>
                  </div>
                  <p className="text-gray-600 font-semibold">
                    Premium Optical Store
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-gold/10 rounded-sm -z-10"></div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold">
                Our Story
              </span>
              <h2 className="text-5xl md:text-6xl font-display font-bold text-bg mt-4 mb-6 leading-tight">
                A Legacy
                <br />
                <span className="text-gold">Reimagined</span>
              </h2>
              <div className="w-20 h-1 bg-gold"></div>
            </div>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                Welcome to{" "}
                <span className="font-semibold text-bg">Kaanchwala & Sons</span>
                , your trusted destination for premium eyewear and comprehensive
                eye care services in Gopal Nagar, Bhiwandi.
              </p>

              <p>
                Formerly known as{" "}
                <span className="font-semibold">Arihant Opticals</span>,
                we&apos;ve served our community with dedication and expertise
                for over 15 years. Now reimagined as Kaanchwala & Sons, we
                continue our family-owned tradition of excellence with a fresh,
                modern approach.
              </p>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-gold font-display text-2xl italic">
                  &ldquo;Where tradition meets modern luxury in eyewear.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
