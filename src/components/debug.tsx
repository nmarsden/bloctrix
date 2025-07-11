import {Leva} from "leva";
import {useEffect, useState} from "react";

export default function Debug (){
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

  return (
    <Leva hidden={hidden} />
  )
}