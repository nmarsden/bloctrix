import {Suspense} from 'react';
import {Canvas} from "@react-three/fiber";
import {Loader} from "@react-three/drei";
import Debug from "./debug.tsx";
import Performance from "./performance.tsx";
import Lights from "./lights.tsx";
import Camera from "./camera.tsx";
import Ui from './ui/ui.tsx';
import Blocks from './blocks.tsx';
import Editor from './editor/editor.tsx';

export default function App() {
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
      <Loader containerStyles={{ background: '#0A0A0A' }}/>
    </>
  );
}

