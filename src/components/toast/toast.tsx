import { JSX, useEffect, useState} from "react";
import './toast.css';
import { GlobalState, ToastMessage, useGlobalStore } from "../../stores/useGlobalStore";

type ToastData = {
  cssClasses: string;
  message: JSX.Element | null;
};

const TOASTS: Map<ToastMessage, ToastData> = new Map([
  ['NONE', { 
    cssClasses: 'toastMessage', 
    message: null 
  }],
  ['BLOCK_MODE', { 
    cssClasses: 'toastMessage show', 
    message: (
      <>
        <div>
          <i className="fa-solid fa-cube"></i>&nbsp;Block Mode
        </div>
        <div>Click a block to change type</div>
      </>
    )
  }],
  ['MOVE_MODE', { 
    cssClasses: 'toastMessage show', 
    message: (
      <>
        <div>
          <i className="fa-solid fa-cubes"></i>&nbsp;Move Mode
        </div>
        <div>Click a block to make a move</div>
      </>
    )
  }],
  ['SAVED', { 
    cssClasses: 'toastMessage show', 
    message: <>
      <div>
        <i className="fa-solid fa-floppy-disk"></i>&nbsp;Level Saved!
      </div>
    </> 
  }],
  ['DELETED', { 
    cssClasses: 'toastMessage show', 
    message: <>
      <div>
        <i className="fa-solid fa-trash-can"></i>&nbsp;Level Deleted!
      </div>
    </> 
  }],
  ['SHARE', { 
    cssClasses: 'toastMessage show', 
    message: <>
      <div>
        <i className="fa-solid fa-link"></i>&nbsp;Link copied to clipboard!
      </div>
    </> 
  }],
])

export default function Toast() {
  const [toastData, setToastData] = useState<ToastData>(TOASTS.get('NONE') as ToastData);

  const toastMessage = useGlobalStore((state: GlobalState) => state.toastMessage);
  const setToastMessage = useGlobalStore((state: GlobalState) => state.setToastMessage);
  
  useEffect(() => {
    setToastData(TOASTS.get(toastMessage) as ToastData);
    if (toastMessage === 'NONE') {
      return;
    }

    setTimeout(() => setToastMessage('NONE'), 2000);
  }, [toastMessage])

  return (
    <div className="toastContainer">
      <div className={toastData.cssClasses}>{toastData.message}</div> 
    </div>
  )
}