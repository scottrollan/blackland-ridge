import React from 'react';
import { Modal, Carousel } from 'react-bootstrap';
import styles from './AlbumModal.module.scss';

export default function AlbumModal({ show, handleClose, carouselImages }) {
  return (
    <Modal show={show} onHide={handleClose} className={styles.albumModal}>
      <Modal.Header closeButton className={styles.modalHeader}></Modal.Header>
      <Carousel className={styles.carousel}>
        {carouselImages.map((i) => {
          return (
            <Carousel.Item className={styles.carouselItem} key={i.url}>
              <a
                className={styles.imageWrapper}
                href={i.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={i.url} alt="" className={styles.carouselImage} />
              </a>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </Modal>
  );
}
