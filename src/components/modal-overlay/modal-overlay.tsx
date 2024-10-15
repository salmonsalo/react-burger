import styleModalOverlay from "./modal-overlay.module.css";
import React, { useRef } from "react";

interface IModalOverlayProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function ModalOverlay({ children, onClose }: IModalOverlayProps) {
  const modalRef = useRef(null);

  const closeModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  return (
    <div
      className={styleModalOverlay.overlay}
      ref={modalRef}
      onClick={closeModal}
      data-testid="modal-overlay"
    >
      {children}
    </div>
  );
}
