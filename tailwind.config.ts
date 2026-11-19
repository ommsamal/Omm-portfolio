import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101216",
        panel: "#171A20",
        raised: "#1E222A",
        line: "rgba(255,255,255,0.09)",
        text: "#E8EAED",
        muted: "#9AA3AF",
        accent: "#3DE0FF",
      },
      fontFamily: {
        sans: ['"Sora Variable"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      maxWidth: { page: "1120px" },
    },
  },
  plugins: [],
};
export default config;
