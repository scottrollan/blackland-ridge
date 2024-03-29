import React, { useState, useEffect } from 'react';
import { messagesCollection } from '../../firestore/index';
import { reactions } from '../../data/reactions';
import { Tooltip, Typography } from '@material-ui/core';
import styles from './MessageIcons.module.scss';

export default function ResponseIcons({ m }) {
  const [thisMessage, setThisMessage] = useState({ ...m });
  const likedBy = thisMessage.likedBy ? thisMessage.likedBy.length : 0;
  const lovedBy = thisMessage.lovedBy ? thisMessage.lovedBy.length : 0;
  const laughedBy = thisMessage.laughedBy ? thisMessage.laughedBy.length : 0;
  const criedBy = thisMessage.criedBy ? thisMessage.criedBy.length : 0;
  const numberOfReactions = likedBy + lovedBy + criedBy + laughedBy; //total number of reactions

  const id = m.responseToID;
  const myIndex = m.arrayIndex;

  useEffect(() => {
    let mounted = true;
    messagesCollection.doc(id).onSnapshot((doc) => {
      const parentMessage = { ...doc.data() };
      const parentResponseArray = parentMessage.responses;
      const parentResponses = [...parentResponseArray];
      if (mounted) {
        const updatedResponse = parentResponses[myIndex];
        setThisMessage({ ...updatedResponse });
      }
    });
    const unsubscribe = messagesCollection.onSnapshot(function () {});

    return () => {
      mounted = false;
      unsubscribe();
    };
  });

  return (
    <div className={styles.statsRow}>
      <div className={styles.statsReactions}>
        {reactions.map((r) => {
          let num;
          const thisArray = r.array;
          if (thisMessage[`${thisArray}`]) {
            num = thisMessage[`${thisArray}`].length;
          }

          return (
            <Tooltip
              key={r.title}
              title={
                <React.Fragment>
                  <Typography color="inherit">{r.label}</Typography>
                  {thisMessage[thisArray] //map the "likedBy's", etc... from reactions array
                    ? thisMessage[thisArray].map((by) => {
                        return <Typography key={by}>{by}</Typography>;
                      })
                    : null}
                </React.Fragment>
              }
            >
              <i
                className={[`${r.fontawesome} ${styles.icon}`]}
                style={{
                  color: r.color,
                  display: num > 0 ? 'inherit' : 'none',
                }}
              ></i>
            </Tooltip>
          );
        })}
        <div>
          <span
            style={{
              marginLeft: '12px',
            }}
          >
            {numberOfReactions > 0 ? (
              numberOfReactions
            ) : (
              <span className={styles.noReactionsYet}>
                <em>No reactions yet.</em>
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
