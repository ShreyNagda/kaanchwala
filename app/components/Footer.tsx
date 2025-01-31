"use client";
import { usePathname } from "next/navigation";
import { FaFacebook, FaPhoneAlt } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { RiInstagramFill } from "react-icons/ri";
import Logo from "./Logo";
import { noto_serif_display } from "@/lib/fonts";

export default function Footer() {
  const pathName = usePathname();
  if (pathName.includes("/admin")) {
    return <></>;
  }

  return (
    <footer className="bg-primary text-white flex flex-col max-w-4xl mx-auto p-4">
      <div className="w-full flex flex-col md:flex-row items-center justify-between">
        <div
          className={
            "flex items-center justify-center text-lg " +
            noto_serif_display.className
          }
        >
          <Logo />
          <div className="text-left text-sm">
            <span className="text-lg">Kaanchwala</span>
            <br /> & Sons
          </div>
        </div>
        <div className="flex gap-4">
          <a href={`tel:${9890334929}`} className="">
            <FaPhoneAlt size={18} />
          </a>
          <a href="mailto:shreynagda2714@gmail.com">
            <MdMail size={20} />
          </a>
          <a
            target="_new"
            href="https://www.instagram.com/kaanchwala_/"
            className=""
          >
            <RiInstagramFill size={20} />
          </a>
          <a
            target="_new"
            href="https://www.facebook.com/shrey.nagda/"
            className=""
          >
            <FaFacebook size={20} />
          </a>
        </div>
      </div>
      <div className="text-center p-2">&copy; All rights reserved</div>
    </footer>
  );
}
