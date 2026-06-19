import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        vazir: ["Vazir", "sans-serif"],
      },
      colors: {
        parchment: "#F8F5F0",
        border: "#E8DDD0",
        crimson: {
          DEFAULT: "#C0392B",
          dark: "#96281B",
          light: "#F9EBEA",
        },
        navy: {
          DEFAULT: "#1A1A2E",
          muted: "#4A4A6A",
        },
      },
    },
  },
  plugins: [],
};
export default config;
