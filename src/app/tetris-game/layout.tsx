import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Tetris",
  description: "Bộ trò chơi & công cụ của ThangDevALone Gamik",
};

export default function CaroLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex mt-[88px] h-[calc(100vh-88px)] md:h-[calc(100vh-4rem)] items-center justify-center">
      {children}
    </div>
  );
}
