import { button, useControls } from "leva";
import { useCallback, useEffect } from "react";
import { BlockType, GlobalState, ToggleMode, useGlobalStore } from "../../stores/useGlobalStore";
import "./editor.css";

export default function Editor (){
  const showEditor = useGlobalStore((state: GlobalState) => state.showEditor);
  const toggleMode = useGlobalStore((state: GlobalState) => state.toggleMode);
  const toggleShowEditor = useGlobalStore((state: GlobalState) => state.toggleShowEditor);
  const editGridSize = useGlobalStore((state: GlobalState) => state.editGridSize);
  const editFill = useGlobalStore((state: GlobalState) => state.editFill);
  const editReset = useGlobalStore((state: GlobalState) => state.editReset);
  const editSave = useGlobalStore((state: GlobalState) => state.editSave);
  const setToggleMode = useGlobalStore((state: GlobalState) => state.setToggleMode);

  useControls(
    'Editor',
    {
      [showEditor ? "hide": "show"]: button(() => toggleShowEditor()),
    },
    {
      collapsed: true
    },
    [showEditor]
  );

  const onToggleModeClicked = useCallback((toggleMode: ToggleMode) => {
    return () => setToggleMode(toggleMode);
  }, [toggleMode]);

  const onGridSizeClicked = useCallback((gridSize: number) => {
    return () => editGridSize(gridSize);
  }, []);

  const onFillClicked = useCallback((blockType: BlockType) => {
    return () => editFill(blockType);
  }, []);

  const onResetClicked = useCallback(() => {
    editReset();
  }, []);

  const onSaveClicked = useCallback(() => {
    editSave();
  }, []);

  useEffect(() => {
    if (showEditor) {
      setToggleMode('TOGGLE_BLOCK_TYPE');
    } else {
      setToggleMode('TOGGLE_ON');
    }
  }, [showEditor]);
  
  return (
    <>
      {showEditor ? 
        <div className="editor-container">
              <div className="editor-buttonGroup">
                <div className="editor-heading">Editor Tools</div>
                <div>
                  <div>Mode</div>
                  <div className="editor-buttonGroup">
                    <div className={`button-dark button-tab ${toggleMode === 'TOGGLE_BLOCK_TYPE' ? 'button-selected' : 'button-not-selected'}`} onClick={onToggleModeClicked('TOGGLE_BLOCK_TYPE')}>EDIT</div>
                    <div className={`button-dark button-tab ${toggleMode === 'TOGGLE_ON' ? 'button-selected' : 'button-not-selected'}`} onClick={onToggleModeClicked('TOGGLE_ON')}>PLAY</div>
                  </div>
                </div>
              </div>
          {toggleMode === 'TOGGLE_BLOCK_TYPE' ? (
            <>
              <div>Grid size:</div>
              <div className="editor-buttonGroup">
                <div className="button-dark" onClick={onGridSizeClicked(3)}>3x3</div>
                <div className="button-dark" onClick={onGridSizeClicked(4)}>4x4</div>
                <div className="button-dark" onClick={onGridSizeClicked(5)}>5x5</div>
              </div>
              <div>Fill with block type:</div>
              <div className="editor-buttonGroup">
                <div className="button-dark editor-all-button" onClick={onFillClicked('ALL')}></div>
                <div className="button-dark editor-self-and-edges-button" onClick={onFillClicked('SELF_AND_EDGES')}></div>
                <div className="button-dark editor-edges-button" onClick={onFillClicked('EDGES')}></div>
                <div className="button-dark editor-none-button" onClick={onFillClicked('NONE')}></div>
              </div>
              <div className="editor-instructions">Click a block to change its block type or change all blocks using the fill options above</div>
            </>
          ) : (
            <>
              <div className="editor-buttonGroup">
                <div className="button-dark" onClick={onResetClicked}>Reset</div>
                <div className="button-dark" onClick={onSaveClicked}>Save</div>
              </div>
              <div className="editor-instructions">Click blocks to toggle on/off according to block type. Choose 'Reset' to toggle all to off. Choose 'Save' to output the level data to the browser console.</div>
            </>
          )}
        </div>
        : null}
    </>
  )
}