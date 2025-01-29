"use client";
import { usePathname } from "next/navigation";
import {
  FaFacebook,
  FaInstagram,
  FaPhoneAlt,
  FaLinkedin,
} from "react-icons/fa";
import { MdMail } from "react-icons/md";
import Logo from "./Logo";
import { noto_serif_display } from "@/lib/fonts";

export default function Footer() {
  const pathName = usePathname();
  if (pathName.includes("/admin")) {
    return <></>;
  }

  return (
    <footer className="bg-primary text-white flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-start gap-1 py-4">
        <div
          className={
            "row-span-2 flex items-center text-lg  " +
            noto_serif_display.className
          }
        >
          <Logo />
          <div className="text-left text-sm m-0 pr-7">
            <span className="text-lg">Kaanchwala</span>
            <br /> & Sons
          </div>
        </div>
        <div className="flex items-center gap-2 pl-5 md:pl-0">
          <FaPhoneAlt />
          +91 9890334929
        </div>
        <div className="flex items-center gap-2 pl-5 md:pl-0">
          <MdMail />
          kaanchwala@gmail.com
        </div>
        <div className="flex items-center gap-2 pl-5 md:pl-0">
          <FaInstagram />
          kaanchwala_
        </div>
        <div className="flex items-center gap-2 pl-5 md:pl-0">
          <FaFacebook />
          kaanchwala_
        </div>
      </div>
    </footer>
  );
}
