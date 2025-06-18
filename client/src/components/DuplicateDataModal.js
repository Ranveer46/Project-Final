import React from "react";
import Modal from "react-modal";

const DuplicateDataModal = ({ isOpen, closeModal }) => {
  const modalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      width: "80%",
      maxWidth: "400px",
      height: "auto",
      margin: "auto",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      backgroundColor: "#fff",
      position: "relative",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      transform: "translate(0%, 0%)", // Center the modal
    },
  };

  const buttonStyles = {
    backgroundColor: "#e74c3c",
    color: "#ffffff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    position: "absolute",
    top: "10px",
    right: "10px",
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Duplicate Data Modal"
      style={modalStyles}
    >
      <button onClick={closeModal} style={buttonStyles}>
        <i className="fas fa-times"></i>
      </button>
      <br />
      <div style={{ textAlign: "center" }}>
        <h2 style={{ marginBottom: "15px", color: "#e74c3c" }}>
          Duplicate Data Error
        </h2>
        <p style={{ marginBottom: "20px", color: "#555" }}>
          A student with the same ID or email already exists. Please
          double-check your input.
        </p>
      </div>
    </Modal>
  );
};

export default DuplicateDataModal;
