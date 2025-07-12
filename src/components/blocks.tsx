import Block from "./block";

const GRID_SIZE_IN_BLOCKS = 5;
const BLOCK_SIZE = 1;
const BLOCK_GAP = 0.1;
const GRID_WIDTH = ((GRID_SIZE_IN_BLOCKS * BLOCK_SIZE) + ((GRID_SIZE_IN_BLOCKS - 1) * BLOCK_GAP));
const MAX_POS = (GRID_WIDTH - BLOCK_SIZE) * 0.5;
const MIN_POS = -MAX_POS;

let blockPositions: [number, number, number][] = [];
for (let x = MIN_POS; x <=MAX_POS; x = x + BLOCK_SIZE + BLOCK_GAP) {
  for (let y = MIN_POS; y <=MAX_POS; y = y + BLOCK_SIZE + BLOCK_GAP) {
    for (let z = MIN_POS; z <=MAX_POS; z = z + BLOCK_SIZE + BLOCK_GAP) {
      const xPos = x;
      const yPos = y;
      const zPos = z;
      blockPositions.push([xPos, yPos, zPos]);
    }
  }
}

export default function Blocks (){
  return (
    <>
      {blockPositions.map((position, index) => (
        <Block
          key={`block-${index}`}
          position={position}
        />
      ))}
      {/* <mesh>
        <boxGeometry />
        <meshBasicMaterial color="red" wireframe={false} />
      </mesh> */}
    </>
  )
}