# TODOs

- [x] initial layout
  - [x] camera
  - [x] lights
  - [x] blocks

- [x] block
  - [x] edges
  - [x] shadows
  - [x] pointer over
    - [x] change edge color
    - [x] change cursor
    - [x] highlight neighbouring blocks
  - [x] When no block is hovered: show block 
  - [x] When a block is hovered: only show block which is hovered OR hovered neighbour OR block on the active plane
  - [x] Use a custom shader for hiding/showing blocks
  - [x] toggle
  - [x] do not adjust block opacity on hover
  - [x] make it a 3x3 grid instead of 5x5
  - [x] avoid mistaking a drag for a click
  - [x] animate hover
  - [x] animate toggle
  - [x] show labels on block face to indicate toggle affect
        - center square: toggle this block
        - edge square: toggles 1 neighbour in edge direction
        - double edge square: toggles 2 neighbours in edge direction
  - [x] introduce different types of toggling blocks
        [x] toggles all (self, corner, and edge blocks)
        [x] toggles corner and edge blocks only
        [x] toggles self and edge blocks
        [x] toggles edge blocks only
        [x] toggles self and corner blocks
        [x] toggles corner blocks only
        [x] toggles nothing
  - [x] only show blocks that are on the cubes surface

- [x] level
  - [x] introduce Level
  - [x] level editor
    - [x] press 'e' to enable/disable the editor
    - [x] edit
      - [x] name
      - [x] grid size
        - [x] 3 x 3
        - [x] 4 x 4
        - [x] 5 x 5
      - [x] fill
        - [x] block type: all
        - [x] block type: neighbours
        - [x] block type: none
        - [ ] improve fill mode
          - [ ] instead of clearing all moves, re-apply moves based on the new block types
    - [x] block mode    
      - [x] clicking a block toggles block type
      - [x] improve block mode
        - [x] when a block type changes, instead of clearing moves, re-apply the moves based on the new block type
        - [x] handle a move no longer possible to apply, ie. block type was changed to 'NONE' for a moved block
        - [x] when saving level, remove any moves which became invalid due to the block type changing to 'NONE'

    - [x] play mode
      - [x] clicking a block toggles on/off according to standard rules
        - [ ] delay toggle animation
              - actual clicked block should have no delay
              - neighbours should have varying delay.  Perhaps with increasing delay based on relative position to   the clicked block in a clockwise rotation when looking from the clicked block to the blocks origin

      - [x] reset - toggle all blocks off
      - [x] save - output level data JS code to browser console
        - [x] add moves, eg. moves: ['block-0-0-1', 'block-1-2-0']
          - [x] change save format...
                * type LevelBlock = 'a' | 'o' | 'p' | 'e' | 'x' | 'c' | 'n' | ' ';
                * type Level = {
                    name: string;
                    blocks: LevelBlock[];
                    moves: string[];
                  };
        - [x] save to local storage
          - [x] compress data using https://github.com/pieroxy/lz-string
        - [x] load from local storage
          - [x] uncompress data using https://github.com/pieroxy/lz-string
    - [x] show toast message on save  
    - [x] unsaved changes
      - [x] indicate when unsaved changes

    - [x] support editing existing level
      - [x] introduce level ID - as UUID
    - [x] support deleting existing level
      - [x] confirm deleting
      
    - [x] mobile support
    - [x] share
      - [x] write...
        - [x] share button to trigger sharing
        - [x] create URL with encoded level data eg. <hostname>/bloctrix#cl=[ENCODED_DATA]
        - [x] copy URL to clipboard
        - [x] show toast message: Link copied to clipboard!
      - [x] read...
        - [x] react to URL hash starting with 'cl='
        - [x] decode level data
        - [x] add level to customLevels
          - [ ] what if the levelId already exists in customLevels?
                * prompt to override?
        - [x] starting playing level
      - [x] improve the share button - use a link icon   
      - [x] prevent share when unsaved changes

  - [x] custom levels
    - [x] new level - open level editor
    - [x] list custom levels loaded from local storage
      - [-] show columns: checkbox, name, updated (timestamp), grid size, block types, moves
      - [-] options
        - [-] play
        - [-] edit
        - [-] copy
        - [-] delete
        - [-] export
      - [-] export - exports selected levels (or all if none selected)
      - [-] import
  - [x] level completed
    - [x] disable interactions with buttons, blocks, and camera
      - [x] hide buttons
      - [x] disable camera controls
      - [x] update cursor
      - [x] ignore block interactions
      - [x] reset camera position
    - [x] animation
      - [x] rotate blocks group
      - [x] pulse individual blocks with varying delays
        - [x] scale
        - [x] border color
        - [x] surface color
        - [x] label color
    - [x] show 'Level Completed' modal
      - [x] Menu button
      - [x] Replay button
      - [x] Next button
      - [x] Indicate whether 'gold' or 'silver' tick achieved
        - [x] when solved in minimum moves...
          - [x] 'gold' achieved
          - [x] Solved in [n] moves
        - [x] when NOT solved in minimum moves...
          - [x] 'silver' achieved
          - [x] Solved in [n] moves  
          - [x] 'gold' requires [N] moves

  - [x] ui
    - [x] main menu
      - [x] reset & animate blocks
    - [x] level menu
      - [x] new custom
      - [x] reset & animate blocks
        - [x] animate grid size change
      - [x] switch to a gallery layout
          - [x] show a single level
            - [x] level name
            - [x] n of N
            - [x] blocks
          - [x] show play button  
          - [x] show next & previous buttons
      - [x] handle no custom levels

    - [x] hud
      - [x] moves
      - [x] reset - use icon
      - [x] quit - use icon
    - [x] toast messages
      - [x] shared
      - [x] block mode
      - [x] move mode
      - [x] saved
      - [x] deleted
    - [x] options
      - [x] sfx on/off
      - [x] music on/off

- [x] plane tool
  - [x] enable/disable on xz plane
  - [x] only pointer over when on the plane
  - [x] remove plane tool

- [x] plane switches  
  - [x] select active plane
  - [x] show switches on each corner
  - [x] hide switches when in the way
        [x] between camera and blocks
        [x] behind blocks
  - [x] remove plane switches      

- [x] axes
  - [x] show on pointer over

- [x] rename game to bloctrix

- [x] have custom cursor for...
  - [x] pointer
  - [x] click
  - [x] drag
  - [x] dragging
  - [x] text input

- [x] sound
  - [x] music
    - [x] game mode: MAIN_MENU & LEVEL_MENU & LEVEL_COMPLETED
    - [x] game mode: PLAYING & EDITING
  - [x] sound effects
    - [x] button clicked
    - [x] block toggled
    - [x] level completed

- [x] favicon

- [ ] info
- [ ] more levels
- [ ] help
- [ ] achievements
- [x] track bestMoves per level
- [x] indicate which levels have been completed
  - [x] not completed
  - [x] completed - but NOT minimum moves
  - [x] completed best - minimum moves

- [ ] particles
  - [ ] show particles on click - extruding from the block label squares

- [ ] ribbons
  - [ ] show ribbons on rotate - wind effect extruding from the edges of the cube


