export type LevelBlock = 
    'a'  // toggle all
  | 'o'  // toggle edges & corners
  | 'p'  // toggle self & edges. Note: 'p' is short for plus sign (+) which is the shape of the toggle blocks
  | 'e'  // toggle edges
  | 'x'  // toggle self and corners
  | 'c'  // toggle corners
  | 'n'  // toggle none
  | ' '  // empty

export type Level = {
  id: string;
  name: string;
  blocks: LevelBlock[];
  moves: string[];
};

// *************************
// **     EASY LEVELS     **
// *************************

const EASY_LEVEL_01: Level = {
  id: 'd9045321-b9ca-425a-804b-690b484fbc10',
  name: 'Level 1',
  blocks: [
    // layer 1
    'n','n','n',
    'n','p','n',
    'n','n','n',
    // layer 2
    'n','n','n',
    'n',' ','e',
    'n','a','n',
    // layer 3
    'n','n','n',
    'n','n','n',
    'n','n','n',
  ],
  moves: [
    'block-1-1-2',
    'block-2-1-1',
    'block-1-2-1',
  ]
};

const EASY_LEVEL_02: Level = {
  id: 'd2eb808a-373f-4c89-9fd9-a990ddc4d55d',
  name: 'Level 2',
  blocks: [
    // layer 1
    'n','n','n',
    'n','p','n',
    'n','n','n',
    // layer 2
    'n','n','n',
    'n',' ','e',
    'n','a','n',
    // layer 3
    'n','n','n',
    'n','n','n',
    'n','n','n',
  ],
  moves: [
    'block-1-1-2',
    'block-2-1-1',
    'block-1-2-1',
  ]
};

export const EASY_LEVELS: Level[] = [
  EASY_LEVEL_01,
  EASY_LEVEL_02
];

// *************************
// **    MEDIUM LEVELS    **
// *************************

const MEDIUM_LEVEL_01: Level = {
  id: 'ff46aff9-a82e-4919-ac57-735b7557a094',
  name: 'Level 1',
  blocks: [
    // layer 1
    'n','n','n',
    'n','p','n',
    'n','n','n',
    // layer 2
    'n','n','n',
    'n',' ','e',
    'n','a','n',
    // layer 3
    'n','n','n',
    'n','n','n',
    'n','n','n',
  ],
  moves: [
    'block-1-1-2',
    'block-2-1-1',
    'block-1-2-1',
  ]
};

const MEDIUM_LEVEL_02: Level = {
  id: '0c91d45b-b2b4-4236-a6d7-f96750c10a48',
  name: 'Level 2',
  blocks: [
    // layer 1
    'n','n','n',
    'n','p','n',
    'n','n','n',
    // layer 2
    'n','n','n',
    'n',' ','e',
    'n','a','n',
    // layer 3
    'n','n','n',
    'n','n','n',
    'n','n','n',
  ],
  moves: [
    'block-1-1-2',
    'block-2-1-1',
    'block-1-2-1',
  ]
};

export const MEDIUM_LEVELS: Level[] = [
  MEDIUM_LEVEL_01,
  MEDIUM_LEVEL_02
];

// *************************
// **     HARD LEVELS     **
// *************************

const HARD_LEVEL_01: Level = {
  id: '27a257eb-1827-4d45-ae7c-c4f9211cdb25',
  name: 'Level 1',
  blocks: [
    // layer 1
    'n','n','n',
    'n','p','n',
    'n','n','n',
    // layer 2
    'n','n','n',
    'n',' ','e',
    'n','a','n',
    // layer 3
    'n','n','n',
    'n','n','n',
    'n','n','n',
  ],
  moves: [
    'block-1-1-2',
    'block-2-1-1',
    'block-1-2-1',
  ]
};

const HARD_LEVEL_02: Level = {
  id: '639edd26-d8ab-42cf-8969-cc43345c0569',
  name: 'Level 2',
  blocks: [
    // layer 1
    'n','n','n',
    'n','p','n',
    'n','n','n',
    // layer 2
    'n','n','n',
    'n',' ','e',
    'n','a','n',
    // layer 3
    'n','n','n',
    'n','n','n',
    'n','n','n',
  ],
  moves: [
    'block-1-1-2',
    'block-2-1-1',
    'block-1-2-1',
  ]
};

export const HARD_LEVELS: Level[] = [
  HARD_LEVEL_01,
  HARD_LEVEL_02
];


