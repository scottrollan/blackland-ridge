import React, { useState } from 'react';
// import NewReferralSubcategories from './NewReferralSubcategories';
import { referralCategories } from '../data/referralCategories';
import { Modal, Button, Form } from 'react-bootstrap';
import $ from 'jquery';
import styles from './NewReferral.module.scss';

export default function NewReferral({ show, handleClose }) {
  const [subcategories, setSubcategories] = useState([]);

  const selectCategory = (subC) => {
    const theseSubs = subC.split(',');
    setSubcategories([...theseSubs]);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="newBusiness">
            <Form.Label>Business or Person's Name</Form.Label>
            <Form.Control type="text" placeholder="Minchew Media" />
          </Form.Group>
          <Form.Group controlId="category">
            <Form.Label>Select Category</Form.Label>
            <Form.Control
              as="select"
              defaultValue="select"
              onChange={(e) => selectCategory(e.target.value)}
            >
              <option disabled>select</option>
              {referralCategories.map((c) => {
                return (
                  <option key={c.category} value={[...c.subcategories]}>
                    {c.category}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="subcategories">
            <Form.Label>Subcategory(ies)</Form.Label>
            <Form.Control as="select" multiple>
              {subcategories.map((s) => {
                return <option key={s}>{s}</option>;
              })}
            </Form.Control>
          </Form.Group>
          {/* <NewReferralSubcategories subcategories={subcategories} /> */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
