import { Edges, EdgesRef } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { Color, Mesh, MeshStandardMaterial } from "three";
import { BlockInfo, GlobalState, useGlobalStore } from "../stores/useGlobalStore";

const BLOCK_SHOWN_OPACITY = 1;
const BLOCK_HIDDEN_OPACITY = 0.1;

export default function Block ({ id, position, neighbourIds }: BlockInfo ){
  const block = useRef<Mesh>(null!);
  const material = useRef<MeshStandardMaterial>(null!);
  const edges = useRef<EdgesRef>(null!);

  const edgeColor = useRef(new Color("#444444"));

  const activePlane = useGlobalStore((state: GlobalState) => state.activePlane);
  const hoveredIds = useGlobalStore((state: GlobalState) => state.hoveredIds);  

  useEffect(() => {
    // When no block is hovered: show block
    if (hoveredIds.length === 0) {
      material.current.opacity = BLOCK_SHOWN_OPACITY;
      edges.current.material.opacity = BLOCK_SHOWN_OPACITY;
      return;
    }

    // When a block is hovered: only show block which is hovered OR hovered neighbour OR block on the active plane
    if (hoveredIds.includes(id)) {
      material.current.opacity = BLOCK_SHOWN_OPACITY;
      edges.current.material.opacity = BLOCK_SHOWN_OPACITY;
      return;
    }
    if (neighbourIds.includes(hoveredIds[0])) {
      material.current.opacity = BLOCK_SHOWN_OPACITY;
      edges.current.material.opacity = BLOCK_SHOWN_OPACITY;
      return;
    }
    const blockPlane = parseInt(id.split('-')[2]);
    material.current.opacity = (blockPlane === activePlane) ? BLOCK_SHOWN_OPACITY : BLOCK_HIDDEN_OPACITY;
    edges.current.material.opacity = (blockPlane === activePlane) ? BLOCK_SHOWN_OPACITY : BLOCK_HIDDEN_OPACITY;

  }, [hoveredIds, activePlane]);
  
  return (
    <mesh
      ref={block}
      position={position}
      // castShadow={true}
      receiveShadow={true}
      scale={0.2}
    >
      <boxGeometry />
      <meshStandardMaterial
        ref={material} 
        color={"#EEEEEE"}
        transparent={true} 
        opacity={1}
        depthWrite={false}
      />
      <Edges
        ref={edges}
        linewidth={1}
        scale={1.02}
        threshold={15}
        transparent={true}
        opacity={1}
        depthWrite={false}
        color={edgeColor.current}
      />
    </mesh>
  )
}