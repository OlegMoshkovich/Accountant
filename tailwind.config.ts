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
          50: "#e8eef8",
          100: "#c5d4ec",
          200: "#8fa9d9",
          300: "#5a7fc5",
          400: "#2f5aab",
          500: "#1a4394",
          600: "#0f3582",
          700: "#082c78",
          800: "#00246f",
          900: "#001c57",
          950: "#00123a",
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
