import { Color } from 'three';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --------------
// --- LEVELS ---
// --------------
export type LevelBlock = 
    'O'  // toggle all - off
  | 'X'  // toggle all - on
  | 'o'  // toggle neighbours - off
  | 'x'  // toggle neighbours - on
  | ' '  // toggle none - off
  | '.'  // toggle none - on

type LevelBlockLayer = [LevelBlock, LevelBlock, LevelBlock, LevelBlock, LevelBlock, LevelBlock, LevelBlock, LevelBlock, LevelBlock];
type Level = [LevelBlockLayer, LevelBlockLayer, LevelBlockLayer];

const LEVEL: Level = [
  [
   'O','O','O',
   'O','O','O',
   'O','O','O',
  ],
  [
   'O','O','X',
   'O','O','O',
   'X','O','X',
  ],
  [
   'O','O','O',
   'O','O','O',
   'O','O','O',
  ],
];

// const LEVEL: Level = [
//   // top layer
//   [
//     'O', 'x', 'O',  // back   - left, center, right
//     'O', 'O', 'O',  // middle
//     'o', 'X', 'O',  // front
//   ],
//   // middle layer
//   [
//     'O', 'o', 'O',
//     'O', 'O', 'O',
//     'O', 'X', 'O',
//   ],
//   // bottom layer
//   [
//     'O', 'o', 'O',
//     'O', 'O', 'O',
//     'O', 'X', 'O',
//   ],
// ];

// --------------
// --- BLOCKS ---
// --------------
export type BlockInfo = {
  id: string;
  position: [number, number, number];
  neighbourIds: string[];
  toggleSelf: boolean;
  on: boolean;
};

export const GRID_SIZE_IN_BLOCKS = 3;
export const BLOCK_SIZE = 1;
export const BLOCK_GAP = 0.1;
export const GRID_WIDTH = ((GRID_SIZE_IN_BLOCKS * BLOCK_SIZE) + ((GRID_SIZE_IN_BLOCKS - 1) * BLOCK_GAP));
export const MAX_POS = (GRID_WIDTH - BLOCK_SIZE) * 0.5;
export const MIN_POS = -MAX_POS;

const calcBlockNeighbourIds = (x: number, y: number, z: number): string[] => {
  const neighbourIds: string[] = [];

  // neighbor above & below
  if (y + 1 < GRID_SIZE_IN_BLOCKS) neighbourIds.push(`block-${x}-${y + 1}-${z}`);
  if (y - 1 >= 0) neighbourIds.push(`block-${x}-${y - 1}-${z}`);

  // neighbor right & left
  if (x + 1 < GRID_SIZE_IN_BLOCKS) neighbourIds.push(`block-${x + 1}-${y}-${z}`);
  if (x - 1 >= 0) neighbourIds.push(`block-${x - 1}-${y}-${z}`);

  // neighbor forward & back
  if (z + 1 < GRID_SIZE_IN_BLOCKS) neighbourIds.push(`block-${x}-${y}-${z + 1}`);
  if (z - 1 >= 0) neighbourIds.push(`block-${x}-${y}-${z - 1}`);

  return neighbourIds;
};

const levelToBlocks = (level: Level): BlockInfo[] => {
  const blocks: BlockInfo[] = [];

  for (let layerIndex=0; layerIndex<level.length; layerIndex++) {
    const layer: LevelBlockLayer = level[layerIndex];
    for (let blockIndex=0; blockIndex< layer.length; blockIndex++) {
      const block = layer[blockIndex];
      const x = blockIndex % GRID_SIZE_IN_BLOCKS;
      const y = GRID_SIZE_IN_BLOCKS - (layerIndex+1);
      const z = Math.floor(blockIndex / 3);

      const xPos = MIN_POS + (x * (BLOCK_SIZE + BLOCK_GAP));
      const yPos = MIN_POS + (y * (BLOCK_SIZE + BLOCK_GAP));
      const zPos = MIN_POS + (z * (BLOCK_SIZE + BLOCK_GAP));
      blocks.push({ 
        id: `block-${x}-${y}-${z}`, 
        position: [xPos, yPos, zPos], 
        neighbourIds: calcBlockNeighbourIds(x, y, z),
        toggleSelf: (block === 'O' || block === 'X'),
        on: (block === 'X' || block === 'x' || block === '.')
      });

      // console.log(`[layer:${layerIndex}][block:${blockIndex}]=`, layer[blockIndex], `[x:${x}][y:${y}][z:${z}]`);
    }
  }
  return blocks;
}

const BLOCKS: BlockInfo[] = levelToBlocks(LEVEL);

const populateIdToBlock = (blocks: BlockInfo[]): Map<string, BlockInfo> => {
  let idToBlock: Map<string, BlockInfo> = new Map<string, BlockInfo>();
  for (let i=0; i<blocks.length; i++) {
    const block = blocks[i];
    idToBlock.set(block.id, block);
  }
  return idToBlock;
};

// -------------------
// --- GlobalState ---
// -------------------

type Colors = {
  blockOn: Color;
  blockOff: Color;
  blockLabel: Color;
  blockEdge: Color;
  blockEdgeHover: Color;
  planeTool: string;
  planeSwitchActive: string;
  planeSwitchInactive: string;
  planeSwitchEdge: string;
};

const COLORS: Colors = {
  blockOn: new Color('#be424c'),
  blockOff: new Color('#457b9d'),
  blockLabel: new Color('#1d3557'),
  blockEdge: new Color('#1d3557'),
  blockEdgeHover: new Color('#f1faee'),
  planeTool: '#76afff',
  planeSwitchActive: '#76afff',
  planeSwitchInactive: '#eeeeee',
  planeSwitchEdge: '#96c2ff',
};

// -------------------
// --- GlobalState ---
// -------------------

export type GlobalState = {
  playing: boolean;
  blocks: BlockInfo[];
  idToBlock: Map<string, BlockInfo>;
  hoveredIds: string[];
  onIds: string[];
  activePlane: number;
  colors: Colors;
  editMode: boolean;

  play: () => void;
  blockHovered: (id: string, isHovered: boolean) => void;
  toggleHovered: () => void;
  setActivePlane: (activePlane: number) => void;
  setColors: (colors: Colors) => void;
  toggleEditMode: () => void;
  editFill: (levelBlock: LevelBlock) => void;
  editReset: () => void;
};

export const useGlobalStore = create<GlobalState>()(
  persist(  
    (set) => {
      return {
        playing: true,
        blocks: BLOCKS,
        idToBlock: populateIdToBlock(BLOCKS),
        hoveredIds: [],
        onIds: BLOCKS.filter(block => block.on).map(block => block.id),
        activePlane: 2,
        colors: COLORS,
        editMode: false,

        play: () => set(() => {
          return {};
        }),

        blockHovered: (id: string, isHovered: boolean) => set(({ hoveredIds }) => {

          if (isHovered) {
            hoveredIds = [ ...hoveredIds, id ];
          } else {
            hoveredIds = hoveredIds.filter(hoveredId => hoveredId !== id);
          }
          
          // console.log('hoveredIds=', hoveredIds);

          return { hoveredIds };
        }),

        toggleHovered: () => set(({ idToBlock, hoveredIds, onIds }) => {
          const hoveredBlock = idToBlock.get(hoveredIds[0]) as BlockInfo;
          const idsToToggle = hoveredBlock.toggleSelf ? [hoveredBlock.id, ...hoveredBlock.neighbourIds] : [...hoveredBlock.neighbourIds];

          // Toggle off
          const toggleOffIds = onIds.filter(id => idsToToggle.includes(id));
          let newOnIds = onIds.filter(id => !toggleOffIds.includes(id));
          // Toggle on
          const toggleOnIds = idsToToggle.filter(id => !toggleOffIds.includes(id));
          newOnIds = [...newOnIds, ...toggleOnIds];

          return { onIds: newOnIds };
        }),

        setActivePlane: (activePlane) => set(() => ({ activePlane })),

        setColors: (colors: Colors) => set(() => ({ colors: {...colors} })),

        toggleEditMode: () => set(({ editMode }) => ({ editMode: !editMode })),

        editFill: (levelBlock: LevelBlock) => set(({ blocks }) => {
          const updatedBlocks = blocks.map(block => ({...block, toggleSelf: (levelBlock === 'O')}));          
          return { 
            onIds: [],
            blocks: updatedBlocks,
            idToBlock: populateIdToBlock(updatedBlocks)
          };
        }),

        editReset: () => set(() => ({ onIds: [] })),
      }
    },
    {
      name: 'voxel-void',
      partialize: () => ({ 
      }),
    }
  )
);
