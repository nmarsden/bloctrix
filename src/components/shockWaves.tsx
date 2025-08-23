import { useCallback, useEffect, useMemo, useRef } from "react";
import { Mesh, MeshBasicMaterial } from "three";
import gsap from "gsap";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";

const NUM_SHOCK_WAVES = 3;

const NO_ANIMATION = gsap.to({}, { duration: 3 });

type Animations = {
  position: gsap.core.Tween;
  opacity: gsap.core.Tween;
  scale: gsap.core.Tween;
};

export default function ShockWaves () {
  const meshRefs = useRef<(Mesh | null)[]>(new Array(NUM_SHOCK_WAVES).fill(null));
  const animationsMap = useRef<Map<string, Animations>>(new Map());

  const toggledBlock = useGlobalStore((state: GlobalState) => state.toggledBlock);

  const materials: MeshBasicMaterial[] = useMemo(() => {
    return new Array(NUM_SHOCK_WAVES).fill(null).map(() => new MeshBasicMaterial({ 
      color: '#f1faee',
      transparent: true,
      depthWrite: false,
      opacity: 0
    }));
  }, []);

  const animate = useCallback((
    name: string, 
    mesh: Mesh, 
    material: MeshBasicMaterial, 
    position: [number, number, number], 
    delay: number, 
    scale: number,
    duration: number
  ) => {
    let animations = animationsMap.current.get(name);
    if (animations) {
      animations.position.kill();
      animations.opacity.kill();
      animations.scale.kill();
    } else {
      animations = { position: NO_ANIMATION, opacity: NO_ANIMATION, scale: NO_ANIMATION };
      animationsMap.current.set(name, animations);
    }

    const plus = '+=0.3';
    const minus = '-=0.3';
    const opacity = 0.06;
    const ease: gsap.EaseString = 'none';

    mesh.position.set(position[0], position[1], position[2]);
    animations.position = gsap.to(mesh.position, {
      x: position[0] > 0 ? plus : position[0] < 0 ? minus : '+=0',
      y: position[1] > 0 ? plus : position[1] < 0 ? minus : '+=0',
      z: position[2] > 0 ? plus : position[2] < 0 ? minus : '+=0',
      duration,
      delay,
      ease
    });

    material.opacity = opacity;
    animations.opacity = gsap.to(material, {
      opacity: 0,
      duration,
      delay,
      ease
    });

    mesh.scale.set(0, 0, 0);
    animations.scale = gsap.to(mesh.scale, {
      x: scale,
      y: scale,
      z: scale,
      duration,
      delay,
      ease
    });
  }, []);
  
  useEffect(() => {
    if (toggledBlock === null || meshRefs.current[0] === null) return;

    for (let i=0; i<materials.length; i++) {
      const mesh = meshRefs.current[i] as Mesh;
      const material = materials[i] as MeshBasicMaterial;
      const delay = 0 + (0.1 * i);
      const duration = 0.4 - (0.1 * i);
      const scale = 5 - (1 * i);

      animate(`shockWave${i}`, mesh, material, toggledBlock.position, delay, scale, duration);  
    }

  }, [toggledBlock]);
    
  return (
    <>
      {materials.map(((material, index) => {
        return (
          <mesh
            key={`shockWave-${index}`}
            ref={mesh => meshRefs.current[index] = mesh} 
            material={material as MeshBasicMaterial}
          >
            <boxGeometry/>
          </mesh>
        );
      }))}
    </>
  )
}
