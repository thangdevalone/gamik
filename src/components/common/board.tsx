"use client";
import React, { useEffect, useState } from "react";
import Square from "./square";
import { motion } from "framer-motion";
import Link from "next/link";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import "./styles/Square.scss";
import { bestMove, findWinningSequences, isWin } from "@/utils/Caro";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
type Props = {};
function BoardComponent({}: Props) {
  const size = 19;
  const [turn,setTurn]=useState('o')
  const DEF_MAP = Array.from({ length: size }, () => Array(size).fill(" "));
  const [squares, setSquares] = useState(DEF_MAP);
  const [win, setWin] = useState<null | Boolean>(null);
  const [alert, setAlert] = useState(false);
  const [moveHistory, setMoveHistory] = useState<any>([]);
  const [AiMove,setAiMove]=useState(false);
  const [winRoute,setWinRoute]=useState<any>()
  const updateSquares = (pos: string) => {
    const [idx_row, idx_col] = pos.split("-").map(Number);
    if (squares[idx_row][idx_col] !== " " || win !== null) {
      return;
    }
    const s = squares;
    s[idx_row][idx_col] = turn;
    const newHis = [...moveHistory, [idx_row, idx_col]];
    setMoveHistory(newHis);
    setSquares(s);
    setTurn(turn === "x" ? "o" : "x")
    const result_caro = isWin(squares);
    if (result_caro !== "Continue playing") {
      setWin(true);
      setAlert(true);
      setWinRoute(findWinningSequences(s))
      return;
    }
    setAiMove(true)
  };
  useEffect(()=>{
    if(AiMove){
      const [aiY, aiX] = bestMove(squares, turn);
      const s = squares;
      s[aiY][aiX] = turn;
      const newHis2 = [...moveHistory, [aiY, aiX]];
      setMoveHistory(newHis2);
      setSquares(s);
      setTurn(turn === "x" ? "o" : "x")
      const result_caro = isWin(squares);
  
      if (result_caro !== "Continue playing") {
        setWin(false);
        setAlert(true);
        setWinRoute(findWinningSequences(s))
        return;
      }
      setAiMove(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[AiMove])
  console.log(winRoute)
  return (
    <>
      <AlertDialog open={alert} onOpenChange={setAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              {win ? "Chúc mừng bạn đã chiến thắng" : "Bạn đã thua cuộc"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base  text-left">
              - Bấm đóng để đòng cửa sổ. <br />
              - Bấm chơi tiếp để tạo bàn cờ mới.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng</AlertDialogCancel>
            <AlertDialogAction>Chơi tiếp</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="game-caro p-3 border-2 border-black shadow-base rounded-base w-fit bg-white "
      >
        <div className="mb-2">
          <p className="text-2xl font-semibold text-center ">
            Cờ caro (19 x 19)
          </p>
          <p className="text-gray-500 items-center justify-center flex gap-1">
            Tạo bởi:{" "}
            <Link
              href="https://github.com/thangdevalone"
              className="flex flex-row items-center gap-1 hover:underline"
            >
              <GitHubLogoIcon /> thangdevalone
            </Link>
          </p>
        </div>
        <div className="grid border border-indigo-200 grid-cols-19">
          {DEF_MAP.map((row, idx_row) =>
            row.map((_, idx_col) => (
              <Square
                key={idx_row + "-" + idx_col}
                pos={idx_row + "-" + idx_col}
                updateSquares={updateSquares}
                clsName={squares[idx_row][idx_col]}
              />
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}

export default BoardComponent;
