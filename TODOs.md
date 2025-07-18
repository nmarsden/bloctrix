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

- [ ] camera
  - [ ] do not rotate camera while hovering blocks
