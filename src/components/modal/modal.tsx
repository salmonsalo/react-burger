import styleModal from "./modal.module.css";
import ReactDOM from "react-dom";
import { useEffect } from "react";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import ModalOverlay from "../modal-overlay/modal-overlay";

interface IModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
}
const modal = document.getElementById("modal");

export default function Modal({ children, onClose, title }: IModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return modal
    ? ReactDOM.createPortal(
        <ModalOverlay onClose={onClose}>
          <div className={styleModal.modal} data-testid="modal">
            <div className={`${styleModal.title} pl-10 pr-10 pt-10`}>
              <h2 className="text text_type_main-large">{title}</h2>
              <button
                onClick={onClose}
                className={styleModal.button}
                data-testid="close-modal-button"
              >
                <CloseIcon type="primary" />
              </button>
            </div>
            {children}
          </div>
        </ModalOverlay>,
        modal
      )
    : null;
}
