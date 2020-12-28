import React, { useReducer, useContext } from 'react';
import { UserContext } from '../../App';
import { reactions } from '../../data/reactions';
import styles from './ReactionIcons.module.scss';

const union = require('lodash.union');
const remove = require('lodash.remove');

const reducer = (state, action) => {
  let arrayName = action.payload.array;
  let userName = [`${action.payload.name}`];
  switch (action.type) {
    case 'add':
      const mArray = union(state[arrayName], userName);
      console.log(mArray);
      return {
        ...state,
        [arrayName]: mArray,
      };
    case 'remove':
      console.log('case remove triggered');
      return {
        ...state,
        [arrayName]: remove([arrayName], (name) => {
          return name !== `${action.payload}`;
        }),
      };
    default:
      return { ...state };
  }
};

const ReactionIcons = ({ m }) => {
  const thisUser = useContext(UserContext);
  let likedBy = m.likedBy ? [...m.likedBy] : [];
  let lovedBy = m.lovedBy ? [...m.lovedBy] : [];
  let criedBy = m.criedBy ? [...m.criedBy] : [];
  let laughedBy = m.laughedBy ? [...m.laughedBy] : [];
  let mergedBys = [...likedBy, ...lovedBy, ...criedBy, ...laughedBy];
  let byObj = { likedBy, lovedBy, criedBy, laughedBy };

  const [state, dispatch] = useReducer(reducer, { ...byObj });

  ////////lodash practice
  // let arr = ['Barry', 'Lucius', 'Beth', 'Harry', 'Lucius', 'Barry'];
  // arr = remove(arr, (name) => {
  //   return name !== 'Harry';
  // }); //['Barry', 'Lucius', 'Beth', 'Lucius', 'Barry']
  // arr = union(arr, ['Chuck', 'Sandra', 'Chuck']);
  // console.log(arr); //  }); //['Barry', 'Lucius', 'Beth', 'Chuck', 'Sandra']

  const affectReaction = () => {};
  const me = thisUser.name;
  let iAmHere = false;
  if (mergedBys.includes(me)) {
    iAmHere = true;
  }
  return (
    <div className={styles.iconRow}>
      {reactions.map((icon) => {
        return (
          <i
            key={`${icon.title}Of${m.id}`}
            id={`${icon.title}Of${m.id}`}
            //if reaction array (i.e. likedBy) includes me, then the first click of this button should decrease the likes by 1 and remove "me" from the array (unlike), if me is not already there, then increase the number and add me to the array
            onClick={() => {
              dispatch({
                type:
                  m[`${icon.array}`] && m[`${icon.array}`].includes(me)
                    ? 'remove'
                    : 'add',

                payload: { name: me, array: icon.array },
              });
              setTimeout(() => console.log('new state: ', state), 2000);
            }}
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
