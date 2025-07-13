import { useEffect, useRef } from "react";
import { BLOCK_GAP, BLOCK_SIZE, GlobalState, MAX_POS, MIN_POS, useGlobalStore } from "../stores/useGlobalStore";
import { Line } from "@react-three/drei";
import { Group } from "three";
import { Line2 } from "three/examples/jsm/Addons.js";

const AXIS_LENGTH = BLOCK_SIZE + BLOCK_GAP;

export default function Axes (){
  const axes = useRef<Group>(null!);
  const xAxisN = useRef<Line2>(null!);
  const xAxisP = useRef<Line2>(null!);
  const yAxisN = useRef<Line2>(null!);
  const yAxisP = useRef<Line2>(null!);
  const zAxisN = useRef<Line2>(null!);
  const zAxisP = useRef<Line2>(null!);

  const hoveredIds = useGlobalStore((state: GlobalState) => state.hoveredIds);  

  useEffect(() => {
    if (hoveredIds.length === 0) {
      axes.current.visible = false;
      return;
    }
    const id = hoveredIds[0];
    const idPartX = parseInt(id.split('-')[1]);
    const idPartY = parseInt(id.split('-')[2]);
    const idPartZ = parseInt(id.split('-')[3]);

    const x = MIN_POS + (idPartX * (BLOCK_SIZE + BLOCK_GAP));
    const y = MIN_POS + (idPartY * (BLOCK_SIZE + BLOCK_GAP));
    const z = MIN_POS + (idPartZ * (BLOCK_SIZE + BLOCK_GAP));
    
    axes.current.position.set(x, y, z);
    axes.current.visible = true;

    xAxisN.current.visible = (x > MIN_POS);
    xAxisP.current.visible = (x < MAX_POS);
    yAxisN.current.visible = (y > MIN_POS);
    yAxisP.current.visible = (y < MAX_POS);
    zAxisN.current.visible = (z > MIN_POS);
    zAxisP.current.visible = (z < MAX_POS);

  }, [hoveredIds]);

  return (
    <group
      ref={axes}
    >
      {/* X Axes */}
      <Line ref={xAxisN} points={[[-AXIS_LENGTH, 0, 0], [0, 0, 0]]} color={"grey"} lineWidth={2} dashed={false} />
      <Line ref={xAxisP} points={[[0, 0, 0], [AXIS_LENGTH, 0, 0]]} color={"grey"} lineWidth={2} dashed={false} />
      {/* Y Axes */}
      <Line ref={yAxisN} points={[[0, -AXIS_LENGTH, 0], [0, 0, 0]]} color={"grey"} lineWidth={2} dashed={false} />
      <Line ref={yAxisP} points={[[0, 0, 0], [0, AXIS_LENGTH, 0]]} color={"grey"} lineWidth={2} dashed={false} />
      {/* Z Axes */}
      <Line ref={zAxisN} points={[[0, 0, -AXIS_LENGTH], [0, 0, 0]]} color={"grey"} lineWidth={2} dashed={false} />
      <Line ref={zAxisP} points={[[0, 0, 0], [0, 0, AXIS_LENGTH]]} color={"grey"} lineWidth={2} dashed={false} />
    </group>
  )
}