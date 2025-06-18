import React from "react";
import Modal from "react-modal";

const DeleteConfirmationModal = ({ isOpen, closeModal, onDelete }) => {
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
    color: "#ffffff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Delete Confirmation Modal"
      style={modalStyles}
    >
      <div style={{ textAlign: "center" }}>
        <h2 style={{ marginBottom: "15px", color: "#e74c3c" }}>
          Delete Confirmation
        </h2>
        <p style={{ marginBottom: "20px", color: "#555" }}>
          Are you sure you want to delete this student?
        </p>
        <button
          onClick={onDelete}
          style={{ ...buttonStyles, backgroundColor: "#e74c3c" }}
        >
          Confirm Delete
        </button>
        <button
          onClick={closeModal}
          style={{
            ...buttonStyles,
            marginLeft: "10px",
            backgroundColor: "green",
          }}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
