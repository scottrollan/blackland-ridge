import React, { useState, useEffect } from 'react';
import { Modal, Carousel } from 'react-bootstrap';
import styles from './AlbumModal.module.scss';

export default function AlbumModal({
  show,
  handleClose,
  carouselImages,
  carouselIndex,
}) {
  const [index, setIndex] = useState(carouselIndex);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    setIndex(carouselIndex);
  }, [carouselIndex]);

  return (
    <Modal show={show} onHide={handleClose} className={styles.albumModal}>
      <Modal.Header closeButton className={styles.modalHeader}></Modal.Header>
      <Carousel
        className={styles.carousel}
        activeIndex={index}
        onSelect={handleSelect}
        indicators={false}
      >
        {carouselImages.map((i, index) => {
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
