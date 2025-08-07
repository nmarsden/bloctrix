import { useCallback } from 'react';
import { GlobalState, LevelType, useGlobalStore } from '../../stores/useGlobalStore';
import { Level } from '../../stores/levelData';
import './ui.css';
import Toast from '../toast/toast';

export default function Ui() {
  const gameMode = useGlobalStore((state: GlobalState) => state.gameMode);
  const levelType = useGlobalStore((state: GlobalState) => state.levelType);
  const levelIndex = useGlobalStore((state: GlobalState) => state.levelIndex);
  const currentLevel = useGlobalStore((state: GlobalState) => state.currentLevel);
  const moveCount = useGlobalStore((state: GlobalState) => state.moveCount);
  const levelName = useGlobalStore((state: GlobalState) => state.levelName);
  const levels = useGlobalStore((state: GlobalState) => state.levels);
  const showLevels = useGlobalStore((state: GlobalState) => state.showLevels);
  const newLevel = useGlobalStore((state: GlobalState) => state.newLevel);
  const editLevel = useGlobalStore((state: GlobalState) => state.editLevel);
  const playLevel = useGlobalStore((state: GlobalState) => state.playLevel);
  const playNextLevel = useGlobalStore((state: GlobalState) => state.playNextLevel);
  const showMainMenu = useGlobalStore((state: GlobalState) => state.showMainMenu);

  const onSelectLevelType = useCallback((levelType: LevelType) => {
    return () => showLevels(levelType);
  }, []);

  const onSelectNewLevel = useCallback(() => {
    newLevel();
  }, []);

  const onSelectLevel = useCallback((levelIndex: number) => {
    return () => playLevel(levelIndex, levelType);
  }, [levelType]);

  const onEditLevel = useCallback((level: Level) => {
    return () => editLevel(level);
  }, []);

  const onSelectMenu = useCallback(() => {
    showMainMenu();
  }, []);

  const onSelectReset = useCallback(() => {
    playLevel(levelIndex, levelType);
  }, [levelIndex, levelType]);

  const onSelectNext = useCallback(() => {
    playNextLevel();
  }, []);

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
            <div className="button-light button-icon" onClick={onSelectMenu} title="Back"><i className="fa-solid fa-bars"></i></div>
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
            <div className="levelMenuContainer">
              {levels.map((level, index) => (
                <div className="button-light button-level" key={`level-${index}`} onClick={onSelectLevel(index)}>{level.name}</div>
              ))}
            </div>
          </div>
          <div className="hudFooter levelMenuFooter"></div>
        </div>
      ) : null}

      {/* PLAYING or LEVEL_COMPLETED */}
      {(gameMode === 'PLAYING' || gameMode === 'LEVEL_COMPLETED') ? (
        <div className="hud show">
          <div className="hudHeader">
            <div 
              className={`button-dark ${gameMode === 'LEVEL_COMPLETED' ? 'button-hidden' : ''}`} 
              onClick={onSelectQuit} 
              title="Back"
            >
              <i className="fa-solid fa-left-long"></i>
            </div>
            <div className="subHeading">
              <div>{levelType}</div>
              <div className="levelName">{levelName}</div>
            </div>
            <div 
              className={`button-dark ${gameMode === 'LEVEL_COMPLETED' || levelType !== 'CUSTOM' ? 'button-icon-hidden' : 'button-icon'}`}
              onClick={onEditLevel(currentLevel)} 
              title="Edit">
                <i className="fa-solid fa-pen"></i>
            </div>    
          </div>
          <div className="hudMain"></div>
          <div className="hudFooter">
            <div>Moves: {moveCount}</div>
            <div className="buttonGroup">
              <div 
                className={`button-dark ${gameMode === 'LEVEL_COMPLETED' ? 'button-hidden' : ''}`} 
                onClick={onSelectReset} 
                title="Reset"
              >
                  <i className="fa-solid fa-rotate"></i>
              </div>
            </div>
          </div>
          {/* LEVEL_COMPLETED Modal */}
          <div className={`editor-modal ${gameMode === 'LEVEL_COMPLETED' ? 'show': ''}`}>
            <div className="editor-modal-header">
              <div className="levelCompleted">Level Completed</div>
            </div>
            <div className="editor-buttonGroup">
              <div className="button-dark button-icon" onClick={onSelectMenu} title="Back">
                <i className="fa-solid fa-bars"></i>
              </div>
              <div className="button-dark" onClick={onSelectReset} title="Reset">
                  <i className="fa-solid fa-rotate"></i>
              </div>
              <div className="button-dark button-icon button-hidden"></div>
              <div className="button-dark" onClick={onSelectNext} title="Next Level">
                  <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          </div>

        </div>
      ) : null}

      {/* TOAST */}
      <Toast />
    </>
  )
}