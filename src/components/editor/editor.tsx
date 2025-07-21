import { button, useControls } from "leva";
import { useCallback, useEffect } from "react";
import { BlockInfo, BlockType, GlobalState, GRID_SIZE_IN_BLOCKS, ToggleMode, toLevelBlock, useGlobalStore } from "../../stores/useGlobalStore";
import "./editor.css";

export default function Editor (){
  const showEditor = useGlobalStore((state: GlobalState) => state.showEditor);
  const toggleMode = useGlobalStore((state: GlobalState) => state.toggleMode);
  const toggleShowEditor = useGlobalStore((state: GlobalState) => state.toggleShowEditor);
  const blocks = useGlobalStore((state: GlobalState) => state.blocks);
  const onIds = useGlobalStore((state: GlobalState) => state.onIds);
  const editFill = useGlobalStore((state: GlobalState) => state.editFill);
  const editReset = useGlobalStore((state: GlobalState) => state.editReset);
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

  const onFillClicked = useCallback((blockType: BlockType) => {
    return () => editFill(blockType);
  }, []);

  const onResetClicked = useCallback(() => {
    editReset();
  }, []);

  const onSaveClicked = useCallback(() => {

    // const LEVEL: Level = [
    //   // top layer
    //   [
    //     'p', 'E', 'p',  // back   - left, center, right
    //     'p', 'p', 'p',  // middle
    //     'e', 'P', 'p',  // front
    //   ],
    //   // middle layer
    //   [
    //     'p', 'e', 'p',
    //     'p', 'p', 'p',
    //     'p', 'P', 'p',
    //   ],
    //   // bottom layer
    //   [
    //     'p', 'e', 'p',
    //     'p', 'p', 'p',
    //     'p', 'P', 'p',
    //   ],
    // ];

    const blockChar = (block: BlockInfo): string => {
      const isOn = onIds.includes(block.id);
      const levelBlock = toLevelBlock(block.blockType, isOn);
      return `'${levelBlock}'`
    };

    let output: string[] = [];
    output.push('// Level Data');
    output.push('const LEVEL: Level = [');

    let blockIndex = 0;
    for (let layer=0; layer<GRID_SIZE_IN_BLOCKS; layer++) {
      output.push('  [');
      let rowOutput: string[] = [];
      for (let row=0; row<GRID_SIZE_IN_BLOCKS; row++, blockIndex += GRID_SIZE_IN_BLOCKS) {
        rowOutput.push(blockChar(blocks[blockIndex]));
        rowOutput.push(blockChar(blocks[blockIndex + 1]));
        rowOutput.push(blockChar(blocks[blockIndex + 2]));

        output.push('   ' + rowOutput.join(',') + ',');
        rowOutput = [];
      }
      output.push('  ],');
    }
    output.push('];');

    console.log(output.join('\n'));
  }, [blocks,onIds]);

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