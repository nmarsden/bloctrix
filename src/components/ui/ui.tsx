import { useCallback } from 'react';
import { GlobalState, LevelType, Level, useGlobalStore } from '../../stores/useGlobalStore';
import './ui.css';
import Toast from '../toast/toast';

export default function Ui() {
  const gameMode = useGlobalStore((state: GlobalState) => state.gameMode);
  const levelType = useGlobalStore((state: GlobalState) => state.levelType);
  const currentLevel = useGlobalStore((state: GlobalState) => state.currentLevel);
  const moveCount = useGlobalStore((state: GlobalState) => state.moveCount);
  const levelName = useGlobalStore((state: GlobalState) => state.levelName);
  const levels = useGlobalStore((state: GlobalState) => state.levels);
  const showLevels = useGlobalStore((state: GlobalState) => state.showLevels);
  const newLevel = useGlobalStore((state: GlobalState) => state.newLevel);
  const editLevel = useGlobalStore((state: GlobalState) => state.editLevel);
  const playLevel = useGlobalStore((state: GlobalState) => state.playLevel);
  const showMainMenu = useGlobalStore((state: GlobalState) => state.showMainMenu);

  const onSelectLevelType = useCallback((levelType: LevelType) => {
    return () => showLevels(levelType);
  }, []);

  const onSelectNewLevel = useCallback(() => {
    newLevel();
  }, []);

  const onSelectLevel = useCallback((level: Level) => {
    return () => playLevel(level, levelType);
  }, [levelType]);

  const onEditLevel = useCallback((level: Level) => {
    return () => editLevel(level);
  }, []);

  const onSelectBack = useCallback(() => {
    showMainMenu();
  }, []);

  const onSelectReset = useCallback(() => {
    playLevel(currentLevel, levelType);
  }, [currentLevel, levelType]);

  const onSelectQuit = useCallback(() => {
    showLevels(levelType);
  }, [levelType]);
  
  return (
    <>
      {/* MAIN MENU */}
      {gameMode === 'MAIN_MENU' ? (
        <div className={'overlay show'}>
          <div className="overlayHeading">BLOCTRIX</div>
          <div className="subHeading">Levels</div>
          <div className="buttonGroup buttonGroup-column">
            <div className="button-light" onClick={onSelectLevelType('EASY')}>EASY</div>
            <div className="button-light" onClick={onSelectLevelType('MEDIUM')}>MEDIUM</div>
            <div className="button-light" onClick={onSelectLevelType('HARD')}>HARD</div>
            <div className="button-light" onClick={onSelectLevelType('CUSTOM')}>CUSTOM</div>
          </div>
          <div className="subHeading">Options</div>
          <div className="buttonGroup">
            <div className="button-light">SFX</div>
            <div className="button-light">MUSIC</div>
          </div>
        </div>
      ) : null}

      {/* LEVEL MENU */}
      {gameMode === 'LEVEL_MENU' ? (
        <div className={'overlay show'}>
          <div className="hudHeader">
            <div className="button-light button-icon" onClick={onSelectBack} title="Back"><i className="fa-solid fa-left-long"></i></div>
            <div className="subHeading">
              <div>{levelType}</div>
              <div>LEVELS</div>
            </div>
            <div 
              className={`button-light ${levelType === 'CUSTOM' ? 'button-icon' : 'button-icon-hidden'}`} 
              onClick={onSelectNewLevel} 
              title="New Level"
            >
              <i className="fa-solid fa-plus"></i>
            </div>
          </div>
          <div className="hudMain">
            <div className="buttonGroup buttonGroup-column">
              {levels.map((level, index) => (
                <div className="button-light button-level" key={`level-${index}`} onClick={onSelectLevel(level)}>{level.name}</div>
              ))}
            </div>
          </div>
          <div className="hudFooter levelMenuFooter"></div>
        </div>
      ) : null}

      {/* PLAYING */}
      {gameMode === 'PLAYING' ? (
        <div className={`hud ${gameMode === 'PLAYING' ? 'show' : 'hide'}`}>
          <div className="hudHeader">
            <div className="button-dark" onClick={onSelectQuit} title="Back"><i className="fa-solid fa-left-long"></i></div>
            <div className="subHeading">
              <div>{levelType}</div>
              <div className="levelName">{levelName}</div>
            </div>
            <div 
              className={`button-dark ${levelType === 'CUSTOM' ? 'button-icon' : 'button-icon-hidden'}`}
              onClick={onEditLevel(currentLevel)} 
              title="Edit">
                <i className="fa-solid fa-pen"></i>
            </div>    
          </div>
          <div className="hudMain"></div>
          <div className="hudFooter">
            <div>Moves: {moveCount}</div>
            <div className="buttonGroup">
              <div className="button-dark" onClick={onSelectReset} title="Reset"><i className="fa-solid fa-rotate"></i></div>
            </div>
          </div>
        </div>
      ) : null}

      {/* TOAST */}
      <Toast />
    </>
  )
}