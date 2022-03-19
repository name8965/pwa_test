import React, { useState } from "react";
import Modal from "react-modal";

const ModalTest = () => {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  return (
    <>
      <button
        onClick={() => {
          setModalIsOpen(false);
        }}
      >
        Modal open
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setModalIsOpen(false);
        }}
        aria={{ labelledby: "heading", describedby: "full_description" }}
      >
        <h1 id="heading">Alert</h1>
        <div id="full_description"></div>
        this is modal
        <button
          onClick={() => {
            setModalIsOpen(false);
          }}
        >
          Modal close
        </button>
      </Modal>
    </>
  );
};

export default ModalTest;
