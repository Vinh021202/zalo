'use client'; // Đảm bảo chính xác

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BiMoon, BiSun } from "react-icons/bi";

export const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // Chỉ chạy một lần khi component được mount
    useEffect(() => {
        setMounted(true);
    }, []);

    // Không render gì cho đến khi component được mount
    if (!mounted) return null;

    return (
        <div className="flex items-center justify-center mx-4">
            {
                theme === "light" ? (
                    <BiMoon
                        className="cursor-pointer"
                        fill="black"
                        size={25}
                        onClick={() => setTheme("dark")}
                    />
                ) : (
                    <BiSun
                        className="cursor-pointer"
                        size={25}
                        onClick={() => setTheme("light")}
                    />
                )
            }
        </div>
    );
}
