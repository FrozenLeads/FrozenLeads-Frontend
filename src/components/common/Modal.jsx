import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// --- Styled Components for the Modal ---

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  inset: 0; /* A modern shorthand for top: 0, right: 0, bottom: 0, left: 0 */
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 2000; /* Ensure it's on top of other content */
`;

const ModalPanel = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  background-color: #FDFCF9;
  border: 1px solid #E0DBCF;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  font-family: 'Poppins', sans-serif;
  overflow: hidden; /* Ensures content respects the border-radius */
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #E0DBCF;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2C2C2C;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(44, 44, 44, 0.05);
  }

  svg {
    width: 24px;
    height: 24px;
    stroke: #888;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  /* Add styles for content within the modal if needed, e.g., line-height */
  line-height: 1.6;
  color: #3D3D3D;
`;

// --- SVG Icon ---
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// --- Animation Variants for Framer Motion ---
const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const panelVariants = {
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    visible: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { scale: 0.95, opacity: 0, y: 20, transition: { duration: 0.2, ease: "easeIn" } },
};


// --- Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => {
    // The AnimatePresence component enables exit animations
    return (
        <AnimatePresence>
            {isOpen && (
                <ModalBackdrop
                    onClick={onClose} // UX Improvement: Click outside to close
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <ModalPanel
                        onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside it
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <ModalHeader>
                            <ModalTitle>{title}</ModalTitle>
                            <CloseButton onClick={onClose}>
                                <CloseIcon />
                            </CloseButton>
                        </ModalHeader>
                        <ModalBody>
                            {children}
                        </ModalBody>
                    </ModalPanel>
                </ModalBackdrop>
            )}
        </AnimatePresence>
    );
};

export default Modal;