import styleModal from "./modal.module.css";
import ReactDOM from "react-dom";
import { useEffect} from "react";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";

const modal = document.getElementById("modal");

export default function Modal({ children, onClose, title}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        };
    
        document.addEventListener('keydown', handleKeyDown);
    
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
        };
      }, [onClose]);

  return ReactDOM.createPortal(
    <div className={styleModal.modal}>
      <div style={{display: "flex", justifyContent:"space-between", alignItems:"center"}} className="pl-10 pr-10 pt-10">
        <h2 className="text text_type_main-large">{title}</h2>
        <button onClick={onClose} style={{backgroundColor:"transparent", border:"none", cursor:"pointer"}}>
            <CloseIcon type="primary" />
        </button>
      </div>
      {children}
    </div>,
    modal
  );
}
