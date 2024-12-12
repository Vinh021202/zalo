import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"], // Cách sử dụng chế độ tối
  theme: {
    extend: {
      fontFamily: {
        Poppins: ["var(--font-Poppins)"], // Đã sửa lỗi chính tả
        Josefin: ["var(--font-Josefin)"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))', // Đã sửa lỗi chính tả
      },
      screens: {
        sm: "640px", // Thêm các breakpoint chuẩn cho responsive
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        // Có thể thêm các kích thước tùy chỉnh nếu cần thiết
      },
    },
  },
  plugins: [],
};

export default config;
