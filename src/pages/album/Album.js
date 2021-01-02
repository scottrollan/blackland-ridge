import React, { useState, useEffect } from 'react';
import QuickButtons from '../../components/shared/QuickButtons';
// import FileUpload from '../../components/shared/FileUpload';
import AlbumModal from './AlbumModal';
import { createRandomString } from '../../functions/CreateRandomString';
import { miscRef, petsRef, wildlifeRef } from '../../firestore/index';
import { Card, Tab, Tabs, Button } from 'react-bootstrap';
import $ from 'jquery';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import styles from './Album.module.scss';

export default function Album() {
  const [attachedImages, setAttachedImages] = useState([]);
  const [firstPage, setFirstPage] = useState([]);
  const [secondPage, setSecondPage] = useState([]);
  const [thirdPage, setThirdPage] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // const [petPics, setPetPics] = useState([]);
  // const [wildlifePics, setWildlifePics] = useState([]);
  const [progress, setProgress] = useState(0);
  const thisUser = React.useContext(UserContext);
  const me = thisUser.name;
  const history = useHistory();

  const onFileUpload = async (image, uploadedBy, ref) => {
    //image upload
    $('#uploadButton').hide();
    $('#progressCircle').show();
    const randomString = createRandomString(8);
    const metadata = {
      customMetadata: {
        uploadedBy: uploadedBy,
      },
    };
    const uploadTask = ref
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
    const getPics = async () => {
      try {
        firstPage = await miscRef.list({ maxResults: 4 });
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
          secondPage = await miscRef.list({
            maxResults: 4,
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
    getPics();
  }, []);

  return (
    <div className={styles.album}>
      <QuickButtons />
      <Tabs defaultActiveKey="misc">
        <Tab id="miscTab" eventKey="misc" title="Main">
          <AlbumModal
            show={showModal}
            handleClose={handleClose}
            carouselImages={firstPage.concat(secondPage)}
          />
          <div className={styles.cardGrid}>
            {firstPage.map((p) => {
              return (
                <Card key={p.url} className={styles.card} onClick={handleShow}>
                  <Card.Img src={p.url} alt="" className={styles.albumPhoto} />
                </Card>
              );
            })}
            <div className={styles.buttonWrap} id="pageTwoButton">
              <Button
                className={styles.moreButton}
                onClick={() => open('pageTwo')}
              >
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
          </div>
        </Tab>
        <Tab id="petTab" eventKey="pets" title="Pets">
          PETS
        </Tab>
        <Tab id="wildlifeTab" eventKey="wildlife" title="Wildlife">
          WILDLIFE
        </Tab>
      </Tabs>
    </div>
  );
}
