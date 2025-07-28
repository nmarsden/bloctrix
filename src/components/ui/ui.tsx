import { useCallback } from 'react';
import { GlobalState, LevelType, Level, useGlobalStore, NEW_LEVEL } from '../../stores/useGlobalStore';
import './ui.css';

export default function Ui() {
  const gameMode = useGlobalStore((state: GlobalState) => state.gameMode);
  const levelType = useGlobalStore((state: GlobalState) => state.levelType);
  const currentLevel = useGlobalStore((state: GlobalState) => state.currentLevel);
  const moveCount = useGlobalStore((state: GlobalState) => state.moveCount);
  const levelName = useGlobalStore((state: GlobalState) => state.levelName);
  const levels = useGlobalStore((state: GlobalState) => state.levels);
  const showLevels = useGlobalStore((state: GlobalState) => state.showLevels);
  const editLevel = useGlobalStore((state: GlobalState) => state.editLevel);
  const playLevel = useGlobalStore((state: GlobalState) => state.playLevel);
  const showMainMenu = useGlobalStore((state: GlobalState) => state.showMainMenu);

  const onSelectLevelType = useCallback((levelType: LevelType) => {
    return () => showLevels(levelType);
  }, []);

  const onSelectNewLevel = useCallback(() => {
    editLevel(NEW_LEVEL);
  }, []);

  const onSelectLevel = useCallback((level: Level) => {
    return () => playLevel(level);
  }, []);

  const onSelectBack = useCallback(() => {
    showMainMenu();
  }, []);

  const onSelectReset = useCallback(() => {
    playLevel(currentLevel);
  }, [currentLevel]);

  const onSelectQuit = useCallback(() => {
    showMainMenu();
  }, []);
  
  return (
    <>
      {/* MAIN MENUS */}
      <div className={`overlay ${gameMode === 'MAIN_MENU' || gameMode === 'LEVEL_MENU' ? 'show': 'hide'}`}>
        {gameMode === 'MAIN_MENU' ? (
          <>
            {/* Main Menu */}
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
          </>
        ) : null}
        {gameMode === 'LEVEL_MENU' ? (
          <>
            {/* Level Menu */}
            <div className="subHeading">{levelType} LEVELS</div>
            <div className="buttonGroup buttonGroup-column">
              {levelType === 'CUSTOM' ? (
                <div className="button-light" onClick={onSelectNewLevel}>NEW</div>
              ) : null}
              {levels.map((level, index) => (
                <div className="button-light" key={`level-${index}`} onClick={onSelectLevel(level)}>{level.name}</div>
              ))}
              <div className="button-light" onClick={onSelectBack}>BACK</div>
            </div>
          </>
        ) : null}
      </div>
      {/* HUD */}
      {gameMode === 'PLAYING' ? (
        <div className={`hud ${gameMode === 'PLAYING' ? 'show' : 'hide'}`}>
          <div className="hudHeader">
            <div>{levelType}</div>
            <div>{levelName}</div>
          </div>
          <div className="hudMain"></div>
          <div className="hudFooter">
            <div>Moves: {moveCount}</div>
            <div className="buttonGroup">
              <div className="button-dark" onClick={onSelectReset}>RESET</div>
              <div className="button-dark" onClick={onSelectQuit}>QUIT</div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}