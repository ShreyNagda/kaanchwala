import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kaanchwala & Sons | Premium Eyewear in Bhiwandi",
  description:
    "Trusted optical store in Gopal Nagar, Bhiwandi. Premium eyewear, eye testing, prescription glasses, sunglasses & contact lenses. Located next to Dr. Praful Bhat's Eye Clinic.",
  keywords: [
    "optical store Bhiwandi",
    "eyewear Gopal Nagar",
    "eye testing",
    "prescription glasses",
    "Kaanchwala Sons",
    "Arihant Opticals",
  ],
  openGraph: {
    title: "Kaanchwala & Sons | Premium Eyewear in Bhiwandi",
    description: "Premium eyewear & trusted eye care in Gopal Nagar, Bhiwandi",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${inter.className} ${cormorantGaramond.className}`}
      >
        {children}
      </body>
    </html>
  );
}
