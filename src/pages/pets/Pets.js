import React, { useState, useContext, useEffect } from 'react';
import FileUpload from '../../components/shared/FileUpload';
import AlbumModal from '../album/AlbumModal';
import QuickButtons from '../../components/shared/QuickButtons';
import Footer from '../../components/shared/Footer';
import ErrorMessage from '../../components/ErrorMessage';
import { createRandomString } from '../../functions/CreateRandomString';
import { petsRef } from '../../firestore/index';
import { CardGroup, Card, Button } from 'react-bootstrap';
import $ from 'jquery';
import { UserContext } from '../../App';
import styles from './Pets.module.scss';

export default function Pets() {
  const [attachedImages, setAttachedImages] = useState([]);
  const [albumImages, setAlbumImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const thisUser = useContext(UserContext);
  const me = thisUser.name;
  const myAddress = thisUser.address;
  //for carousel index selection
  const [index, setIndex] = useState(0);
  //for # of images on screen
  const [galleryViewLength, setGalleryViewLength] = useState(25);
  const myMetadata = {
    contact1: me,
    address: myAddress,
  };

  const onFileUpload = async (image, newMetadata) => {
    //image upload
    $('#uploadButton').hide();
    $('#progressCircle').show();
    const randomString = createRandomString(8);
    const metadata = {
      customMetadata: newMetadata,
    };

    const uploadTask = petsRef
      .child(`${randomString}${image.name}`)
      .put(image, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        //gives progress info on upload
        const transferProgress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(transferProgress);
      },
      (error) => {
        console.log(error);
        $('#errorMessage').css('display', 'flex');
      },
      () => {
        //when complete
        uploadTask.snapshot.ref.getDownloadURL().then((gotURL) => {
          setAttachedImages([...attachedImages, gotURL]);
        });
        console.log('Upload Complete');
      }
    );
  };

  const handleShow = (i) => {
    setIndex(i);
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    let allImages = {};
    let theseImgObjs = [];
    const getMiscPics = async () => {
      try {
        allImages = await petsRef.listAll();
        //allImages is an obj with 'items' array (of pic objs, with getDownloadURL()),
        //and a 'nextPageToken' string
        const allItems = allImages.items;
        allItems.forEach(async (i) => {
          const thisURL = await i.getDownloadURL();
          const thisMetadata = await i.getMetadata();
          const customMetadata = thisMetadata.customMetadata;
          const data = {
            ...customMetadata,
            timeCreated: thisMetadata.timeCreated,
          };
          const imageObj = { url: thisURL, data };
          theseImgObjs = [...theseImgObjs, imageObj];
          theseImgObjs.sort((a, b) => {
            return a.data.timeCreated > b.data.timeCreated ? -1 : 1;
          }); //puts most recently added on top
          setAlbumImages(theseImgObjs);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getMiscPics();
  }, []);

  return (
    <>
      <QuickButtons />
      <div className={styles.cardGrid}>
        <ErrorMessage
          errorMessage="Image file too large... try using an image that is smaller that 10MB"
          tryAgainBtn={true}
          tryAgainText="Try Again"
          resetBtn={false}
        />
        <AlbumModal
          show={showModal}
          handleClose={handleClose}
          carouselImages={albumImages}
          carouselIndex={index}
        />
        <div
          className={styles.upload}
          style={{ display: thisUser ? 'flex' : 'none' }}
        >
          <div className={styles.uploadInner}>
            <span style={{ marginBottom: '0.5rem' }}>ADD MY PET</span>
            <FileUpload
              newThread={false}
              onFileUpload={onFileUpload}
              progress={progress}
              metadata={myMetadata}
              requireForm={true}
            />
          </div>
        </div>
        <CardGroup
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {albumImages.map((p, index) => {
            return (
              <Card
                key={p.url}
                className={styles.card}
                style={{
                  display: index < galleryViewLength ? 'inherit' : 'none',
                  minWidth: '275px',
                  maxWidth: '275px',
                  margin: '1rem',
                }}
                onClick={() => handleShow(index)}
              >
                <Card.Img
                  src={p.url}
                  // alt=""
                  // className={styles.albumPhoto}
                  variant="top"
                  // style={{ width: '250px', height: '320px', objectFit: 'cover' }}
                />
                <Card.Body
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Card.Title
                    style={{ display: p.data.petName ? 'block' : 'none' }}
                  >
                    {p.data.petName}
                  </Card.Title>
                  <Card.Text
                    style={{ display: p.data.address ? 'block' : 'none' }}
                  >
                    I live at {p.data.address}
                  </Card.Text>
                  <Card.Text
                    style={{ display: p.data.contact1 ? 'block' : 'none' }}
                  >
                    If you find me, please contact {p.data.contact1} at{' '}
                    <span style={{ whiteSpace: 'nowrap' }}>
                      {p.data.phone1}
                    </span>
                    <span
                      style={{
                        display: p.data.contact2 !== '' ? 'inherit' : 'none',
                      }}
                    >
                      or {p.data.contact2} at{' '}
                      <span style={{ whiteSpace: 'nowrap' }}>
                        {p.data.phone2}
                      </span>
                      .
                    </span>
                  </Card.Text>
                </Card.Body>
              </Card>
            );
          })}
        </CardGroup>
        <div
          className={styles.buttonWrap}
          style={{
            display: albumImages.length > galleryViewLength ? 'block' : 'none',
          }}
        >
          <Button
            className={styles.moreButton}
            onClick={() => setGalleryViewLength(galleryViewLength + 25)}
          >
            See More
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}
