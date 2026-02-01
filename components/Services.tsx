"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Eye, Glasses, Wrench } from "lucide-react";

const services = [
  {
    title: "Eye Testing",
    description:
      "Comprehensive eye examinations using advanced diagnostic equipment and expert optometrists",
    icon: Eye,
  },
  {
    title: "Premium Eyewear",
    description:
      "Custom-fitted prescription glasses, sunglasses, and contact lenses tailored to your unique vision needs",
    icon: Glasses,
  },
  {
    title: "Repairs & Adjustments",
    description:
      "Professional frame repairs, precise fitting adjustments, and ongoing maintenance services",
    icon: Wrench,
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="services"
      className="py-32 md:py-40 px-6 md:px-12 lg:px-16 bg-off-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold">
            What We Offer
          </span>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-bg mt-4 mb-6">
            Our Services
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto"></div>
        </div>

        {/* Services Grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4 lg:gap-8"
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white md:p-4 p-10 rounded-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-6">
                  <IconComponent
                    className="w-14 h-14 text-gold group-hover:scale-110 transition-transform duration-300"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-2xl font-display font-semibold text-bg mb-4 group-hover:text-gold transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
                <div className="w-0 h-0.5 bg-gold mt-6 transition-all duration-300 group-hover:w-full"></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
