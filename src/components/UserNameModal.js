import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const UserNameModal = ({ show, nameInput, setName, signUp }) => {
  return (
    <div>
      <Modal show={show} style={{ zIndex: 999 }} id="userNameModal">
        <Modal.Header>Set a User Name</Modal.Header>
        <Modal.Body>
          <Form onSubmit={signUp}>
            <Form.Control
              id="userInput"
              required
              type="input"
              value={nameInput}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Judy Patel"
            ></Form.Control>
            <Button type="submit">Set User Name</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserNameModal;
