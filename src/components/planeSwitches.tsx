import { useCursor } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Color, Group, Mesh, ShaderMaterial, Uniform, Vector3 } from "three";
import { BLOCK_GAP, BLOCK_SIZE, GlobalState, GRID_SIZE_IN_BLOCKS, MAX_POS, MIN_POS, useGlobalStore } from "../stores/useGlobalStore";
import { ThreeEvent } from "@react-three/fiber";
import vertexShader from '../shaders/reveal/vertex.glsl';
import fragmentShader from '../shaders/reveal/fragment.glsl';

const PLANE_SWITCH_WIDTH = BLOCK_SIZE;
const PLANE_SWITCH_HEIGHT = 0.025;
const PLANE_SWITCH_OPACITY = 0.1;
const PLANE_SWITCH_FACE_COLOR = "#5d5f63";

type SwitchInfo = {
  id: string;
  plane: number;
  position: [number, number, number];
};

function PlaneSwitch ({ plane, position }: SwitchInfo) {
  const planeSwitch = useRef<Group>(null!);

  const activePlane = useGlobalStore((state: GlobalState) => state.activePlane);
  const setActivePlane = useGlobalStore((state: GlobalState) => state.setActivePlane);  

  const [hovered, setHovered] = useState(false);

  useCursor(hovered)

  const material: ShaderMaterial = useMemo(() => {
    const shaderMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: new Uniform(new Color(PLANE_SWITCH_FACE_COLOR)),
        uOpacity: new Uniform(PLANE_SWITCH_OPACITY),
        uTargetPosition: new Uniform(new Vector3(0, 0, 0)),
        uDistanceThreshold: new Uniform(GRID_SIZE_IN_BLOCKS * 0.8),
        uAlphaFalloff: new Uniform(3)
      }
    });
    return shaderMaterial;
  }, []);

  const onPointerOver = useCallback((event: ThreeEvent<PointerEvent>) => { 
    material.uniforms.uOpacity.value = 0.2;
    setHovered(true);
    event.stopPropagation();
  }, []);

  const onPointerOut = useCallback((event: ThreeEvent<PointerEvent>) => {
    const opacity = (plane === activePlane) ? 0.2 : 0.1;
    material.uniforms.uOpacity.value = opacity;
    setHovered(false);

    event.stopPropagation();
  }, [activePlane]);

  const onPointerDown = useCallback((event: ThreeEvent<PointerEvent>) => {
    setActivePlane(plane);
    event.stopPropagation();
  }, []);

  useEffect(() => {
    const opacity = (plane === activePlane) ? 0.2 : 0.1;
    material.uniforms.uOpacity.value = opacity;
  }, [activePlane]);
  
  return (
    <mesh
      ref={planeSwitch}
      position={position}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerDown={onPointerDown}
      material={material}
    >
      <boxGeometry 
        args={[PLANE_SWITCH_WIDTH, PLANE_SWITCH_HEIGHT, PLANE_SWITCH_WIDTH]} 
      />
    </mesh>
  )
}

export default function PlaneSwitches () {
  const planeSwitches = useRef<Mesh>(null!);

  const switches: SwitchInfo[] = useMemo(() => {
    const startPositions: [number, number, number][] = [];
    startPositions.push([
      MIN_POS - (1 * (BLOCK_SIZE + BLOCK_GAP)),
      MIN_POS + (0 * (BLOCK_SIZE + BLOCK_GAP)),
      MIN_POS - (1 * (BLOCK_SIZE + BLOCK_GAP))
    ]);
    startPositions.push([
      MAX_POS + (1 * (BLOCK_SIZE + BLOCK_GAP)),
      MIN_POS + (0 * (BLOCK_SIZE + BLOCK_GAP)),
      MIN_POS - (1 * (BLOCK_SIZE + BLOCK_GAP))
    ]);
    startPositions.push([
      MAX_POS + (1 * (BLOCK_SIZE + BLOCK_GAP)),
      MIN_POS + (0 * (BLOCK_SIZE + BLOCK_GAP)),
      MAX_POS + (1 * (BLOCK_SIZE + BLOCK_GAP))
    ]);
    startPositions.push([
      MIN_POS - (1 * (BLOCK_SIZE + BLOCK_GAP)),
      MIN_POS + (0 * (BLOCK_SIZE + BLOCK_GAP)),
      MAX_POS + (1 * (BLOCK_SIZE + BLOCK_GAP))
    ]);

    const switches: SwitchInfo[] = [];
    for (let index=0; index<startPositions.length; index++) {
      for (let plane=0; plane<GRID_SIZE_IN_BLOCKS; plane++) {
        const pos = startPositions[index];
        switches.push({
          id: `switch-${index}-${plane}`,
          plane,
          position: [pos[0], pos[1] + (plane * (BLOCK_SIZE + BLOCK_GAP)), pos[2]]
        })
      }
    }
    return switches;
  }, []);

  return (
    <group ref={planeSwitches}>
      {switches.map(planeSwitch => (
        <PlaneSwitch 
          key={planeSwitch.id} 
          {...planeSwitch} 
        />
       ))}
    </group>
  )
}