"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";

const features = [
  {
    title: "Trusted Local Legacy",
    description: "Serving Bhiwandi community for over 15 years with dedication",
  },
  {
    title: "Premium Quality Frames",
    description: "Curated selection from top international brands",
  },
  {
    title: "Advanced Eye Testing",
    description:
      "State-of-the-art diagnostic equipment and expert optometrists",
  },
  {
    title: "Personalized Service",
    description: "Dedicated support to find your perfect eyewear",
  },
  {
    title: "Expert Medical Partnership",
    description: "Located next to trusted eye clinic for comprehensive care",
  },
  {
    title: "Complete Eye Care",
    description: "From diagnosis to perfect eyewear solution",
  },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="why-choose-us"
      className="py-32 md:py-40 px-6 md:px-12 lg:px-16 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold">
              Excellence in Every Detail
            </span>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-bg mt-4 mb-6 leading-tight">
              Why Choose
              <br />
              <span className="text-gold">Kaanchwala & Sons?</span>
            </h2>
            <div className="w-20 h-1 bg-gold mb-8"></div>
            <p className="text-gray-600 text-lg leading-relaxed">
              We combine traditional values with modern expertise to deliver
              exceptional eye care and premium eyewear solutions.
            </p>
          </motion.div>

          {/* Right Column - Features */}
          <div ref={ref} className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-6 p-6 rounded-sm hover:bg-off-white transition-colors"
              >
                <div className="shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                    <Check className="w-5 h-5 text-black" strokeWidth={3} />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-display font-semibold text-bg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
