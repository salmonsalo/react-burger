import styleModalOverlay from "./modal-overlay.module.css";
import { useRef } from "react";

export default function ModalOverlay({ children, onClose }) {
  const modalRef = useRef(null);

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };
  
  return (
    <div
      className={styleModalOverlay.overlay}
      ref={modalRef}
      onClick={closeModal}
    >
      {children}
    </div>
  );
}
