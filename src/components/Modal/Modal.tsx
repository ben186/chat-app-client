import React, { useEffect, useRef, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  hasCloseButton?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = (props) => {
  const [isModalOpen, setModalOpen] = useState(props.isOpen);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    setModalOpen(props.isOpen);
  }, [props.isOpen]);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    if (isModalOpen)
      modalElement.showModal();
    else 
      modalElement.close();

  }, [isModalOpen]);

  const handleCloseModal = () => {
    if (props.onClose)
      props.onClose();

    setModalOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      handleCloseModal();
    }
  };

  return (
    <dialog ref={modalRef} onKeyDown={handleKeyDown}>
      {props.hasCloseButton && (
        <button className='w-full p-1 text-right' onClick={handleCloseModal}>
          X
        </button>
      )}
      {props.children && props.children}
    </dialog>
  );
};

export default Modal;
