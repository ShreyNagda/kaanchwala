import Link from "next/link";
import { ArrowRight, Truck, Shield, Eye, Sparkles, Phone } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import Image from "next/image";
import { ProductCard } from "@/components/product/ProductCard";

export default async function HomePage() {
  const db = createAdminClient();
  const { data: featuredProducts } = await db
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("is_premium", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(4);
  return (
    <div className="space-y-0">
      {/* ===== Hero Section ===== */}
      <section className="relative h-[90vh] min-h-150 flex items-center justify-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 bg-black">
          <Image
            width={1920}
            height={1080}
            loading="eager"
            src="/images/kaanchwala_hero.png"
            alt="Luxury Eyewear Boutique"
            className="w-full h-full object-bottom object-cover opacity-60 animate-fade-in duration-1000"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-black/10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/20 backdrop-blur-md mb-6 animate-slide-up">
            <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-accent">
              Bhiwandi&apos;s Elite Optical House
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight text-white leading-[1.1] max-w-4xl mx-auto animate-slide-up">
            Curators of{" "}
            <span className="italic text-accent">Luxury Eyewear</span> &amp;{" "}
            Precision Vision
          </h1>

          <p
            className="mt-6 text-sm sm:text-base md:text-lg text-stone-300 leading-relaxed max-w-xl mx-auto font-light animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            Discover handcrafted designer frames, specialized prescription
            lenses, and three generations of optical expertise.
          </p>

          <div
            className="mt-10 flex flex-wrap justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            <Link
              href="/products"
              className="btn-accent gap-2 text-xs sm:text-sm px-8 py-3 rounded-md tracking-widest uppercase font-semibold text-black hover:bg-accent/90"
            >
              Shop Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products?premium=true"
              className="btn-ghost gap-2 text-xs sm:text-sm px-8 py-3 rounded-md tracking-widest uppercase font-semibold text-white border-white/30 hover:bg-white/10"
            >
              Premium Range
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Brand Directory Bar ===== */}
      <section className="border-y border-border bg-surface py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <span className="text-[10px] tracking-[0.3em] font-semibold text-muted-foreground uppercase">
              Featured Luxury Brands
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 md:gap-x-12 gap-y-6 text-foreground/40 font-light text-sm sm:text-lg md:text-xl tracking-[0.25em] uppercase">
            <span className="hover:text-foreground transition-colors cursor-default">
              Cartier
            </span>
            <span className="hover:text-foreground transition-colors cursor-default">
              Akoni
            </span>
            <span className="hover:text-foreground transition-colors cursor-default">
              Tom Ford
            </span>
            <span className="hover:text-foreground transition-colors cursor-default">
              Gucci
            </span>
            <span className="hover:text-foreground transition-colors cursor-default">
              Prada
            </span>
            <span className="hover:text-foreground transition-colors cursor-default">
              Dita
            </span>
            <span className="hover:text-foreground transition-colors cursor-default">
              Chanel
            </span>
          </div>
        </div>
      </section>

      {/* ===== Visual Category Grid ===== */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-foreground tracking-tight">
              Browse by <span className="italic text-accent">Collection</span>
            </h2>
            <p className="text-muted-foreground text-sm mt-3 tracking-wide max-w-md mx-auto">
              Select a specialized lens category curated for optimal vision and
              style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Sunglasses",
                desc: "UV Protection meets High Fashion",
                href: "/products?category=sunglasses",
                img: "/images/sunglasses_cat.png",
              },
              {
                title: "Eyeglasses",
                desc: "Precision prescription frames",
                href: "/products?category=eyeglasses",
                img: "/images/eyeglasses_cat.png",
              },
              {
                title: "Contact Lenses",
                desc: "Aesthetic clarity & hydration comfort",
                href: "/products?category=contact_lenses",
                img: "/images/contact_lenses_cat.png",
              },
            ].map((category, idx) => (
              <Link
                key={category.title}
                href={category.href}
                className="relative group block aspect-4/5 rounded-xl overflow-hidden shadow-card border border-border transition-all duration-300 hover:border-accent/40"
              >
                {/* Background Category Image */}
                <Image
                  width={1920}
                  height={1080}
                  src={category.img}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 premium-overlay" />

                {/* Overlay Text */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 text-white z-10">
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-accent uppercase mb-2">
                    Collection 0{idx + 1}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-light tracking-wide mb-1 text-white">
                    {category.title}
                  </h3>
                  <p className="text-xs text-stone-300 font-light tracking-wide mb-4">
                    {category.desc}
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-accent group-hover:translate-x-1.5 transition-transform duration-300">
                    Explore collection
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Featured Products Section ===== */}
      <section
        id="featured"
        className="py-20 bg-background border-t border-border"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="text-[10px] font-semibold tracking-[0.25em] text-accent uppercase block mb-2">
                The Curation
              </span>
              <h2 className="text-3xl sm:text-4xl font-light text-foreground tracking-tight">
                Featured <span className="italic text-accent">Designs</span>
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-accent hover:text-accent/80 hover:translate-x-1 transition-all duration-300"
            >
              View Full Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {!featuredProducts || featuredProducts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl bg-surface/50">
              <p className="text-muted-foreground text-sm">
                No featured eyewear available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  inViewDelay={1000}
                  staggerDelay={idx * 120}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== Heritage & Boutique Story Section ===== */}
      <section id="story" className="py-24 bg-surface border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Boutique image with gold detail */}
            <div className="relative aspect-square sm:aspect-4/3 lg:aspect-square rounded-xl overflow-hidden border border-border shadow-elevated">
              <video
                src={"/e_b_cmp.mp4"}
                className="aspect-square object-cover"
                autoPlay
                muted
                loop
              />
              <div className="absolute inset-0 border-3 border-surface/50 pointer-events-none rounded-xl" />
            </div>

            {/* Right Column: Narrative */}
            <div className="space-y-6 lg:pl-6">
              <div className="inline-flex items-center gap-2">
                <span className="text-[10px] font-semibold tracking-[0.25em] text-accent uppercase">
                  ESTABLISHED 2026
                </span>
                <span className="h-1 w-8 bg-accent" />
              </div>

              <h2 className="text-3xl sm:text-5xl font-light text-foreground leading-[1.15]">
                Three Generations of <br />
                <span className="italic text-accent">Optical Masterpiece</span>
              </h2>

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-light">
                At Kaanchwala, our heritage is built on a simple promise: to
                marry precision ophthalmology with the world&apos;s most
                exquisite luxury eyewear.
              </p>

              <blockquote className="border-l-2 border-accent pl-4 italic text-foreground text-sm sm:text-base py-1 my-4">
                &quot;Eyewear is not simply a correction; it is a signature of
                personal identity.&quot;
              </blockquote>

              <p className="text-muted-foreground text-sm leading-relaxed font-light">
                Every frame in our luxury inventory is hand-selected from
                workshops in Italy, France, and Japan. Our advanced diagnostic
                lab ensures that each custom lens is fitted with clinical
                perfection.
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/products?premium=true"
                  className="btn-accent px-6 text-xs uppercase tracking-widest font-semibold text-black"
                >
                  View Luxury Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Premium Cues (Value Props) ===== */}
      <section className="py-16 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Truck className="h-5 w-5" />,
                title: "Free Shipping",
                desc: "On all orders above ₹2,000",
              },
              {
                icon: <Eye className="h-5 w-5" />,
                title: "Prescription Support",
                desc: "Simple prescription uploads",
              },
              {
                icon: <Shield className="h-5 w-5" />,
                title: "Easy Returns",
                desc: "Hassle-free exchanges",
              },
              {
                icon: <Sparkles className="h-5 w-5" />,
                title: "100% Authentic",
                desc: "Direct designer partnerships",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 p-4 rounded-lg bg-surface border border-border hover:border-accent/30 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Prescription Customizer CTA ===== */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden bg-foreground text-background p-10 sm:p-20 border border-border shadow-elevated">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-stone-100 via-stone-900 to-black pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
              <span className="text-[10px] font-semibold tracking-[0.3em] text-accent uppercase">
                Precision Ophthalmics
              </span>

              <h2 className="text-3xl sm:text-5xl font-light text-background leading-tight">
                Order Custom{" "}
                <span className="italic text-accent">Prescription Lenses</span>{" "}
                Online
              </h2>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto font-light">
                Configure your lenses with blue-cut coating, photochromic
                transitions, or high-index thinning in a few simple clicks.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link
                  href="/lenses?redirect=/"
                  className="btn-accent text-xs font-semibold tracking-widest uppercase px-8 text-black"
                >
                  Configure My Lenses
                </Link>
                <Link
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-white"
                  href={"tel:+9890334929"}
                >
                  <Phone className="h-4 w-4 text-accent" /> Book Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
