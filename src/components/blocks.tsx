import { useEffect, useState } from "react";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import Block from "./block";
import { useCursor } from "@react-three/drei";

export default function Blocks (){
  const blocks = useGlobalStore((state: GlobalState) => state.blocks);  
  const hoveredIds = useGlobalStore((state: GlobalState) => state.hoveredIds);  
  const [hovered, setHovered] = useState(false);

  useCursor(hovered)

  useEffect(() => setHovered(hoveredIds.length > 0), [ hoveredIds ]);

  return (
    <>
      {blocks.filter(block => block.blockType !== 'EMPTY').map(block => (
        <Block
          key={block.id}
          {...block}
        />
      ))}
    </>
  )
}