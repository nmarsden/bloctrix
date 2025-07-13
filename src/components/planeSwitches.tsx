import { Edges, EdgesRef, useCursor } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { BLOCK_GAP, BLOCK_SIZE, GlobalState, GRID_SIZE_IN_BLOCKS, MIN_POS, useGlobalStore } from "../stores/useGlobalStore";
import { ThreeEvent } from "@react-three/fiber";

const PLANE_SWITCH_WIDTH = BLOCK_SIZE;
const PLANE_SWITCH_HEIGHT = 0.025;
const PLANE_SWITCH_OPACITY = 0.1;
const PLANE_SWITCH_FACE_COLOR = "#4287ff";
const PLANE_EDGE_COLOR = "#275097";

type SwitchInfo = {
  id: number;
  position: [number, number, number];
}
function PlaneSwitch ({ id, position }: SwitchInfo) {
  const planeSwitch = useRef<Group>(null!);
  const material = useRef<MeshStandardMaterial>(null!);
  const edges = useRef<EdgesRef>(null!);

  const activePlane = useGlobalStore((state: GlobalState) => state.activePlane);
  const setActivePlane = useGlobalStore((state: GlobalState) => state.setActivePlane);  

  const [hovered, setHovered] = useState(false);

  useCursor(hovered)

  const onPointerOver = useCallback((event: ThreeEvent<PointerEvent>) => { 
    material.current.opacity = 0.2;
    edges.current.material.opacity = 0.2;
    setHovered(true);
    event.stopPropagation();
  }, []);

  const onPointerOut = useCallback((event: ThreeEvent<PointerEvent>) => {
    const opacity = (id === activePlane) ? 0.2 : 0.1;

    material.current.opacity = opacity;
    edges.current.material.opacity = opacity;
    setHovered(false);

    event.stopPropagation();
  }, [activePlane]);

  const onPointerDown = useCallback((event: ThreeEvent<PointerEvent>) => {
    setActivePlane(id);
    event.stopPropagation();
  }, []);

  useEffect(() => {
    const opacity = (id === activePlane) ? 0.2 : 0.1;
    material.current.opacity = opacity;
    edges.current.material.opacity = opacity;

  }, [activePlane]);
  
  return (
    <mesh
      ref={planeSwitch}
      position={position}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerDown={onPointerDown}
    >
      <boxGeometry 
        args={[PLANE_SWITCH_WIDTH, PLANE_SWITCH_HEIGHT, PLANE_SWITCH_WIDTH]} 
      />
      <meshStandardMaterial
        ref={material}
        color={PLANE_SWITCH_FACE_COLOR}
        transparent={true} 
        opacity={PLANE_SWITCH_OPACITY}
      />
      <Edges
        ref={edges}
        linewidth={4}
        scale={1.001}
        threshold={15}
        transparent={true}
        opacity={PLANE_SWITCH_OPACITY}
        color={PLANE_EDGE_COLOR}
      />
    </mesh>
  )
}

export default function PlaneSwitches () {
  const planeSwitches = useRef<Mesh>(null!);

  const switches: SwitchInfo[] = useMemo(() => {
    const x = MIN_POS - (1 * (BLOCK_SIZE + BLOCK_GAP));
    const y = MIN_POS + (0 * (BLOCK_SIZE + BLOCK_GAP));
    const z = MIN_POS - (1 * (BLOCK_SIZE + BLOCK_GAP));

    return [...new Array(GRID_SIZE_IN_BLOCKS)].map((_, index)=> ({ 
      id: index, 
      position: [x, y + (index * (BLOCK_SIZE + BLOCK_GAP)), z]
    }));
  }, []);

  return (
    <group ref={planeSwitches}>
      {switches.map(planeSwitch => (
        <PlaneSwitch 
          key={`switch-${planeSwitch.id}`} 
          {...planeSwitch} 
        />
       ))}
    </group>
  )
}