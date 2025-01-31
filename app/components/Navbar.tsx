"use client";

import Link from "next/link";
import React, { useState } from "react";

import Logo from "@/app/components/Logo";
import { MdOutlineShoppingBag, MdOutlinePersonOutline } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { inter } from "@/lib/fonts";

type Link = {
  name: string;
  link: string;
};

export default function Navbar() {
  const links: Link[] = [
    { name: "Home", link: "/" },
    { name: "Opticals", link: "/opticals" },
    { name: "Sunglasses", link: "/sunglasses" },
  ];

  const pathName = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (pathName.includes("/admin")) {
    return <></>;
  }

  return (
    <header
      className={
        " text-white p-2 md:p-4 max-w-2xl md:max-w-4xl mx-auto border-b border-white " +
        inter.className
      }
    >
      <div className="flex justify-between md:justify-between items-center px-4 sm:px-6 ">
        <div
          className="md:hidden relative "
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <IoMenu size={20} />
        </div>
        <Link href={"/"}>
          <Logo />
        </Link>
        <div className="hidden md:flex gap-4 tracking-wider">
          {links.map((link: Link) => (
            <Link
              href={link.link}
              key={link.name}
              className={
                pathName === link.link ? "text-dark-accent" : "text-white"
              }
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex space-x-2 items-center">
          <Link href={"/profile"} className="hidden md:block text-xl">
            <MdOutlinePersonOutline size={25} />
          </Link>
          <Link href={"/cart"} className="relative">
            <MdOutlineShoppingBag size={25} />
            <div className="absolute top-[-7px] right-[-7px] font-bold text-light-accent">
              0
            </div>
          </Link>
        </div>
        {/* Mobile Device Nav Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden absolute top-0 left-0 bg-dark-primary text-white z-10 h-[calc(100vh-10px)] w-4/5 h-[calc(100vh - 40px)] shadow-lg p-5 space-y-3"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "0", opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div
                onClick={() => setIsMenuOpen(false)}
                className=" text-white px-2"
              >
                <FaTimes />
              </div>
              {links.map((link: Link) => (
                <div key={link.name}>
                  <Link
                    href={link.link}
                    className="text-lg"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                  >
                    {link.name}
                  </Link>
                </div>
              ))}
              <Link
                href={"/profile"}
                className={`absolute bottom-5 ${pathName === "/profile" ? "text-light-accent" : "text-white"}`}
              >
                <MdOutlinePersonOutline size={25} color="D4AF37" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
