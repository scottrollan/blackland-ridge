import React, { useContext } from 'react';
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
  const myResponses = m.responses ?? [];
  const responsesLength = myResponses.length;
  const thisUser = useContext(UserContext);

  return (
    <div className={styles.root} style={{ display: 'block' }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className={styles.accordionHead}>
            <span className={styles.reactionSpan}>
              <MessageIcons m={m} />
            </span>
            <span
              onClick={(e) => e.stopPropagation()}
              style={{ visibility: thisUser ? 'visible' : 'hidden' }}
              className={styles.likeButton}
            >
              <OverlayTrigger
                trigger="click"
                placement="auto"
                overlay={
                  <Popover style={{ padding: '0.75rem' }}>
                    <MessageReactions m={m} />
                  </Popover>
                }
              >
                <span>
                  <i className="far fa-thumbs-up" /> Like
                </span>
              </OverlayTrigger>
            </span>

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
        <AccordionDetails style={{ flexDirection: 'column' }}>
          <Comment fieldName="Add Reply" m={m} />
          <Responses m={m} />
          <div style={{ display: myResponses.length > 0 ? 'inherit' : 'none' }}>
            <Comment fieldName="Add Reply" m={m} />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ResponseAccordion;
