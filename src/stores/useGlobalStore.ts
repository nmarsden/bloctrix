import { Color } from 'three';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --------------
// --- LEVELS ---
// --------------
export type BlockType = 'SELF_AND_EDGES' | 'EDGES' | 'NONE' | 'ALL';

export type LevelBlock = 
    'a'  // toggle all - off
  | 'A'  // toggle all - on
  | 'p'  // toggle self & edges - off. Note: 'p' is short for plus sign, ie. +
  | 'P'  // toggle self & edges - on
  | 'e'  // toggle edges - off
  | 'E'  // toggle edges - on
  | ' '  // toggle none - off
  | '.'  // toggle none - on

const BLOCK_INFO_LOOKUP: Map<LevelBlock, { blockType: BlockType, on: boolean }> = new Map<LevelBlock, { blockType: BlockType, on: boolean }>([
  ['a', { blockType: 'ALL',             on: false }],
  ['A', { blockType: 'ALL',             on: true }],
  ['p', { blockType: 'SELF_AND_EDGES',  on: false }],
  ['P', { blockType: 'SELF_AND_EDGES',  on: true  }],
  ['e', { blockType: 'EDGES',           on: false }],
  ['E', { blockType: 'EDGES',           on: true  }],
  [' ', { blockType: 'NONE',            on: false }],
  ['.', { blockType: 'NONE',            on: true  }],
]);

export const toLevelBlock = (blockType: BlockType, on: boolean): LevelBlock => {
  const matchingEntries = [...BLOCK_INFO_LOOKUP.entries()].filter(([_, value]) => value.blockType === blockType && value.on === on);
  return matchingEntries[0][0];
};

const nextBlockType = (blockType: BlockType): BlockType => {
  switch (blockType) {
    case 'SELF_AND_EDGES': return 'EDGES';
    case 'EDGES':          return 'NONE';
    case 'NONE':           return 'ALL';
    case 'ALL':            return 'SELF_AND_EDGES';
  }
};

type LevelBlockLayer = [LevelBlock, LevelBlock, LevelBlock, LevelBlock, LevelBlock, LevelBlock, LevelBlock, LevelBlock, LevelBlock];
type Level = [LevelBlockLayer, LevelBlockLayer, LevelBlockLayer];

const LEVEL: Level = [
  [
   ' ','.',' ',
   '.','P',' ',
   '.',' ','.',
  ],
  [
   ' ',' ','.',
   ' ','.','e',
   '.','A',' ',
  ],
  [
   ' ',' ',' ',
   ' ',' ','.',
   '.','.','.',
  ],
];

// const LEVEL: Level = [
//   // top layer
//   [
//     'p', 'E', 'p',  // back   - left, center, right
//     'p', 'p', 'p',  // middle
//     'e', 'P', 'p',  // front
//   ],
//   // middle layer
//   [
//     'p', 'e', 'p',
//     'p', 'p', 'p',
//     'p', 'P', 'p',
//   ],
//   // bottom layer
//   [
//     'p', 'e', 'p',
//     'p', 'p', 'p',
//     'p', 'P', 'p',
//   ],
// ];

// --------------
// --- BLOCKS ---
// --------------
export type BlockInfo = {
  id: string;
  position: [number, number, number];
  toggleIds: string[];
  blockType: BlockType;
  on: boolean;
};

export const GRID_SIZE_IN_BLOCKS = 3;
export const BLOCK_SIZE = 1;
export const BLOCK_GAP = 0.1;
export const GRID_WIDTH = ((GRID_SIZE_IN_BLOCKS * BLOCK_SIZE) + ((GRID_SIZE_IN_BLOCKS - 1) * BLOCK_GAP));
export const MAX_POS = (GRID_WIDTH - BLOCK_SIZE) * 0.5;
export const MIN_POS = -MAX_POS;

const calcBlockId = (x: number, y: number, z: number): string => {
  return `block-${x}-${y}-${z}`;
}

const calcBlockEdgeAndCornerIds = (blockId: string): string[] => {
  const ids: string[] = [];

  const x = parseInt(blockId.split('-')[1]);
  const y = parseInt(blockId.split('-')[2]);
  const z = parseInt(blockId.split('-')[3]);

  if ((x === 0 || x === 2) && y === 1 && z === 1) {
    // -- block edges and corners for block (0, 1, 1) or (2, 1, 1) --
    ids.push(calcBlockId(x, 0, 0));
    ids.push(calcBlockId(x, 0, 2));
    ids.push(calcBlockId(x, 2, 0));
    ids.push(calcBlockId(x, 2, 2));
    return [...ids, ...calcBlockEdgeIds(blockId)];
  }
  if (x === 1 && (y === 0 || y === 2) && z === 1) {
    // -- block edges and corners for block (1, 0, 1) or (1, 2, 1) --
    ids.push(calcBlockId(0, y, 0));
    ids.push(calcBlockId(0, y, 2));
    ids.push(calcBlockId(2, y, 0));
    ids.push(calcBlockId(2, y, 2));
    return [...ids, ...calcBlockEdgeIds(blockId)];
  }
  if (x === 1 && y === 1 && (z === 0 || z === 2)) {
    // -- block edges and corners for block (1, 1, 0) or (1, 1, 2) --
    ids.push(calcBlockId(0, 0, z));
    ids.push(calcBlockId(0, 2, z));
    ids.push(calcBlockId(2, 0, z));
    ids.push(calcBlockId(2, 2, z));
    return [...ids, ...calcBlockEdgeIds(blockId)];
  }

  // block above & right
  if ((y + 1 < GRID_SIZE_IN_BLOCKS) && (x + 1 < GRID_SIZE_IN_BLOCKS)) ids.push(calcBlockId(x + 1, y + 1, z));
  // block above & left
  if ((y + 1 < GRID_SIZE_IN_BLOCKS) && (x - 1 >= 0)) ids.push(calcBlockId(x - 1, y + 1, z));
  // block below & right
  if ((y - 1 >= 0) && (x + 1 < GRID_SIZE_IN_BLOCKS)) ids.push(calcBlockId(x + 1, y - 1, z));
  // block below & left
  if ((y - 1 >= 0) && (x - 1 >= 0)) ids.push(calcBlockId(x - 1, y - 1, z));
  // block forward & above
  if ((z + 1 < GRID_SIZE_IN_BLOCKS) && (y + 1 < GRID_SIZE_IN_BLOCKS)) ids.push(calcBlockId(x, y + 1, z + 1));
  // block forward & below
  if ((z + 1 < GRID_SIZE_IN_BLOCKS) && (y - 1 >= 0)) ids.push(calcBlockId(x, y - 1, z + 1));
  // block forward & left
  if ((z + 1 < GRID_SIZE_IN_BLOCKS) && (x + 1 < GRID_SIZE_IN_BLOCKS)) ids.push(calcBlockId(x + 1, y, z + 1));
  // block forward & right
  if ((z + 1 < GRID_SIZE_IN_BLOCKS) && (x - 1 >= 0)) ids.push(calcBlockId(x - 1, y, z + 1));
  // block back & above
  if ((z - 1 >= 0) && (y + 1 < GRID_SIZE_IN_BLOCKS)) ids.push(calcBlockId(x, y + 1, z - 1));
  // block back & below
  if ((z - 1 >= 0) && (y - 1 >= 0)) ids.push(calcBlockId(x, y - 1, z - 1));
  // block back & left
  if ((z - 1 >= 0) && (x - 1 >= 0)) ids.push(calcBlockId(x - 1, y, z - 1));
  // block back & right
  if ((z - 1 >= 0) && (x + 1 < GRID_SIZE_IN_BLOCKS)) ids.push(calcBlockId(x + 1, y, z - 1));

  return [...ids, ...calcBlockEdgeIds(blockId)];
};

const calcBlockEdgeIds = (blockId: string): string[] => {
  const ids: string[] = [];

  const x = parseInt(blockId.split('-')[1]);
  const y = parseInt(blockId.split('-')[2]);
  const z = parseInt(blockId.split('-')[3]);

  // block above
  if (y + 1 < GRID_SIZE_IN_BLOCKS) ids.push(calcBlockId(x, y + 1, z));
  // block below
  if (y - 1 >= 0) ids.push(calcBlockId(x, y - 1, z));
  // block right
  if (x + 1 < GRID_SIZE_IN_BLOCKS) ids.push(calcBlockId(x + 1, y, z));
  // block left
  if (x - 1 >= 0) ids.push(calcBlockId(x - 1, y, z));
  // block forward
  if (z + 1 < GRID_SIZE_IN_BLOCKS) ids.push(calcBlockId(x, y, z + 1));
  // block back
  if (z - 1 >= 0) ids.push(calcBlockId(x, y, z - 1));

  return ids;
};

const calcToggleIds = (blockType: BlockType, blockId: string, toggleMode: ToggleMode): string[] => {
  if (toggleMode === 'TOGGLE_ON') {
    switch (blockType) {
      case 'ALL':            return [blockId, ...calcBlockEdgeAndCornerIds(blockId)];
      case 'SELF_AND_EDGES': return [blockId, ...calcBlockEdgeIds(blockId)];
      case 'EDGES':          return [...calcBlockEdgeIds(blockId)];
      case 'NONE':           return [];
    }
  }
  if (toggleMode === 'TOGGLE_BLOCK_TYPE') {
    return [blockId];
  }
  return [];
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

      const extraInfo = BLOCK_INFO_LOOKUP.get(block) as { blockType: BlockType, on: false };
      const id = calcBlockId(x, y, z);
      blocks.push({ 
        id, 
        position: [xPos, yPos, zPos], 
        toggleIds: calcToggleIds(extraInfo.blockType, id, 'TOGGLE_ON'),
        blockType: extraInfo.blockType,
        on: extraInfo.on
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

export type ToggleMode = 'TOGGLE_ON' | 'TOGGLE_BLOCK_TYPE';

export type GlobalState = {
  playing: boolean;
  blocks: BlockInfo[];
  idToBlock: Map<string, BlockInfo>;
  hoveredIds: string[];
  onIds: string[];
  activePlane: number;
  colors: Colors;
  showEditor: boolean;
  toggleMode: ToggleMode;

  play: () => void;
  blockHovered: (id: string, isHovered: boolean) => void;
  toggleHovered: () => void;
  setActivePlane: (activePlane: number) => void;
  setColors: (colors: Colors) => void;
  toggleShowEditor: () => void;
  setToggleMode: (toggleMode: ToggleMode) => void;
  editFill: (blockType: BlockType) => void;
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
        showEditor: false,
        toggleMode: 'TOGGLE_ON',

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

        toggleHovered: () => set(({ idToBlock, hoveredIds, onIds, toggleMode, blocks }) => {
          const hoveredBlock = idToBlock.get(hoveredIds[0]) as BlockInfo;

          if (toggleMode === 'TOGGLE_ON') {
            const idsToToggle = hoveredBlock.toggleIds;

            // Toggle off
            const toggleOffIds = onIds.filter(id => idsToToggle.includes(id));
            let newOnIds = onIds.filter(id => !toggleOffIds.includes(id));
            // Toggle on
            const toggleOnIds = idsToToggle.filter(id => !toggleOffIds.includes(id));
            newOnIds = [...newOnIds, ...toggleOnIds];

            return { onIds: newOnIds };
          }
          if (toggleMode === 'TOGGLE_BLOCK_TYPE') {
            const blockType = hoveredBlock.blockType;
            const newBlockType = nextBlockType(blockType);

            const updatedBlocks = blocks.map(block => ({
              ...block, 
              blockType: (block.id === hoveredBlock.id ? newBlockType : block.blockType), 
            }));

            return { 
              onIds: [],
              blocks: updatedBlocks,
              idToBlock: populateIdToBlock(updatedBlocks)
            };            
          }
          return {};
        }),

        setActivePlane: (activePlane) => set(() => ({ activePlane })),

        setColors: (colors: Colors) => set(() => ({ colors: {...colors} })),

        toggleShowEditor: () => set(({ showEditor }) => ({ showEditor: !showEditor })),

        setToggleMode: (toggleMode: ToggleMode) => set(({ blocks }) => {
          // Recalculate Toggle IDs 
          const updatedBlocks = blocks.map(block => ({
            ...block, 
            toggleIds: calcToggleIds(block.blockType, block.id, toggleMode)
          }));

          return { 
            blocks: updatedBlocks,
            idToBlock: populateIdToBlock(updatedBlocks),
            toggleMode 
          }
        }),

        editFill: (blockType: BlockType) => set(({ blocks }) => {
          const updatedBlocks = blocks.map(block => ({
            ...block, 
            blockType, 
            toggleIds: calcToggleIds(blockType, block.id, 'TOGGLE_BLOCK_TYPE'), 
            on: false
          }));

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
