import { useCallback, useEffect, useMemo, useRef } from "react";
import { BufferAttribute, BufferGeometry, Color, CubicBezierCurve3, DoubleSide, Mesh, ShaderMaterial, Uniform, Vector3 } from "three";
import vertexShader from '../shaders/windStream/vertex.glsl';
import fragmentShader from '../shaders/windStream/fragment.glsl';
import { useFrame } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import type { TransformControls as TransformControlsImpl } from 'three/addons';
import { useControls } from "leva";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";
import gsap from "gsap";

const NUM_CURVE_POINTS = 30;

const startPoint = new Vector3(0.8, -12.3, 0.1);
const controlPoint1 = new Vector3(-0.6, 0.2, 0);
const controlPoint2 = new Vector3(2.6, -1.1, 0);
const endPoint = new Vector3(5.3, -4.0, 0);

export default function WindStream ({ rotationY }: { rotationY: number; }) {
  const editorEnabled = useRef(false);
  const transformControls = useRef<TransformControlsImpl>(null!);
  const startPointRef = useRef<Mesh>(null!);
  const controlPoint1Ref = useRef<Mesh>(null!);
  const controlPoint2Ref = useRef<Mesh>(null!);
  const endPointRef = useRef<Mesh>(null!);
  const alphaFactorTimelines = useRef<gsap.core.Timeline[]>([]);

  const gameMode = useGlobalStore((state: GlobalState) => state.gameMode);
  
  useControls(
    'Wind Stream',
    {
      editorEnabled: {
        value: editorEnabled.current,
        label: 'editorEnabled',
        onChange: (value) => {
          curve1Material.uniforms.uDebug.value = value ? 1 : 0;
          curve2Material.uniforms.uDebug.value = value ? 1 : 0;
          curve3Material.uniforms.uDebug.value = value ? 1 : 0;
          curve4Material.uniforms.uDebug.value = value ? 1 : 0;
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

  useEffect(() => {
    if (gameMode !== 'LEVEL_COMPLETED') {    
      if (alphaFactorTimelines.current.length > 0) return;

      const duration = 5; 

      alphaFactorTimelines.current.push(
        gsap.timeline().to(
          curve1Material.uniforms.uAlphaFactor,
          {
            keyframes: [
              { value: 0.0, ease: 'linear' },
              { value: 0.1, ease: 'linear', duration },
            ],
            delay: Math.random() * 5,
            repeat: -1,
            yoyo: true
          }
        )
      );
      alphaFactorTimelines.current.push(
        gsap.timeline().to(
          curve2Material.uniforms.uAlphaFactor,
          {
            keyframes: [
              { value: 0.0, ease: 'linear' },
              { value: 0.2, ease: 'linear', duration },
            ],
            delay: Math.random() * 5,
            repeat: -1,
            yoyo: true
          }
        )
      );
      alphaFactorTimelines.current.push(
        gsap.timeline().to(
          curve3Material.uniforms.uAlphaFactor,
          {
            keyframes: [
              { value: 0.0, ease: 'linear' },
              { value: 0.3, ease: 'linear', duration },
            ],
            delay: Math.random() * 5,
            repeat: -1,
            yoyo: true
          }
        )
      );
      alphaFactorTimelines.current.push(
        gsap.timeline().to(
          curve4Material.uniforms.uAlphaFactor,
          {
            keyframes: [
              { value: 0.0, ease: 'linear' },
              { value: 0.4, ease: 'linear', duration },
            ],
            delay: Math.random() * 5,
            repeat: -1,
            yoyo: true
          }
        )
      );
    } else {
      // Remove animations
      if (alphaFactorTimelines.current.length > 0) {
        const numTweens = alphaFactorTimelines.current.length;
        for (let i=0; i<numTweens; i++) {
          const tween = alphaFactorTimelines.current.pop() as gsap.core.Timeline;
          tween.kill();
        }
        curve1Material.uniforms.uAlphaFactor.value = 0;
        curve2Material.uniforms.uAlphaFactor.value = 0;
        curve3Material.uniforms.uAlphaFactor.value = 0;
        curve4Material.uniforms.uAlphaFactor.value = 0;
      }
    }
  }, [gameMode]);
  
  const updateCurveGeometry = useCallback((geometry: BufferGeometry, points: Vector3[]) => {
    points.forEach((b, i) => {
        let ribbonWidth = 0.1;

        geometry.attributes.position.setXYZ(i * 2 + 0, b.x, b.y + ribbonWidth, b.z);
        geometry.attributes.position.setXYZ(i * 2 + 1, b.x, b.y - ribbonWidth, b.z);

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

  const { 
    curve1Material, 
    curve2Material, 
    curve3Material, 
    curve4Material 
  } = useMemo(() => {
    const material1 = new ShaderMaterial({
        uniforms: {
          uColor: new Uniform(new Color("white")),
          uAlphaFactor: new Uniform(0),
          uProgressOffset: new Uniform(Math.random()),
          uTime: new Uniform(0),
          uDebug: new Uniform(editorEnabled.current ? 1 : 0)
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: DoubleSide,
        transparent: true,
        depthTest: true,
    });
    const material2 = material1.clone();
    material2.uniforms.uProgressOffset.value = Math.random();

    const material3 = material1.clone();
    material3.uniforms.uProgressOffset.value = Math.random();

    const material4 = material1.clone();
    material4.uniforms.uProgressOffset.value = Math.random();

    return {
      curve1Material: material1,
      curve2Material: material2,
      curve3Material: material3,
      curve4Material: material4,
    }
  }, []);
  
  useFrame(({ clock }) => {
    curve1Material.uniforms.uTime.value = clock.getElapsedTime() * 0.25;
    curve2Material.uniforms.uTime.value = clock.getElapsedTime() * 0.25;
    curve3Material.uniforms.uTime.value = clock.getElapsedTime() * 0.25;
    curve4Material.uniforms.uTime.value = clock.getElapsedTime() * 0.25;
  });
  
  return (
    <group
      rotation-y={rotationY}
      visible={gameMode !== 'LEVEL_COMPLETED'}
    >
      {/* ---- Curve 1 (Editable) ---- */}
      <group
        scale={1}
      >
        {/* Curve */}
        <mesh 
          material={curve1Material}
          geometry={curveGeometry}
        />

        {/* Transform Controls */}
        {editorEnabled.current ? (
          <TransformControls 
            // @ts-ignore
            ref={transformControls}
            mode="translate" 
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
            if (!editorEnabled.current) return;
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
            if (!editorEnabled.current) return;
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
            if (!editorEnabled.current) return;
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
            if (!editorEnabled.current) return;
            transformControls.current.attach(endPointRef.current)
          }}
        >
          <meshBasicMaterial />
          <sphereGeometry />
        </mesh>
      </group>

      {/* ---- Curve 2 (Rotated 90) ---- */}
      <group
        scale={1}
        rotation-y={Math.PI * 0.5}
      >
        <mesh 
          material={curve2Material}
          geometry={curveGeometry}
        />
      </group>

      {/* ---- Curve 3 (Rotated 180) ---- */}
      <group
        scale={1}
        rotation-y={Math.PI}
      >
        <mesh 
          material={curve3Material}
          geometry={curveGeometry}
        />
      </group>

      {/* ---- Curve 4 (Rotated 270) ---- */}
      <group
        scale={1}
        rotation-y={Math.PI * 1.5}
      >
        <mesh 
          material={curve4Material}
          geometry={curveGeometry}
        />
      </group>
    </group>
  )
}
