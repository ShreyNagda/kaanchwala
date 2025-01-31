"use client";
import { usePathname } from "next/navigation";
import { FaFacebook, FaInstagram, FaPhoneAlt } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import Logo from "./Logo";
import { noto_serif_display } from "@/lib/fonts";

export default function Footer() {
  const pathName = usePathname();
  if (pathName.includes("/admin")) {
    return <></>;
  }

  return (
    <footer className="bg-primary text-white flex flex-col items-center max-w-4xl mx-auto">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-1 py-4 items-center">
        <div
          className={
            "row-span-2 flex items-center justify-center text-lg " +
            noto_serif_display.className
          }
        >
          <Logo />
          <div className="text-left text-sm">
            <span className="text-lg">Kaanchwala</span>
            <br /> & Sons
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 pl-5 md:pl-0 ">
          <FaPhoneAlt />
          +91 9890334929
        </div>
        <div className="flex items-center justify-center gap-2 pl-5 md:pl-0">
          <MdMail />
          kaanchwala@gmail.com
        </div>
        <div className="flex items-center justify-center gap-2 pl-5 md:pl-0">
          <FaInstagram />
          kaanchwala_
        </div>
        <div className="flex items-center justify-center gap-2 pl-5 md:pl-0">
          <FaFacebook />
          kaanchwala_
        </div>
      </div>
    </footer>
  );
}
