import { Edges } from "@react-three/drei";

export default function Block ({ position }: { position: [number, number, number]}){
  return (
    <mesh
      position={position}
      castShadow={true}
      receiveShadow={true}
    >
      <boxGeometry />
      <meshStandardMaterial 
        color="#EEEEEE" 
        transparent={true} 
        opacity={1}
      />
      <Edges
        linewidth={4}
        scale={1.01}
        threshold={15} // Display edges only when the angle between two faces exceeds this value (default=15 degrees)
        transparent={true}
        opacity={1}
        color="#444444"
      />
    </mesh>
  )
}