'use client'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

function CaroGame({}: Props) {
  const router = useRouter();

  const handlePlayDou = () => {
    // Navigate to the desired route
    router.push('/caro-game/play/play-double');
  };
  const handlePlayBot = () => {
    // Navigate to the desired route
    router.push('/caro-game/play/play-bot');
  };
  return (
    <div>
      <div className="gap-4 h-full flex flex-col justify-center items-center">
        <Button onClick={handlePlayBot} className="w-[130px]">Chơi với máy</Button>
        <Button onClick={handlePlayDou} className="bg-purple-500 w-[130px]">Chơi đôi</Button>
        <Button className="w-[130px] bg-pink-500">Chơi online</Button>
        <p className="font-semibold text-sm text-gray-500">
          Để tạo giải đấu cờ vui lòng <Link href='/login' className="underline">đăng nhập</Link>!
        </p>
      </div>
    </div>
  );
}

export default CaroGame;
