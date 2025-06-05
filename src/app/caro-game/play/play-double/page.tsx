import BoardComponent from "@/components/common/board";
import React from "react";

type Props = {};

function PlayDoubles({}: Props) {
  return (
    <div className="h-full pt-5">
      <BoardComponent />
    </div>
  );
}

export default PlayDoubles;
