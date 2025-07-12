import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const GRID_SIZE_IN_BLOCKS = 5;
const BLOCK_SIZE = 1;
const BLOCK_GAP = 0.1;
const GRID_WIDTH = ((GRID_SIZE_IN_BLOCKS * BLOCK_SIZE) + ((GRID_SIZE_IN_BLOCKS - 1) * BLOCK_GAP));
const MAX_POS = (GRID_WIDTH - BLOCK_SIZE) * 0.5;
const MIN_POS = -MAX_POS;

const BLOCK_POSITIONS: [number, number, number][] = [];
for (let x = MIN_POS; x <=MAX_POS; x = x + BLOCK_SIZE + BLOCK_GAP) {
  for (let y = MIN_POS; y <=MAX_POS; y = y + BLOCK_SIZE + BLOCK_GAP) {
    for (let z = MIN_POS; z <=MAX_POS; z = z + BLOCK_SIZE + BLOCK_GAP) {
      const xPos = x;
      const yPos = y;
      const zPos = z;
      BLOCK_POSITIONS.push([xPos, yPos, zPos]);
    }
  }
}

type BlockInfo = {
  id: string;
  position: [number, number, number];
};

export type GlobalState = {
  playing: boolean;
  blocks: BlockInfo[];
  hoveredIds: string[];

  play: () => void;
  blockHovered: (id: string, isHovered: boolean) => void;
};

export const useGlobalStore = create<GlobalState>()(
  persist(  
    (set) => {
      return {
        playing: true,
        blocks: BLOCK_POSITIONS.map((position, index) => ({ id: `block-${index}`, position })),
        hoveredIds: [],

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
      }
    },
    {
      name: 'voxel-void',
      partialize: () => ({ 
      }),
    }
  )
);
