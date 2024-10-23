import React from 'react';
import './Modal.css'; // Create a separate CSS file for styling the modal

const Modal = ({ show, onClose, children }) => {
  if (!show) return null; // If `show` is false, do not render the modal

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
