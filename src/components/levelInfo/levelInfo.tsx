import { useMemo } from 'react';
import { CompletedStatus, GlobalState, useGlobalStore } from '../../stores/useGlobalStore';
import './levelInfo.css';

export default function LevelInfo() {
  const levelType = useGlobalStore((state: GlobalState) => state.levelType);
  const levelIndex = useGlobalStore((state: GlobalState) => state.levelIndex);
  const currentLevel = useGlobalStore((state: GlobalState) => state.currentLevel);
  const levels = useGlobalStore((state: GlobalState) => state.levels);
  const levelToBestNumMoves = useGlobalStore((state: GlobalState) => state.levelToBestNumMoves);

  const completedStatus = useMemo(() => {
    const bestNumMoves = levelToBestNumMoves[currentLevel.id] || 0;
    let currentLevelCompletedStatus: CompletedStatus = 'COMPLETED_BEST';
    if (bestNumMoves === 0) {
      currentLevelCompletedStatus = 'NOT_COMPLETED';
    }
    if (bestNumMoves > currentLevel.moves.length) {
      currentLevelCompletedStatus = 'COMPLETED';
    }
    return currentLevelCompletedStatus;

  }, [levelToBestNumMoves, currentLevel]);

  return (
    <div className="subHeading">
        <div className="levelInfo-levelName">{currentLevel.name}</div>
        <div className="levelInfo-subHeading">
          <div className={`levelInfo-completedStatus ${completedStatus}`}><i className="fa-solid fa-square-check"></i></div>
          <div className="levelInfo-levelType">{levelType} {levelIndex + 1} of {levels.length}</div>
        </div>
    </div>
  )
}