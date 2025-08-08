import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import Block from "./block";
import { Group } from "three";
import gsap from "gsap";

export default function Blocks (){
  const group = useRef<Group>(null!);
  const rotateTween = useRef<gsap.core.Tween>(null);

  const blocks = useGlobalStore((state: GlobalState) => state.blocks);  
  const hoveredIds = useGlobalStore((state: GlobalState) => state.hoveredIds);  
  const gameMode = useGlobalStore((state: GlobalState) => state.gameMode);

  const { gl } = useThree();

  useEffect(() => {
    // TODO animate camera up & down instead?
    // slowly move up & down
    // gsap.to(group.current.position, {
    //   y: `+=0.4`,
    //   duration: 4,
    //   ease: 'sine.inOut',
    //   repeat: -1,
    //   yoyo: true
    // });
  }, []);

  useEffect(() => {
    if (hoveredIds.length > 0) {
      gl.domElement.classList.add('cursor-click');
    } else {
      gl.domElement.classList.remove('cursor-click');
    }
  }, [ hoveredIds ]);

  useEffect(() => {
    if (gameMode === 'LEVEL_COMPLETED') {
      rotateTween.current = gsap.to(group.current.rotation, {
        x: `+=${Math.PI * 2}`,
        y: `+=${Math.PI * 2}`,
        duration: 15,
        ease: 'none',
        repeat: -1,
      });
    } else {
      if (rotateTween.current !== null) {
        rotateTween.current.kill();
        rotateTween.current = null;
      }
      // reset rotate
      gsap.to(group.current.rotation, {
        x: 0,
        y: 0,
        duration: 0.2,
        ease: 'linear',
      });
    }
  }, [gameMode]);

  return (
    <group ref={group}>
      {blocks.filter(block => block.blockType !== 'EMPTY').map(block => (
        <Block
          key={block.id}
          {...block}
        />
      ))}
    </group>
  )
}