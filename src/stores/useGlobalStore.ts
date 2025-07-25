import { Color } from 'three';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --------------
// --- LEVELS ---
// --------------
export type BlockType = 'ALL' | 'EDGES_AND_CORNERS' | 'SELF_AND_EDGES' | 'EDGES' | 'SELF_AND_CORNERS' | 'CORNERS' | 'NONE' | 'EMPTY';

export type LevelBlock = 
    'a'  // toggle all - off
  | 'A'  // toggle all - on
  | 'o'  // toggle edges & corners - off
  | 'O'  // toggle edges & corners - on
  | 'p'  // toggle self & edges - off. Note: 'p' is short for plus sign (+) which is the shape of the toggle blocks
  | 'P'  // toggle self & edges - on
  | 'e'  // toggle edges - off
  | 'E'  // toggle edges - on
  | 'x'  // toggle self and corners - off
  | 'X'  // toggle self and corners - on
  | 'c'  // toggle corners - off
  | 'C'  // toggle corners - on
  | 'n'  // toggle none - off
  | 'N'  // toggle none - on
  | ' '  // empty

const BLOCK_INFO_LOOKUP: Map<LevelBlock, { blockType: BlockType, on: boolean }> = new Map<LevelBlock, { blockType: BlockType, on: boolean }>([
  ['a', { blockType: 'ALL',               on: false }],
  ['A', { blockType: 'ALL',               on: true  }],
  ['o', { blockType: 'EDGES_AND_CORNERS', on: false }],
  ['O', { blockType: 'EDGES_AND_CORNERS', on: true  }],
  ['p', { blockType: 'SELF_AND_EDGES',    on: false }],
  ['P', { blockType: 'SELF_AND_EDGES',    on: true  }],
  ['e', { blockType: 'EDGES',             on: false }],
  ['E', { blockType: 'EDGES',             on: true  }],
  ['x', { blockType: 'SELF_AND_CORNERS',  on: true  }],
  ['X', { blockType: 'SELF_AND_CORNERS',  on: false }],
  ['c', { blockType: 'CORNERS',           on: true  }],
  ['C', { blockType: 'CORNERS',           on: false }],
  ['n', { blockType: 'NONE',              on: false }],
  ['N', { blockType: 'NONE',              on: true  }],
  [' ', { blockType: 'EMPTY',             on: false }],
]);

export const toLevelBlock = (blockType: BlockType, on: boolean): LevelBlock => {
  const matchingEntries = [...BLOCK_INFO_LOOKUP.entries()].filter(([_, value]) => value.blockType === blockType && value.on === on);
  return matchingEntries[0][0];
};

const nextBlockType = (blockType: BlockType): BlockType => {
  if (blockType === 'EMPTY') return blockType;

  switch (blockType) {
    case 'ALL':               return 'EDGES_AND_CORNERS';
    case 'EDGES_AND_CORNERS': return 'SELF_AND_EDGES';
    case 'SELF_AND_EDGES':    return 'EDGES';
    case 'EDGES':             return 'SELF_AND_CORNERS';
    case 'SELF_AND_CORNERS':  return 'CORNERS';
    case 'CORNERS':           return 'NONE';
    case 'NONE':              return 'ALL';
  }
};

// const LEVEL: LevelBlock[] = [
//   // layer 1
//   'e','a','A','A',
//   'a','a','A','A',
//   'a','a','a','a',
//   'p','a','a','n',
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
  'n','N','n',
  'N','P','n',
  'N','n','N',
  // middle layer
  'n','n','N',
  'n',' ','e',
  'N','A','n',
  // bottom layer
  'n','n','n',
  'n','n','N',
  'N','N','N',
];

const GRID_3x3x3: LevelBlock[] = [
  // top layer
  'a','a','a',
  'a','a','a',
  'a','a','a',
  // middle layer
  'a','a','a',
  'a',' ','a',
  'a','a','a',
  // bottom layer
  'a','a','a',
  'a','a','a',
  'a','a','a',
];

const GRID_4x4x4: LevelBlock[] = [
  // layer 1
  'a','a','a','a',
  'a','a','a','a',
  'a','a','a','a',
  'a','a','a','a',
  // layer 2
  'a','a','a','a',
  'a',' ',' ','a',
  'a',' ',' ','a',
  'a','a','a','a',
  // layer 3
  'a','a','a','a',
  'a',' ',' ','a',
  'a',' ',' ','a',
  'a','a','a','a',
  // layer 4
  'a','a','a','a',
  'a','a','a','a',
  'a','a','a','a',
  'a','a','a','a',
];

const GRID_5x5x5: LevelBlock[] = [
  // layer 1
  'a','a','a','a','a',
  'a','a','a','a','a',
  'a','a','a','a','a',
  'a','a','a','a','a',
  'a','a','a','a','a',
  // layer 2
  'a','a','a','a','a',
  'a',' ',' ',' ','a',
  'a',' ',' ',' ','a',
  'a',' ',' ',' ','a',
  'a','a','a','a','a',
  // layer 3
  'a','a','a','a','a',
  'a',' ',' ',' ','a',
  'a',' ',' ',' ','a',
  'a',' ',' ',' ','a',
  'a','a','a','a','a',
  // layer 4
  'a','a','a','a','a',
  'a',' ',' ',' ','a',
  'a',' ',' ',' ','a',
  'a',' ',' ',' ','a',
  'a','a','a','a','a',
  // layer 5
  'a','a','a','a','a',
  'a','a','a','a','a',
  'a','a','a','a','a',
  'a','a','a','a','a',
  'a','a','a','a','a',
];

const initLevel = (gridSize: number): LevelBlock[] => {
  switch(gridSize) {
    case 3: return GRID_3x3x3;
    case 4: return GRID_4x4x4;
    case 5: return GRID_5x5x5;
  }
  return [];
}
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

const calcBlockCornerIds = (blockId: string, gridSize: number): string[] => {
  const x = parseInt(blockId.split('-')[1]);
  const y = parseInt(blockId.split('-')[2]);
  const z = parseInt(blockId.split('-')[3]);

  // xyz for block corners
  let cornerBlockXYZs: [number, number, number][];
  if ((x === 0 || x === (gridSize - 1)) && y !== 0 && y !== (gridSize - 1) && z !== 0 && z !== (gridSize - 1)) {
    // block corners on x face
    cornerBlockXYZs = [
      [x, y - 1, z - 1],
      [x, y - 1, z + 1],
      [x, y + 1, z - 1],
      [x, y + 1, z + 1]
    ];
  } else if (x !== 0 && x !== (gridSize - 1) && (y === 0 || y === (gridSize - 1)) && z !== 0 && z !== (gridSize - 1)) {
    // block corners on y face
    cornerBlockXYZs = [
      [x - 1, y, z - 1],
      [x - 1, y, z + 1],
      [x + 1, y, z - 1],
      [x + 1, y, z + 1]
    ];
  } else if (x !== 0 && x !== (gridSize - 1) && y !== 0 && y !== (gridSize - 1) && (z === 0 || z === (gridSize - 1))) {
    // block corners on z face
    cornerBlockXYZs = [
      [x - 1, y - 1, z],
      [x - 1, y + 1, z],
      [x + 1, y - 1, z],
      [x + 1, y + 1, z]
    ];
  } else {
    cornerBlockXYZs = [
      [x + 1, y + 1, z    ], // above & right
      [x - 1, y + 1, z    ], // above & left
      [x + 1, y - 1, z    ], // below & right
      [x - 1, y - 1, z    ], // below & left
      [x,     y + 1, z + 1], // forward & above
      [x,     y - 1, z + 1], // forward & below
      [x + 1, y,     z + 1], // forward & left
      [x - 1, y,     z + 1], // forward & right
      [x,     y + 1, z - 1], // back & above
      [x,     y - 1, z - 1], // back & below
      [x - 1, y,     z - 1], // back & left
      [x + 1, y,     z - 1], // back & right
    ];
  }

  // keep points which are in the valid range
  cornerBlockXYZs = cornerBlockXYZs.filter(point => (
    point[0] >= 0 && point[0] < gridSize && 
    point[1] >= 0 && point[1] < gridSize &&
    point[2] >= 0 && point[2] < gridSize
  ));
  // keep points which are on the surface
  cornerBlockXYZs = cornerBlockXYZs.filter(point => {
    return (
      point[0] === 0 || point[0] === (gridSize - 1) ||
      point[1] === 0 || point[1] === (gridSize - 1) ||
      point[2] === 0 || point[2] === (gridSize - 1)
    )}
  );

  return cornerBlockXYZs.map(point => calcBlockId(point[0], point[1], point[2]));
};

const calcBlockEdgeIds = (blockId: string, gridSize: number): string[] => {
  const x = parseInt(blockId.split('-')[1]);
  const y = parseInt(blockId.split('-')[2]);
  const z = parseInt(blockId.split('-')[3]);

  // xyz for block edges
  let edgeBlockXYZs: [number, number, number][] = [
    [x,     y + 1, z    ], // above
    [x,     y - 1, z    ], // below
    [x + 1, y,     z    ], // right
    [x - 1, y,     z    ], // left
    [x,     y,     z + 1], // forward
    [x,     y,     z - 1], // backward
  ];
  // keep points which are in the valid range
  edgeBlockXYZs = edgeBlockXYZs.filter(point => (
    point[0] >= 0 && point[0] < gridSize && 
    point[1] >= 0 && point[1] < gridSize &&
    point[2] >= 0 && point[2] < gridSize
  ));
  // keep points which are on the surface
  edgeBlockXYZs = edgeBlockXYZs.filter(point => {
    return (
      point[0] === 0 || point[0] === (gridSize - 1) ||
      point[1] === 0 || point[1] === (gridSize - 1) ||
      point[2] === 0 || point[2] === (gridSize - 1)
    )}
  );

  return edgeBlockXYZs.map(point => calcBlockId(point[0], point[1], point[2]));
};

const calcToggleIds = (blockType: BlockType, blockId: string, toggleMode: ToggleMode, gridSize: number): string[] => {
  if (toggleMode === 'TOGGLE_ON') {
    switch (blockType) {
      case 'ALL':               return [blockId, ...calcBlockEdgeIds(blockId, gridSize), ...calcBlockCornerIds(blockId, gridSize)];
      case 'EDGES_AND_CORNERS': return [...calcBlockEdgeIds(blockId, gridSize), ...calcBlockCornerIds(blockId, gridSize)];
      case 'SELF_AND_EDGES':    return [blockId, ...calcBlockEdgeIds(blockId, gridSize)];
      case 'EDGES':             return [...calcBlockEdgeIds(blockId, gridSize)];
      case 'SELF_AND_CORNERS':  return [blockId, ...calcBlockCornerIds(blockId, gridSize)];
      case 'CORNERS':           return [...calcBlockCornerIds(blockId, gridSize)];
      case 'NONE':              return [];
      case 'EMPTY':             return [];
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
  //   'n','N','n',
  //   'N','P','n',
  //   'N','n','N',
  //   // layer 2
  //   'n','n','N',
  //   'n',' ','e',
  //   'N','A','n',
  //   // layer 3
  //   'n','n','n',
  //   'n','n','N',
  //   'N','N','N',
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
          const levelBlocks: LevelBlock[] = initLevel(gridSize);
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
            blockType: block.blockType === 'EMPTY' ? 'EMPTY' : blockType,
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
