import React from 'react';
import Responses from './Responses';
import Comment from './shared/Comment';
import Reactions from './shared/Reactions';
import ReactionIcons from './shared/ReactionIcons';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import styles from './ResponseAccordion.module.scss';

const ResponseAccordion = ({ newThread, fieldName, m }) => {
  const myResponses = m.responses ?? [];
  const responsesLength = myResponses.length;

  const popover = {};

  return (
    <div
      className={styles.root}
      style={{ display: newThread ? 'flex' : 'none' }}
    >
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className={styles.accordionHead}>
            <span onClick={(e) => e.stopPropagation()}>
              <OverlayTrigger
                trigger="click"
                placement="auto"
                overlay={
                  <Popover style={{ padding: '0.75rem' }}>
                    <ReactionIcons m={m} />
                  </Popover>
                }
              >
                <span>
                  <i className="far fa-thumbs-up" /> Like
                </span>
              </OverlayTrigger>
            </span>
            <span className={styles.reactionSpan}>
              <Reactions m={m} />
            </span>
            <span className={styles.liked}>
              {responsesLength > 0 ? 'Replies' : 'Be the first to comment'}
            </span>
          </div>
        </AccordionSummary>
        <AccordionDetails style={{ flexDirection: 'column' }}>
          <Comment fieldName="Add Reply" newThread={false} m={m} />
          <Responses m={m} />
          <div style={{ display: m.responses ? 'inherit' : 'none' }}>
            <Comment fieldName="Add Reply" newThread={false} m={m} />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ResponseAccordion;
