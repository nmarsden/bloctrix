import { Color } from 'three';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


// --------------
// --- BLOCKS ---
// --------------
export type BlockInfo = {
  id: string;
  position: [number, number, number];
  neighbourIds: string[];
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

const BLOCKS: BlockInfo[] = [];
for (let x = 0; x <GRID_SIZE_IN_BLOCKS; x++) {
  for (let y = 0; y <GRID_SIZE_IN_BLOCKS; y++) {
    for (let z = 0; z <GRID_SIZE_IN_BLOCKS; z++) {
      const xPos = MIN_POS + (x * (BLOCK_SIZE + BLOCK_GAP));
      const yPos = MIN_POS + (y * (BLOCK_SIZE + BLOCK_GAP));
      const zPos = MIN_POS + (z * (BLOCK_SIZE + BLOCK_GAP));
      BLOCKS.push({ 
        id: `block-${x}-${y}-${z}`, 
        position: [xPos, yPos, zPos], 
        neighbourIds: calcBlockNeighbourIds(x, y, z)
      });
    }
  }
}

const getNeighbourBlockIds = (id: string): string[] => {
  const x = parseInt(id.split('-')[1]);
  const y = parseInt(id.split('-')[2]);
  const z = parseInt(id.split('-')[3]);
  return calcBlockNeighbourIds(x, y, z);
}

// -------------------
// --- GlobalState ---
// -------------------

type Colors = {
  blockOn: string;
  blockOff: string;
  blockEdge: Color;
  blockEdgeHover: Color;
  planeTool: string;
  planeSwitchActive: string;
  planeSwitchInactive: string;
  planeSwitchEdge: string;
};

const COLORS: Colors = {
  blockOn: '#e63946',
  blockOff: '#457b9d',
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
  hoveredIds: string[];
  onIds: string[];
  activePlane: number;
  colors: Colors;

  play: () => void;
  blockHovered: (id: string, isHovered: boolean) => void;
  toggleHovered: () => void;
  setActivePlane: (activePlane: number) => void;
  setColors: (colors: Colors) => void;
};

export const useGlobalStore = create<GlobalState>()(
  persist(  
    (set) => {
      return {
        playing: true,
        blocks: BLOCKS,
        hoveredIds: [],
        onIds: [ 'block-0-0-0', 'block-1-1-0' ],
        activePlane: 2,
        colors: COLORS,

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

        toggleHovered: () => set(({ hoveredIds, onIds }) => {
          const idsToToggle = [hoveredIds[0], ...getNeighbourBlockIds(hoveredIds[0])];

          // Toggle off
          const toggleOffIds = onIds.filter(id => idsToToggle.includes(id));
          let newOnIds = onIds.filter(id => !toggleOffIds.includes(id));
          // Toggle on
          const toggleOnIds = idsToToggle.filter(id => !toggleOffIds.includes(id));
          newOnIds = [...newOnIds, ...toggleOnIds];

          return { onIds: newOnIds };
        }),

        setActivePlane: (activePlane) => set(() => ({ activePlane })),

        setColors: (colors: Colors) => set(() => ({ colors: {...colors} }))
      }
    },
    {
      name: 'voxel-void',
      partialize: () => ({ 
      }),
    }
  )
);
