import { useCallback, useEffect, useMemo, useRef } from "react";
import { Color, Mesh, ShaderMaterial, Uniform, Vector3 } from "three";
import { BLOCK_GAP, BLOCK_SIZE, BlockInfo, GlobalState, MIN_POS, useGlobalStore } from "../stores/useGlobalStore";
import vertexShader from '../shaders/block/vertex.glsl';
import fragmentShader from '../shaders/block/fragment.glsl';
import { useControls } from "leva";

const BLOCK_SHOWN_OPACITY = 0.8;
const BLOCK_BORDER_WIDTH = 0.02;
const BLOCK_TARGET_POSITION = new Vector3(20, 20, 20);
const BLOCK_DISTANCE_THRESHOLD = (BLOCK_SIZE * 3) + (BLOCK_GAP * 2);
const BLOCK_ALPHA_FALLOFF = BLOCK_DISTANCE_THRESHOLD * 0.5;

export default function Block ({ id, position, neighbourIds }: BlockInfo ){
  const block = useRef<Mesh>(null!);
  const distanceThreshold = useRef(BLOCK_DISTANCE_THRESHOLD);

  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const activePlane = useGlobalStore((state: GlobalState) => state.activePlane);
  const hoveredIds = useGlobalStore((state: GlobalState) => state.hoveredIds);  

  const idToPosition = useCallback((id: string): Vector3 => {
    const idPartX = parseInt(id.split('-')[1]);
    const idPartY = parseInt(id.split('-')[2]);
    const idPartZ = parseInt(id.split('-')[3]);

    const x = MIN_POS + (idPartX * (BLOCK_SIZE + BLOCK_GAP));
    const y = MIN_POS + (idPartY * (BLOCK_SIZE + BLOCK_GAP));
    const z = MIN_POS + (idPartZ * (BLOCK_SIZE + BLOCK_GAP));

    return new Vector3(x, y, z);
  }, []);
  
  const material: ShaderMaterial = useMemo(() => {
    const shaderMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      // depthWrite: false,
      uniforms: {
        uColor: new Uniform(new Color(colors.block)),
        uOpacity: new Uniform(BLOCK_SHOWN_OPACITY),
        uTargetPosition: new Uniform(BLOCK_TARGET_POSITION),
        uDistanceThreshold: new Uniform(BLOCK_DISTANCE_THRESHOLD),
        uAlphaFalloff: new Uniform(BLOCK_ALPHA_FALLOFF),
        uBorderColor: new Uniform(new Color(colors.blockEdge)),
        uBorderWidth: new Uniform(BLOCK_BORDER_WIDTH)
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
    },
    {
      collapsed: true
    }
  );
    
  useEffect(() => {
    material.uniforms.uColor.value.set(colors.block);
    material.uniforms.uBorderColor.value.set(colors.blockEdge);
  }, [colors]);

  useEffect(() => {
    // When NO block is hovered: show block
    if (hoveredIds.length === 0) {
      material.uniforms.uDistanceThreshold.value = 0;
      return;
    }
    // When a block is hovered: only show block which is hovered OR hovered neighbour
    if (hoveredIds.includes(id)) {
      material.uniforms.uDistanceThreshold.value = 0;
      return;
    }
    if (neighbourIds.includes(hoveredIds[0])) {
      material.uniforms.uDistanceThreshold.value = 0;
      return;
    }
    material.uniforms.uDistanceThreshold.value = distanceThreshold.current;
    material.uniforms.uTargetPosition.value = idToPosition(hoveredIds[0]);

  }, [hoveredIds, activePlane]);
  
  return (
    <mesh
      ref={block}
      position={position}
      // castShadow={true}
      receiveShadow={true}
      scale={1}
      material={material}
    >
      <boxGeometry />
    </mesh>
  )
}