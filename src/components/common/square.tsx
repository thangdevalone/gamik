import React from "react";
import "./styles/Square.scss";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SquareProps {
  pos: string;
  updateSquares: (pos: string) => void;
  clsName?: string;
}

const Square: React.FC<SquareProps> = ({ pos, updateSquares, clsName }) => {
  const handleClick = () => {
    updateSquares(pos);
  }

  return (
    <div className={cn("square border  border-indigo-200",clsName!==' ' ?'pointer-events-none':'hover:bg-slate-300 cursor-pointer')} onClick={handleClick}>
      {clsName && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={clsName}
        ></motion.span>
      )}
    </div>
  );
};

export default Square;
