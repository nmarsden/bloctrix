import {Suspense, useEffect} from 'react';
import {Canvas} from "@react-three/fiber";
import {Loader} from "@react-three/drei";
import Debug from "./debug.tsx";
import Performance from "./performance.tsx";
import Lights from "./lights.tsx";
import Camera from "./camera.tsx";
import Ui from './ui/ui.tsx';
import Blocks from './blocks.tsx';
import Editor from './editor/editor.tsx';
import { GlobalState, useGlobalStore } from '../stores/useGlobalStore.ts';

export default function App() {
  const openCustomLevel = useGlobalStore((state: GlobalState) => state.openCustomLevel);

  useEffect(() => {
    if (window.location.hash.startsWith('#cl=')) {
      openCustomLevel(window.location.hash);
    }
  }, []);

  return (
    <>
      <Debug />
      <Canvas
        gl={{ logarithmicDepthBuffer: false }}
        shadows={true}
      >
        <Suspense>
          <Performance />
          <Lights />
          <Camera />
          <Blocks />
        </Suspense>
      </Canvas>
      <Ui />
      <Editor />
      <Loader containerStyles={{ background: '#1f3d6a' }}/>
    </>
  );
}

