import { useCallback, useEffect, useMemo, useRef } from "react";
import { Color, Mesh, ShaderMaterial, Uniform, Vector2, Vector3 } from "three";
import { BLOCK_GAP, BLOCK_SIZE, BlockInfo, GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import vertexShader from '../shaders/block/vertex.glsl';
import fragmentShader from '../shaders/block/fragment.glsl';
import { useControls } from "leva";
import { ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import { useTexture } from "@react-three/drei";

type PointerData = {
  pos: Vector2;
  time: number;
};

const BLOCK_SHOWN_OPACITY = 0.85;
const BLOCK_BORDER_WIDTH = 0.02;
const BLOCK_BORDER_SMOOTHNESS = 0.01;
const BLOCK_TARGET_POSITION = new Vector3(20, 20, 20);
const BLOCK_DISTANCE_THRESHOLD = (BLOCK_SIZE * 3) + (BLOCK_GAP * 2);
const BLOCK_ALPHA_FALLOFF = BLOCK_DISTANCE_THRESHOLD * 0.5;

export default function Block ({ id, position, neighbourIds }: BlockInfo ){
  const block = useRef<Mesh>(null!);
  const distanceThreshold = useRef(0);
  const texture = useTexture("textures/label_01.png");

  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const hoveredIds = useGlobalStore((state: GlobalState) => state.hoveredIds);  
  const onIds = useGlobalStore((state: GlobalState) => state.onIds);  
  const blockHovered = useGlobalStore((state: GlobalState) => state.blockHovered);
  const toggleHovered = useGlobalStore((state: GlobalState) => state.toggleHovered);

  const isOn = useRef(onIds.includes(id));

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

  const pointerDownData = useRef<PointerData>({ pos: new Vector2(), time: 0 });
  const pointerUpData = useRef<PointerData>({ pos: new Vector2(), time: 10000 });

  const onPointerDown = useCallback((event: ThreeEvent<PointerEvent>) => {
    pointerDownData.current.pos.setX(event.x);
    pointerDownData.current.pos.setY(event.y);
    pointerDownData.current.time = new Date().getTime();
    event.stopPropagation();
  }, []);
  const onPointerUp = useCallback((event: ThreeEvent<PointerEvent>) => {
    pointerUpData.current.pos.setX(event.x);
    pointerUpData.current.pos.setY(event.y);
    pointerUpData.current.time = new Date().getTime();

    const distance = pointerDownData.current.pos.distanceTo(pointerUpData.current.pos);
    const time = pointerUpData.current.time - pointerDownData.current.time;

    // Is this a click?
    if (time < 300 && distance < 5) {
      toggleHovered();
    }
    event.stopPropagation();
  }, []);
 
  const material: ShaderMaterial = useMemo(() => {
    const color = onIds.includes(id) ? colors.blockOn : colors.blockOff;

    const shaderMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      // depthWrite: false,
      uniforms: {
        uTexture: { value: texture },
        uColorA: new Uniform(new Color(color)),
        uColorB: new Uniform(new Color(colors.blockLabel)),
        uOpacity: new Uniform(BLOCK_SHOWN_OPACITY),
        uTargetPosition: new Uniform(BLOCK_TARGET_POSITION),
        uDistanceThreshold: new Uniform(0),
        uAlphaFalloff: new Uniform(BLOCK_ALPHA_FALLOFF),
        uBorderColor: new Uniform(new Color(colors.blockEdge)),
        uBorderWidth: new Uniform(BLOCK_BORDER_WIDTH),
        uBorderSmoothness: new Uniform(BLOCK_BORDER_SMOOTHNESS),
      }
    });
    return shaderMaterial;
  }, []);

  useControls(
    'Block',
    {
      distanceThreshold: { 
        value: distanceThreshold.current,    
        min: 0,
        max: 10,
        step: 0.01,
        onChange: value => {
          distanceThreshold.current = value;
          material.uniforms.uDistanceThreshold.value = value;
        }
      },
      alphaFalloff: { 
        value: BLOCK_ALPHA_FALLOFF,
        min: 0,
        max: 10,
        step: 0.01,
        onChange: value => {
          material.uniforms.uAlphaFalloff.value = value;
        }
      },
      opacity: {
        value: BLOCK_SHOWN_OPACITY,
        min: 0,
        max: 1,
        step: 0.01,
        onChange: value => {
          material.uniforms.uOpacity.value = value;
        }
      }
    },
    {
      collapsed: true
    }
  );
    
  const updateBorderColor = useCallback((borderColor: Color) => {
    gsap.to(
      material.uniforms.uBorderColor.value,
      {
        r: borderColor.r,
        g: borderColor.g,
        b: borderColor.b,
        duration: 0.2,
        ease: "linear",
      }
    );
  }, []);

  useEffect(() => {
    const newIsOn = onIds.includes(id);
    if (newIsOn !== isOn.current) {
      isOn.current = newIsOn;

      // Animate color
      const color = newIsOn ? colors.blockOn : colors.blockOff;
      gsap.to(
        material.uniforms.uColorA.value,
        {
          r: color.r,
          g: color.g,
          b: color.b,
          duration: 0.2,
          ease: "linear",
        }
      );

      // Animate scale
      gsap.to(
        block.current.scale,
        {
          keyframes: [
            { x: 0.2, y: 0.2, z: 0.2, ease: 'linear', duration: 0.1 },
            { x: 1.0, y: 1.0, z: 1.0, ease: 'bounce', duration: 0.4 }
          ]
        }
      );
    }
  }, [colors, onIds]);

  useEffect(() => {
    // When a block is hovered: show hovered border when block is hovered OR hovered neighbour
    if (hoveredIds.length !== 0 && (hoveredIds.includes(id) || neighbourIds.includes(hoveredIds[0]))) {
      updateBorderColor(colors.blockEdgeHover);
      return;
    }
    // Otherwise: show regular border
    updateBorderColor(colors.blockEdge);

  }, [hoveredIds, colors]);

  useEffect(() => {
    // Update block label color
    material.uniforms.uColorB.value = new Color(colors.blockLabel);
  }, [colors.blockLabel]);

  // useEffect(() => {
  //   // When NO block is hovered: show block
  //   if (hoveredIds.length === 0) {
  //     material.uniforms.uDistanceThreshold.value = 0;
  //     return;
  //   }
  //   // When a block is hovered: only show block which is hovered OR hovered neighbour
  //   if (hoveredIds.includes(id)) {
  //     material.uniforms.uDistanceThreshold.value = 0;
  //     return;
  //   }
  //   if (neighbourIds.includes(hoveredIds[0])) {
  //     material.uniforms.uDistanceThreshold.value = 0;
  //     return;
  //   }
  //   material.uniforms.uDistanceThreshold.value = distanceThreshold.current;
  //   material.uniforms.uTargetPosition.value = idToPosition(hoveredIds[0]);

  // }, [hoveredIds, activePlane]);
  
  return (
    <mesh
      ref={block}
      position={position}
      // castShadow={true}
      receiveShadow={true}
      scale={1}
      material={material}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <boxGeometry />
    </mesh>
  )
}

useTexture.preload("textures/pattern_01.png");
