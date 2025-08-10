import { useCallback, useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import Block from "./block";
import { Group } from "three";
import gsap from "gsap";
import { Sounds } from "../utils/sounds";

export default function Blocks (){
  const group = useRef<Group>(null!);
  const rotateTween = useRef<gsap.core.Tween>(null);

  const blocks = useGlobalStore((state: GlobalState) => state.blocks);  
  const hoveredIds = useGlobalStore((state: GlobalState) => state.hoveredIds);  
  const gameMode = useGlobalStore((state: GlobalState) => state.gameMode);
  const gridSize = useGlobalStore((state: GlobalState) => state.gridSize);

  const { gl } = useThree();

  const killRotateTween = useCallback(() => {
      if (rotateTween.current !== null) {
        rotateTween.current.kill();
        rotateTween.current = null;
      }
  }, [rotateTween]);

  useEffect(() => {
    // slowly move up & down
    gsap.to(group.current.position, {
      keyframes: [
        { y: `+=0.4`, duration: 4 },
        { y: `-=0.4`, duration: 4 },
      ],      
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  }, []);

  useEffect(() => {
    if (hoveredIds.length > 0) {
      gl.domElement.classList.add('cursor-click');
    } else {
      gl.domElement.classList.remove('cursor-click');
    }
  }, [ hoveredIds ]);

  useEffect(() => {
    if (gameMode === 'MAIN_MENU' || gameMode == 'LEVEL_MENU') {
      // reset rotate
      killRotateTween();
      gsap.to(group.current.rotation, {
        x: 0,
        y: 0,
        duration: 1.0,
        ease: 'sine.inOut',
      });
      // rotate y
      rotateTween.current = gsap.to(group.current.rotation, {
        y: `+=${Math.PI * 2}`,
        duration: 30,
        ease: 'none',
        repeat: -1,
      });
    } else if (gameMode === 'PLAYING' || gameMode === 'EDITING') {
      // reset rotate
      killRotateTween();
      gsap.to(group.current.rotation, {
        x: 0,
        y: 0,
        duration: 1.0,
        ease: 'sine.inOut',
      });
    } else if (gameMode === 'LEVEL_COMPLETED') {

      setTimeout(() => {
        Sounds.getInstance().playSoundFX('LEVEL_COMPLETED');

        // rotate x & y
        killRotateTween();
        rotateTween.current = gsap.to(group.current.rotation, {
          x: `+=${Math.PI * 2}`,
          y: `+=${Math.PI * 2}`,
          duration: 15,
          ease: 'none',
          repeat: -1
        });

      }, 400);
    }
  }, [gameMode]);

  useEffect(() => {
    Sounds.getInstance().playSoundFX('BLOCK_TOGGLE');
  }, [gridSize]);

  return (
    <group ref={group}>
      {blocks.filter(block => block.blockType !== 'EMPTY').map(block => (
        <Block
          key={`${block.id}-${gridSize}`}
          {...block}
        />
      ))}
    </group>
  )
}