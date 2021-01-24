import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function PostReferralAgreement({
  show,
  handleClose,
  handleFormShow,
}) {
  const handleMyClose = () => {
    handleFormShow();
    handleClose();
  };
  return (
    <>
      <Modal show={show} onHide={handleMyClose} style={{ zIndex: '1051' }}>
        <Modal.Header closeButton>
          <Modal.Title>New Business Referral Terms</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <li>
              I understand this board is for relaying{' '}
              <span style={{ textDecoration: 'underline' }}>customer</span>{' '}
              experiences.
            </li>
            <li>I will not post my own business.</li>
            <li>I will not post a business where I work or have worked.</li>
            <li>
              I will not post a business with which I have not had personal
              experience (no hearsay).
            </li>
            <li>
              I understand that breaking these terms will be cause for removal
              of my post by the network administrator(s).
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleMyClose}>
            I Agree.
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
