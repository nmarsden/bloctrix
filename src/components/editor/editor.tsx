import { button, useControls } from "leva";
import { useCallback } from "react";
import { BlockInfo, BlockType, GlobalState, GRID_SIZE_IN_BLOCKS, toLevelBlock, useGlobalStore } from "../../stores/useGlobalStore";
import "./editor.css";

export default function Editor (){
  const editMode = useGlobalStore((state: GlobalState) => state.editMode);
  const toggleEditMode = useGlobalStore((state: GlobalState) => state.toggleEditMode);
  const blocks = useGlobalStore((state: GlobalState) => state.blocks);
  const onIds = useGlobalStore((state: GlobalState) => state.onIds);
  const editFill = useGlobalStore((state: GlobalState) => state.editFill);
  const editReset = useGlobalStore((state: GlobalState) => state.editReset);

  useControls(
    'Editor',
    {
      [editMode ? "enabled": "disabled"]: button(() => toggleEditMode()),
    },
    {
      collapsed: true
    },
    [editMode]
  );

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
    //     'O', 'x', 'O',  // back   - left, center, right
    //     'O', 'O', 'O',  // middle
    //     'o', 'X', 'O',  // front
    //   ],
    //   // middle layer
    //   [
    //     'O', 'o', 'O',
    //     'O', 'O', 'O',
    //     'O', 'X', 'O',
    //   ],
    //   // bottom layer
    //   [
    //     'O', 'o', 'O',
    //     'O', 'O', 'O',
    //     'O', 'X', 'O',
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

  return (
    <>
      {editMode ? 
        <div className="editor-container">
          <div>
            <div>Fill with block type:</div>
            <div className="button-light" onClick={onFillClicked('ALL')}>all</div>
            <div className="button-light" onClick={onFillClicked('NEIGHBOURS')}>neighbours</div>
            <div className="button-light" onClick={onFillClicked('NONE')}>none</div>
          </div>
          <div className="button-light" onClick={onResetClicked}>Reset</div>
          <div className="button-light" onClick={onSaveClicked}>Save</div>
        </div>
        : null}
    </>
  )
}