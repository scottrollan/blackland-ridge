import React from 'react';
import { UserContext } from '../../App';
import { reactions } from '../../data/reactions';
import styles from './ReactionIcons.module.scss';

const ReactionIcons = ({ m, affectReaction }) => {
  const thisUser = React.useContext(UserContext);
  const me = thisUser.name;

  return (
    <div className={styles.iconRow}>
      {reactions.map((icon) => {
        return (
          <i
            key={`${icon.title}of${m._id}`}
            id={`${icon.title}Of${m._id}`}
            action={
              m[`${icon.array}`] && m[`${icon.array}`].includes(me)
                ? 'dec'
                : 'inc'
            } //if reaction array (i.e. likedBy) includes me, then the first click of this button should decrease the likes by 1 and remove me from the array (unlike), if me is not already there, then increase the number and add me to the array
            onClick={() =>
              affectReaction(icon.title, icon.array, icon.color, m)
            }
            className={[`${icon.fontawesome} ${styles.icon} byIcon`]}
            disabled
            style={{
              color:
                m[`${icon.array}`] && m[`${icon.array}`].includes(me) // if this reaction array (i.e. likedBy) includes me
                  ? icon.color // color it
                  : 'var(--overlay-medium)', //otherwise make it gray
            }}
          ></i>
        );
      })}
    </div>
  );
};

export default ReactionIcons;
