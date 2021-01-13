import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../App';
import { messagesCollection } from '../../firestore/index';
import { reactions } from '../../data/reactions';
import styles from './MessageReactions.module.scss';

const remove = require('lodash.remove');

const MessageReactions = ({ m }) => {
  const thisUser = useContext(UserContext);
  const me = thisUser.name;
  const id = m.id;

  const [state, setState] = useState({ ...m });
  let likedBy = state.likedBy ?? [];
  let lovedBy = state.lovedBy ?? [];
  let criedBy = state.criedBy ?? [];
  let laughedBy = state.laughedBy ?? [];

  let iHaveReacted = false;
  if (
    likedBy.includes(me) ||
    lovedBy.includes(me) ||
    criedBy.includes(me) ||
    laughedBy.includes(me)
  ) {
    iHaveReacted = true;
  }

  const affectReaction = (addRemove, array) => {
    let newData = { ...state };
    const currentArray = state[array] ?? []; //state.likedBy, i.e.
    let newArray;
    switch (addRemove) {
      case 'add':
        newArray = [...currentArray, me];
        newData = { ...state, [array]: [...newArray] };
        break;
      case 'remove':
        newArray = remove(currentArray, (name) => {
          return name != me;
        });
        newData = { ...state, [array]: [...newArray] };
        break;
      default:
        console.log(state);
    }

    messagesCollection.doc(id).update({
      [array]: newArray,
    });
    setState(newData);
  };

  useEffect(() => {
    let mounted = true;
    let thisMessage = {};
    messagesCollection.doc(id).onSnapshot((doc) => {
      try {
        const changeData = { ...doc.data() };
        thisMessage = { ...changeData };
      } finally {
        if (mounted) {
          setState({ ...thisMessage });
        }
      }
    });
    const unsubscribe = messagesCollection.onSnapshot(function () {});

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [id]);

  return (
    <div className={styles.iconRow}>
      <div className={styles.iconMask}></div>
      {reactions.map((icon) => {
        const iconArray = state[icon.array] ?? [];
        return (
          <i
            key={`${icon.title}Of${id}`}
            id={`${icon.title}Of${id}`}
            //if reaction array (i.e. likedBy) includes me, then the first click of this button should decrease the likes by 1 and remove "me" from the array (unlike), if me is not already there, then increase the number and add me to the array
            onClick={() =>
              affectReaction(iHaveReacted ? 'remove' : 'add', icon.array)
            }
            className={[`${icon.fontawesome} ${styles.icon} byIcon`]}
            style={{
              color: icon.color,
              // opacity: iHaveReacted ? 1 : 0.6,
              zIndex: !iHaveReacted
                ? 3 //if I have not reacted, all icons above mask
                : iconArray.includes(me) // if iHaveReacted (in one array) and this particular reaction array (i.e. likedBy, etc.) includes me
                ? 3 // also above mask
                : 1, //otherwise (if iHaveReacted, but not in this array), under mask
            }}
          ></i>
        );
      })}
    </div>
  );
};

export default MessageReactions;
