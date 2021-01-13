import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../App';
import { messagesCollection } from '../../firestore/index';
import { reactions } from '../../data/reactions';
import styles from './MessageReactions.module.scss';

const remove = require('lodash.remove');

const ResponseReactions = ({ m }) => {
  const thisUser = useContext(UserContext);
  const me = thisUser.name;
  const id = m.responseToID;
  const myIndex = m.arrayIndex;

  const [thisResponse, setThisResponse] = useState({ ...m });
  const [parentResponses, setParentResponses] = useState('');
  let likedBy = thisResponse.likedBy ?? [];
  let lovedBy = thisResponse.lovedBy ?? [];
  let criedBy = thisResponse.criedBy ?? [];
  let laughedBy = thisResponse.laughedBy ?? [];

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
    let newData = { ...thisResponse };
    let responseArray = [...parentResponses]; //array of all responses
    let currentArray = thisResponse[array] ?? []; // list of By's already stored, if exists
    const myNestedResponse = responseArray[myIndex];
    let newArray;
    switch (addRemove) {
      case 'add':
        newArray = [...currentArray, me]; //add me to the By array
        newData = { ...myNestedResponse, [array]: [...newArray] }; //the whole response
        break;
      case 'remove':
        newArray = remove(currentArray, (name) => {
          //delete me from the By array
          return name !== me;
        });
        newData = { ...myNestedResponse, [array]: [...newArray] };
        break;
      default:
        console.log(thisResponse);
    }
    responseArray[myIndex] = { ...newData }; //update old response array with new data

    messagesCollection.doc(id).update({
      responses: [...responseArray], //replace entire response array with updated array
    });
    // setThisResponse(newData);
  };

  useEffect(() => {
    let mounted = true;
    let updatedResponse = {};
    messagesCollection.doc(id).onSnapshot((doc) => {
      try {
        const parentData = { ...doc.data() };
        const parentDataResponses = parentData.responses;
        setParentResponses([...parentDataResponses]);
        const parentResponses = [...parentDataResponses];
        updatedResponse = parentResponses[myIndex];
      } finally {
        if (mounted) {
          setThisResponse({ ...updatedResponse });
        }
      }
    });
    const unsubscribe = messagesCollection.onSnapshot(function () {});

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <div className={styles.iconRow}>
      <div className={styles.iconMask}></div>
      {reactions.map((icon) => {
        const iconArray = thisResponse[icon.array] ?? [];
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

export default ResponseReactions;
