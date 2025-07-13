import { Edges, EdgesRef } from "@react-three/drei";
import { useRef } from "react";
import { Color, Mesh, MeshStandardMaterial } from "three";
import { BlockInfo } from "../stores/useGlobalStore";

export default function Block ({ position }: BlockInfo ){
  const block = useRef<Mesh>(null!);
  const material = useRef<MeshStandardMaterial>(null!);
  const edges = useRef<EdgesRef>(null!);

  const edgeColor = useRef(new Color("#444444"));
  
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
      />
      <Edges
        ref={edges}
        linewidth={1}
        scale={1.02}
        threshold={15}
        transparent={true}
        opacity={1}
        color={edgeColor.current}
      />
    </mesh>
  )
}