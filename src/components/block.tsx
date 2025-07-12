import { Edges, EdgesRef } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import { Color, MeshStandardMaterial } from "three";
import { BlockInfo, GlobalState, useGlobalStore } from "../stores/useGlobalStore";

export default function Block ({ id, position, neighbourIds }: BlockInfo ){
  const material = useRef<MeshStandardMaterial>(null!);
  const edges = useRef<EdgesRef>(null!);
  const edgeColor = useRef(new Color("#444444"));
  const edgeHoverColor = useRef(new Color("#fd9300"));

  const hoveredIds = useGlobalStore((state: GlobalState) => state.hoveredIds);  
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

  useEffect(() => {
    // console.log(`${id}: hoveredIds = `, hoveredIds);

    if (hoveredIds.length !== 0 && (hoveredIds.includes(id) || neighbourIds.includes(hoveredIds[0]))) {
      edges.current.material.color = edgeHoverColor.current;
    } else {
      edges.current.material.color = edgeColor.current;
    }
  }, [hoveredIds])
  
  return (
    <mesh
      position={position}
      castShadow={true}
      receiveShadow={true}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <boxGeometry />
      <meshStandardMaterial
        ref={material} 
        color={"#EEEEEE"}
        transparent={true} 
        opacity={1}
      />
      <Edges
        ref={edges}
        linewidth={4}
        scale={1.01}
        threshold={15} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
        transparent={true}
        opacity={1}
        color={edgeColor.current}
      />
    </mesh>
  )
}