"use client";
import { hover, motion } from "framer-motion";

export default function Services() {
  const service_data = [
    {
      image: "./reading-eyeglasses.png",
      title: "Spectacles",
    },
    {
      image: "./summer.png",
      title: "Sunglasses",
    },
    {
      image: "./contact-lens.png",
      title: "Contact Lens",
    },
  ];
  return (
    <div className="w-full md:w-[768px] bg-white text-dark-primary mx-auto py-4 flex items-center justify-center flex-col">
      <motion.h1
        className="text-xl md:text-2xl font-bold mt-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        Our Services
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {service_data.map((service, index) => (
          <ServiceCard
            key={service.title}
            image={service.image}
            title={service.title}
            delay={index}
          />
        ))}
      </div>
    </div>
  );
}

function ServiceCard({
  image,
  title,
  delay,
}: {
  title: string;
  image: string;
  delay: number;
}) {
  const variants = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut", delay: 0.3 * delay },
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut", delay: 0.3 * delay },
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  };
  return (
    <motion.div
      className="flex flex-col items-center justify-center shadow-lg p-2 rounded-lg border-slate-100 w-36 h-36 md:w-44 md:h-44 gap-1 md:gap-2 "
      variants={variants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
    >
      <img src={image} alt="" height={50} width={50} />
      <div className="text-lg">{title}</div>
    </motion.div>
  );
}
