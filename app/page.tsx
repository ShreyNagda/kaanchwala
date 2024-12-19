import Image from "next/image";
import {
  Clock,
  Eye,
  Phone,
  Mail,
  MapPin,
  Star,
  Check,
  Glasses,
  ScanEye,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gold-600">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gold-500">
            Kaanchwala & Sons
          </h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="#home" className="text-gold-500 hover:text-gold-400">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gold-500 hover:text-gold-400"
                >
                  Services
                </a>
              </li>
              <li>
                <a href="#about" className="text-gold-500 hover:text-gold-400">
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gold-500 hover:text-gold-400"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="bg-gradient-to-b from-black to-gray-900 py-20"
      >
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-4xl font-bold mb-4 text-gold-500">
              Enhance Vision with Clarity
            </h2>
            <p className="text-xl mb-6 text-gray-300">
              Serving our community with precision and care for over 30 years.
            </p>
            <a
              href="#contact"
              className="bg-gold-500 text-black py-2 px-6 rounded-full font-semibold hover:bg-gold-400 transition duration-300"
            >
              Book an Appointment
            </a>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/bg-transparent.png"
              alt="Optician examining eyes"
              width={800}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gold-500">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black p-6 rounded-lg shadow-md border border-gold-600">
              <Eye className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gold-400">
                Eye Examinations
              </h3>
              <p className="text-gray-400">
                Comprehensive eye tests using state-of-the-art equipment.
              </p>
            </div>
            <div className="bg-black p-6 rounded-lg shadow-md border border-gold-600">
              <Glasses className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gold-400">
                Prescription Glasses
              </h3>
              <p className="text-gray-400">
                Wide range of frames and lenses to suit every style and need.
              </p>
            </div>
            <div className="bg-black p-6 rounded-lg shadow-md border border-gold-600">
              <ScanEye className="w-12 h-12 text-gold-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gold-400">
                Contact Lenses
              </h3>
              <p className="text-gray-400">
                Expert fitting and advice for contact lens wearers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gold-500">
            What Our Customers Say
          </h2>
          <div className="max-w-3xl mx-auto bg-gray-900 p-8 rounded-lg shadow-md border border-gold-600">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-gold-500 fill-current" />
              ))}
            </div>
            <p className="text-gray-300 mb-4">
              "I've been coming to Kaanchwala & Sons for over a decade now.
              Their attention to detail and personalized service is unmatched. I
              wouldn't trust my eyes to anyone else!"
            </p>
            <p className="font-semibold text-gold-400">- Rahul Sharma</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="about" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gold-500">
            Why Choose Kaanchwala & Sons?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <Check className="w-6 h-6 text-gold-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gold-400">
                  30 Years of Experience
                </h3>
                <p className="text-gray-300">
                  Three decades of serving our community with excellence.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Check className="w-6 h-6 text-gold-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gold-400">
                  Cutting-edge Technology
                </h3>
                <p className="text-gray-300">
                  We invest in the latest optical equipment for accurate
                  diagnoses.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Check className="w-6 h-6 text-gold-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gold-400">
                  Personalized Care
                </h3>
                <p className="text-gray-300">
                  We take the time to understand your unique vision needs.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Check className="w-6 h-6 text-gold-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gold-400">
                  Wide Selection
                </h3>
                <p className="text-gray-300">
                  Extensive range of frames and lenses to suit all preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-black py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gold-500">
            Get in Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-gold-400">
                Contact Information
              </h3>
              <div className="flex items-center mb-4">
                <Phone className="w-6 h-6 mr-4 text-gold-500" />
                <p className="text-gray-300">+91 8856904929</p>
              </div>
              <div className="flex items-center mb-4">
                <Mail className="w-6 h-6 mr-4 text-gold-500" />
                <p className="text-gray-300">info@kaanchwala.com</p>
              </div>
              <div className="flex items-start mb-4">
                <MapPin className="w-6 h-6 mr-4 mt-1 text-gold-500" />
                <p className="text-gray-300">Bhiwandi | Mumbai</p>
              </div>
              <div className="flex items-center">
                <Clock className="w-6 h-6 mr-4 text-gold-500" />
                <p className="text-gray-300">Mon-Sat: 9:00 AM - 7:00 PM</p>
              </div>
            </div>
            <div>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gold-600 focus:outline-none focus:border-gold-400"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gold-600 focus:outline-none focus:border-gold-400"
                />
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gold-600 focus:outline-none focus:border-gold-400"
                ></textarea>
                <button
                  type="submit"
                  className="bg-gold-500 text-black py-2 px-6 rounded-full font-semibold hover:bg-gold-400 transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 border-t border-gold-600">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; 2023 Kaanchwala & Sons. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
