import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Luxury Dark Auction House Design Tokens
        void: "#050505",       // Jet Black
        deep: "#08090A",       // Deep Black
        charcoal: "#101113",   // Charcoal Panels
        surface: "#18191C",    // Light Black
        graphite: "#222428",   // Graphite Border/Highlight
        
        // Silvers
        "silver-dark": "#55585D",
        silver: "#8B8E93",
        "silver-light": "#C7C9CC",
        "silver-bright": "#F1F2F3",

        // Semantic Accents
        gold: {
          DEFAULT: "#D4AF37",
          hover: "#E5C158",
          muted: "rgba(212, 175, 55, 0.15)",
          border: "rgba(212, 175, 55, 0.35)",
        },
        danger: {
          DEFAULT: "#E53935",
          hover: "#EF5350",
          muted: "rgba(229, 57, 53, 0.15)",
          border: "rgba(229, 57, 53, 0.35)",
        },
        info: {
          DEFAULT: "#2F81FF",
          hover: "#58A6FF",
          muted: "rgba(47, 129, 255, 0.15)",
          border: "rgba(47, 129, 255, 0.35)",
        },
        caution: {
          DEFAULT: "#F5C542",
          hover: "#F7D065",
          muted: "rgba(245, 197, 66, 0.15)",
          border: "rgba(245, 197, 66, 0.35)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      borderRadius: {
        DEFAULT: "6px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "10px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.5)",
        panel: "0 4px 20px -2px rgba(0, 0, 0, 0.7)",
        "gold-glow": "0 0 15px -3px rgba(212, 175, 55, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
