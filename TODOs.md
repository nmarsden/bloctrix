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
  - [x] show labels on block face to indicate toggle affect
        - center square: toggle this block
        - edge square: toggles 1 neighbour in edge direction
        - double edge square: toggles 2 neighbours in edge direction
  - [x] introduce different types of toggling blocks
        [x] filled center and edge blocks: toggles self and edge blocks
        [x] filled edge blocks only: toggles edge blocks only
        [x] no filled blocks: toggles nothing
        [x] filled center, edge, and corners: toggles self, corner, and edge blocks
        [ ] filled edge and corners: toggles corner and edge blocks

- [ ] level
  - [x] introduce Level
  - [x] level editor
    - [x] edit mode
      - [x] grid size
        - [x] 3 x 3
        - [x] 4 x 4
        - [x] 5 x 5
      - [x] fill
        - [x] block type: all
        - [x] block type: neighbours
        - [x] block type: none
      - [x] clicking a block toggles block type
    - [x] play mode
      - [x] clicking a block toggles on/off according to standard rules
      - [x] reset - toggle all blocks off
      - [x] save - output level data JS code to browser console
  - [ ] level completed

  - [ ] ui
    - [ ] 

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

