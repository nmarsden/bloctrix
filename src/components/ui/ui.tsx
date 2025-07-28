import { useCallback } from 'react';
import { GlobalState, LevelType, Level, useGlobalStore } from '../../stores/useGlobalStore';
import './ui.css';

export default function Ui() {
  const playing = useGlobalStore((state: GlobalState) => state.playing);
  const levelType = useGlobalStore((state: GlobalState) => state.levelType);
  const levelName = useGlobalStore((state: GlobalState) => state.levelName);
  const levels = useGlobalStore((state: GlobalState) => state.levels);
  const showLevels = useGlobalStore((state: GlobalState) => state.showLevels);
  const playLevel = useGlobalStore((state: GlobalState) => state.playLevel);
  const showMainMenu = useGlobalStore((state: GlobalState) => state.showMainMenu);

  const onSelectLevelType = useCallback((levelType: LevelType) => {
    return () => showLevels(levelType);
  }, []);

  const onSelectLevel = useCallback((level: Level) => {
    return () => playLevel(level);
  }, []);

  const onSelectQuit = useCallback(() => {
    showMainMenu();
  }, []);
  
  return (
    <>
      {/* MAIN MENUS */}
      <div className={`overlay ${playing ? 'hide' : 'show'}`}>
        {levelType === 'NONE' ? (
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
        ) : (
          <>
            {/* Level Menu */}
            <div className="subHeading">{levelType} LEVELS</div>
            <div className="buttonGroup buttonGroup-column">
              {levels.map((level, index) => (
                <div className="button-light" key={`level-${index}`} onClick={onSelectLevel(level)}>{level.name}</div>
              ))}
              <div className="button-light" onClick={onSelectLevelType('NONE')}>BACK</div>
            </div>
          </>
        )}
      </div>
      {/* HUD */}
      <div className={`hud ${playing ? 'show' : 'hide'}`}>
        <div className="hudHeader">
          <div>{levelType}</div>
          <div>{levelName}</div>
        </div>
        <div className="hudMain"></div>
        <div className="hudFooter">
          <div className="button-dark" onClick={onSelectQuit}>QUIT</div>
        </div>
      </div>
    </>
  )
}