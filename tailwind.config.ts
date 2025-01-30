import type { Config } from "tailwindcss";

export default {
  darkMode: "media",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./omponents/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          primary: "#F9F9F9",
          secondary: "#F5F5F5",
          text: {
            primary: "#000000",
            secondary: "#4D4D4D",
            accent: "#D4AF37",
          },
          accent: "#D4AF37",
        },
        dark: {
          primary: "#000000",
          secondary: "#2C2C2C",
          text: {
            primary: "#FFFFFF",
            secondary: "#B3B3B3",
            accent: "#D4AF37",
          },
          accent: "#D4AF37",
        },
      },
      aspectRatio: {
        "4/3": "4 / 3",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
