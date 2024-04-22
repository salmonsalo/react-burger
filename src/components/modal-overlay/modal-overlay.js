import styleModalOverlay from "./modal-overlay.module.css";
import { useRef } from "react";
import PropTypes from "prop-types";

export default function ModalOverlay({ children, onClose }) {
  const modalRef = useRef(null);

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  ModalOverlay.propTypes = {
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
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
