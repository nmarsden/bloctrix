import { useCallback, useState } from 'react';
import { GlobalState, LevelType, Level, useGlobalStore } from '../../stores/useGlobalStore';
import './ui.css';

export default function Ui() {
  const [showToast, setShowToast] = useState(false);
  
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
  const canShare = useGlobalStore((state: GlobalState) => state.canShare);
  const shareCustomLevel = useGlobalStore((state: GlobalState) => state.shareCustomLevel);

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

  const onSelectShare = useCallback(async () => {
    await shareCustomLevel();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
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
                <div className="button-light button-new-level" onClick={onSelectNewLevel}><i className="fa-solid fa-plus"></i></div>
              ) : null}
              {levels.map((level, index) => (
                <div className="buttonGroup">
                  <div className="button-light button-level" key={`level-${index}`} onClick={onSelectLevel(level)}>{level.name}</div>
                  {levelType === 'CUSTOM' ? (
                    <div className="button-light button-edit" onClick={onEditLevel(level)} title="Edit"><i className="fa-solid fa-pen"></i></div>    
                  ) : null}
                </div>
              ))}
              <div className="button-light" onClick={onSelectBack} title="Back"><i className="fa-solid fa-left-long"></i></div>
            </div>
          </>
        ) : null}
      </div>
      {/* HUD */}
      {gameMode === 'PLAYING' ? (
        <div className={`hud ${gameMode === 'PLAYING' ? 'show' : 'hide'}`}>
          <div className="hudHeader">
            <div>{levelType}</div>
            <div>{levelName}{canShare ?<i className="shareLink fa-solid fa-link" onClick={onSelectShare}></i> : null}</div>
          </div>
          <div className="hudMain"></div>
          <div className="hudFooter">
            <div>Moves: {moveCount}</div>
            <div className="buttonGroup">
              <div className="button-dark" onClick={onSelectQuit} title="Back"><i className="fa-solid fa-left-long"></i></div>
              <div className="button-dark" onClick={onSelectReset} title="Reset"><i className="fa-solid fa-rotate"></i></div>
            </div>
          </div>
        </div>
      ) : null}
      {/* TOAST */}
      <div className={`toast ${showToast ? 'show' : ''}`}>Link copied to clipboard!</div>
    </>
  )
}