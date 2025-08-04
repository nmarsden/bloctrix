import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import Block from "./block";

export default function Blocks (){
  const blocks = useGlobalStore((state: GlobalState) => state.blocks);  
  const hoveredIds = useGlobalStore((state: GlobalState) => state.hoveredIds);  
  const { gl } = useThree();

  useEffect(() => {
    if (hoveredIds.length > 0) {
      gl.domElement.classList.add('cursor-click');
    } else {
      gl.domElement.classList.remove('cursor-click');
    }
  }, [ hoveredIds ]);

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