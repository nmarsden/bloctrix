import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { BlockType, GlobalState, useGlobalStore } from "../../stores/useGlobalStore";
import "./editor.css";

export default function Editor (){
  const [showSizeEditor, setShowSizeEditor] = useState(false);
  const [showFillEditor, setShowFillEditor] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const gameMode = useGlobalStore((state: GlobalState) => state.gameMode);
  const toggleMode = useGlobalStore((state: GlobalState) => state.toggleMode);
  const levelName = useGlobalStore((state: GlobalState) => state.levelName);
  const unsavedChanges = useGlobalStore((state: GlobalState) => state.unsavedChanges);

  const editLevelName = useGlobalStore((state: GlobalState) => state.editLevelName);
  const editGridSize = useGlobalStore((state: GlobalState) => state.editGridSize);
  const editFill = useGlobalStore((state: GlobalState) => state.editFill);
  const editReset = useGlobalStore((state: GlobalState) => state.editReset);
  const editDelete = useGlobalStore((state: GlobalState) => state.editDelete);
  const editSave = useGlobalStore((state: GlobalState) => state.editSave);
  const editPlay = useGlobalStore((state: GlobalState) => state.editPlay);
  const setToggleMode = useGlobalStore((state: GlobalState) => state.setToggleMode);
  const shareCustomLevel = useGlobalStore((state: GlobalState) => state.shareCustomLevel);
  const setToastMessage = useGlobalStore((state: GlobalState) => state.setToastMessage);

  const onLevelNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    editLevelName(event.target.value);
  }, []);

  const onToggleModeClicked = useCallback(() => {
    setToggleMode(toggleMode === 'TOGGLE_BLOCK_TYPE' ? 'TOGGLE_ON' : 'TOGGLE_BLOCK_TYPE');
    setToastMessage(toggleMode === 'TOGGLE_BLOCK_TYPE' ? 'MOVE_MODE' : 'BLOCK_MODE');
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

  const onSaveClicked = useCallback(() => {
    editSave();
    setToastMessage('SAVED');
  }, []);

  const onDeleteClicked = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const onDeleteConfirmClicked = useCallback(() => {
    setShowDeleteConfirm(false);
    editDelete();
    setToastMessage('DELETED');
  }, []);

  const onCloseDeleteConfirmClicked = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  const onShareClicked = useCallback(async () => {
    await shareCustomLevel();
    setToastMessage('SHARE');
  }, []);

  const onPlayClicked = useCallback(() => {
    editPlay();
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
      {gameMode === 'EDITING' ? (
        <div className="hud">
          <div className="hudHeader">
            <div className="subHeading editor-subHeading">
              <div className="editor-buttonGroup">
                <div className="button-dark" onClick={onDeleteClicked} title="Delete"><i className="fa-solid fa-trash-can"></i></div>
                <div className={`button-dark ${unsavedChanges ? 'button-disabled' : ''}`} onClick={onShareClicked} title="Share"><i className="fa-solid fa-link"></i></div>
                <div className="button-dark" onClick={onSaveClicked} title="Save">
                  <i className="fa-solid fa-floppy-disk"></i>
                  {unsavedChanges ? <i className="unsaved-badge"></i> : null}
                </div>
                <div className="button-dark" onClick={onPlayClicked} title="Play"><i className="fa-solid fa-play"></i></div>
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
          </div>          
          <div className="hudMain"></div>
          <div className="hudFooter">
            <div className="editor-buttonGroup">
              {/* SELECT MODE */}
              <div className="editor-editModeLabel">Mode:</div>
              <div className="button-dark" onClick={onToggleModeClicked} title={toggleMode === 'TOGGLE_BLOCK_TYPE' ? "Block" : "Move"}>
                <i className={`fa-solid ${toggleMode === 'TOGGLE_BLOCK_TYPE' ? 'fa-cube' : 'fa-cubes'}`}></i>
              </div>

              <div className="editor-buttonGroup-divider"></div>
              {/* RESIZE */}
              <div className="button-dark" onClick={onOpenSizeEditorClicked} title="Resize"><i className="fa-solid fa-maximize"></i></div>

              <div className={`editor-modal ${showSizeEditor ? 'show': ''}`}>
                <div className="editor-modal-close-button" onClick={onCloseSizeEditorClicked}>
                  <i className="fa-solid fa-xmark"></i>
                </div>
                <div className="editor-modal-header"><i className="fa-solid fa-maximize"></i>&nbsp;Resize</div>
                <div className="editor-buttonGroup">
                  <div className="button-dark" onClick={onGridSizeClicked(3)}>3</div>
                  <div className="button-dark" onClick={onGridSizeClicked(4)}>4</div>
                  <div className="button-dark" onClick={onGridSizeClicked(5)}>5</div>
                </div>
              </div>

              {/* FILL */}
              <div className="button-dark" onClick={onOpenFillEditorClicked} title="Fill"><i className="fa-solid fa-fill-drip"></i></div>

              <div className={`editor-modal ${showFillEditor ? 'show': ''}`}>
                <div className="editor-modal-close-button" onClick={onCloseFillEditorClicked}>
                  <i className="fa-solid fa-xmark"></i>
                </div>
                <div className="editor-modal-header"><i className="fa-solid fa-fill-drip"></i>&nbsp;Fill</div>
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

              {/* RESET MOVES */}
              <div className="button-dark" onClick={onResetClicked} title="Reset Moves"><i className="fa-solid fa-rotate"></i></div>
            </div>
          </div>
        </div>   
        ) : null}

      {/* DELETE CONFIRM */}        
      {showDeleteConfirm ? (
        <div className="editor-modal-delete">
          <div className={`editor-modal ${showDeleteConfirm ? 'show': ''}`}>
            <div className="editor-modal-close-button" onClick={onCloseDeleteConfirmClicked}>
              <i className="fa-solid fa-xmark"></i>
            </div>
            <div className="editor-modal-header"><i className="fa-solid fa-trash-can"></i>&nbsp;Delete Level</div>
            <div>Are you sure?</div>
            <div className="button-dark editor-button-delete" onClick={onDeleteConfirmClicked}>DELETE</div>
          </div>
        </div>
      ) : null}
    </>
  )
}