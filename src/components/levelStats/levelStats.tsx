import { useMemo } from 'react';
import { GlobalState, LevelType, useGlobalStore } from '../../stores/useGlobalStore';
import './levelStats.css';

export default function LevelStats({ levelType }: { levelType: LevelType }) {

  const levelToBestNumMoves = useGlobalStore((state: GlobalState) => state.levelToBestNumMoves);
  const getCompletedStats = useGlobalStore((state: GlobalState) => state.getCompletedStats);
  
  const { slice1, slice2, slice3 } = useMemo(() => {
    const completedStats = getCompletedStats(levelType);

    const totalLevels = completedStats.notCompleted + completedStats.completed + completedStats.completedBest;
    if (totalLevels === 0) {
      return { slice1: '0%', slice2: '0%', slice3: '100%', totalCompletedPercentage: '0%' };
    }

    const slice1 = Math.floor(completedStats.completedBest * 100 / totalLevels)  + '%';
    const slice2 = Math.floor(completedStats.completed * 100 / totalLevels) + '%';
    const slice3 = Math.floor(completedStats.notCompleted * 100 / totalLevels) + '%';

    return { 
      slice1, 
      slice2, 
      slice3
    };

  }, [levelToBestNumMoves]);

  return (
    <div className="levelStats">
      <div className={`levelStats-completedBestPercentage ${slice1 === '0%' ? 'zero' : ''}`}>{slice1}</div>
      <div 
        className="levelStats-pieChart" 
        style={{
          '--slice-1': slice1,
          '--slice-2': slice2,
          '--slice-3': slice3,
        } as React.CSSProperties}>
      </div>
    </div>
  )
}