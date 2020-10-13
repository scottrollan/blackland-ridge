import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import $ from 'jquery';
import styles from './FileUpload.module.scss';

export default function FileUpload({ newThread, onFileUpload }) {
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const selectThisFile = (e) => {
    //setSelectedFile & render a preview in modal before uploading
    const file = e.target.files[0];
    setSelectedFile(file);
    const output = document.getElementById('output');
    $('#output').attr('src', URL.createObjectURL(file));
    $('#output').onload = () => {
      URL.revokeObjectURL(output.src); // free memory
    };
    $('#uploadButton').show();
  };

  return (
    <div>
      <i
        onClick={handleShow}
        className={`fal fa-camera-alt ${styles.icon}`}
        style={{ margin: !newThread ? '0 2rem 0 1rem' : 'inherit' }}
      ></i>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select a File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="file"
            onChange={(e) => selectThisFile(e)}
            accept="image/*"
          />

          <img id="output" alt="" className={styles.previewImage} />
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: 'space-between' }}>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="dark"
            id="uploadButton"
            onClick={() => {
              onFileUpload(selectedFile);
              setTimeout(() => handleClose(), 1800);
            }}
            className={styles.uploadButton}
          >
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
