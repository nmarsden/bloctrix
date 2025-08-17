import { useCallback, useEffect, useState } from 'react';
import { GlobalState, LevelType, useGlobalStore } from '../../stores/useGlobalStore';
import { Level } from '../../stores/levelData';
import './ui.css';
import Toast from '../toast/toast';
import { Sounds } from '../../utils/sounds';
import LevelStats from '../levelStats/levelStats';
import LevelInfo from '../levelInfo/levelInfo';

export default function Ui() {
  const gameMode = useGlobalStore((state: GlobalState) => state.gameMode);
  const levelType = useGlobalStore((state: GlobalState) => state.levelType);
  const levelIndex = useGlobalStore((state: GlobalState) => state.levelIndex);
  const currentLevel = useGlobalStore((state: GlobalState) => state.currentLevel);
  const moveCount = useGlobalStore((state: GlobalState) => state.moveCount);
  const levels = useGlobalStore((state: GlobalState) => state.levels);
  const musicOn = useGlobalStore((state: GlobalState) => state.musicOn);
  const soundFXOn = useGlobalStore((state: GlobalState) => state.soundFXOn);
  const toggleMusic = useGlobalStore((state: GlobalState) => state.toggleMusic);
  const toggleSoundFx = useGlobalStore((state: GlobalState) => state.toggleSoundFx);

  const showLevels = useGlobalStore((state: GlobalState) => state.showLevels);
  const newLevel = useGlobalStore((state: GlobalState) => state.newLevel);
  const editLevel = useGlobalStore((state: GlobalState) => state.editLevel);
  const playLevel = useGlobalStore((state: GlobalState) => state.playLevel);
  const playNextLevel = useGlobalStore((state: GlobalState) => state.playNextLevel);
  const showMainMenu = useGlobalStore((state: GlobalState) => state.showMainMenu);
  const showPreviousLevel = useGlobalStore((state: GlobalState) => state.showPreviousLevel);
  const showNextLevel = useGlobalStore((state: GlobalState) => state.showNextLevel);

  const [showLevelCompletedModal, setShowLevelCompletedModal] = useState(false);

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
    setShowLevelCompletedModal(false);
    showMainMenu();
  }, []);

  const isSelectPreviousLevel = useCallback(() => {
    return levelIndex > 0;
  }, [levelIndex]);

  const onSelectPreviousLevel = useCallback(() => {
    showPreviousLevel();
  }, []);

  const isSelectNextLevel = useCallback(() => {
    return levelIndex < levels.length - 1;
  }, [levelIndex, levels]);

  const onSelectNextLevel = useCallback(() => {
    showNextLevel();
  }, []);

  const onSelectReset = useCallback(() => {
    setShowLevelCompletedModal(false);
    playLevel(levelIndex, levelType);
  }, [levelIndex, levelType]);

  const onSelectNext = useCallback(() => {
    setShowLevelCompletedModal(false);
    playNextLevel();
  }, []);

  const onSelectQuit = useCallback(() => {
    showLevels(levelType);
  }, [levelType]);
  
  useEffect(() => {
    if (gameMode === 'LEVEL_COMPLETED') {
      setTimeout(() => setShowLevelCompletedModal(true), 500);
    }
  }, [gameMode]);

  useEffect(() => {
    if (musicOn) {
      Sounds.getInstance().enableMusic();
    } else {
      Sounds.getInstance().disableMusic();
    }
  }, [musicOn]);

  useEffect(() => {
    if (soundFXOn) {
      Sounds.getInstance().enableSoundFX();
    } else {
      Sounds.getInstance().disableSoundFX();
    }
  }, [soundFXOn]);

  return (
    <>
      {/* MAIN MENU */}
      {gameMode === 'MAIN_MENU' ? (
        <div className={'overlay show'}>
          <div className="overlayHeading">BLOCTRIX</div>
          <div className="subHeading">Levels</div>
          <div className="buttonGroup buttonGroup-column">
            <div className="button-light button-level" onClick={onSelectLevelType('EASY')}>
              <div>EASY</div>
              <div className="levelStatsContainer">
                <LevelStats levelType='EASY' />
              </div>
            </div>
            <div className="button-light button-level" onClick={onSelectLevelType('MEDIUM')}>
              <div>MEDIUM</div>
              <div className="levelStatsContainer">
                <LevelStats levelType='MEDIUM' />
              </div>
            </div>
            <div className="button-light button-level" onClick={onSelectLevelType('HARD')}>
              <div>HARD</div>
              <div className="levelStatsContainer">
                <LevelStats levelType='HARD' />
              </div>
            </div>
            <div className="button-light button-level" onClick={onSelectLevelType('CUSTOM')}>
              <div>CUSTOM</div>
              <div className="levelStatsContainer">
                <LevelStats levelType='CUSTOM' />
              </div>
            </div>
          </div>
          <div className="subHeading">Options</div>
          <div className="buttonGroup">
            <div className="button-light button-toggle" onClick={() => toggleMusic()}>
              <span>MUSIC</span>
              <span>{musicOn ? 'ON' : 'OFF'}</span>
            </div>
            <div className="button-light button-toggle" onClick={() => toggleSoundFx()}>
              <span>SFX</span>
              <span>{soundFXOn ? 'ON' : 'OFF'}</span>
            </div>
          </div>
        </div>
      ) : null}

      {/* LEVEL MENU */}
      {gameMode === 'LEVEL_MENU' ? (
        <div className={'hud show'}>
          <div className="hudHeader">
            {levels.length > 0 ? (
              <LevelInfo />
            ) : null}
          </div>
          <div className="hudMain">
            {levels.length > 0 ? (
              <div className="button-light levelMenuPlayButton" onClick={onSelectLevel(levelIndex)}>
                <i className="fa-solid fa-play"></i>
              </div>
            ) : (
              <div className="noLevelsMessage">
                <div>No custom levels yet.</div>
                <div>Press <i className="fa-solid fa-plus"></i> to add a level.</div>
              </div>
            )}
          </div>
          <div className="hudFooter">
              {levels.length === 0 ? (
                // -- NO LEVELS --
                <div className="buttonGroup">
                  <div className="button-dark" onClick={onSelectMenu} title="Back"><i className="fa-solid fa-bars"></i></div>
                  <div 
                    className="button-dark button-icon" 
                    onClick={onSelectNewLevel} 
                    title="New Level"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </div>
                </div>
              ) : (
                // -- HAVE LEVELS --
                <div className="buttonGroup">
                  <div className="button-dark" onClick={onSelectMenu} title="Back"><i className="fa-solid fa-bars"></i></div>
                  <div 
                      className={`button-dark ${levelType === 'CUSTOM' ? 'button-icon' : 'button-icon-hidden'}`} 
                      onClick={onSelectNewLevel} 
                      title="New Level"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </div>
                  <div 
                    className={`button-dark ${(levelType === 'CUSTOM') ? 'button-icon' : 'button-icon-hidden'}`}
                    onClick={onEditLevel(currentLevel)} 
                    title="Edit">
                      <i className="fa-solid fa-pen"></i>
                  </div>    
                  <div 
                    className={`button-dark ${isSelectPreviousLevel() ? '' : 'button-disabled'}`} 
                    onClick={onSelectPreviousLevel}
                  >
                    <i className="fa-solid fa-chevron-left"></i>
                  </div>
                  <div 
                    className={`button-dark ${isSelectNextLevel() ? '' : 'button-disabled'}`} 
                    onClick={onSelectNextLevel}
                  >
                      <i className="fa-solid fa-chevron-right"></i>
                  </div>              
                </div>
              )}
          </div>
        </div>
      ) : null}

      {/* PLAYING or LEVEL_COMPLETED */}
      {(gameMode === 'PLAYING' || gameMode === 'LEVEL_COMPLETED') ? (
        <div className="hud show">
          <div className="hudHeader">
            <LevelInfo />
          </div>
          <div className="hudMain"></div>
          <div className="hudFooter">
            <div className="buttonGroup">
              <div 
                className={`button-dark ${gameMode === 'LEVEL_COMPLETED' ? 'button-hidden' : ''}`} 
                onClick={onSelectQuit} 
                title="Back"
              >
                <i className="fa-solid fa-left-long"></i>
              </div>
              <div className="moves">Moves: {moveCount}</div>
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
          <div className={`editor-modal ${showLevelCompletedModal ? 'show': ''}`}>
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
                  <i className="fa-solid fa-chevron-right"></i>
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