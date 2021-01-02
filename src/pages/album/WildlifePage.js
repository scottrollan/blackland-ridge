import React, { useState, useContext, useEffect } from 'react';
import FileUpload from '../../components/shared/FileUpload';
import AlbumModal from './AlbumModal';
import { createRandomString } from '../../functions/CreateRandomString';
import { wildlifeRef } from '../../firestore/index';
import { Card, Button } from 'react-bootstrap';
import $ from 'jquery';
import { UserContext } from '../../App';
import styles from './Album.module.scss';

export default function WildlifePage() {
  const [attachedImages, setAttachedImages] = useState([]);
  const [firstPage, setFirstPage] = useState([]);
  const [secondPage, setSecondPage] = useState([]);
  const [thirdPage, setThirdPage] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const thisUser = useContext(UserContext);
  const me = thisUser.name;

  const onFileUpload = async (image, uploadedBy) => {
    //image upload
    $('#uploadButton').hide();
    $('#progressCircle').show();
    const randomString = createRandomString(8);
    const metadata = {
      customMetadata: {
        uploadedBy: uploadedBy,
      },
    };
    const uploadTask = wildlifeRef
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

  const open = (pageName) => {
    $(`.${pageName}`).show();
    $(`#${pageName}Button`).hide();
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    let firstPage = {};
    let secondPage = {};
    let urls1 = [];
    let urls2 = [];
    const getMiscPics = async () => {
      try {
        firstPage = await wildlifeRef.list({ maxResults: 25 });
        //firstPage is an obj with 'items' array (of pic objs, with getDownloadURL()),
        //and a 'nextPageToken' string
        const items = firstPage.items;
        items.forEach(async (i) => {
          const thisURL = await i.getDownloadURL();
          const thisMetadata = await i.getMetadata();
          const imageObj = { url: thisURL, data: thisMetadata };
          urls1 = [...urls1, imageObj];
          urls1.sort((a, b) => {
            return a.data.timeCreated > b.data.timeCreated ? 1 : -1;
          });
          setFirstPage(urls1);
        });
        if (firstPage.nextPageToken) {
          secondPage = await wildlifeRef.list({
            maxResults: 25,
            pageToken: firstPage.nextPageToken,
          });
          const items2 = secondPage.items;
          items2.forEach(async (i) => {
            const thisURL = await i.getDownloadURL();
            const thisMetadata = await i.getMetadata();
            const imageObj = { url: thisURL, data: thisMetadata };
            urls2 = [...urls2, imageObj];
            urls2.sort((a, b) => {
              return a.data.timeCreated > b.data.timeCreated ? 1 : -1;
            });
            setSecondPage(urls2);
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getMiscPics();
  }, []);

  return (
    <div className={styles.cardGrid}>
      <AlbumModal
        show={showModal}
        handleClose={handleClose}
        carouselImages={firstPage.concat(secondPage)}
      />
      {firstPage.map((p) => {
        return (
          <Card key={p.url} className={styles.card} onClick={handleShow}>
            <Card.Img src={p.url} alt="" className={styles.albumPhoto} />
          </Card>
        );
      })}
      <div className={styles.buttonWrap} id="pageTwoButton">
        <Button className={styles.moreButton} onClick={() => open('pageTwo')}>
          See {secondPage.length} More
        </Button>
      </div>
      {secondPage.map((p) => {
        return (
          <Card
            key={p.url}
            className={[`pageTwo ${styles.card}`]}
            style={{ display: 'none' }}
            onClick={handleShow}
          >
            <Card.Img src={p.url} alt="" className={styles.albumPhoto} />
          </Card>
        );
      })}
      <div className={styles.upload}>
        <div className={styles.uploadInner}>
          <span style={{ marginBottom: '0.5rem' }}>Upload a Photo</span>
          <FileUpload
            newThread={false}
            onFileUpload={onFileUpload}
            progress={progress}
          />
        </div>
      </div>
    </div>
  );
}
