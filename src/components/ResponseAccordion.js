import React from 'react';
import Responses from './Responses';
import Comment from './shared/Comment';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styles from './ResponseAccordion.module.scss';

const ResponseAccordion = ({ newThread, fieldName, m }) => {
  const myResponses = m.responses ?? [];
  const responsesLength = myResponses.length;

  return (
    <div
      className={styles.root}
      style={{ display: newThread ? 'flex' : 'none' }}
    >
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={styles.heading}>
            {fieldName} ({responsesLength})
          </Typography>
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
