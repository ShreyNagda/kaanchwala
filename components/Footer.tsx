"use client";

import { MapPin, Phone, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg text-fg">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 flex items-center justify-center">
                <span className="text-gold font-display text-3xl font-bold">
                  K&S
                </span>
              </div>
              <div>
                <p className="text-fg font-display text-xl font-semibold tracking-wide">
                  Kaanchwala & Sons
                </p>
                <p className="text-gray-400 text-sm">Premium Eyewear</p>
              </div>
            </div>
            <p className="text-gold font-display text-xl italic mb-6">
              &quot;Timeless Vision, Crafted with Care&quot;
            </p>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Premium eyewear and trusted eye care in Gopal Nagar, Bhiwandi
              since 2008. Formerly known as Arihant Opticals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold font-semibold uppercase tracking-widest text-sm mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-gold transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-gold transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#why-choose-us"
                  className="text-gray-400 hover:text-gold transition-colors"
                >
                  Why Us
                </a>
              </li>
              <li>
                <a
                  href="#medical-expertise"
                  className="text-gray-400 hover:text-gold transition-colors"
                >
                  Medical Expertise
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold font-semibold uppercase tracking-widest text-sm mb-6">
              Contact
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                <span>
                  Gopal Nagar, Bhiwandi
                  <br />
                  Next to Dr. Praful Bhat&apos;s Eye Clinic
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <a
                  href="tel:+919890334929"
                  className="hover:text-gold transition-colors"
                >
                  +91 98903 34929
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gold shrink-0" />
                <span>Mon-Sat: 10AM-8PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {currentYear} Kaanchwala & Sons. All rights reserved.</p>
            <p>
              Formerly known as{" "}
              <span className="text-gold">Arihant Opticals</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
