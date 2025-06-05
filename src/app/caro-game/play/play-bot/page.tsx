'use client'
import BoardComponent from "@/components/common/board";
import CaroInfo from "@/components/common/caro.info";
import React from "react";

type Props = {};

function PlayDoubles({}: Props) {
  return (
    <div className="h-full pt-[50px] px-3 flex overflow-y-auto d e flex-row justify-evenly  w-full gap-2">
      <div>
       <CaroInfo name="Nguyễn Quang Thắng" title="Người chơi 1" o={true}/>
      </div>
      <div>
        <BoardComponent />
      </div>
      <div>
      <CaroInfo name="Máy" title="Người chơi 2"  o={false}/>
      </div>
    </div>
  );
}

export default PlayDoubles;
