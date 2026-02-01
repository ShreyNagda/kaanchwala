"use client";

import { useState, useEffect } from "react";
import { Phone, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "translate-y-0 opacity-100 bg-white/95 backdrop-blur-md shadow-lg py-4"
          : "-translate-y-full opacity-0 bg-transparent py-6 pointer-events-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-12 h-12 flex items-center justify-center">
              <span
                className={`font-display text-2xl font-bold transition-colors ${
                  isScrolled ? "text-gold" : "text-gold"
                }`}
              >
                K&S
              </span>
            </div>
            <div className="hidden sm:block">
              <p
                className={`font-display text-lg font-semibold tracking-wide transition-colors ${
                  isScrolled ? "text-bg" : "text-white"
                }`}
              >
                Kaanchwala & Sons
              </p>
              <p
                className={`text-xs transition-colors ${
                  isScrolled ? "text-gray-600" : "text-gray-300"
                }`}
              >
                Premium Eyewear
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-10">
            <a
              href="#about"
              className={`text-sm font-medium uppercase tracking-wider transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-gold"
                  : "text-white hover:text-gold"
              }`}
            >
              About
            </a>
            <a
              href="#services"
              className={`text-sm font-medium uppercase tracking-wider transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-gold"
                  : "text-white hover:text-gold"
              }`}
            >
              Services
            </a>
            <a
              href="#why-choose-us"
              className={`text-sm font-medium uppercase tracking-wider transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-gold"
                  : "text-white hover:text-gold"
              }`}
            >
              Why Us
            </a>
            <a
              href="#medical-expertise"
              className={`text-sm font-medium uppercase tracking-wider transition-colors ${
                isScrolled
                  ? "text-gray-700 hover:text-gold"
                  : "text-white hover:text-gold"
              }`}
            >
              Expertise
            </a>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+919876543210"
              className="bg-gold hover:bg-gold-soft text-black font-semibold px-6 py-3 rounded-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Call Now</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? "max-h-96 opacity-100 mt-6 pb-6 border-t border-gray-200 pt-6"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-4">
            <a
              href="#about"
              className="text-sm font-medium uppercase tracking-wider text-gray-700 hover:text-gold transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#services"
              className="text-sm font-medium uppercase tracking-wider text-gray-700 hover:text-gold transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="#why-choose-us"
              className="text-sm font-medium uppercase tracking-wider text-gray-700 hover:text-gold transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Why Us
            </a>
            <a
              href="#medical-expertise"
              className="text-sm font-medium uppercase tracking-wider text-gray-700 hover:text-gold transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Expertise
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
