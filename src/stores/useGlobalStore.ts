import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GlobalState = {
  playing: boolean;

  play: () => void;
};

export const useGlobalStore = create<GlobalState>()(
  persist(  
    (set) => {
      return {
        playing: true,

        play: () => set(() => {
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
