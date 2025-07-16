import {Leva, useControls} from "leva";
import {useEffect, useState} from "react";
import { GlobalState, useGlobalStore } from "../stores/useGlobalStore";

export default function Debug (){
  const colors = useGlobalStore((state: GlobalState) => state.colors);
  const setColors = useGlobalStore((state: GlobalState) => state.setColors);

  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (window.location.hash === '#debug') {
      setHidden(false)
    }
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'd') {
        setHidden(hidden => !hidden);
      // } else if (event.key === 'p') {
      //   setPaused(paused => !paused);
      }
    });
  }, []);

  useControls(
    'Colors',
    {
      block:                { value: colors.block,                onChange: value => setColors({ ...colors, block: value }) },
      blockEdge:            { value: colors.blockEdge,            onChange: value => setColors({ ...colors, blockEdge: value }) },
      planeTool:            { value: colors.planeTool,            onChange: value => setColors({ ...colors, planeTool: value }) },
      planeSwitchActive:    { value: colors.planeSwitchActive,    onChange: value => setColors({ ...colors, planeSwitchActive: value }) },
      planeSwitchInactive:  { value: colors.planeSwitchInactive,  onChange: value => setColors({ ...colors, planeSwitchInactive: value }) },
      planeSwitchEdge:      { value: colors.planeSwitchEdge,      onChange: value => setColors({ ...colors, planeSwitchEdge: value }) },
    },
    {
      collapsed: true
    },
    [colors]
  );

  return (
    <Leva hidden={hidden} />
  )
}