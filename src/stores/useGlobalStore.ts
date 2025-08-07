import { Color } from 'three';
import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import * as lz from 'lz-string';
import { v4 as uuidv4 } from 'uuid';
import { EASY_LEVELS, HARD_LEVELS, Level, LevelBlock, MEDIUM_LEVELS } from './levelData';

export type GameMode = 'MAIN_MENU' | 'LEVEL_MENU' | 'EDITING' | 'PLAYING' | 'LEVEL_COMPLETED';

// --------------
// --- LEVELS ---
// --------------
export type LevelType = 'EASY' | 'MEDIUM' | 'HARD' | 'CUSTOM' | 'NONE';

export type BlockType = 'ALL' | 'EDGES_AND_CORNERS' | 'SELF_AND_EDGES' | 'EDGES' | 'SELF_AND_CORNERS' | 'CORNERS' | 'NONE' | 'EMPTY';

const BLOCK_TYPE_LOOKUP: Map<LevelBlock, BlockType> = new Map<LevelBlock, BlockType>([
  ['a', 'ALL'              ],
  ['o', 'EDGES_AND_CORNERS'],
  ['p', 'SELF_AND_EDGES'   ],
  ['e', 'EDGES'            ],
  ['x', 'SELF_AND_CORNERS' ],
  ['c', 'CORNERS'          ],
  ['n', 'NONE'             ],
  [' ', 'EMPTY'            ],
]);

const getLevels = (levelType: LevelType, customLevels: Level[]): Level[] => {
  switch(levelType) {
    case 'EASY': return EASY_LEVELS;
    case 'MEDIUM': return MEDIUM_LEVELS;
    case 'HARD': return HARD_LEVELS;
    case 'CUSTOM': return [...customLevels];
    default: return [];
  }
};

export const toLevelBlock = (blockType: BlockType): LevelBlock => {
  const matchingEntries = [...BLOCK_TYPE_LOOKUP.entries()].filter(([_, value]) => value === blockType);
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

const NEW_LEVEL: Level = {
  id: '',
  name: 'New Level',
  blocks: [
    // layer 1
    'a','a','a',
    'a','a','a',
    'a','a','a',
    // layer 2
    'a','a','a',
    'a',' ','a',
    'a','a','a',
    // layer 3
    'a','a','a',
    'a','a','a',
    'a','a','a',
  ],
  moves: []
};

const EMPTY_LEVEL: Level = {
  id: 'd9045321-b9ca-425a-804b-690b484fbc10',
  name: 'Sample 01',
  blocks: [
    // layer 1
    'n','n','n',
    'n','p','n',
    'n','n','n',
    // layer 2
    'n','n','n',
    'n',' ','e',
    'n','a','n',
    // layer 3
    'n','n','n',
    'n','n','n',
    'n','n','n',
  ],
  moves: [
    'block-1-1-2',
    'block-2-1-1',
    'block-1-2-1',
  ]
};

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

const initLevelBlocks = (gridSize: number): LevelBlock[] => {
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

const updateOnIds = (onIds: string[], idsToToggle: string[]): string[] => {
  // Toggle off
  const toggleOffIds = onIds.filter(id => idsToToggle.includes(id));
  let newOnIds = onIds.filter(id => !toggleOffIds.includes(id));
  // Toggle on
  const toggleOnIds = idsToToggle.filter(id => !toggleOffIds.includes(id));
  return [...newOnIds, ...toggleOnIds];
}

const levelBlocksToBlocks = (levelBlocks: LevelBlock[], moves?: string[]): BlockInfo[] => {
  let blocks: BlockInfo[] = [];

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

      const blockType = BLOCK_TYPE_LOOKUP.get(block) as BlockType;
      const id = calcBlockId(x, y, z);
      blocks.push({ 
        id, 
        position: [xPos, yPos, zPos], 
        toggleIds: calcToggleIds(blockType, id, 'TOGGLE_ON', gridSize),
        blockType: blockType,
        on: false
      });

      // console.log(`[layer:${layerIndex}][block:${blockIndex}]=`, layer[blockIndex], `[x:${x}][y:${y}][z:${z}]`);
    }
  }

  // Populate onIds according to moves
  let onIds: string[] = [];
  moves?.forEach(move => {
    const idsToToggle = (blocks.filter(block => block.id === move))[0].toggleIds;
    onIds = updateOnIds(onIds, idsToToggle);
  });

  // Update 'on' in blocks according to onIds
  blocks = blocks.map(block => ({ ...block, on: onIds.includes(block.id) }));

  return blocks;
}

const BLOCKS: BlockInfo[] = levelBlocksToBlocks(EMPTY_LEVEL.blocks, EMPTY_LEVEL.moves);

const populateIdToBlock = (blocks: BlockInfo[]): Map<string, BlockInfo> => {
  let idToBlock: Map<string, BlockInfo> = new Map<string, BlockInfo>();
  for (let i=0; i<blocks.length; i++) {
    const block = blocks[i];
    idToBlock.set(block.id, block);
  }
  return idToBlock;
};

const outputLevelToConsole = (levelId: string, levelName: string, blocks: BlockInfo[], moves: string[]) => {
  // const LEVEL: Level = {
  //   id: '',
  //   name: 'Sample 01',
  //   blocks: [
  //     // top layer
  //     'n','n','n',
  //     'N','p','n',
  //     'n','n','n',
  //     // middle layer
  //     'n','n','n',
  //     'n',' ','e',
  //     'n','a','n',
  //     // bottom layer
  //     'n','n','n',
  //     'n','n','n',
  //     'n','n','n',
  //   ],
  //   moves: [ 
  //     'block-1-1-2', 
  //     'block-2-1-1', 
  //     'block-1-2-1' 
  //   ]  
  // };  

  const blockChar = (block: BlockInfo): string => {
    const levelBlock = toLevelBlock(block.blockType);
    return `'${levelBlock}'`
  };

  let output: string[] = [];
  output.push('const LEVEL: Level = {');

  output.push(`  id: '${levelId}',`);

  output.push(`  name: '${levelName}',`);

  output.push('  blocks: [');
  const gridSize = Math.round(Math.pow(blocks.length, 1 / 3));
  let blockIndex = 0;
  for (let layer=0; layer<gridSize; layer++) {
    output.push(`    // layer ${layer + 1}`);
    let rowOutput: string[] = [];
    for (let row=0; row<gridSize; row++, blockIndex += gridSize) {
      for (let col=0; col<gridSize; col++) {
        rowOutput.push(blockChar(blocks[blockIndex + col]));
      }
      output.push('    ' + rowOutput.join(',') + ',');
      rowOutput = [];
    }
  }
  output.push('  ],');

  output.push('  moves: [');
  moves.forEach(move => {
    output.push(`    '${move}',`);
  })
  output.push('  ]');

  output.push('};');

  console.log(output.join('\n'));
}

const levelToEncodedURI = (level: Level): string => {
  return lz.compressToEncodedURIComponent(JSON.stringify(level));
}

const encodedURIToLevel = (encodedURIComponent: string): Level => {
  return JSON.parse(lz.decompressFromEncodedURIComponent(encodedURIComponent));
}

const toCustomLevelURL = (level: Level): string => {
  const encodedURIComponent = levelToEncodedURI(level);
  return window.location.protocol + window.location.host + window.location.pathname + '#cl=' + encodedURIComponent;
}

const hashToCustomLevel = (hash: string): Level => {
  return encodedURIToLevel(hash.substring('#cl='.length));
}

const arraysAreEqual = (arr1: string[], arr2: string[]) => {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

const isNotExistingLevel = (level: Level, existingLevels: Level[]): boolean => {
  return !existingLevels.some(lvl => (
    lvl.name === level.name &&
    arraysAreEqual(lvl.blocks, level.blocks) &&
    arraysAreEqual(lvl.moves, level.moves)
  ));
}

const copyToClipboard = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (typeof navigator !== "undefined" && typeof navigator.clipboard !== "undefined") {
            const type = "text/plain";
            const blob = new Blob([text], { type });
            const data = [new ClipboardItem({ [type]: blob })];
            navigator.clipboard.write(data).then(resolve, reject).catch(reject);
        }
        else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";
            textarea.style.width = '2em';
            textarea.style.height = '2em';
            textarea.style.padding = '0';
            textarea.style.border = 'none';
            textarea.style.outline = 'none';
            textarea.style.boxShadow = 'none';
            textarea.style.background = 'transparent';
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand("copy");
                document.body.removeChild(textarea);
                resolve();
            }
            catch (e) {
                document.body.removeChild(textarea);
                reject(e);
            }
        }
        else {
            reject(new Error("None of copying methods are supported by this browser!"));
        }
    });
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
  blockCompleteA: Color;
  blockCompleteB: Color;
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
  blockCompleteA: new Color('#1d3557'),
  blockCompleteB: new Color('#f8f8f8'),
  planeTool: '#76afff',
  planeSwitchActive: '#76afff',
  planeSwitchInactive: '#eeeeee',
  planeSwitchEdge: '#96c2ff',
};

// -------------------
// --- GlobalState ---
// -------------------

export type ToggleMode = 'TOGGLE_ON' | 'TOGGLE_BLOCK_TYPE'; 

export type ToastMessage = 'NONE' | 'BLOCK_MODE' | 'MOVE_MODE' | 'SHARE' | 'SAVED' | 'DELETED';

export type GlobalState = {
  gameMode: GameMode;
  levelIndex: number;
  levelType: LevelType;
  currentLevel: Level;
  moveCount: number;
  levels: Level[];
  levelName: string;
  blocks: BlockInfo[];
  moves: string[];
  idToBlock: Map<string, BlockInfo>;
  hoveredIds: string[];
  onIds: string[];
  activePlane: number;
  colors: Colors;
  toggleMode: ToggleMode;
  customLevels: Level[];
  editingLevelId: string;
  toastMessage: ToastMessage;
  unsavedChanges: boolean;

  shareCustomLevel: () => Promise<void>;
  openCustomLevel: (hash: string) => void;
  showLevels: (levelType: LevelType) => void;
  newLevel: () => void;
  editLevel: (level: Level) => void;
  playLevel: (levelIndex: number, levelType: LevelType) => void;
  playNextLevel: () => void;
  showMainMenu: () => void;
  blockHovered: (id: string, isHovered: boolean) => void;
  toggleHovered: () => void;
  setActivePlane: (activePlane: number) => void;
  setColors: (colors: Colors) => void;
  setToggleMode: (toggleMode: ToggleMode) => void;
  editLevelName: (levelName: string) => void;
  editGridSize: (gridSize: number) => void;
  editFill: (blockType: BlockType) => void;
  editReset: () => void;
  editDelete: () => void;
  editSave: () => void;
  editPlay: () => void;
  setToastMessage: (toastMessage: ToastMessage) => void;
  updateUnsavedChanges: () => void;
};

const customLzStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      const storedValue = localStorage.getItem(name);
      if (storedValue) {
        // Decompress the string using lz-string
        const decompressed = lz.decompressFromUTF16(storedValue);
        // console.log(`customLzStorage: getItem(${name}):`, decompressed);
        return decompressed;
      }
    } catch (error) {
      console.error('Error getting item from custom storage:', error);
    }
    return null;
  },
  setItem: (name: string, value: string): void => {
    try {
      // Compress the string using lz-string
      const compressed = lz.compressToUTF16(value);
      localStorage.setItem(name, compressed);
    } catch (error) {
      console.error('Error setting item to custom storage:', error);
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error('Error removing item from custom storage:', error);
    }
  },
};

export const useGlobalStore = create<GlobalState>()(
  persist(  
    (set, get) => {
      return {
        gameMode: 'MAIN_MENU',
        levelIndex: 0,
        levelType: 'NONE',
        currentLevel: EMPTY_LEVEL,
        moveCount: 0,
        levels: [],
        levelName: EMPTY_LEVEL.name,
        blocks: BLOCKS,
        moves: EMPTY_LEVEL.moves,
        idToBlock: populateIdToBlock(BLOCKS),
        hoveredIds: [],
        onIds: BLOCKS.filter(block => block.on).map(block => block.id),
        activePlane: 2,
        colors: COLORS,
        toggleMode: 'TOGGLE_ON',
        customLevels: [],
        editingLevelId: '',
        toastMessage: 'NONE',
        unsavedChanges: false,

        shareCustomLevel: async () => {
          // Copy link to clipboard
          const customLevelURL = toCustomLevelURL(get().currentLevel);
          return await copyToClipboard(customLevelURL);
        },

        openCustomLevel: (hash: string) => set(({ playLevel, customLevels }) => {
          const level = hashToCustomLevel(hash);

          // Store custom level
          if (isNotExistingLevel(level, customLevels)) {
            customLevels = [...customLevels, level];
          }
          const levelIndex = customLevels.findIndex(lvl => lvl.id === level.id);

          playLevel(levelIndex, 'CUSTOM');

          return { customLevels };
        }),

        showLevels: (levelType: LevelType) => set(({ customLevels }) => {
          const levels = getLevels(levelType, customLevels);

          return {
            gameMode: 'LEVEL_MENU',
            levelType,
            levels
          }
        }),

        newLevel: () => set(({ editLevel, editSave }) => {
          const level = {...NEW_LEVEL, id: uuidv4()};
          editLevel(level);
          editSave();
          return {};
        }),

        editLevel: (level: Level) => set(() => {
          const blocks = levelBlocksToBlocks(level.blocks, level.moves);
          const moves = [...level.moves];
          const idToBlock = populateIdToBlock(blocks);
          const onIds = blocks.filter(block => block.on).map(block => block.id);
          
          return {
            gameMode: 'EDITING',
            levelName: level.name,
            currentLevel: level,
            moveCount: 0,
            blocks,
            moves,
            idToBlock,
            onIds,
            editingLevelId: level.id,
            unsavedChanges: false
          };
        }),

        playLevel: (levelIndex: number, levelType: LevelType) => set(({ customLevels }) => {
          const levels = getLevels(levelType, customLevels);
          const level = levels[levelIndex];
          const blocks = levelBlocksToBlocks(level.blocks, level.moves);
          const moves = [...level.moves];
          const idToBlock = populateIdToBlock(blocks);
          const onIds = blocks.filter(block => block.on).map(block => block.id);

          return {
            gameMode: 'PLAYING',
            currentLevel: level,
            moveCount: 0,
            levelIndex,
            levels,
            levelType,
            levelName: level.name,
            blocks,
            moves,
            idToBlock,
            onIds,
            editingLevelId: ''
          };
        }),

        playNextLevel: () => {
          const { levels, playLevel, levelIndex, levelType } = get();
          
          let newLevelIndex = levelIndex + 1;
          let newLevelType = levelType;
          if (newLevelIndex >= levels.length) {
            newLevelIndex = 0;
            switch (levelType) {
              case 'EASY':   newLevelType = 'MEDIUM'; break;
              case 'MEDIUM': newLevelType = 'HARD';   break;
              case 'HARD':   newLevelType = 'CUSTOM'; break;
            }
          }

          playLevel(newLevelIndex, newLevelType);
        },

        showMainMenu: () => set(() => {
          return { 
            gameMode: 'MAIN_MENU',
            levelType: 'NONE'
          };
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

        toggleHovered: () => {
          const { idToBlock, hoveredIds, moves, onIds, toggleMode, blocks, moveCount, gameMode } = get();
          const hoveredBlock = idToBlock.get(hoveredIds[0]) as BlockInfo;

          if (toggleMode === 'TOGGLE_ON') {
            const newMoves = moves.includes(hoveredBlock.id) ? moves.filter(id => id !== hoveredBlock.id) : [...moves, hoveredBlock.id];
            const newOnIds = updateOnIds(onIds, hoveredBlock.toggleIds);

            if (gameMode === 'PLAYING' && newOnIds.length === 0) {
              set({ gameMode: 'LEVEL_COMPLETED', hoveredIds: [] });
            }

            set({ moves: newMoves, onIds: newOnIds, moveCount: moveCount + 1 });
          }
          if (toggleMode === 'TOGGLE_BLOCK_TYPE') {
            const blockType = hoveredBlock.blockType;
            const newBlockType = nextBlockType(blockType);

            const updatedBlocks = blocks.map(block => ({
              ...block, 
              blockType: (block.id === hoveredBlock.id ? newBlockType : block.blockType), 
            }));

            set({ 
              onIds: [],
              blocks: updatedBlocks,
              moves: [],
              idToBlock: populateIdToBlock(updatedBlocks)
            });            
          }

          if (gameMode === 'EDITING') {
            get().updateUnsavedChanges();
          }
        },

        setActivePlane: (activePlane) => set(() => ({ activePlane })),

        setColors: (colors: Colors) => set(() => ({ colors: {...colors} })),

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

        editLevelName: (levelName: string) => {
          set({ levelName });
          get().updateUnsavedChanges();
        },

        editGridSize: (gridSize: number) => {
          const levelBlocks: LevelBlock[] = initLevelBlocks(gridSize);
          const blocks: BlockInfo[] = levelBlocksToBlocks(levelBlocks);

          set({ 
            onIds: [],
            blocks,
            moves: [],
            idToBlock: populateIdToBlock(blocks)
          });
          get().updateUnsavedChanges();
        },

        editFill: (blockType: BlockType) => {
          const { blocks, toggleMode } = get();
          const gridSize = Math.round(Math.pow(blocks.length, 1 / 3));
          const updatedBlocks = blocks.map(block => ({
            ...block, 
            blockType: block.blockType === 'EMPTY' ? 'EMPTY' : blockType,
            toggleIds: calcToggleIds(blockType, block.id, toggleMode, gridSize), 
            on: false
          }));

          set({ 
            onIds: [],
            blocks: updatedBlocks,
            moves: [],
            idToBlock: populateIdToBlock(updatedBlocks)
          });
          get().updateUnsavedChanges();
        },

        editReset: () => {
          set({ onIds: [], moves: [] });
          get().updateUnsavedChanges();
        },

        editDelete: () => {
          const { editingLevelId, customLevels, showLevels } = get();
          const newCustomLevels = customLevels.filter(level => level.id !== editingLevelId);
          set({ customLevels: newCustomLevels, editingLevelId: '' });
          showLevels('CUSTOM');
        },

        editSave: () => {
          const { editingLevelId, levelName, blocks, moves, customLevels } = get();
          outputLevelToConsole(editingLevelId, levelName, blocks, moves);

          const saveLevel: Level = {
            id: editingLevelId,
            name: levelName, 
            blocks: blocks.map(block => toLevelBlock(block.blockType)), 
            moves 
          };

          let levelIndex = customLevels.findIndex(level => level.id === editingLevelId);
          if (levelIndex === -1) {
            // Save new level
            set({ customLevels: [saveLevel, ...customLevels] });
            levelIndex = 0;
          } else {
            // Update existing level
            customLevels[levelIndex] = saveLevel;
            set({ customLevels: [...customLevels] });
          }

          set({ 
            currentLevel: saveLevel,
            levelIndex
          });
          get().updateUnsavedChanges();
        },

        editPlay: () => set(({ levelIndex, playLevel }) => {
          playLevel(levelIndex, 'CUSTOM');
          return { editingLevelId: '' };
        }),

        setToastMessage: (toastMessage: ToastMessage) => set(() => ({ toastMessage })),

        updateUnsavedChanges: () => {
          const { currentLevel, levelName, blocks, moves } = get();

          const levelBlocks = blocks.map(block => toLevelBlock(block.blockType))

          const unsavedChanges = !(
              currentLevel.name === levelName &&
              arraysAreEqual(currentLevel.blocks, levelBlocks) &&
              arraysAreEqual(currentLevel.moves, moves)
          );

          set({ unsavedChanges });
        }
      }
    },
    {
      name: 'bloctrix',
      partialize: (state) => ({ 
        customLevels: state.customLevels
      }),
      storage: createJSONStorage(() => customLzStorage)
    }
  )
);
