import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      colors: {
        term: {
          bg: "#060810",
          "bg-deeper": "#03050a",
          panel: "#0c1018",
          border: "#1a2235",
          hairline: "rgba(255,255,255,0.06)",
          text: "#e2eaff",
          dim: "#4a5a7a",
          green: "#39ff88",
          amber: "#f59e0b",
          red: "#f43f5e",
          cyan: "#22d3ee",
          violet: "#a855f7",
          blue: "#3b82f6",
        },
        aura: {
          god:   "#39ff88",   /* 90-100 */
          based: "#22d3ee",   /* 75-89  */
          solid: "#a855f7",   /* 60-74  */
          mid:   "#f59e0b",   /* 40-59  */
          ngmi:  "#f43f5e",   /* 0-39   */
        },
      },
      backgroundImage: {
        "glass-creator": "linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(34,211,238,0.04) 100%)",
        "glass-trader": "linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(57,255,136,0.04) 100%)",
        "glow-violet": "radial-gradient(ellipse at center, rgba(168,85,247,0.15) 0%, transparent 70%)",
        "glow-cyan": "radial-gradient(ellipse at center, rgba(34,211,238,0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        term: "inset 0 0 0 1px rgba(57, 255, 136, 0.08)",
        glass: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        "glow-green": "0 0 20px rgba(57,255,136,0.3), 0 0 60px rgba(57,255,136,0.1)",
        "glow-violet": "0 0 20px rgba(168,85,247,0.3), 0 0 60px rgba(168,85,247,0.1)",
        "glow-cyan": "0 0 20px rgba(34,211,238,0.3), 0 0 60px rgba(34,211,238,0.1)",
      },
      keyframes: {
        blink: { "0%,50%": { opacity: "1" }, "51%,100%": { opacity: "0" } },
        tick: { "0%": { opacity: "0.4" }, "100%": { opacity: "1" } },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        drawSvg: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-20px) translateX(10px)" },
        },
        gridDrift: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "40px 40px" },
        },
        typewriter: {
          "0%": { width: "0ch" },
          "100%": { width: "var(--type-to, 18ch)" },
        },
        glowPulse: {
          "0%,100%": { boxShadow: "0 0 20px rgba(57,255,136,0.2), 0 0 60px rgba(57,255,136,0.05)" },
          "50%": { boxShadow: "0 0 40px rgba(57,255,136,0.5), 0 0 80px rgba(57,255,136,0.15)" },
        },
        violetPulse: {
          "0%,100%": { boxShadow: "0 0 20px rgba(168,85,247,0.2), 0 0 60px rgba(168,85,247,0.05)" },
          "50%": { boxShadow: "0 0 40px rgba(168,85,247,0.5), 0 0 80px rgba(168,85,247,0.15)" },
        },
        cyanPulse: {
          "0%,100%": { boxShadow: "0 0 20px rgba(34,211,238,0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(34,211,238,0.5)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        rotateSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        auraFloat: {
          "0%,100%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(8px,-14px)" },
        },
        auraBlink: {
          "0%,50%": { opacity: "1" },
          "51%,100%": { opacity: "0" },
        },
        auraFadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        blink: "blink 1s steps(1) infinite",
        tick: "tick 120ms ease-out",
        fadeIn: "fadeIn 0.4s ease-out both",
        slideUp: "slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
        slideIn: "slideIn 0.5s cubic-bezier(0.16,1,0.3,1) both",
        drawSvg: "drawSvg 3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        float: "float 8s ease-in-out infinite",
        gridDrift: "gridDrift 20s linear infinite",
        typewriter: "typewriter 2.5s steps(30) 0.8s forwards",
        glowPulse: "glowPulse 3s ease-in-out infinite",
        violetPulse: "violetPulse 3s ease-in-out infinite",
        cyanPulse: "cyanPulse 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        rotateSlow: "rotateSlow 20s linear infinite",
        scaleIn: "scaleIn 0.3s ease-out both",
        auraFloat: "auraFloat 5s ease-in-out infinite",
        auraBlink: "auraBlink 1s steps(1) infinite",
        auraFadeIn: "auraFadeIn 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
