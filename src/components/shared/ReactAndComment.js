import React from 'react';
import { reactions } from '../../data/reactions';
import { Tooltip, Typography } from '@material-ui/core';
import styles from './ReactAndComment.module.scss';

export default function ReactAndComment({
  m,
  numberOfReactions,
  numberOfResponses,
}) {
  return (
    <div className={styles.statsRow}>
      <div className={styles.statsReactions}>
        {reactions.map((r) => {
          let num;
          if (m[`${r.array}`]) {
            num = m[`${r.array}`].length;
          }

          return (
            <Tooltip
              key={r.title}
              placement="right-start"
              title={
                <React.Fragment>
                  <Typography color="inherit">{r.label}</Typography>
                  {m[r.array] //map the "likedBy's", etc... fro reactions array
                    ? m[r.array].map((by) => {
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

        <span
          style={{
            marginLeft: '12px',
          }}
        >
          {numberOfReactions > 0 ? numberOfReactions : 'No reactions yet.'}
        </span>
      </div>
      <div
        className={styles.statsComments}
        style={{
          display: numberOfResponses ? 'inherit' : 'none', //if num of responses not 0
        }}
      >
        {numberOfResponses} Comments
      </div>
      <div
        className={styles.statsComments}
        style={{
          display: numberOfResponses ? 'none' : 'block', //if num of response is 0
        }}
      >
        Comment
      </div>
    </div>
  );
}
