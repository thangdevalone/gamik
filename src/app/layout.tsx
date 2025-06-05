import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/common/header";
import Aside from "@/components/common/aside";
import { inter } from "./fonts";
import React from "react";


export const metadata: Metadata = {
  title: "App",
  description: "Bộ trò chơi & công cụ của ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen overflow-y-auto overflow-x-hidden bg-background overflow-hidden font-sans antialiased",
          inter.variable,
        )}
      >
        <Header />
        <Aside />
        <div className="ml-[250px] bg-[radial-gradient(#cacbce_1px,transparent_1px)] [background-size:16px_16px]  min-h-[100dvh] sm:px-0 w-[calc(100vw_-_250px)] bg-bg  md:ml-[180px] md:w-[calc(100vw_-_180px)] sm:m-0 sm:w-full sm:pt-16">{children}</div>
      </body>
    </html>
  );
}
