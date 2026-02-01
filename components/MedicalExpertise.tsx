"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Hospital, UserCheck, Award } from "lucide-react";

export default function MedicalExpertise() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="medical-expertise"
      className="py-32 md:py-40 px-6 md:px-12 lg:px-16 bg-gradient-to-br from-gray-900 to-black text-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold">
            Medical Excellence
          </span>
          <h2 className="text-5xl md:text-6xl font-display font-bold mt-4 mb-6">
            Expert Eye Care
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto"></div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Location Card */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gold/10 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <Hospital className="w-10 h-10 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-display font-bold mb-4">
              Strategic Location
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Located next to{" "}
              <span className="text-gold font-semibold">
                Dr. Praful Bhat&apos;s Eye Clinic
              </span>{" "}
              for seamless comprehensive eye care
            </p>
          </motion.div>

          {/* Optometrist Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:border-x border-gray-800 lg:px-8"
          >
            <div className="w-20 h-20 bg-gold/10 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <UserCheck className="w-10 h-10 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-display font-bold mb-4">
              Expert Optometrist
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Guided by{" "}
              <span className="text-gold font-semibold">
                Optometrist Siddharth Jain
              </span>
              , ensuring precise prescriptions and personalized care
            </p>
          </motion.div>

          {/* Quality Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gold/10 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-gold" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-display font-bold mb-4">
              15+ Years Excellence
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Trusted by over 5,000+ happy customers with 100% quality assurance
              in every service
            </p>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 pt-12 border-t border-gray-800"
        >
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-display font-bold text-gold mb-2">
                15+
              </p>
              <p className="text-gray-400 text-sm uppercase tracking-wider">
                Years Experience
              </p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-display font-bold text-gold mb-2">
                5000+
              </p>
              <p className="text-gray-400 text-sm uppercase tracking-wider">
                Happy Customers
              </p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-display font-bold text-gold mb-2">
                100%
              </p>
              <p className="text-gray-400 text-sm uppercase tracking-wider">
                Quality Assured
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
