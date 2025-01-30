import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { inter } from "@/lib/fonts";
import Transition from "@/components/Transition";

export const metadata: Metadata = {
  title: "Kaanchwala & Sons",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialiased " + inter.className}>
        <Navbar />
        <main className="min-h-[calc(100vh-93px)] bg-dark-primary text-white overflow-x-hidden">
          <Transition>{children}</Transition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
