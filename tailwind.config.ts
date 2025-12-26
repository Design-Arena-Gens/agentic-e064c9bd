import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#040714",
        surface: "#0a1a2a",
        accent: "#4f46e5",
        "accent-soft": "#6366f1",
        "accent-strong": "#312e81"
      },
      boxShadow: {
        glow: "0 0 25px rgba(79, 70, 229, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
