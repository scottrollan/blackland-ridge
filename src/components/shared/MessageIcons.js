import React, { useState, useEffect } from 'react';
import { messagesCollection } from '../../firestore/index';
import { reactions } from '../../data/reactions';
import { Tooltip, Typography } from '@material-ui/core';
import styles from './MessageIcons.module.scss';

export default function MessageIcons({ m }) {
  const [thisMessage, setThisMessage] = useState({ ...m });
  const likedBy = thisMessage.likedBy ? thisMessage.likedBy.length : 0;
  const lovedBy = thisMessage.lovedBy ? thisMessage.lovedBy.length : 0;
  const laughedBy = thisMessage.laughedBy ? thisMessage.laughedBy.length : 0;
  const criedBy = thisMessage.criedBy ? thisMessage.criedBy.length : 0;
  const numberOfReactions = likedBy + lovedBy + criedBy + laughedBy; //total number of reactions

  const id = m.responseToID ? m.responseToID : m.id;

  useEffect(() => {
    let mounted = true;
    messagesCollection.doc(id).onSnapshot((doc) => {
      const data = { ...doc.data() };
      if (mounted) {
        setThisMessage(data);
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
            {numberOfReactions > 0 ? numberOfReactions : 'No reactions yet.'}
          </span>
        </div>
      </div>
    </div>
  );
}
