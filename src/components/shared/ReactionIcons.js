import React, { useContext } from 'react';
import { UserContext } from '../../App';
import { reactions } from '../../data/reactions';
import styles from './ReactionIcons.module.scss';

const ReactionIcons = ({ m, affectReaction }) => {
  const thisUser = useContext(UserContext);
  let likedBy = [];
  if (m.likedBy) {
    likedBy = [...m.likedBy];
  }

  let lovedBy = (lovedBy = [...m.lovedBy] ?? []);

  let criedBy = [];
  if (m.criedBy) {
    criedBy = [...m.criedBy];
  }

  let laughedBy = [];
  if (m.laughedBy) {
    laughedBy = [...m.laughedBy];
  }

  const me = thisUser.name;
  const allBys = [...likedBy, ...lovedBy, ...criedBy, ...laughedBy];
  let iAmHere = false;
  if (allBys.includes(me)) {
    iAmHere = true;
  }
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
            style={
              !iAmHere
                ? { color: 'var(--overlay-medium' } //if not iAmHere, all icons displayed and grayed out
                : m[`${icon.array}`] && m[`${icon.array}`].includes(me) // if iAmHere and  this reaction array (i.e. likedBy) includes me
                ? { color: icon.color, display: 'block' } // color it
                : { visibility: 'hidden' } //otherwise (if iAmHere, but not in this array, don't display me)
            }
          ></i>
        );
      })}
    </div>
  );
};

export default ReactionIcons;
