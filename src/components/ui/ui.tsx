import { GlobalState, useGlobalStore } from '../../stores/useGlobalStore';
import './ui.css';

export default function Ui() {
  const playing = useGlobalStore((state: GlobalState) => state.playing);  

  return (
    <>
      <div className={`overlay ${playing ? 'hide' : 'show'}`}>
        <div className="overlayHeading">
          <div>VOXEL</div>
          <div>VOID</div>
        </div>
      </div>
    </>
  )
}