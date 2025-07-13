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

export const GRID_SIZE_IN_BLOCKS = 5;
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

// -------------------
// --- GlobalState ---
// -------------------

export type GlobalState = {
  playing: boolean;
  blocks: BlockInfo[];
  hoveredIds: string[];
  activePlane: number;

  play: () => void;
  blockHovered: (id: string, isHovered: boolean) => void;
  setActivePlane: (activePlane: number) => void;
};

export const useGlobalStore = create<GlobalState>()(
  persist(  
    (set) => {
      return {
        playing: true,
        blocks: BLOCKS,
        hoveredIds: [],
        activePlane: 2,

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

        setActivePlane: (activePlane) => set(() => ({ activePlane }))
      }
    },
    {
      name: 'voxel-void',
      partialize: () => ({ 
      }),
    }
  )
);
