# TODOs

- [x] initial layout
  - [x] camera
  - [x] lights
  - [x] blocks

- [ ] block
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
  - [ ] show labels on block face to indicate toggle affect
        - center square: toggle this block
        - edge square: toggles 1 neighbour in edge direction
        - double edge square: toggles 2 neighbours in edge direction
  - [ ] introduce different types of toggling blocks
        [x] filled center and edge blocks: toggles self and neighbours
        [x] filled edge blocks only: toggles neighbours but not self
        [ ] no filled blocks: toggles nothing

- [ ] level
  - [x] introduce Level
  - [ ] level editor
    - [x] 1) fill feature
      - [ ] select block type
      - [ ] next - sets all blocks
    - [ ] 2) edit block type mode
      - [ ] clicking a block toggles its block type
      - [ ] next - switches to play mode
    - [ ] 3) play mode
      - [x] clicking a block toggles according to standard rules
      - [x] reset - toggle all blocks off
      - [x] save - output level data JS code to browser console


Edit Mode

Fill: [All] [Neighbours] [None]

Note: Click a block to change block type

Play Mode

[Reset] [Save]


Editor Tools

Edit | Play




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

