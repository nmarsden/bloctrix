import {CameraControls, PerspectiveCamera} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {useControls} from "leva";
import {ReactNode, useEffect, useRef} from "react";
import {Group, PerspectiveCamera as PerspectiveCameraType, Vector3} from "three";
import {GlobalState, useGlobalStore} from "../stores/useGlobalStore";

export default function Camera({ children } : { children?: ReactNode }) {
  const cameraGroup = useRef<Group>(null!);
  const cameraControls = useRef<CameraControls>(null!);

  const controlsEnabled = useRef(true);
  const fov = useRef(40);
  const cameraPositionPlaying = useRef<Vector3>(new Vector3(8, 8, 8));
  const cameraPositionNotPlaying = useRef<Vector3>(new Vector3(6, 6, 6));
  const cameraTarget = useRef<Vector3>(new Vector3(0, 0, 0));

  const gameMode = useGlobalStore((state: GlobalState) => state.gameMode);
  const blocks = useGlobalStore((state: GlobalState) => state.blocks);

  const { gl } = useThree();

  useEffect(() => {
    gl.domElement.classList.add('cursor-grab');

    setTimeout(() => {
      cameraControls.current.setTarget(cameraTarget.current.x, cameraTarget.current.y, cameraTarget.current.z, true);
    }, 300);
  }, []);

  useEffect(() => {
    if (gameMode === 'PLAYING' || gameMode === 'EDITING') {
      cameraControls.current.normalizeRotations();
      cameraControls.current.setPosition(cameraPositionPlaying.current.x, cameraPositionPlaying.current.y, cameraPositionPlaying.current.z, true);
    } else {
      cameraControls.current.normalizeRotations();
      cameraControls.current.setPosition(cameraPositionNotPlaying.current.x, cameraPositionNotPlaying.current.y, cameraPositionNotPlaying.current.z, true);
    }
    if (gameMode === 'LEVEL_COMPLETED') {
      cameraControls.current.enabled = false;
      gl.domElement.classList.remove('cursor-grab');
      gl.domElement.classList.add('cursor-pointer');
    } else {
      cameraControls.current.enabled = true;
      gl.domElement.classList.remove('cursor-pointer');
      gl.domElement.classList.add('cursor-grab');
    }
  }, [gameMode, blocks]);
  
  useEffect(() => {
    const controls = cameraControls.current
    if (!controls) return

    const handleDragStart = () => {
      if (gameMode === 'LEVEL_COMPLETED') return;

      gl.domElement.classList.add('cursor-grabbing');
    }

    const handleDragEnd = () => {
      if (gameMode === 'LEVEL_COMPLETED') return;

      gl.domElement.classList.remove('cursor-grabbing');
    }

    controls.addEventListener('controlstart', handleDragStart)
    controls.addEventListener('controlend', handleDragEnd)

    // Cleanup listeners on unmount
    return () => {
      controls.removeEventListener('controlstart', handleDragStart)
      controls.removeEventListener('controlend', handleDragEnd)
    }
  }, [gl]);

  useControls(
    'Camera',
    {
      controlsEnabled: {
        value: controlsEnabled.current,
        label: 'controlsEnabled',
        onChange: (value) => cameraControls.current.enabled = value
      },
      fov: { 
        value: fov.current, 
        label: 'fov', 
        min: 0, 
        max: 100, 
        step: 0.1,
        onChange: (value) => {
          (cameraControls.current.camera as PerspectiveCameraType).fov = value;
          (cameraControls.current.camera as PerspectiveCameraType).updateProjectionMatrix();
        }
      },
      positionY: { 
        value: cameraPositionPlaying.current.y, 
        label: 'positionY', 
        min: 0, 
        max: 50, 
        step: 0.01, 
        onChange: (value) => {
          cameraPositionPlaying.current.y = value;
          cameraControls.current.setPosition(cameraPositionPlaying.current.x, cameraPositionPlaying.current.y, cameraPositionPlaying.current.z);
        }
      },
      positionZ: { 
        value: cameraPositionPlaying.current.z, 
        label: 'positionZ', 
        min: -20, 
        max: 10, 
        step: 0.01,
        onChange: (value) => {
          cameraPositionPlaying.current.z = value;
          cameraControls.current.setPosition(cameraPositionPlaying.current.x, cameraPositionPlaying.current.y, cameraPositionPlaying.current.z);
        }
      },
      targetZ: { 
        value: cameraTarget.current.z, 
        label: 'targetZ', 
        min: -10, 
        max: 0, 
        step: 0.01,
        onChange: (value) => {
          cameraTarget.current.z = value;
          cameraControls.current.setTarget(cameraTarget.current.x, cameraTarget.current.y, cameraTarget.current.z);
        }
      }
    },
    {
      collapsed: true
    }
  );

  return (
    <>
      <group ref={cameraGroup}>
        <PerspectiveCamera
          makeDefault={true}
          fov={fov.current}
          near={0.1}
          far={150}
          position={[cameraPositionNotPlaying.current.x, cameraPositionNotPlaying.current.y, cameraPositionNotPlaying.current.z]}
          rotation-x={Math.PI * -0.25}
        >
          { children }
        </PerspectiveCamera>
        <CameraControls 
          ref={cameraControls}
          enabled={true}
          
          truckSpeed={0}
          // minPolarAngle={0}
          // maxPolarAngle={Math.PI}
          minDistance={10.0}
          maxDistance={20.0}
          draggingSmoothTime={0.2}
        />
      </group>
    </>
  );
}
