import { useCursor } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Color, DoubleSide, Group, Mesh, ShaderMaterial, Uniform, Vector3 } from "three";
import { BLOCK_GAP, BLOCK_SIZE, GlobalState, GRID_SIZE_IN_BLOCKS, GRID_WIDTH, MAX_POS, MIN_POS, useGlobalStore } from "../stores/useGlobalStore";
import { ThreeEvent } from "@react-three/fiber";
import vertexShader from '../shaders/planeSwitch/vertex.glsl';
import fragmentShader from '../shaders/planeSwitch/fragment.glsl';

const PLANE_SWITCH_WIDTH = BLOCK_SIZE;
const PLANE_SWITCH_ACTIVE_COLOR = new Color("#e6edf7");
const PLANE_SWITCH_INACTIVE_COLOR = new Color("#f3f6fb");
const PLANE_SWITCH_BORDER_COLOR = new Color("#DDD");

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
    const fadeOuterWidth = (GRID_WIDTH - BLOCK_SIZE) * Math.sqrt(2) * 0.5;
    const fadeInnerWidth = fadeOuterWidth - (BLOCK_SIZE * 0.5);

    const shaderMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      uniforms: {
        uColor: new Uniform(PLANE_SWITCH_INACTIVE_COLOR),
        uOpacity: new Uniform(0.5),
        uTargetPosition: new Uniform(new Vector3(0, 0, 0)),
        uFadeInnerWidth: new Uniform(fadeInnerWidth),
        uFadeOuterWidth: new Uniform(fadeOuterWidth),
        uBorderColor: new Uniform(PLANE_SWITCH_BORDER_COLOR),
        uBorderWidth: new Uniform(0.02)
      }
    });
    return shaderMaterial;
  }, []);

  const onPointerOver = useCallback((event: ThreeEvent<PointerEvent>) => { 
    material.uniforms.uColor.value = PLANE_SWITCH_ACTIVE_COLOR;
    setHovered(true);
    event.stopPropagation();
  }, []);

  const onPointerOut = useCallback((event: ThreeEvent<PointerEvent>) => {
    const color = (plane === activePlane) ? PLANE_SWITCH_ACTIVE_COLOR : PLANE_SWITCH_INACTIVE_COLOR;
    material.uniforms.uColor.value = color;
    setHovered(false);

    event.stopPropagation();
  }, [activePlane]);

  const onPointerDown = useCallback((event: ThreeEvent<PointerEvent>) => {
    setActivePlane(plane);
    event.stopPropagation();
  }, []);

  useEffect(() => {
    const color = (plane === activePlane) ? PLANE_SWITCH_ACTIVE_COLOR : PLANE_SWITCH_INACTIVE_COLOR;
    material.uniforms.uColor.value = color;
  }, [activePlane]);
  
  return (
    <mesh
      ref={planeSwitch}
      position={position}
      rotation-x={Math.PI * -0.5}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerDown={onPointerDown}
      material={material}
    >
      <planeGeometry 
        args={[PLANE_SWITCH_WIDTH, PLANE_SWITCH_WIDTH]} 
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