import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2fb",
          100: "#d5def4",
          200: "#aabce9",
          300: "#7f9bdd",
          400: "#5479d2",
          500: "#2f58bf",
          600: "#1f3f97",
          700: "#17368a",
          800: "#122a6d",
          900: "#0d1f52",
          950: "#081437",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
