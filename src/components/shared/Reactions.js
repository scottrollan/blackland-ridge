import React from 'react';
import { reactions } from '../../data/reactions';
import { Tooltip, Typography } from '@material-ui/core';
import styles from './Reactions.module.scss';

export default function Reactions({ m }) {
  let likedBy = m.likedBy ? m.likedBy.length : 0;
  let lovedBy = m.lovedBy ? m.lovedBy.length : 0;
  let laughedBy = m.laughedBy ? m.laughedBy.length : 0;
  let criedBy = m.criedBy ? m.criedBy.length : 0;
  let numberOfReactions = likedBy + lovedBy + criedBy + laughedBy; //total number of reactions

  return (
    <div className={styles.statsRow}>
      <div className={styles.statsReactions}>
        {reactions.map((r) => {
          let num;
          const thisArray = r.array;
          if (m[`${thisArray}`]) {
            num = m[`${thisArray}`].length;
          }

          return (
            <Tooltip
              key={r.title}
              placement="right-start"
              title={
                <React.Fragment>
                  <Typography color="inherit">{r.label}</Typography>
                  {m[thisArray] //map the "likedBy's", etc... from reactions array
                    ? m[thisArray].map((by) => {
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
