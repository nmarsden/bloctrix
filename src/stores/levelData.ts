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
  id: '639edd26-d8ab-42cf-8969-cc43345c0569',
  name: 'Level 1',
  blocks: [
    // layer 1
    'n','n','n',
    'n','n','n',
    'n','n','n',
    // layer 2
    'n','a','n',
    'n',' ','n',
    'n','a','n',
    // layer 3
    'n','n','n',
    'n','n','n',
    'n','n','n',
  ],
  moves: [
    'block-1-1-2',
    'block-1-1-0',
  ]
};

const EASY_LEVEL_02: Level = {
  id: '069cfe18-3f67-4f86-b681-9bb8d652deaa',
  name: 'Level 2',
  blocks: [
    // layer 1
    'a','n','n',
    'n','n','n',
    'n','n','a',
    // layer 2
    'n','n','n',
    'n',' ','n',
    'n','n','n',
    // layer 3
    'n','n','n',
    'n','n','n',
    'n','n','n',
  ],
  moves: [
    'block-0-2-0',
    'block-2-2-2',
  ]
};

const EASY_LEVEL_03: Level = {
  id: 'd7827831-cecc-4fd4-9a71-6de603dfa8cc',
  name: 'Level 3',
  blocks: [
    // layer 1
    'n','n','n',
    'n','a','n',
    'n','n','n',
    // layer 2
    'a','n','a',
    'n',' ','n',
    'a','n','a',
    // layer 3
    'n','n','n',
    'n','a','n',
    'n','n','n',
  ],
  moves: [
    'block-2-1-2',
    'block-0-1-0',
  ]
};

const EASY_LEVEL_04: Level = {
  id: '211349a6-a86d-49bd-8e4b-3a004313aca3',
  name: 'Level 4',
  blocks: [
    // layer 1
    'n','n','n',
    'p','n','p',
    'n','n','n',
    // layer 2
    'n','p','n',
    'n',' ','n',
    'n','p','n',
    // layer 3
    'n','n','n',
    'p','n','p',
    'n','n','n',
  ],
  moves: [
    'block-1-1-2',
    'block-1-1-0',
  ]
};

const EASY_LEVEL_05: Level = {
  id: 'd629ffc6-a970-4d65-88ce-c56c79d0ff05',
  name: 'Level 5',
  blocks: [
    // layer 1
    'p','n','p',
    'n','n','n',
    'p','n','p',
    // layer 2
    'n','n','n',
    'n',' ','n',
    'n','n','n',
    // layer 3
    'p','n','p',
    'n','n','n',
    'p','n','p',
  ],
  moves: [
    'block-2-2-2',
    'block-2-0-2',
    'block-2-0-0',
    'block-0-0-2',
  ]
};

const EASY_LEVEL_06: Level = {
  id: '8d47a367-b5ce-4434-a687-9faf17503ee9',
  name: 'Level 6',
  blocks: [
    // layer 1
    'n','n','n',
    'n','x','n',
    'n','n','n',
    // layer 2
    'n','x','n',
    'x',' ','x',
    'n','x','n',
    // layer 3
    'n','n','n',
    'n','x','n',
    'n','n','n',
  ],
  moves: [
    'block-1-1-2',
    'block-1-1-0',
  ]
};

const EASY_LEVEL_07: Level = {
  id: 'c453a875-7f66-4577-ab1e-6427498ee9fe',
  name: 'Level 7',
  blocks: [
    // layer 1
    'n','n','n',
    'x','n','x',
    'n','n','n',
    // layer 2
    'x','n','x',
    'n',' ','n',
    'x','n','x',
    // layer 3
    'n','n','n',
    'x','n','x',
    'n','n','n',
  ],
  moves: [
    'block-2-2-1',
    'block-0-0-1',
  ]
};

const EASY_LEVEL_08: Level = {
  id: '31e4e2fd-0e72-4a72-ad20-1c2309ffdc1d',
  name: 'Level 8',
  blocks: [
    // layer 1
    'x','n','x',
    'n','n','n',
    'x','n','x',
    // layer 2
    'n','n','n',
    'n',' ','n',
    'n','n','n',
    // layer 3
    'x','n','x',
    'n','n','n',
    'x','n','x',
  ],
  moves: [
    'block-2-2-2',
    'block-0-2-0',
    'block-2-2-0',
    'block-0-2-2',
  ]
};

const EASY_LEVEL_09: Level = {
  id: '227d17b2-aab0-42aa-861e-123edd7b165e',
  name: 'Level 9',
  blocks: [
    // layer 1
    'n','n','n',
    'p','p','p',
    'n','n','n',
    // layer 2
    'n','a','n',
    'p',' ','p',
    'n','a','n',
    // layer 3
    'n','n','n',
    'p','p','p',
    'n','n','n',
  ],
  moves: [
    'block-2-1-1',
    'block-0-1-1',
    'block-1-2-1',
    'block-1-0-1',
    'block-1-1-2',
    'block-1-1-0',
  ]
};

const EASY_LEVEL_10: Level = {
  id: '58928623-3211-446e-8e86-b4ecf527b848',
  name: 'Level 10',
  blocks: [
    // layer 1
    'n','n','n',
    'n','p','n',
    'n','n','n',
    // layer 2
    'a','p','a',
    'p',' ','p',
    'a','p','a',
    // layer 3
    'n','n','n',
    'n','p','n',
    'n','n','n',
  ],
  moves: [
    'block-1-1-2',
    'block-2-1-1',
    'block-0-1-0',
  ]
};

export const EASY_LEVELS: Level[] = [
  EASY_LEVEL_01,
  EASY_LEVEL_02,
  EASY_LEVEL_03,
  EASY_LEVEL_04,
  EASY_LEVEL_05,
  EASY_LEVEL_06,
  EASY_LEVEL_07,
  EASY_LEVEL_08,
  EASY_LEVEL_09,
  EASY_LEVEL_10,
];

// *************************
// **    MEDIUM LEVELS    **
// *************************

const MEDIUM_LEVEL_01: Level = {
  id: 'a9711e79-1754-43fa-8493-b3e9ab76d59a',
  name: 'Level 1',
  blocks: [
    // layer 1
    'a','n','a',
    'n','n','n',
    'a','n','a',
    // layer 2
    'n','n','n',
    'n',' ','n',
    'n','n','n',
    // layer 3
    'a','n','a',
    'n','n','n',
    'a','n','a',
  ],
  moves: [
    'block-2-0-2',
    'block-2-2-0',
    'block-0-2-2',
    'block-0-0-0',
  ]
};

export const MEDIUM_LEVELS: Level[] = [
  MEDIUM_LEVEL_01,
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


export const HARD_LEVELS: Level[] = [
  HARD_LEVEL_01,
];


