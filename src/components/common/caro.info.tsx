
import React from "react";
import { motion } from "framer-motion";

type Props = {
  name: string;
  title: string;
  o: boolean;
};

function CaroInfo({ name, title, o }: Props) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ rotate: 360, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
      }}
      className=" p-3 border-2 lg:w-[250px] 2xl:w-[250px] w-[300px] min-w-[200px] border-black shadow-base rounded-base bg-white "
    >
      <p className="text-center font-semibold mb-2  text-2xl">{title}</p>
      <div className="flex flex-row gap-2">
        <strong>Họ tên: </strong>
        {name}
        <div className="square !pointer-events-none border border-black rounded-md">
          <span className={o ? "o" : "x"}></span>
        </div>
      </div>
    </motion.div>
  );
}

export default CaroInfo;
