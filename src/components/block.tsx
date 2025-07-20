import { useCallback, useEffect, useMemo, useRef } from "react";
import { Color, Mesh, ShaderMaterial, Texture, Uniform, Vector2, Vector3 } from "three";
import { BLOCK_GAP, BLOCK_SIZE, BlockInfo, BlockType, GlobalState, useGlobalStore } from "../stores/useGlobalStore";
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

export default function Block ({ id, position, blockType, toggleIds }: BlockInfo ){
  const block = useRef<Mesh>(null!);
  const distanceThreshold = useRef(0);
  const blockLabel1 = useTexture("textures/block_label_01.png");
  const blockLabel2 = useTexture("textures/block_label_02.png");

  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const hoveredIds = useGlobalStore((state: GlobalState) => state.hoveredIds);  
  const onIds = useGlobalStore((state: GlobalState) => state.onIds);  
  const blockHovered = useGlobalStore((state: GlobalState) => state.blockHovered);
  const toggleHovered = useGlobalStore((state: GlobalState) => state.toggleHovered);
  const toggleMode = useGlobalStore((state: GlobalState) => state.toggleMode);
  const idToBlock = useGlobalStore((state: GlobalState) => state.idToBlock);

  const isOn = useRef(onIds.includes(id));

  const onPointerOver = useCallback((event: ThreeEvent<PointerEvent>) => { 
    // console.log(`pointerOver: ${id}`);
    if (toggleIds.length > 0) {
      blockHovered(id, true);
    }
    event.stopPropagation();
  }, [toggleIds]);

  const onPointerOut = useCallback((event: ThreeEvent<PointerEvent>) => {
    // console.log(`pointerOut: ${id}`);
    if (toggleIds.length > 0) {
      blockHovered(id, false);
    }
    event.stopPropagation();
  }, [toggleIds]);

  const pointerDownData = useRef<PointerData>({ pos: new Vector2(), time: 0 });
  const pointerUpData = useRef<PointerData>({ pos: new Vector2(), time: 10000 });

  const onPointerDown = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (toggleIds.length > 0) {
      pointerDownData.current.pos.setX(event.x);
      pointerDownData.current.pos.setY(event.y);
      pointerDownData.current.time = new Date().getTime();
    }
    event.stopPropagation();
  }, [toggleIds]);
  const onPointerUp = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (toggleIds.length > 0) {
      pointerUpData.current.pos.setX(event.x);
      pointerUpData.current.pos.setY(event.y);
      pointerUpData.current.time = new Date().getTime();

      const distance = pointerDownData.current.pos.distanceTo(pointerUpData.current.pos);
      const time = pointerUpData.current.time - pointerDownData.current.time;

      // Is this a click?
      if (time < 300 && distance < 5) {
        toggleHovered();
      }
    }
    event.stopPropagation();
  }, [toggleIds]);
 
  const getTexture = useCallback((blockType: BlockType): Texture | null => {
    if (blockType === 'ALL') return blockLabel1;
    if (blockType === 'NEIGHBOURS') return blockLabel2;
    return null;
  }, [blockLabel1, blockLabel2]);
  
  const material: ShaderMaterial = useMemo(() => {
    const color = onIds.includes(id) ? colors.blockOn : colors.blockOff;
    const texture = getTexture(blockType);

    const shaderMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: false,
      // depthWrite: false,
      uniforms: {
        uUseTexture: { value: texture ? 1.0 : 0.0 },
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
    // Handle hoveredIds change
    if (toggleMode === 'TOGGLE_ON') {
      // 'TOGGLE_ON' Toggle Mode: Show hovered border when hovered block contains this block's ID in toggleIds
      if (hoveredIds.length !== 0 && idToBlock.get(hoveredIds[0])?.toggleIds.includes(id)) {
        updateBorderColor(colors.blockEdgeHover);
        return;
      }
    }
    if (toggleMode === 'TOGGLE_BLOCK_TYPE') {
      // 'TOGGLE_BLOCK_TYPE' Toggle Mode: Show hovered border when hovered block ID matches this block's ID
      if (hoveredIds.length !== 0 && (id === hoveredIds[0])) {
        updateBorderColor(colors.blockEdgeHover);
        return;
      }
    }

    // Otherwise: show regular border
    updateBorderColor(colors.blockEdge);

  }, [hoveredIds, colors, toggleIds, toggleMode]);

  useEffect(() => {
    // Update block label color
    material.uniforms.uColorB.value = new Color(colors.blockLabel);
  }, [colors.blockLabel]);

  useEffect((() => {
    const texture = getTexture(blockType);
    material.uniforms.uUseTexture.value = texture ? 1.0 : 0.0;    
    material.uniforms.uTexture.value = texture;
  }), [blockType]);

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

useTexture.preload("textures/block_label_01.png");
useTexture.preload("textures/block_label_02.png");
