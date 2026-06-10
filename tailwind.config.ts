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
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      colors: {
        surface: {
          DEFAULT: "#0A0A0B",
          card: "#141416",
          muted: "#1C1C1E",
        },
        accent: {
          DEFAULT: "#D48BA6",
          blue: "#D48BA6",
          purple: "#ECA8D6",
          indigo: "#B06D8A",
          glow: "rgba(212, 139, 166, 0.12)",
          dim: "rgba(212, 139, 166, 0.06)",
        },
        "accent-hover": "#B06D8A",
        ink: {
          DEFAULT: "#EDECEA",
          muted: "#A3A19E",
          dim: "#6E6C69",
        },
      },
      animation: {
        "float": "float 4s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.7s ease-out forwards",
        "reveal": "reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "reveal": {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
