"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Clock } from "lucide-react";

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="contact"
      className="py-32 md:py-40 px-6 md:px-12 lg:px-16 bg-off-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - CTA Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <span className="text-gold uppercase tracking-[0.3em] text-sm font-semibold">
                Visit Us Today
              </span>
              <h2 className="text-5xl md:text-6xl font-display font-bold text-bg mt-4 mb-6 leading-tight">
                Experience
                <br />
                <span className="text-gold">Premium Eyewear</span>
              </h2>
              <div className="w-20 h-1 bg-gold"></div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              Visit our store in Gopal Nagar, Bhiwandi for personalized eye care
              and premium eyewear selection. Our expert team is ready to help
              you find the perfect vision solution.
            </p>

            {/* Contact Info */}
            <div className="space-y-6 pt-4">
              {/* Address */}
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-gold" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-bg mb-1">Address</h3>
                  <p className="text-gray-600">
                    Shop No. 4, 8-B/6, Gopal Nagar, Bhiwandi
                    <br />
                    Next to Dr. Praful Bhat&apos;s Eye Clinic
                    <br />
                    Maharashtra, India
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-gold" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-bg mb-1">Phone</h3>
                  <a
                    href="tel:+919876543210"
                    className="text-2xl font-display font-bold text-gold hover:text-gold-soft transition-colors"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-gold" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-bg mb-2">Store Hours</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>Monday - Saturday: 10:00 AM - 8:00 PM</p>
                    <p>Sunday: 11:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold hover:bg-gold-soft text-black font-semibold px-8 py-4 rounded-sm transition-all duration-300 hover:scale-105 text-center"
              >
                Get Directions
              </a>
              <a
                href="tel:+919876543210"
                className="border-2 border-gold text-gold hover:bg-gold hover:text-black font-semibold px-8 py-4 rounded-sm transition-all duration-300 text-center"
              >
                Call Us Now
              </a>
            </div>
          </motion.div>

          {/* Right Column - Google Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square lg:aspect-4/5 rounded-sm overflow-hidden border-2 border-gray-300 shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.4924288487676!2d73.05875931490034!3d19.29714998694948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDE3JzQ5LjciTiA3M8KwMDMnNDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kaanchwala & Sons Location - Gopal Nagar, Bhiwandi"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-sm shadow-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <p className="font-semibold text-bg text-sm">
                    Kaanchwala & Sons
                  </p>
                  <p className="text-gray-600 text-xs">Gopal Nagar, Bhiwandi</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
