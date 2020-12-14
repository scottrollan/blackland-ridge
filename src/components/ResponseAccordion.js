import React from 'react';
import Comment from './shared/Comment';
import Responses from './Responses';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styles from './ResponseAccordion.module.scss';

const ResponseAccordion = ({ newThread, fieldName, m }) => {
  const responses = m.responses ?? [];
  const responsesLength = responses.length;
  return (
    <div className={styles.root}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={styles.heading}>
            Comments{'  '}
            <span style={{ display: responsesLength > 0 ? 'block' : 'none' }}>
              ({responsesLength})
            </span>
          </Typography>
        </AccordionSummary>
        <Responses m={m} />
        <AccordionDetails>
          <Comment newThread={newThread} fieldName={fieldName} />
        </AccordionDetails>
        <Responses m={m} />
      </Accordion>
    </div>
  );
};

export default ResponseAccordion;
