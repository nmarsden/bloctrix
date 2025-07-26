import { button, useControls } from "leva";
import { ChangeEvent, useCallback, useEffect } from "react";
import { BlockType, GlobalState, ToggleMode, useGlobalStore } from "../../stores/useGlobalStore";
import "./editor.css";

export default function Editor (){
  const showEditor = useGlobalStore((state: GlobalState) => state.showEditor);
  const toggleMode = useGlobalStore((state: GlobalState) => state.toggleMode);
  const toggleShowEditor = useGlobalStore((state: GlobalState) => state.toggleShowEditor);
  const levelName = useGlobalStore((state: GlobalState) => state.levelName);
  const editLevelName = useGlobalStore((state: GlobalState) => state.editLevelName);
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

  const onLevelNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    editLevelName(event.target.value);
  }, []);

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
          <div className="editor-heading">Editor Tools</div>
          <div>Level Name:</div>
          <input 
            className="editor-nameInput"
            type="text"
            value={levelName}
            onChange={onLevelNameChange}
            onKeyDown={event => event.stopPropagation()}
            maxLength={20}
          />
          <div className="editor-buttonGroup">
            <div className="button-dark" onClick={onSaveClicked}>Save</div>
          </div>

          <div>
            <div>Toggle Mode</div>
            <div className="editor-buttonGroup">
              <div className={`button-dark button-tab ${toggleMode === 'TOGGLE_BLOCK_TYPE' ? 'button-selected' : 'button-not-selected'}`} onClick={onToggleModeClicked('TOGGLE_BLOCK_TYPE')}>BLOCK TYPE</div>
              <div className={`button-dark button-tab ${toggleMode === 'TOGGLE_ON' ? 'button-selected' : 'button-not-selected'}`} onClick={onToggleModeClicked('TOGGLE_ON')}>ON / OFF</div>
            </div>
          </div>

          {toggleMode === 'TOGGLE_BLOCK_TYPE' ? (
            <>
              <div className="editor-instructions">Choose a grid size. Use the fill options to change all block types. Click an individual block to change its block type.</div>
              <div>Grid size:</div>
              <div className="editor-buttonGroup">
                <div className="button-dark" onClick={onGridSizeClicked(3)}>3</div>
                <div className="button-dark" onClick={onGridSizeClicked(4)}>4</div>
                <div className="button-dark" onClick={onGridSizeClicked(5)}>5</div>
              </div>
              <div>Fill with block type:</div>
              <div className="editor-buttonGroup">
                <div className="button-dark editor-all-button" onClick={onFillClicked('ALL')}></div>
                <div className="button-dark editor-edges-and-corners-button" onClick={onFillClicked('EDGES_AND_CORNERS')}></div>
                <div className="button-dark editor-self-and-edges-button" onClick={onFillClicked('SELF_AND_EDGES')}></div>
                <div className="button-dark editor-edges-button" onClick={onFillClicked('EDGES')}></div>
                <div className="button-dark editor-self-and-corners-button" onClick={onFillClicked('SELF_AND_CORNERS')}></div>
                <div className="button-dark editor-corners-button" onClick={onFillClicked('CORNERS')}></div>
                <div className="button-dark editor-none-button" onClick={onFillClicked('NONE')}></div>
              </div>
            </>
          ) : (
            <>
              <div className="editor-instructions">Click a block to toggle on/off according to block type. Choose 'Reset' to toggle all to off.</div>
              <div className="editor-buttonGroup">
                <div className="button-dark" onClick={onResetClicked}>Reset</div>
              </div>
            </>
          )}
        </div>
        : null}
    </>
  )
}