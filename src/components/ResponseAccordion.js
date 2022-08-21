import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import Responses from './Responses';
import Comment from './shared/Comment';
import MessageIcons from './shared/MessageIcons';
import MessageReactions from './shared/MessageReactions';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import styles from './ResponseAccordion.module.scss';

const ResponseAccordion = ({ m }) => {
  // const myResponses = m.responses ?? [];
  // const responsesLength = myResponses.length;
  const thisUser = useContext(UserContext);
  const [show, setShow] = useState(false);
  const [responsesLength, setResponsesLength] = useState([]);

  const handlePopoverShow = () => {
    setShow(true);
  };
  const handlePopoverHide = () => {
    setShow(false);
  };

  useEffect(() => {
    const totalResponses = m.responses;
    const totalResponsesLength = totalResponses.length;
    setResponsesLength(totalResponsesLength);
  }, [m]);

  return (
    <div className={styles.root} style={{ display: 'block' }}>
      <div className={styles.reactionBar}>
        <span className={styles.reactionSpan}>
          <MessageIcons m={m} />
        </span>

        <OverlayTrigger
          trigger="click"
          placement="auto"
          show={show}
          onToggle={() => handlePopoverShow()}
          overlay={
            <Popover
              style={{ padding: '0.75rem' }}
              onClick={() => handlePopoverHide()}
            >
              <MessageReactions m={m} />
            </Popover>
          }
        >
          <span
            onClick={(e) => e.stopPropagation()}
            style={{ visibility: thisUser ? 'visible' : 'hidden' }}
            className={styles.likeButton}
          >
            <span>
              <i className="far fa-thumbs-up" /> Like
            </span>
          </span>
        </OverlayTrigger>
      </div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className={styles.accordionBackground}
        >
          <div className={styles.accordionHead}>
            <span className={styles.liked}>
              {responsesLength > 1 ? (
                <span>{responsesLength} Replies</span>
              ) : responsesLength > 0 ? (
                <span>{responsesLength} Reply</span>
              ) : (
                'Be the first to comment'
              )}
            </span>
          </div>
        </AccordionSummary>
        <AccordionDetails
          style={{ flexDirection: 'column' }}
          className={styles.accordionBackground}
        >
          <Responses m={m} />
          {/* <div style={{ display: myResponses.length > 0 ? 'inherit' : 'none' }}> */}
          <Comment
            fieldName="Add Reply"
            m={m}
            formID={`commentResponse${m.id}`}
            titleID={`titleResponse${m.id}`}
            messageTypeID={`response${m.id}`}
          />
          {/* </div> */}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ResponseAccordion;
