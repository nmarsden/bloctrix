import { Edges } from "@react-three/drei";
import { useCallback,useMemo, useRef } from "react";
import { Mesh } from "three";
import { BLOCK_SIZE, BlockInfo, GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import { ThreeEvent } from "@react-three/fiber";

const PLANE_WIDTH = BLOCK_SIZE;
const PLANE_HEIGHT = 0.025;
const PLANE_OPACITY = 0.2;
const PLANE_FACE_COLOR = "#4287ff";
const PLANE_EDGE_COLOR = "#275097";

function PlaneBlock ({ id, position }: BlockInfo) {
  const blockHovered = useGlobalStore((state: GlobalState) => state.blockHovered);

  const onPointerOver = useCallback((event: ThreeEvent<PointerEvent>) => { 
    // console.log(`pointerOver: ${id}`);
    blockHovered(id, true);
    event.stopPropagation();
  }, []);

  const onPointerOut = useCallback((event: ThreeEvent<PointerEvent>) => {
    // console.log(`pointerOut: ${id}`);
    blockHovered(id, false);
    event.stopPropagation();
  }, []);

  return (
    <mesh
      position={position}
      renderOrder={1001}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <boxGeometry 
        args={[PLANE_WIDTH, PLANE_HEIGHT, PLANE_WIDTH]} 
      />
      <meshStandardMaterial
        color={PLANE_FACE_COLOR}
        transparent={true} 
        opacity={PLANE_OPACITY}
      />
      <Edges
        renderOrder={1002}
        linewidth={4}
        scale={1.001}
        threshold={15}
        transparent={true}
        opacity={PLANE_OPACITY}
        color={PLANE_EDGE_COLOR}
      />
    </mesh>
  )
}

export default function PlaneTool () {
  const planeTool = useRef<Mesh>(null!);

  const blocks = useGlobalStore((state: GlobalState) => state.blocks);
  const activePlane = useGlobalStore((state: GlobalState) => state.activePlane);
  
  const planeBlocks = useMemo(() => {
    return blocks.filter(block => {
      const blockPlane = parseInt(block.id.split('-')[2]);
      return blockPlane === activePlane;
    });
  }, [blocks, activePlane]);

  return (
    <group ref={planeTool}>
      {planeBlocks.map(planeBlock => <PlaneBlock key={`plane-${planeBlock.id}`} {...planeBlock} />)}
    </group>
  )
}