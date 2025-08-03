import { useEffect} from "react";
import './toast.css';
import { GlobalState, ToastMessage, useGlobalStore } from "../../stores/useGlobalStore";

function message (toastMessage: ToastMessage) {
  switch(toastMessage) {
    case 'NONE': return <></>;
    case 'BLOCK_MODE': return (
      <>
        <div>
          <i className="fa-solid fa-cube"></i>&nbsp;Block Mode
        </div>
        <div>Click a block to change type</div>
      </>
    );
    case 'MOVE_MODE': return (
      <>
        <div>
          <i className="fa-solid fa-cubes"></i>&nbsp;Move Mode
        </div>
        <div>Click a block to make a move</div>
      </>
    );
    case 'SHARE': return <>Link copied to clipboard!</>;
  }
}

export default function Toast() {
  const toastMessage = useGlobalStore((state: GlobalState) => state.toastMessage);
  const setToastMessage = useGlobalStore((state: GlobalState) => state.setToastMessage);
  
  useEffect(() => {
    if (toastMessage === 'NONE') {
      return;
    }

    setTimeout(() => setToastMessage('NONE'), 2000);
  }, [toastMessage])

  return (
    <div className={`toast ${toastMessage !== 'NONE' ? 'show' : ''}`}>{message(toastMessage)}</div> 
  )
}