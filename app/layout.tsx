import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { inter } from "@/lib/fonts";
import Transition from "@/app/components/Transition";

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
      <body className={"h-full antialiased " + inter.className}>
        <Navbar />
        <main className=" bg-dark-primary text-white">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
