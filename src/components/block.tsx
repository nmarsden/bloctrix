import { useCallback, useEffect, useMemo, useRef } from "react";
import { Color, Mesh, ShaderMaterial, Texture, Uniform, Vector2, Vector3 } from "three";
import { BLOCK_GAP, BLOCK_SIZE, BlockInfo, BlockType, GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import vertexShader from '../shaders/block/vertex.glsl';
import fragmentShader from '../shaders/block/fragment.glsl';
import { useControls } from "leva";
import { ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import { useTexture } from "@react-three/drei";
import { Sounds } from "../utils/sounds";

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
  const blockLabelAll = useTexture("textures/block_label_all.png");
  const blockLabelEdgesAndCorners = useTexture("textures/block_label_edges_and_corners.png");
  const blockLabelSelfAndEdges = useTexture("textures/block_label_self_and_edges.png");
  const blockLabelEdges = useTexture("textures/block_label_edges.png");
  const blockLabelSelfAndCorners = useTexture("textures/block_label_self_and_corners.png");
  const blockLabelCorners = useTexture("textures/block_label_corners.png");
  const blockLabelNone = useTexture("textures/block_label_none.png");

  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const hoveredIds = useGlobalStore((state: GlobalState) => state.hoveredIds);  
  const onIds = useGlobalStore((state: GlobalState) => state.onIds);  
  const idToToggleDelay = useGlobalStore((state: GlobalState) => state.idToToggleDelay);  
  const blockHovered = useGlobalStore((state: GlobalState) => state.blockHovered);
  const toggleHovered = useGlobalStore((state: GlobalState) => state.toggleHovered);
  const toggleMode = useGlobalStore((state: GlobalState) => state.toggleMode);
  const idToBlock = useGlobalStore((state: GlobalState) => state.idToBlock);
  const gameMode = useGlobalStore((state: GlobalState) => state.gameMode);

  const isOn = useRef(onIds.includes(id));
  const levelCompleteTimelines = useRef<gsap.core.Timeline[]>([]);
  
  const onPointerOver = useCallback((event: ThreeEvent<PointerEvent>) => { 
    if (gameMode !== 'PLAYING' && gameMode !== 'EDITING') return;

    // console.log(`pointerOver: ${id}`);
    if (toggleIds.length > 0) {
      blockHovered(id, true);
    }
    event.stopPropagation();
  }, [toggleIds]);

  const onPointerOut = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (gameMode !== 'PLAYING' && gameMode !== 'EDITING') return;
    
    // console.log(`pointerOut: ${id}`);
    if (toggleIds.length > 0) {
      blockHovered(id, false);
    }
    event.stopPropagation();
  }, [toggleIds]);

  const pointerDownData = useRef<PointerData>({ pos: new Vector2(), time: 0 });
  const pointerUpData = useRef<PointerData>({ pos: new Vector2(), time: 10000 });

  const onPointerDown = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (gameMode !== 'PLAYING' && gameMode !== 'EDITING') return;

    if (toggleIds.length > 0) {
      pointerDownData.current.pos.setX(event.x);
      pointerDownData.current.pos.setY(event.y);
      pointerDownData.current.time = new Date().getTime();
    }
    event.stopPropagation();
  }, [toggleIds]);

  const onPointerUp = useCallback((event: ThreeEvent<PointerEvent>) => {
    if (gameMode !== 'PLAYING' && gameMode !== 'EDITING') return;

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
    switch(blockType) {
      case 'ALL': return blockLabelAll;
      case 'EDGES_AND_CORNERS': return blockLabelEdgesAndCorners;
      case 'SELF_AND_EDGES': return blockLabelSelfAndEdges;
      case 'EDGES': return blockLabelEdges;
      case 'SELF_AND_CORNERS': return blockLabelSelfAndCorners;
      case 'CORNERS': return blockLabelCorners;
      case 'NONE': return blockLabelNone;
      default: return null;
    }
  }, [blockLabelAll, blockLabelEdgesAndCorners, blockLabelSelfAndEdges, blockLabelEdges, blockLabelSelfAndCorners, blockLabelCorners, blockLabelNone]);
  
  const material: ShaderMaterial = useMemo(() => {
    const color = onIds.includes(id) ? colors.blockOn : colors.blockOff;
    const texture = getTexture(blockType);

    const shaderMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: false,
      // depthWrite: false,
      uniforms: {
        uTextureMixFactor: { value: 1.0 },
        uTextureA: { value: texture },
        uTextureB: { value: texture },
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
    if (gameMode === 'LEVEL_COMPLETED') {
      const x = parseInt(id.split('-')[1]);
      const y = parseInt(id.split('-')[2]);
      const z = parseInt(id.split('-')[3]);
      const delay = (0.2 * x) + (0.2 * y) + (0.2 * z);

      // Animate scale
      const scale = 0.5;
      const timelineScale = gsap.timeline();
      timelineScale.to(
        block.current.scale,
        {
          delay: delay + 0.4,
          keyframes: [
            { x: scale, y: scale, z: scale, ease: 'linear', duration: 0.4 },
            { x: 1.0,   y: 1.0,   z: 1.0,   ease: 'linear', duration: 0.4 },
            { x: 1.0,   y: 1.0,   z: 1.0,   ease: 'linear', duration: 1.0 }
          ],
          repeat: -1
        }
      );
      levelCompleteTimelines.current.push(timelineScale);

      // Animate label
      const timelineLabel = gsap.timeline();
      timelineLabel.to(
        material.uniforms.uColorB.value, {
        r: colors.blockOff.r, 
        g: colors.blockOff.g, 
        b: colors.blockOff.b,
        duration: 0.4,
        ease: 'linear'
      });
      levelCompleteTimelines.current.push(timelineLabel);

      // Animage border
      const timelineBorder = gsap.timeline();
      timelineBorder.to(
        material.uniforms.uBorderColor.value, {
        delay,
        r: colors.blockCompleteA.r, 
        g: colors.blockCompleteA.g, 
        b: colors.blockCompleteA.b,
        duration: 0.2,
        ease: 'linear'
      });
      timelineBorder.to(
        material.uniforms.uBorderColor.value,
        {
          keyframes: [
            { r: colors.blockCompleteB.r, g: colors.blockCompleteB.g, b: colors.blockCompleteB.b, ease: 'linear', duration: 0.4 },
            { r: colors.blockCompleteB.r, g: colors.blockCompleteB.g, b: colors.blockCompleteB.b, ease: 'linear', duration: 0.4 },
            { r: colors.blockCompleteA.r, g: colors.blockCompleteA.g, b: colors.blockCompleteA.b, ease: 'linear', duration: 0.4 },
            { r: colors.blockCompleteA.r, g: colors.blockCompleteA.g, b: colors.blockCompleteA.b, ease: 'linear', duration: 0.6 }
          ],
          repeat: -1
        }
      );
      levelCompleteTimelines.current.push(timelineBorder);
    } else {
      // Kill level complete animations
      if (levelCompleteTimelines.current.length > 0) {
        const numTweens = levelCompleteTimelines.current.length;
        for (let i=0; i<numTweens; i++) {
          const tween = levelCompleteTimelines.current.pop() as gsap.core.Timeline;
          tween.kill();
        }
      }
      // Reset scale
      gsap.to(block.current.scale, {
        x: 1.0,
        y: 1.0,
        z: 1.0,
        ease: 'linear',
        duration: 0.2
      });
      // Reset label
      gsap.to(
        material.uniforms.uColorB.value,
        {
          r: colors.blockLabel.r,
          g: colors.blockLabel.g,
          b: colors.blockLabel.b,
          duration: 0.2,
          ease: "linear",
        }
      );
      // Reset border
      updateBorderColor(colors.blockEdge);
    }
  }, [gameMode]);

  useEffect(() => {
    const newIsOn = onIds.includes(id);
    if (newIsOn !== isOn.current) {
      isOn.current = newIsOn;

      const delay = idToToggleDelay.get(id);

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
          onStart: () => Sounds.getInstance().playSoundFX('BLOCK_TOGGLE'),
          delay
        }
      );

      // Animate scale
      gsap.to(
        block.current.scale,
        {
          keyframes: [
            { x: 0.2, y: 0.2, z: 0.2, ease: 'linear', duration: 0.1 },
            { x: 1.0, y: 1.0, z: 1.0, ease: 'bounce', duration: 0.4 }
          ],
          delay
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
    // Animate blockType change
    gsap.to(
      material.uniforms.uTextureMixFactor,
      {
        keyframes: [
          { value: 0,   duration: 0   },
          { value: 1.0, duration: 0.3 }
        ],
        ease: "linear",
        onStart: () => {
          material.uniforms.uTextureA.value = material.uniforms.uTextureB.value;
          material.uniforms.uTextureB.value = getTexture(blockType);
        }
      }
    );    
  }), [blockType]);

  return (
    <mesh
      ref={block}
      position={position}
      // castShadow={true}
      receiveShadow={true}
      scale={0}
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

useTexture.preload("textures/block_label_all.png");
useTexture.preload("textures/block_label_edges_and_corners.png");
useTexture.preload("textures/block_label_self_and_edges.png");
useTexture.preload("textures/block_label_edges.png");
useTexture.preload("textures/block_label_self_and_corners.png");
useTexture.preload("textures/block_label_corners.png");
useTexture.preload("textures/block_label_none.png");
