import { Wireframe } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { Group, SphereGeometry } from "three";
import gsap from "gsap";

export default function Background() {
  const group = useRef<Group>(null!);

  const geometry = useMemo(() => new SphereGeometry(25, 64, 32), []);

  useEffect(() => {
    gsap.to(group.current.rotation, {
      y: `+=${Math.PI * 2}`,
      duration: 240,
      ease: 'none',
      repeat: -1,
    });
  }, []);
  
  return (
    <group ref={group}>
      <Wireframe
        geometry={geometry} // Will create the wireframe based on input geometry.
        transparent={true}

        // Other props
        simplify={true} // Remove some edges from wireframes
        fill={"#1f3d6a"} // Color of the inside of the wireframe
        fillOpacity={0} // Opacity of the inner fill
        stroke={"#457b9d"} // Color of the stroke
        strokeOpacity={1} // Opacity of the stroke
        thickness={0.075} // Thinkness of the lines
      />
    </group>
  );
}
