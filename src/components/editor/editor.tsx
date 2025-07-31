import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { BlockType, GlobalState, ToggleMode, useGlobalStore } from "../../stores/useGlobalStore";
import "./editor.css";

export default function Editor (){
  const [showSizeEditor, setShowSizeEditor] = useState(false);
  const [showFillEditor, setShowFillEditor] = useState(false);
  
  const gameMode = useGlobalStore((state: GlobalState) => state.gameMode);
  const toggleMode = useGlobalStore((state: GlobalState) => state.toggleMode);
  const levelName = useGlobalStore((state: GlobalState) => state.levelName);
  const editLevelName = useGlobalStore((state: GlobalState) => state.editLevelName);
  const editGridSize = useGlobalStore((state: GlobalState) => state.editGridSize);
  const editFill = useGlobalStore((state: GlobalState) => state.editFill);
  const editReset = useGlobalStore((state: GlobalState) => state.editReset);
  const editSave = useGlobalStore((state: GlobalState) => state.editSave);
  const editBack = useGlobalStore((state: GlobalState) => state.editBack);
  const setToggleMode = useGlobalStore((state: GlobalState) => state.setToggleMode);

  const onLevelNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    editLevelName(event.target.value);
  }, []);

  const onToggleModeClicked = useCallback((toggleMode: ToggleMode) => {
    return () => setToggleMode(toggleMode);
  }, [toggleMode]);

  const onOpenSizeEditorClicked = useCallback(() => {
    setShowSizeEditor(true);
  }, []);

  const onCloseSizeEditorClicked = useCallback(() => {
    setShowSizeEditor(false);
  }, []);

  const onGridSizeClicked = useCallback((gridSize: number) => {
    return () => editGridSize(gridSize);
  }, []);

  const onOpenFillEditorClicked = useCallback(() => {
    setShowFillEditor(true);
  }, []);

  const onCloseFillEditorClicked = useCallback(() => {
    setShowFillEditor(false);
  }, []);

  const onFillClicked = useCallback((blockType: BlockType) => {
    return () => editFill(blockType);
  }, []);

  const onResetClicked = useCallback(() => {
    editReset();
  }, []);

  const onHelpClicked = useCallback(() => {
    // TODO show editor help
  }, []);

  const onSaveClicked = useCallback(() => {
    editSave();
  }, []);

  const onBackClicked = useCallback(() => {
    editBack();
  }, []);

  useEffect(() => {
    if (gameMode === 'EDITING') {
      setToggleMode('TOGGLE_BLOCK_TYPE');
    } else {
      setToggleMode('TOGGLE_ON');
    }
  }, [gameMode]);
  
  return (
    <>
      {gameMode === 'EDITING' ? 
        <div className="hud">
        <div className="hudHeader">
          <div className="editor-buttonGroup">
            <div className="button-dark" onClick={onBackClicked} title="Back"><i className="fa-solid fa-left-long"></i></div>
            <div className="button-dark" onClick={onHelpClicked} title="Help"><i className="fa-solid fa-question"></i></div>
            <div className="button-dark" onClick={onSaveClicked} title="Save"><i className="fa-solid fa-floppy-disk"></i></div>
          </div>
          <input 
            className="editor-nameInput"
            type="text"
            value={levelName}
            onChange={onLevelNameChange}
            onKeyDown={event => event.stopPropagation()}
            maxLength={15}
          />
        </div>          
        <div className="hudMain"></div>
        <div className="hudFooter"></div>        
          <div>
            <div className="editor-buttonGroup">
              <div className={`button-dark button-tab ${toggleMode === 'TOGGLE_BLOCK_TYPE' ? 'button-selected' : 'button-not-selected'}`} onClick={onToggleModeClicked('TOGGLE_BLOCK_TYPE')}>BLOCKS</div>
              <div className={`button-dark button-tab ${toggleMode === 'TOGGLE_ON' ? 'button-selected' : 'button-not-selected'}`} onClick={onToggleModeClicked('TOGGLE_ON')}>MOVES</div>
            </div>
          </div>

          {toggleMode === 'TOGGLE_BLOCK_TYPE' ? (
            <>
              <div className="editor-buttonGroup">
                {/* <div className="editor-instructions">Choose a grid size. Use the fill options to change all block types. Click an individual block to change its block type.</div> */}
                <div className="button-dark" onClick={onOpenSizeEditorClicked}>Size</div>

                <div className={`editor-modal ${showSizeEditor ? 'show': ''}`}>
                  <div className="editor-modal-close-button" onClick={onCloseSizeEditorClicked}>
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                  <div className="editor-modal-header">Size</div>
                  <div className="editor-buttonGroup">
                    <div className="button-dark" onClick={onGridSizeClicked(3)}>3</div>
                    <div className="button-dark" onClick={onGridSizeClicked(4)}>4</div>
                    <div className="button-dark" onClick={onGridSizeClicked(5)}>5</div>
                  </div>
                </div>

                <div className="button-dark" onClick={onOpenFillEditorClicked}>Fill</div>

                <div className={`editor-modal ${showFillEditor ? 'show': ''}`}>
                  <div className="editor-modal-close-button" onClick={onCloseFillEditorClicked}>
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                  <div className="editor-modal-header">Fill</div>
                  <div className="editor-buttonGroup">
                    <div className="button-dark editor-all-button" onClick={onFillClicked('ALL')}></div>
                    <div className="button-dark editor-self-and-edges-button" onClick={onFillClicked('SELF_AND_EDGES')}></div>
                    <div className="button-dark editor-self-and-corners-button" onClick={onFillClicked('SELF_AND_CORNERS')}></div>
                  </div>
                  <div className="editor-buttonGroup">
                    <div className="button-dark editor-edges-and-corners-button" onClick={onFillClicked('EDGES_AND_CORNERS')}></div>
                    <div className="button-dark editor-edges-button" onClick={onFillClicked('EDGES')}></div>
                    <div className="button-dark editor-corners-button" onClick={onFillClicked('CORNERS')}></div>
                    <div className="button-dark editor-none-button" onClick={onFillClicked('NONE')}></div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* <div className="editor-instructions">Click a block to toggle on/off according to block type. Choose 'Reset' to toggle all to off.</div> */}
              <div className="editor-buttonGroup">
                <div className="button-dark" onClick={onResetClicked} title="Reset"><i className="fa-solid fa-rotate"></i></div>
              </div>
            </>
          )}
        </div>
        : null}
    </>
  )
}