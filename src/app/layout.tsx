import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Cinzel } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

export const inter = Inter({
 subsets: ["latin"],
 variable: "--font-inter",
});

export const cormorant = Cormorant_Garamond({
 subsets: ["latin"],
 weight: ["300", "400", "500", "600", "700"],
 style: ["normal", "italic"],
 variable: "--font-cormorant",
});

export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
 title: {
 default: "Kaanchwala — Premium Eyewear",
 template: "%s | Kaanchwala",
 },
 description:
 "Discover premium eyeglasses, sunglasses, and contact lenses at Kaanchwala. Prescription support, free shipping above ₹2000, and hassle-free returns.",
 keywords: [
 "eyeglasses",
 "sunglasses",
 "contact lenses",
 "prescription glasses",
 "premium eyewear",
 "India",
 ],
 openGraph: {
 type: "website",
 locale: "en_IN",
 siteName: "Kaanchwala",
 title: "Kaanchwala — Premium Eyewear",
 description: "Discover premium eyeglasses, sunglasses, and contact lenses.",
 },
};

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
 <html
 lang="en"
 className={`${inter.variable} ${cormorant.variable} ${cinzel.variable}`}
 data-scroll-behavior="smooth"
 >
 <body className="min-h-screen flex flex-col">
 {children}
 <Toaster
 position="bottom-right"
 toastOptions={{
 style: {
 background: "var(--color-surface)",
 border: "1px solid var(--color-border)",
 color: "var(--color-foreground)",
 },
 }}
 />
 </body>
 </html>
 );
}
