import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../App';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import $ from 'jquery';
import styles from './FileUpload.module.scss';

export default function FileUpload({
  newThread,
  onFileUpload,
  progress,
  metadata,
  requireForm,
}) {
  const thisUser = useContext(UserContext);
  const uploadedBy = `${thisUser.name} at ${thisUser.address}`;
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [petName, setPetName] = useState('');
  const [contact1, setContact1] = useState('');
  const [phone1, setPhone1] = useState('');
  const [contact2, setContact2] = useState('');
  const [phone2, setPhone2] = useState('');
  const [address, setAddress] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const sendData = () => {
    const newMetadata = requireForm
      ? {
          petName: petName,
          contact1: contact1,
          phone1: phone1,
          contact2: contact2,
          phone2: phone2,
          address: address,
        }
      : { uploadedBy: uploadedBy };
    onFileUpload(selectedFile, newMetadata);
    setTimeout(() => handleClose(), 1800);
  };

  useEffect(() => {
    if (requireForm) {
      setContact1(metadata.contact1);
      setAddress(metadata.address);
    }
  }, [metadata]);

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
        style={{
          margin: !newThread ? '0 2rem 0 1rem' : 'inherit',
        }}
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
        <Modal.Body className={styles.modalBody}>
          <input
            type="file"
            onChange={(e) => selectThisFile(e)}
            accept="image/*"
          />

          <img id="output" alt="" className={styles.previewImage} />
          <Form
            style={{
              display: requireForm && selectedFile ? 'flex' : 'none',
              flexDirection: 'column',
            }}
          >
            <Form.Group>
              <Form.Label>Pet's Name</Form.Label>
              <Form.Control
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>My name</Form.Label>
                  <Form.Control
                    type="text"
                    value={contact1}
                    onChange={(e) => setContact1(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>My phone number</Form.Label>
                  <Form.Control
                    type="text"
                    value={phone1}
                    onChange={(e) => setPhone1(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Second contact's name</Form.Label>
                  <Form.Control
                    type="text"
                    value={contact2}
                    onChange={(e) => setContact2(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Their phone number</Form.Label>
                  <Form.Control
                    type="text"
                    value={phone2}
                    onChange={(e) => setPhone2(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Where we live</Form.Label>
              <Form.Control
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: 'space-between' }}>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="dark"
            id="uploadButton"
            onClick={() => sendData()}
            className={styles.uploadButton}
          >
            Upload
          </Button>
          <CircularProgress
            style={{ display: 'none' }}
            id="progressCircle"
            variant="determinate"
            value={progress}
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
}
