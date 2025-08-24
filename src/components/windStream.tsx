import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BufferAttribute, BufferGeometry, Color, CubicBezierCurve3, DoubleSide, Mesh, ShaderMaterial, Uniform, Vector3 } from "three";
import vertexShader from '../shaders/windStream/vertex.glsl';
import fragmentShader from '../shaders/windStream/fragment.glsl';
import { useFrame } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import type { TransformControls as TransformControlsImpl } from 'three/addons';
import { useControls } from "leva";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import gsap from "gsap";

const NUM_CURVES = 20;
const NUM_CURVE_POINTS = 30;

type CurveData = {
  rotationX: number;
  rotationY: number;
};

const CURVE_DATA: CurveData[] = [];

for (let i=0; i<NUM_CURVES; i++) {
  const rotationY = (Math.PI * 2) * ((i + 1) / NUM_CURVES);
  CURVE_DATA.push({ rotationX: 0,       rotationY });
  CURVE_DATA.push({ rotationX: Math.PI, rotationY });
}

const startPoint = new Vector3(0.8, -12.3, 0.1);
const controlPoint1 = new Vector3(-0.6, 0.2, 0);
const controlPoint2 = new Vector3(2.6, -1.1, 0);
const endPoint = new Vector3(5.3, -4.0, 0);

function Curve({ rotationX, rotationY, geometry, debug } : { rotationX: number, rotationY: number, geometry: BufferGeometry, debug: boolean }) {
  const alphaFactorTimeline = useRef<gsap.core.Timeline | undefined>(null);

  const gameMode = useGlobalStore((state: GlobalState) => state.gameMode);

  const material = useMemo(() => {
    return new ShaderMaterial({
        uniforms: {
          uColor: new Uniform(new Color("white")),
          uAlphaFactor: new Uniform(0),
          uProgressOffset: new Uniform(Math.random()),
          uTime: new Uniform(0),
          uDebug: new Uniform(debug ? 1 : 0)
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: DoubleSide,
        transparent: true,
        depthTest: true,
    });
  }, []);

  useEffect(() => {
    material.uniforms.uDebug.value = debug ? 1 : 0;
  }, [debug]);

  useEffect(() => {
    if (gameMode !== 'LEVEL_COMPLETED') {    
      if (alphaFactorTimeline.current) return;

      const duration = 3; 
      const maxAlphaFactor = (Math.random() > 0.9) ? 0.2 : 0.05;

      alphaFactorTimeline.current = gsap.timeline().to(
        material.uniforms.uAlphaFactor,
        {
          keyframes: [
            { value: 0.0,            ease: 'linear' },
            { value: maxAlphaFactor, ease: 'linear', duration },
          ],
          delay: Math.random() * 5,
          repeat: -1,
          yoyo: true
        }
      );
    } else {
      // Remove animation
      if (alphaFactorTimeline.current) {
        alphaFactorTimeline.current.kill();
        alphaFactorTimeline.current = undefined;
        material.uniforms.uAlphaFactor.value = 0;
      }
    }
  }, [gameMode]);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime() * 0.25;
  });

  return (
    <group
      rotation-x={rotationX}
      rotation-y={rotationY}
    >
      <mesh 
        material={material}
        geometry={geometry}
      />
    </group>
  )
}

export default function WindStream () {
  const transformControls = useRef<TransformControlsImpl>(null!);
  const startPointRef = useRef<Mesh>(null!);
  const controlPoint1Ref = useRef<Mesh>(null!);
  const controlPoint2Ref = useRef<Mesh>(null!);
  const endPointRef = useRef<Mesh>(null!);

  const gameMode = useGlobalStore((state: GlobalState) => state.gameMode);

  const [ debug, setDebug ] = useState(false);

  useControls(
    'Wind Stream',
    {
      debug: {
        value: debug,
        label: 'debug',
        onChange: (value) => {
          setDebug(value);
          startPointRef.current.visible = value;
          endPointRef.current.visible = value;
          controlPoint1Ref.current.visible = value;
          controlPoint2Ref.current.visible = value;
          if (value) {
            console.log('----- bezier curve points -----')
            console.log('start=', startPointRef.current.position);
            console.log('control1=', controlPoint1Ref.current.position);
            console.log('control2=', controlPoint2Ref.current.position);
            console.log('end=', endPointRef.current.position);
          }
        }
      }
    },
    {
      collapsed: true
    }
  );
  
  const updateCurveGeometry = useCallback((geometry: BufferGeometry, points: Vector3[]) => {
    let ribbonWidth = 0.05 + (Math.random() * 0.2);

    points.forEach((b, i) => {
      geometry.attributes.position.setXYZ(i * 2 + 0, b.x, b.y, b.z + ribbonWidth);
      geometry.attributes.position.setXYZ(i * 2 + 1, b.x, b.y, b.z - ribbonWidth);

      geometry.attributes.uv.setXY(i * 2 + 0, i / (points.length - 1), 0);
      geometry.attributes.uv.setXY(i * 2 + 1, i / (points.length - 1), 1);

      const geometryIndex = geometry.getIndex() as BufferAttribute;

      if (i < points.length - 1) {
          geometryIndex.setX(i * 6 + 0, i * 2);
          geometryIndex.setX(i * 6 + 1, i * 2 + 1);
          geometryIndex.setX(i * 6 + 2, i * 2 + 2);

          geometryIndex.setX(i * 6 + 0 + 3, i * 2 + 1);
          geometryIndex.setX(i * 6 + 1 + 3, i * 2 + 2);
          geometryIndex.setX(i * 6 + 2 + 3, i * 2 + 3);
      }
    });
    geometry.attributes.position.needsUpdate = true;

  }, []);

  const curveGeometry = useMemo(() => {

    // Populate points using a bezier curve
    const curve = new CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);
    const points = curve.getPoints(NUM_CURVE_POINTS);

    // -- Populate points in a spiral (original)
    // const numPoints = 120;
    // let points = [];
    // let r = 8;
    // let a = 0;
    // for (let i = 0; i < numPoints; i++) {
    //     let p = (1 - i / numPoints);
    //     r -= Math.pow(p, 2) * 0.187;
    //     a += 0.3 - (r / 6) * 0.2;

    //     points.push(new Vector3(
    //         r * Math.sin(a),
    //         Math.pow(p, 2.5) * 2,
    //         r * Math.cos(a)
    //     ));
    // }

    // Create the flat geometry
    const geometry = new BufferGeometry();

    // create two times as many vertices as points, as we're going to push them in opposing directions to create a ribbon
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(points.length * 3 * 2), 3));
    geometry.setAttribute('uv', new BufferAttribute(new Float32Array(points.length * 2 * 2), 2));
    geometry.setIndex(new BufferAttribute(new Uint16Array(points.length * 6), 1));

    updateCurveGeometry(geometry, points);
    return geometry;
  }, []);

  return (
    <group
      visible={gameMode !== 'LEVEL_COMPLETED'}
    >
      {/* Curves */}
      {CURVE_DATA.map((curveData, index) => {
        return (
          <Curve key={`curve-${index}`} rotationX={curveData.rotationX} rotationY={curveData.rotationY} geometry={curveGeometry} debug={debug} />
        )
      })}

      {/* Transform Controls */}
      {debug ? (
        <TransformControls 
          // @ts-ignore
          ref={transformControls}
          mode="translate" 
          attach={endPointRef.current}
          onObjectChange={() => {
            // Re-calc points
            const curve = new CubicBezierCurve3(
              startPointRef.current.position, 
              controlPoint1Ref.current.position, 
              controlPoint2Ref.current.position, 
              endPointRef.current.position
            );
            const points = curve.getPoints(NUM_CURVE_POINTS);

            updateCurveGeometry(curveGeometry, points);
          }}
        />
      ) : null}

      {/* Start Point */}
      <mesh
        ref={startPointRef}
        position={startPoint}
        scale={0.2}
        onClick={() => {
          if (!debug) return;
          transformControls.current.attach(startPointRef.current)
        }}
      >
        <meshBasicMaterial />
        <sphereGeometry />
      </mesh>

      {/* Control Point 1 */}
      <mesh
        ref={controlPoint1Ref}
        position={controlPoint1}
        scale={0.2}
        onClick={() => {
          if (!debug) return;
          transformControls.current.attach(controlPoint1Ref.current)
        }}
      >
        <meshBasicMaterial />
        <sphereGeometry />
      </mesh>

      {/* Control Point 2 */}
      <mesh
        ref={controlPoint2Ref}
        position={controlPoint2}
        scale={0.2}
        onClick={() => {
          if (!debug) return;
          transformControls.current.attach(controlPoint2Ref.current)
        }}
      >
        <meshBasicMaterial />
        <sphereGeometry />
      </mesh>

      {/* End Point */}
      <mesh
        ref={endPointRef}
        position={endPoint}
        scale={0.2}
        onClick={() => {
          if (!debug) return;
          transformControls.current.attach(endPointRef.current)
        }}
      >
        <meshBasicMaterial />
        <sphereGeometry />
      </mesh>
    </group>
  )
}
