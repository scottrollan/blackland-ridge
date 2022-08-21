import React, { useState, useEffect, useContext } from 'react';
import { directoryCollection } from '../../firestore/index';
import { createRandomString } from '../../functions/CreateRandomString';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { UserContext } from '../../App';
import $ from 'jquery';

export default function ContactInfoPopup({
  contactModalOpen,
  setContactModalOpen,
}) {
  const thisUser = useContext(UserContext);
  const [form, setForm] = useState({
    id: createRandomString(20),
    name: '',
    address: '',
    sameInfo: false,
    homePhone: '',
    cellPhones: '',
    children: '',
    email: '',
    emailListed: false,
    childrenJobs: '',
    streetCaptain: false,
    progressivePoolParty: false,
    movieNight: false,
    iceCreamSocial: false,
    summerParty: false,
    halloweenParty: false,
    holidayParty: false,
  });

  const handleChange = (field, val) => {
    setForm({ ...form, [field]: val });
  };

  const sameInfoToggle = () => {
    setForm({ ...form, sameInfo: !form.sameInfo });
  };

  const cancelAction = () => {
    setContactModalOpen(false);
  };
  const goToPaypal = () => {
    window.location.href = 'https://www.paypal.me/BlacklandridgeGC';
  };
  const submitForm = (event) => {
    event.preventDefault();
    const modaBodyHeight = $('#modalBody').height();
    $('#spinnerDiv').css('height', modaBodyHeight);
    $('#spinnerDiv').css('display', 'flex');
    $('#formDiv').hide();
    try {
      directoryCollection.doc(form.id).set({ ...form });
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => goToPaypal(), 2500);
  };

  useEffect(() => {
    const autoFill = async () => {
      const myAddress = thisUser.address;
      setForm({ ...form, address: myAddress });
    };
    autoFill();
  }, []);

  return (
    <Modal
      show={contactModalOpen}
      onHide={() => cancelAction()}
      centered
      scrollable
    >
      <Modal.Header>
        <Modal.Title
          style={{
            textAlign: 'center',
            color: 'var(--default-font-color)',
          }}
        >
          Please provide information for the (paper) Neighborhood Directory
        </Modal.Title>
      </Modal.Header>
      <Modal.Body id="modalBody">
        <div
          id="spinnerDiv"
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100%',
          }}
        >
          <Spinner animation="grow" variant="success" />
        </div>
        <div id="formDiv">
          <Form id="contactForm" onSubmit={(e) => submitForm(e)}>
            <Form.Group>
              <Form.Control
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                placeholder="Name(s)"
                style={{ margin: '1em 0' }}
              />
              <Form.Text>
                List all adult household members (ex: Jo and Tina Smith) as you
                want them to appear in the directory.
              </Form.Text>
            </Form.Group>
            <Form.Control
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              required
              placeholder="Address"
              style={{ margin: '1em 0' }}
            />
            <Form.Check
              type="checkbox"
              value={form.sameInfo}
              onChange={() => sameInfoToggle()}
              label={'Check here if info is the same as last year'}
            />
            <div style={{ display: form.sameInfo ? 'none' : 'initial' }}>
              <Form.Control
                value={form.homePhone}
                onChange={(e) => handleChange('homePhone', e.target.value)}
                disabled={form.sameInfo}
                placeholder="Home Phone"
                style={{ margin: '1em 0' }}
              />
              <Form.Control
                value={form.cellPhones}
                onChange={(e) => handleChange('cellPhones', e.target.value)}
                disabled={form.sameInfo}
                placeholder="Mobile Phone Number(s)"
                style={{ margin: '1em 0' }}
              />
              <Form.Control
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={form.sameInfo}
                placeholder="Email"
                style={{ margin: '1em 0' }}
              />
              <Form.Check
                type="checkbox"
                value={form.emailListed}
                onChange={() =>
                  setForm({ ...form, emailListed: !form.emailListed })
                }
                disabled={form.sameInfo}
                label="Check here if it's ok to list your email address in the diretory"
              />
              <hr />
              <Form.Group>
                <Form.Label muted={form.sameInfo}>
                  Children living at home and their ages.
                </Form.Label>
                <Form.Control
                  value={form.children}
                  onChange={(e) => handleChange('children', e.target.value)}
                  disabled={form.sameInfo}
                  placeholder="ex: Adam - 9, Ajay - 4"
                  style={{ margin: '1em 0' }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label muted={form.sameInfo}>
                  Children interested in Babysitting/Yardwork/Petsitting--please
                  specify name of child and which service.
                </Form.Label>
                <Form.Control
                  value={form.childrenJobs}
                  onChange={(e) => handleChange('childrenJobs', e.target.value)}
                  disabled={form.sameInfo}
                  placeholder="ex: Tara - petsitting"
                />
              </Form.Group>
            </div>

            <hr />
            <Form.Group>
              <Form.Label>I will volunteer for:</Form.Label>
              <Form.Check
                type="checkbox"
                value={form.streetCaptain}
                onChange={() =>
                  setForm({ ...form, streetCaptain: !form.streetCaptain })
                }
                label={
                  <div>
                    Street Captain{' '}
                    <span style={{ fontSize: 'smaller' }}>
                      (for newsletter and director distribution and new neighbor
                      communication)
                    </span>
                  </div>
                }
              />
              <Form.Check
                type="checkbox"
                value={form.progressivePoolParty}
                onChange={() =>
                  setForm({
                    ...form,
                    progressivePoolParty: !form.progressivePoolParty,
                  })
                }
                label="Progressive Pool Party"
              />
              <Form.Check
                type="checkbox"
                value={form.movieNight}
                onChange={() =>
                  setForm({ ...form, movieNight: !form.movieNight })
                }
                label="Movie Night"
              />
              <Form.Check
                type="checkbox"
                value={form.iceCreamSocial}
                onChange={() =>
                  setForm({ ...form, iceCreamSocial: !form.iceCreamSocial })
                }
                label="End of School Year/Ice Cream Social"
              />
              <Form.Check
                type="checkbox"
                value={form.summerParty}
                onChange={() =>
                  setForm({ ...form, summerParty: !form.summerParty })
                }
                label="July 4th/Summer Party"
              />
              <Form.Check
                type="checkbox"
                value={form.halloweenParty}
                onChange={() =>
                  setForm({ ...form, halloweenParty: !form.halloweenParty })
                }
                label="Halloween Party"
              />
              <Form.Check
                type="checkbox"
                value={form.holidayParty}
                onChange={() =>
                  setForm({ ...form, holidayParty: !form.holidayParty })
                }
                label="Holiday Party"
              />
            </Form.Group>
            <hr />
            <p>
              <span style={{ textDecoration: 'underline' }}>
                Exisiting committee Volunteers
              </span>
              : * Please communicate any interest in helping out in with any
              committee position via your membership form and/or email to:{' '}
              <a href="mailto: blacklandridgegardenclub@gmail.com">
                blacklandridgegardenclub@gmail.com
              </a>
            </p>
            <p>Susan Jackson - Membership</p>
            <p>Michele Minchew &amp; Kim Timson - Accounting</p>
            <p>Holly Adams &amp; Sabrina Kania - Social Activities</p>
            <p>Website - Barry Rollan</p>
            <p>Neighborhood Assistance - Susan Corley</p>
            <p>Communications - Beth Humphreys &amp; Susan Corley</p>
            <p>Directory - Susan Drechsel</p>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => cancelAction()}>
          Go Back
        </Button>
        <Button form="contactForm" type="submit" variant="success">
          Submit Info and Pay
        </Button>
        <Button variant="info" onClick={() => goToPaypal()}>
          Skip to PayPal
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
