'use client'; // Đảm bảo chính xác

import {Poppins } from "next/font/google";
import {Josefin_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./Utils/theme-provider";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Providers";
import { SessionProvider } from "next-auth/react";
import Loader from "./components/Loader/Loader";
import { useLoadUserQuery } from "@/redux/features/api/apiSilce";
import socketIO from "socket.io-client";
import { useEffect } from "react";

const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "http://localhost:8080";
const socketId = socketIO(ENDPOINT, {
    transports: ["websocket"]  // Sử dụng WebSocket transport
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400","500","600","700"],
  variable: "--font-Poppins",
})

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400","500","600","700"],
  variable: "--font-Josefin",
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${josefin.variable} !bg-white bg-no-repeat  dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300 ` }>
          <Providers>
            <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Custom>{children}</Custom>
            {/* {children} */}
            <Toaster position='top-center' reverseOrder={false} />
          </ThemeProvider>
          </SessionProvider>
          </Providers>
      </body>
    </html>
  );
}

const Custom: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {isLoading} = useLoadUserQuery({});

  useEffect(() => {
    socketId.on("notification", () => {
        console.log("Socket connected");
    });

    // Dọn dẹp khi component unmount
    return () => {
        socketId.off("notification");
        socketId.disconnect();
        console.log("Socket disconnected");
    };
}, []);

  return(
    <>
    {
      isLoading ? <Loader /> : <>{children}</>
    }
    </>
  )
}