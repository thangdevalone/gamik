"use client"
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {};

const NavLink = [
  {
    name: "Vòng quay may mắn",
    link: "/happy-wheel",
    link_name: "happy-wheel",

  },
  {
    name: "Cờ caro",
    link: "/caro-game",
    link_name: "caro-game",
  },
  {
    name: "Tetris",
    link: "/tetris-game",
    link_name: "tetris-game",
  },
];

const Aside = (props: Props) => {
  const pathname = usePathname()
  const path_split=pathname.split('/')
  console.log(path_split)
  return (
    <aside className="scrollbar fixed top-[88px] h-[calc(100svh_-_88px)] max-h-[calc(100svh_-_88px)] w-[250px] overflow-y-auto border-r-4 border-black md:w-[180px] sm:hidden">
      <nav>
        {NavLink.map((item) => {
          return (
            <Link
              key={item.link}
              href={item.link}
              className={cn("block border-b-4 border-r-4 border-black p-4 pl-7 text-lg font-base text-black/90  m800:p-4 m800:pl-6 m800:text-base",path_split?.at(1)===item.link_name?"bg-slate-400 hover:bg-slate-300":"bg-white hover:bg-accent")}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Aside;
