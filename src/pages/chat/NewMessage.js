import React, { useState, useEffect, useContext } from 'react';
import { UserContext, ProfilesContext } from '../../App';
import NewMessageForm from './NewMessageForm';
import { Modal, Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import $ from 'jquery';
import styles from './NewMessage.module.scss';

const uniqBy = require('lodash/uniqBy');
const remove = require('lodash/remove');

export default function NewMessage({ show, handleNewMessageClose }) {
  const allUsers = useContext(ProfilesContext);
  const thisUser = useContext(UserContext);
  const me = thisUser.name;
  const [options, setOptions] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [currentRecipients, setCurrentRecipients] = useState([]);
  const [composeMode, setComposeMode] = useState(false);

  const handleChange = (e) => {
    const i = e.target.value;
    const obj = options[i];
    const thisID = obj.id;
    setCurrentRecipients([...currentRecipients, obj]);
    $(`#option${thisID}`).attr('disabled', true);
  };

  const composeNewMessage = () => {
    setRecipients(uniqBy(currentRecipients, 'id'));
    setComposeMode(true);
  };

  const closeNewMessage = () => {
    setComposeMode(false);
    setCurrentRecipients([]);
    handleNewMessageClose();
  };

  const removeMe = (id) => {
    let theseRecipients = [...currentRecipients];
    theseRecipients = remove(theseRecipients, (r) => {
      return r.id !== id;
    });
    setCurrentRecipients([...theseRecipients]);
    $(`#option${id}`).attr('disabled', false);
  };

  useEffect(() => {
    let profileArray = allUsers ?? [];
    profileArray.sort((a, b) =>
      a.name.split(' ').pop() + a.name.split(' ')[0] > //DoeJane will come before DoeJohn
      b.name.split(' ').pop() + b.name.split(' ')[0]
        ? 1
        : -1
    );
    // });
    setOptions([...profileArray]);
    // });
  }, [allUsers]);

  return (
    <Modal
      show={show}
      onHide={closeNewMessage}
      onEnter={() => setCurrentRecipients([])}
    >
      <Modal.Header closeButton>
        <Form>
          {/* Dropdown recipient list */}
          <Form.Group>
            <Form.Label srOnly>Choose Recipient</Form.Label>
            <Form.Control
              as="select"
              defaultValue="x"
              onChange={handleChange}
              style={{ display: composeMode ? 'none' : 'initial' }}
            >
              <option disabled value="x">
                Send message to...
              </option>
              {options.map((op, index) => (
                <option
                  key={op.photoURL}
                  value={index}
                  id={`option${op.id}`}
                  style={{ display: op.name === me ? 'none' : 'block' }}
                >
                  {op.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          {/* recipient bubbles */}

          <div className={styles.recipientList}>
            {currentRecipients.map((r) => (
              <OverlayTrigger
                key={r.id}
                delay={{ show: 250, hide: 400 }}
                overlay={<Tooltip>{r.name}</Tooltip>}
              >
                <div className={styles.recipientButton}>
                  <div
                    className={styles.recipientPhoto}
                    style={{ '--backgroundImage': `url(${r.photoURL})` }}
                  ></div>
                  <span>{r.displayName}</span>

                  <i
                    className={[`fas fa-times ${styles.xIcon}`]}
                    style={{ display: composeMode ? 'none' : 'initial' }}
                    onClick={() => removeMe(r.id)}
                  ></i>
                </div>
              </OverlayTrigger>
            ))}
          </div>
          <Button
            onClick={() => composeNewMessage()}
            disabled={currentRecipients.length > 0 ? false : true}
            variant="secondary"
            style={{ display: composeMode ? 'none' : 'initial' }}
          >
            {currentRecipients.length > 0 ? 'Compose' : 'Choose Recipient(s)'}
          </Button>
        </Form>
      </Modal.Header>
      <Modal.Body>
        <div style={{ display: composeMode ? 'block' : 'none' }}>
          <NewMessageForm
            theseRecipients={recipients}
            closeNewMessage={closeNewMessage}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
}
