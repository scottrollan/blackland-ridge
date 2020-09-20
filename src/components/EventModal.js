import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import $ from 'jquery';
import styles from './EventModal.module.scss';

const EventModal = ({
  title,
  subtitle,
  description,
  date,
  startTime,
  link1,
  link1D,
  link2,
  link2D,
  src,
  text,
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    $('html').css('overflow-y', 'scroll');
  };
  const handleShow = (e) => {
    e.stopPropagation();
    setShow(true);
    $('html').css('overflow-y', 'hidden');
  };

  return (
    <div className="eventModal">
      <Button className={styles.modalButton} onClick={handleShow}>
        {text}
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p as="h5">{subtitle}</p>
          <p>
            {date} at {startTime}
          </p>
          <img src={src} alt="" className={styles.mImage} />
          <p>{description}</p>
        </Modal.Body>

        <Modal.Footer className={styles.mFooter}>
          <div>
            <span
              className={styles.footerNotes}
              style={{ display: !link1D ? 'none' : 'inherit' }}
            >
              {link1D}.
              <span style={{ display: !link1 ? 'none' : 'inherit' }}>
                Find out more{' '}
                <a href={link1} target="_blank" rel="noopener noreferrer">
                  &nbsp;here.
                </a>
              </span>
            </span>
            <div
              style={{
                display: !link2D ? 'none' : 'inherit',
                height: '1px',
                borderTop: '1px green solid',
                margin: '3px 0',
              }}
            ></div>
            <span
              className={styles.footerNotes}
              style={{
                display: !link2D ? 'none' : 'inherit',
              }}
            >
              {link2D}
              <span style={{ display: !link2 ? 'none' : 'inherit' }}>
                {' '}
                Find out more{' '}
                <a href={link2} target="_blank" rel="noopener noreferrer">
                  &nbsp;here.
                </a>
              </span>
            </span>
          </div>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EventModal;
