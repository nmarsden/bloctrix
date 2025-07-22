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

// const LEVEL: LevelBlock[] = [
//   // layer 1
//   'e','a','A','A',
//   'a','a','A','A',
//   'a','a','a','a',
//   'p','a','a',' ',
//   // layer 2
//   'a','a','A','A',
//   'a','a','a','A',
//   'a','a','a','a',
//   'a','a','a','a',
//   // layer 3
//   'a','a','a','a',
//   'a','a','a','a',
//   'a','a','a','a',
//   'a','a','a','a',
//   // layer 4
//   'a','a','a','a',
//   'a','a','a','a',
//   'a','a','a','a',
//   'a','a','a','a',
// ];

const LEVEL: LevelBlock[] = [
  // top layer
  ' ','.',' ',
  '.','P',' ',
  '.',' ','.',
  // middle layer
  ' ',' ','.',
  ' ','.','e',
  '.','A',' ',
  // bottom layer
  ' ',' ',' ',
  ' ',' ','.',
  '.','.','.',
];

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

export const BLOCK_SIZE = 1;
export const BLOCK_GAP = 0.1;

const calcBlockId = (x: number, y: number, z: number): string => {
  return `block-${x}-${y}-${z}`;
}

const calcBlockEdgeAndCornerIds = (blockId: string, gridSize: number): string[] => {
  const ids: string[] = [];

  const x = parseInt(blockId.split('-')[1]);
  const y = parseInt(blockId.split('-')[2]);
  const z = parseInt(blockId.split('-')[3]);

  // Handle block on face (ie. not edge or corner)
  if ((x === 0 || x === (gridSize - 1)) && y !== 0 && y !== (gridSize - 1) && z !== 0 && z !== (gridSize - 1)) {
    // blocks on x face
    ids.push(calcBlockId(x, y - 1, z - 1));
    ids.push(calcBlockId(x, y - 1, z + 1));
    ids.push(calcBlockId(x, y + 1, z - 1));
    ids.push(calcBlockId(x, y + 1, z + 1));
    return [...ids, ...calcBlockEdgeIds(blockId, gridSize)];
  }
  if (x !== 0 && x !== (gridSize - 1) && (y === 0 || y === (gridSize - 1)) && z !== 0 && z !== (gridSize - 1)) {
    // blocks on y face
    ids.push(calcBlockId(x - 1, y, z - 1));
    ids.push(calcBlockId(x - 1, y, z + 1));
    ids.push(calcBlockId(x + 1, y, z - 1));
    ids.push(calcBlockId(x + 1, y, z + 1));
    return [...ids, ...calcBlockEdgeIds(blockId, gridSize)];
  }
  if (x !== 0 && x !== (gridSize - 1) && y !== 0 && y !== (gridSize - 1) && (z === 0 || z === (gridSize - 1))) {
    // blocks on z face
    ids.push(calcBlockId(x - 1, y - 1, z));
    ids.push(calcBlockId(x - 1, y + 1, z));
    ids.push(calcBlockId(x + 1, y - 1, z));
    ids.push(calcBlockId(x + 1, y + 1, z));
    return [...ids, ...calcBlockEdgeIds(blockId, gridSize)];
  }

  // block above & right
  if ((y + 1 < gridSize) && (x + 1 < gridSize)) ids.push(calcBlockId(x + 1, y + 1, z));
  // block above & left
  if ((y + 1 < gridSize) && (x - 1 >= 0)) ids.push(calcBlockId(x - 1, y + 1, z));
  // block below & right
  if ((y - 1 >= 0) && (x + 1 < gridSize)) ids.push(calcBlockId(x + 1, y - 1, z));
  // block below & left
  if ((y - 1 >= 0) && (x - 1 >= 0)) ids.push(calcBlockId(x - 1, y - 1, z));
  // block forward & above
  if ((z + 1 < gridSize) && (y + 1 < gridSize)) ids.push(calcBlockId(x, y + 1, z + 1));
  // block forward & below
  if ((z + 1 < gridSize) && (y - 1 >= 0)) ids.push(calcBlockId(x, y - 1, z + 1));
  // block forward & left
  if ((z + 1 < gridSize) && (x + 1 < gridSize)) ids.push(calcBlockId(x + 1, y, z + 1));
  // block forward & right
  if ((z + 1 < gridSize) && (x - 1 >= 0)) ids.push(calcBlockId(x - 1, y, z + 1));
  // block back & above
  if ((z - 1 >= 0) && (y + 1 < gridSize)) ids.push(calcBlockId(x, y + 1, z - 1));
  // block back & below
  if ((z - 1 >= 0) && (y - 1 >= 0)) ids.push(calcBlockId(x, y - 1, z - 1));
  // block back & left
  if ((z - 1 >= 0) && (x - 1 >= 0)) ids.push(calcBlockId(x - 1, y, z - 1));
  // block back & right
  if ((z - 1 >= 0) && (x + 1 < gridSize)) ids.push(calcBlockId(x + 1, y, z - 1));

  return [...ids, ...calcBlockEdgeIds(blockId, gridSize)];
};

const calcBlockEdgeIds = (blockId: string, gridSize: number): string[] => {
  const ids: string[] = [];

  const x = parseInt(blockId.split('-')[1]);
  const y = parseInt(blockId.split('-')[2]);
  const z = parseInt(blockId.split('-')[3]);

  // block above
  if (y + 1 < gridSize) ids.push(calcBlockId(x, y + 1, z));
  // block below
  if (y - 1 >= 0) ids.push(calcBlockId(x, y - 1, z));
  // block right
  if (x + 1 < gridSize) ids.push(calcBlockId(x + 1, y, z));
  // block left
  if (x - 1 >= 0) ids.push(calcBlockId(x - 1, y, z));
  // block forward
  if (z + 1 < gridSize) ids.push(calcBlockId(x, y, z + 1));
  // block back
  if (z - 1 >= 0) ids.push(calcBlockId(x, y, z - 1));

  return ids;
};

const calcToggleIds = (blockType: BlockType, blockId: string, toggleMode: ToggleMode, gridSize: number): string[] => {
  if (toggleMode === 'TOGGLE_ON') {
    switch (blockType) {
      case 'ALL':            return [blockId, ...calcBlockEdgeAndCornerIds(blockId, gridSize)];
      case 'SELF_AND_EDGES': return [blockId, ...calcBlockEdgeIds(blockId, gridSize)];
      case 'EDGES':          return [...calcBlockEdgeIds(blockId, gridSize)];
      case 'NONE':           return [];
    }
  }
  if (toggleMode === 'TOGGLE_BLOCK_TYPE') {
    return [blockId];
  }
  return [];
};

const levelToBlocks = (levelBlocks: LevelBlock[]): BlockInfo[] => {
  const blocks: BlockInfo[] = [];

  const gridSize = Math.round(Math.pow(levelBlocks.length, 1 / 3));
  const gridWidth = ((gridSize * BLOCK_SIZE) + ((gridSize - 1) * BLOCK_GAP));
  const maxPos = (gridWidth - BLOCK_SIZE) * 0.5;
  const minPos = -maxPos;

  for (let layerIndex=0; layerIndex<gridSize; layerIndex++) {
    for (let blockIndex=0; blockIndex< gridSize*gridSize; blockIndex++) {
      const block = levelBlocks[(layerIndex * gridSize * gridSize) + blockIndex];
      const x = blockIndex % gridSize;
      const y = gridSize - (layerIndex+1);
      const z = Math.floor(blockIndex / gridSize);

      const xPos = minPos + (x * (BLOCK_SIZE + BLOCK_GAP));
      const yPos = minPos + (y * (BLOCK_SIZE + BLOCK_GAP));
      const zPos = minPos + (z * (BLOCK_SIZE + BLOCK_GAP));

      const extraInfo = BLOCK_INFO_LOOKUP.get(block) as { blockType: BlockType, on: false };
      const id = calcBlockId(x, y, z);
      blocks.push({ 
        id, 
        position: [xPos, yPos, zPos], 
        toggleIds: calcToggleIds(extraInfo.blockType, id, 'TOGGLE_ON', gridSize),
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

const outputLevelToConsole = (blocks: BlockInfo[], onIds: string[]) => {
  // const LEVEL: LevelBlock[] = [
  //   // layer 1
  //   ' ','.',' ',
  //   '.','P',' ',
  //   '.',' ','.',
  //   // layer 2
  //   ' ',' ','.',
  //   ' ','.','e',
  //   '.','A',' ',
  //   // layer 3
  //   ' ',' ',' ',
  //   ' ',' ','.',
  //   '.','.','.',
  // ];
  const blockChar = (block: BlockInfo): string => {
    const isOn = onIds.includes(block.id);
    const levelBlock = toLevelBlock(block.blockType, isOn);
    return `'${levelBlock}'`
  };

  let output: string[] = [];
  output.push('const LEVEL: LevelBlock[] = [');

  const gridSize = Math.round(Math.pow(blocks.length, 1 / 3));
  let blockIndex = 0;
  for (let layer=0; layer<gridSize; layer++) {
    output.push(`  // layer ${layer + 1}`);
    let rowOutput: string[] = [];
    for (let row=0; row<gridSize; row++, blockIndex += gridSize) {
      for (let col=0; col<gridSize; col++) {
        rowOutput.push(blockChar(blocks[blockIndex + col]));
      }
      output.push('  ' + rowOutput.join(',') + ',');
      rowOutput = [];
    }
  }
  output.push('];');

  console.log(output.join('\n'));
}

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
  editGridSize: (gridSize: number) => void;
  editFill: (blockType: BlockType) => void;
  editReset: () => void;
  editSave: () => void;
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
          const gridSize = Math.round(Math.pow(blocks.length, 1 / 3));
          const updatedBlocks = blocks.map(block => ({
            ...block, 
            toggleIds: calcToggleIds(block.blockType, block.id, toggleMode, gridSize)
          }));

          return { 
            blocks: updatedBlocks,
            idToBlock: populateIdToBlock(updatedBlocks),
            toggleMode 
          }
        }),

        editGridSize: (gridSize: number) => set(() => {
          const levelBlocks: LevelBlock[] = new Array(gridSize * gridSize * gridSize).fill('a');
          const blocks: BlockInfo[] = levelToBlocks(levelBlocks);

          return { 
            onIds: [],
            blocks,
            idToBlock: populateIdToBlock(blocks)
          };
        }),

        editFill: (blockType: BlockType) => set(({ blocks }) => {
          const gridSize = Math.round(Math.pow(blocks.length, 1 / 3));
          const updatedBlocks = blocks.map(block => ({
            ...block, 
            blockType, 
            toggleIds: calcToggleIds(blockType, block.id, 'TOGGLE_BLOCK_TYPE', gridSize), 
            on: false
          }));

          return { 
            onIds: [],
            blocks: updatedBlocks,
            idToBlock: populateIdToBlock(updatedBlocks)
          };
        }),

        editReset: () => set(() => ({ onIds: [] })),

        editSave: () => set(({ blocks, onIds }) => {
          outputLevelToConsole(blocks, onIds)
          return {};
        }),
      }
    },
    {
      name: 'voxel-void',
      partialize: () => ({ 
      }),
    }
  )
);
