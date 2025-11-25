import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rise: "#f43f5e", // 上涨红色
        fall: "#10b981", // 下跌绿色
      },
    },
  },
  plugins: [],
};
export default config;
