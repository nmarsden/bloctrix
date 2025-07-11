import {folder, useControls} from "leva";
import {useRef} from "react";
import {AmbientLight, DirectionalLight} from "three";

export default function Lights() {
  const ambientLight = useRef<AmbientLight>(null!);
  const directionalLight = useRef<DirectionalLight>(null!);

  const {
    ambientColor, ambientIntensity,
    directionalColor, directionalIntensity, directionalPosition,
  } = useControls(
    'Lights',
    {
      'Ambient': folder(
        {
          ambientColor: {value: 'white', label: 'color'},
          ambientIntensity: {value: 1.0, min: 0, max: 10, step: 0.1, label: 'intensity'}
        }
      ),
      'Directional': folder(
        {
          directionalColor: {value: 'white', label: 'color'},
          directionalIntensity: {value: 1.0, min: 0, max: 10, step: 0.01, label: 'intensity'},
          directionalPosition: {value: [6.5, 3.25, -6.5], label: 'position'},
        }
      )
    },
    {
      collapsed: true
    }
  );

  return <>
    <ambientLight
      ref={ambientLight}
      color={ambientColor}
      intensity={ambientIntensity}
    />
    <directionalLight
      ref={directionalLight}
      color={directionalColor}
      intensity={directionalIntensity}
      position={directionalPosition}

      shadow-mapSize-width={512}
      shadow-mapSize-height={512}

      shadow-camera-top={3}
      shadow-camera-bottom={-4}
      shadow-camera-left={-6}
      shadow-camera-right={12}

      shadow-camera-near={0.1}
      shadow-camera-far={15}      

      castShadow={true}
    />
  </>
}
