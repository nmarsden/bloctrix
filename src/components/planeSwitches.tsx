import { useCursor } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Color, DoubleSide, Group, ShaderMaterial, Uniform, Vector2, Vector3 } from "three";
import { BLOCK_GAP, BLOCK_SIZE, GlobalState, GRID_SIZE_IN_BLOCKS, GRID_WIDTH, MAX_POS, MIN_POS, useGlobalStore } from "../stores/useGlobalStore";
import { Camera, ThreeEvent, useFrame } from "@react-three/fiber";
import vertexShader from '../shaders/planeSwitch/vertex.glsl';
import fragmentShader from '../shaders/planeSwitch/fragment.glsl';

const PLANE_SWITCH_WIDTH = BLOCK_SIZE;
const PLANE_SWITCH_ACTIVE_COLOR = new Color("#e6edf7");
const PLANE_SWITCH_INACTIVE_COLOR = new Color("#f3f6fb");
const PLANE_SWITCH_OPACITY = 0.5;
const PLANE_SWITCH_BORDER_COLOR = new Color("#DDD");
const PLANE_SWITCH_BORDER_WIDTH = 0.02;
const PLANE_SWITCH_TARGET_POSITION = new Vector3(0, 0, 0);
const PLANE_SWITCH_FADE_OUTER_WIDTH = (GRID_WIDTH - BLOCK_SIZE) * Math.sqrt(2) * 0.5;
const PLANE_SWITCH_FADE_INNER_WIDTH = PLANE_SWITCH_FADE_OUTER_WIDTH - (BLOCK_SIZE * 0.5);

type SwitchGroupInfo = {
  id: string;
  position: [number, number, number];
  switches: SwitchInfo[];
};

type SwitchInfo = {
  id: string;
  plane: number;
  position: [number, number, number];
};

function PlaneSwitchGroup ({ position, switches }: SwitchGroupInfo) {
  const planeSwitchGroup = useRef<Group>(null!);

  const checkVisibility = useCallback((camera: Camera) => {
    const worldPosition = new Vector3();
    planeSwitchGroup.current.getWorldPosition(worldPosition);

    // Replicate the shader's XZ plane logic in JavaScript
    const P_xz = new Vector2(worldPosition.x, worldPosition.z);
    const A_xz = new Vector2(camera.position.x, camera.position.z);
    const B_xz = new Vector2(PLANE_SWITCH_TARGET_POSITION.x, PLANE_SWITCH_TARGET_POSITION.z);

    const AB_xz = B_xz.clone().sub(A_xz);
    const lineLengthSq = AB_xz.dot(AB_xz);

    let perpendicularDistance;
    if (lineLengthSq < 0.0001) {
        perpendicularDistance = P_xz.distanceTo(A_xz);
    } else {
        const AP_xz = P_xz.clone().sub(A_xz);
        // Cross product for 2D vectors: AP_x * AB_y - AP_y * AB_x
        perpendicularDistance = Math.abs(AP_xz.x * AB_xz.y - AP_xz.y * AB_xz.x) / Math.sqrt(lineLengthSq);
    }

    const fadeInner = PLANE_SWITCH_FADE_INNER_WIDTH;
    const fadeOuter = PLANE_SWITCH_FADE_OUTER_WIDTH;
    const opacityUniform = PLANE_SWITCH_OPACITY;

    // Replicate smoothstep
    let alphaShader = 0.0;
    if (perpendicularDistance <= fadeInner) {
        alphaShader = 0.0;
    } else if (perpendicularDistance >= fadeOuter) {
        alphaShader = opacityUniform;
    } else {
        alphaShader = opacityUniform * ((perpendicularDistance - fadeInner) / (fadeOuter - fadeInner));
    }

    // Define a threshold for "effectively invisible"
    const visibilityThreshold = 0.0001; // Alpha below this is considered invisible

    return alphaShader > visibilityThreshold;
  }, []);

  useFrame(({ camera }) => {
    planeSwitchGroup.current.visible = checkVisibility(camera);
  });
  
  return (
    <group
      ref={planeSwitchGroup}
      position={position}
    >
      {switches.map(planeSwitch => (
        <PlaneSwitch 
          key={planeSwitch.id} 
          {...planeSwitch} 
        />
      ))}
    </group>
  );
}

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
      side: DoubleSide,
      uniforms: {
        uColor: new Uniform(PLANE_SWITCH_INACTIVE_COLOR),
        uOpacity: new Uniform(PLANE_SWITCH_OPACITY),
        uTargetPosition: new Uniform(PLANE_SWITCH_TARGET_POSITION),
        uFadeInnerWidth: new Uniform(PLANE_SWITCH_FADE_INNER_WIDTH),
        uFadeOuterWidth: new Uniform(PLANE_SWITCH_FADE_OUTER_WIDTH),
        uBorderColor: new Uniform(PLANE_SWITCH_BORDER_COLOR),
        uBorderWidth: new Uniform(PLANE_SWITCH_BORDER_WIDTH)
      }
    });
    return shaderMaterial;
  }, []);

  const onPointerOver = useCallback((event: ThreeEvent<PointerEvent>) => { 
    if (!(planeSwitch.current.parent as Group).visible) return;

    material.uniforms.uColor.value = PLANE_SWITCH_ACTIVE_COLOR;
    setHovered(true);
    event.stopPropagation();
  }, []);

  const onPointerOut = useCallback((event: ThreeEvent<PointerEvent>) => {
    setHovered(false);

    if (!(planeSwitch.current.parent as Group).visible) return;

    const color = (plane === activePlane) ? PLANE_SWITCH_ACTIVE_COLOR : PLANE_SWITCH_INACTIVE_COLOR;
    material.uniforms.uColor.value = color;

    event.stopPropagation();
  }, [activePlane]);

  const onPointerDown = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (!(planeSwitch.current.parent as Group).visible) return;

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
  const switchGroups: SwitchGroupInfo[] = useMemo(() => {
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

    const switchGroups: SwitchGroupInfo[] = [];
    for (let index=0; index<startPositions.length; index++) {
      const switches: SwitchInfo[] = [];
      const x = startPositions[index][0];
      const y = startPositions[index][1];
      const z = startPositions[index][2];

      for (let plane=0; plane<GRID_SIZE_IN_BLOCKS; plane++) {
        switches.push({
          id: `switch-${index}-${plane}`,
          plane,
          position: [0, y + (plane * (BLOCK_SIZE + BLOCK_GAP)), 0]
        })
      }
      switchGroups.push({
        id: `switchGroup-${index}`,
        position: [x, 0, z],
        switches
      });
    }
    return switchGroups;
  }, []);

  return (
    <>
      {switchGroups.map(switchGroup => (
        <PlaneSwitchGroup
          key={switchGroup.id} 
          {...switchGroup}
        />
      ))}
    </>
  )
}