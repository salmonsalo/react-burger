import styleModalOverlay from "./modal-overlay.module.css";
import ReactDOM from "react-dom";
import { useRef } from "react";

const modal = document.getElementById("modal");
export default function ModalOverlay({ children, onClose }) {
  const modalRef = useRef(null);

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };
  
  return ReactDOM.createPortal(
    <div
      className={styleModalOverlay.overlay}
      ref={modalRef}
      onClick={closeModal}
    >
      {children}
    </div>,
    modal
  );
}
